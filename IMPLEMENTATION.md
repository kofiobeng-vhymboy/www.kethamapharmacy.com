# Kethama Pharmacy — Full-Stack Backend Implementation Guide

> **Document Intended For**: OpenAI Codex / Backend Engineers / AI Coding Assistants  
> **Repository Context**: React 19 + TypeScript + Vite + Tailwind CSS v4 frontend with Express server capabilities  
> **Application**: Kethama Pharmacy — Clinical community pharmacy platform serving Accra, Ghana.

---

## 1. Executive Summary & Existing System State

The frontend of **Kethama Pharmacy** is complete, responsive, accessible, and running in production mode. It currently uses client-side state (`localStorage`, React Context) and static seed data (`src/data.ts`) to simulate core workflows.

### Existing Frontend Surface
| Route | Features & User Interactions |
| :--- | :--- |
| `/` | Hero, quick refill access, clinical value pillars, featured vitamins, consultation overview, health articles. |
| `/vitamins` | Product grid, category filters, search, quick view modal with interactive quantity stepper, direct add to cart, wishlist toggle. |
| `/cart` | Order basket, interactive stepper quantity adjustment, free delivery progress bar (threshold: ₵500), checkout via WhatsApp integration. |
| `/wishlist` | Saved items, move to cart, remove, empty state. |
| `/renewal` | Multi-step prescription renewal: patient details, doctor details, prescription photo upload stub, delivery/pickup selection. |
| `/services` | Clinical services: Prescription Dispensing, Medication Therapy Management, Chronic Disease Screening, Lab Tests. |
| `/health-hub` | Health literacy articles, wellness guidance, dietary recommendations. |
| `/signin` | Customer login, registration simulation, validation. |
| `/profile` | User profile details, allergy info, prescription refill history with real-time status tracker badges. |

### Existing Client-Side Types (`src/types.ts` & Contexts)
```typescript
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  tags?: string[];
  description?: string;
  pharmacistNote?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  allergyInfo?: string;
}

export interface PrescriptionRequest {
  id: string;
  medicationName: string;
  dosage: string;
  prescriptionNumber?: string;
  date: string;
  status: 'Pending Verification' | 'Doctor Contacted' | 'Ready for Pickup' | 'Completed';
  deliveryType: 'pickup' | 'delivery';
  pickupLocation?: string;
}
```

---

## 2. Backend Stack Recommendation

### Recommended Choice: **Node.js + Express + TypeScript + PostgreSQL + Drizzle ORM**

#### Why this is the optimal choice for Kethama:
1. **Zero Context Switching**: The repository already includes `express`, `@types/express`, `tsx`, and TypeScript in `package.json`. Express can be served directly from `server.ts` alongside Vite.
2. **Relational Integrity for Healthcare**: Prescriptions, medications, users, audit logs, and orders have strict relational foreign keys (e.g., an order item must reference a valid batch and user; prescription reviews require verified pharmacist IDs). PostgreSQL is ACID compliant and industry-standard for healthcare.
3. **Type Safety End-to-End**: Drizzle ORM provides zero-overhead, type-safe SQL queries sharing schemas between backend and frontend TypeScript models.
4. **Local Ghana Context**: Easy to plug in **Paystack** / **Hubtel** (Ghanaian Mobile Money: MTN MoMo, Telecel Cash, AT Money) and WhatsApp Business API.

#### Alternative: **Supabase (Managed PostgreSQL + Built-in Auth + Storage)**
*If minimal backend server maintenance is preferred:*
- Supabase provides instant PostgreSQL, Row Level Security (RLS), email/phone OTP authentication, and S3-compatible file storage for prescription uploads with zero infrastructure boilerplate.

---

## 3. Database Schema Specification (PostgreSQL / Drizzle)

```sql
-- Enums
CREATE TYPE user_role AS ENUM ('customer', 'pharmacist', 'admin');
CREATE TYPE prescription_status AS ENUM (
  'PENDING_VERIFICATION',
  'DOCTOR_CONTACTED',
  'PHARMACIST_REVIEWED',
  'READY_FOR_PICKUP',
  'OUT_FOR_DELIVERY',
  'COMPLETED',
  'CANCELLED'
);
CREATE TYPE order_status AS ENUM ('PENDING', 'PAID', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'CANCELLED');
CREATE TYPE payment_method AS ENUM ('MOBILE_MONEY', 'CARD', 'CASH_ON_DELIVERY', 'WHATSAPP_CONFIRMATION');

-- 1. Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  address TEXT,
  date_of_birth DATE,
  allergy_info TEXT,
  role user_role DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Products / Inventory Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(120) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  cost_price NUMERIC(10, 2),
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  category VARCHAR(80) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT NOT NULL,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  description TEXT,
  pharmacist_note TEXT,
  requires_prescription BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Prescriptions Table
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  medication_name VARCHAR(200) NOT NULL,
  dosage VARCHAR(100) NOT NULL,
  prescription_number VARCHAR(100),
  doctor_name VARCHAR(150),
  patient_name VARCHAR(150) NOT NULL,
  patient_phone VARCHAR(30) NOT NULL,
  patient_email VARCHAR(255),
  file_url TEXT, -- Secure URL to uploaded prescription slip image/PDF
  delivery_type VARCHAR(20) NOT NULL, -- 'pickup' or 'delivery'
  pickup_location VARCHAR(150),
  delivery_address TEXT,
  status prescription_status DEFAULT 'PENDING_VERIFICATION',
  reviewed_by_pharmacist_id UUID REFERENCES users(id),
  pharmacist_clinical_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Orders & Order Items Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(30) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  guest_email VARCHAR(255),
  guest_phone VARCHAR(30),
  subtotal NUMERIC(10, 2) NOT NULL,
  delivery_fee NUMERIC(10, 2) DEFAULT 0.00,
  total_amount NUMERIC(10, 2) NOT NULL,
  status order_status DEFAULT 'PENDING',
  payment_method payment_method DEFAULT 'WHATSAPP_CONFIRMATION',
  payment_reference VARCHAR(120),
  shipping_address TEXT,
  shipping_city VARCHAR(100) DEFAULT 'Accra',
  whatsapp_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL
);

-- 5. Wishlists & Persistent Carts (Optional for logged-in accounts)
CREATE TABLE user_wishlist (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, product_id)
);
```

---

## 4. REST API Endpoints Specification

Base URL: `/api/v1`

### 4.1 Authentication & Profile (`/api/v1/auth`)
- `POST /api/v1/auth/register`
  - Body: `{ name, email, password, phone, address?, dateOfBirth?, allergyInfo? }`
  - Response: `{ user: UserProfile, token: string }`
- `POST /api/v1/auth/login`
  - Body: `{ email, password }`
  - Response: `{ user: UserProfile, token: string }`
- `GET /api/v1/auth/me`
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ user: UserProfile }`
- `PUT /api/v1/auth/profile`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ name?, phone?, address?, dateOfBirth?, allergyInfo? }`
  - Response: `{ user: UserProfile }`

### 4.2 Products Catalog (`/api/v1/products`)
- `GET /api/v1/products`
  - Query params: `?category=Immunity&search=vitamin&sort=price_asc&limit=20&page=1`
  - Response: `{ products: Product[], total: number, page: number, pages: number }`
- `GET /api/v1/products/:id`
  - Response: `{ product: Product }`
- `POST /api/v1/products` (Admin/Pharmacist only)
  - Body: Product payload
- `PATCH /api/v1/products/:id/stock` (Pharmacist stock update)
  - Body: `{ stockQuantity: number }`

### 4.3 Prescription Refills & Verification (`/api/v1/prescriptions`)
- `POST /api/v1/prescriptions/upload`
  - Content-Type: `multipart/form-data`
  - Form Fields: `file`, `medicationName`, `dosage`, `prescriptionNumber?`, `doctorName?`, `deliveryType`, `pickupLocation?`, `deliveryAddress?`
  - Authenticated or Guest (attaches user ID if token present)
  - Response: `{ prescription: PrescriptionRequest, message: "Refill request received" }`
- `GET /api/v1/prescriptions/my-refills`
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ refills: PrescriptionRequest[] }`
- `GET /api/v1/prescriptions/:id`
  - Response: Detailed prescription verification status and clinical notes
- `PATCH /api/v1/prescriptions/:id/status` (Pharmacist/Admin only)
  - Body: `{ status: prescription_status, clinicalNotes?: string }`
  - Triggers SMS/WhatsApp webhook notification to the patient.

### 4.4 Orders & Checkout (`/api/v1/orders`)
- `POST /api/v1/orders`
  - Body:
    ```json
    {
      "items": [{ "productId": "uuid", "quantity": 2 }],
      "deliveryType": "delivery",
      "shippingAddress": "Dome Parakuo Estates, Accra",
      "recipientName": "Kofi Mensah",
      "recipientPhone": "+233240000000",
      "paymentMethod": "WHATSAPP_CONFIRMATION"
    }
    ```
  - Response: `{ orderId, orderNumber, subtotal, deliveryFee, total, whatsappDeepLink }`
- `GET /api/v1/orders/:id`
  - Response: Full order details, line items, tracking status
- `POST /api/v1/orders/:id/paystack-initiate`
  - Initializes online payment with Paystack Ghana (supports MTN MoMo, Telecel, Visa/Mastercard in GHS).

### 4.5 Webhooks (`/api/v1/webhooks`)
- `POST /api/v1/webhooks/paystack`
  - Validates `x-paystack-signature` header.
  - Updates order status to `PAID` upon successful charge.
- `POST /api/v1/webhooks/whatsapp`
  - Inbound WhatsApp status confirmation from pharmacy dispatchers.

---

## 5. Prescription File Storage & Healthcare Privacy

Medical prescriptions and clinical images require strict confidentiality:
1. **Never make the prescription bucket public.**
2. When a user uploads a prescription in `PrescriptionRenewal.tsx`:
   - Store the file in a private cloud bucket (Google Cloud Storage / AWS S3 / Supabase Private Bucket).
   - Generate short-lived **Signed URLs** (expires in 15–30 minutes) accessible only to authenticated duty pharmacists and the uploading user.
3. Validate file types on backend: accept only `image/jpeg`, `image/png`, `image/webp`, and `application/pdf`. Max file size: 10MB.

---

## 6. Ghana Payments & Communication Integrations

### Paystack / Mobile Money Integration Pattern
```typescript
// server/services/paystack.ts
export async function initializePayment(email: string, amountInGhs: number, orderId: string) {
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amountInGhs * 100), // Amount in pesewas
      currency: "GHS",
      reference: `KETH-${orderId}-${Date.now()}`,
      callback_url: `${process.env.APP_URL}/cart?order_success=true&order_id=${orderId}`,
      channels: ["mobile_money", "card"] // Focus on Ghanaian MoMo
    })
  });
  return response.json();
}
```

### Automated WhatsApp Dispatch Integration
Current client uses `src/lib/whatsapp.ts` with direct deep-linking.
Backend extension: When an order or prescription status changes to `Ready for Pickup`, trigger a transactional WhatsApp notification using Twilio or Hubtel SMS API:
```typescript
// Refill Reminder / Pickup Alert
const msg = `Hello ${patientName}, your prescription refill (${medicationName}) is verified and ready for pickup at Kethama Pharmacy Dome Parakuo Branch. Ref: ${prescriptionNumber}`;
```

---

## 7. Migration Checklist for Codex

Follow these steps sequentially to complete the backend implementation:

### Phase 1: Server & Database Setup
- [ ] 1. Add required dependencies to `package.json`:
  ```bash
  npm install pg drizzle-orm bcryptjs jsonwebtoken zod multer dotenv cors
  npm install -D drizzle-kit @types/pg @types/bcryptjs @types/jsonwebtoken @types/multer @types/cors
  ```
- [ ] 2. Create `server/db/schema.ts` matching the PostgreSQL models specified in Section 3.
- [ ] 3. Create a seed script `server/db/seed.ts` that takes the data from `src/data.ts` and populates the `products` table.
- [ ] 4. Configure `server.ts` with Express routing:
  - Mount `/api/v1/auth`
  - Mount `/api/v1/products`
  - Mount `/api/v1/prescriptions`
  - Mount `/api/v1/orders`

### Phase 2: Frontend API Client Layer
- [ ] 5. Create `src/lib/api.ts` with typed fetch or Axios wrapper handling `Authorization: Bearer <token>` and error responses.
- [ ] 6. Update `src/context/AuthContext.tsx`:
  - Replace `localStorage` mock users with calls to `/api/v1/auth/login`, `/api/v1/auth/register`, and `/api/v1/auth/me`.
  - Connect `addRefillRequest` and `refills` list to `/api/v1/prescriptions`.
- [ ] 7. Update `src/pages/Vitamins.tsx`:
  - Fetch products from `/api/v1/products` with live filtering and pagination.
- [ ] 8. Update `src/pages/PrescriptionRenewal.tsx`:
  - Send real multipart form data with image file to `/api/v1/prescriptions/upload`.
- [ ] 9. Update `src/pages/Cart.tsx`:
  - Create real order record via `/api/v1/orders` before launching WhatsApp checkout.

### Phase 3: Security & Verification
- [ ] 10. Implement JWT authentication middleware (`server/middleware/auth.ts`) validating customer vs. pharmacist roles.
- [ ] 11. Add Zod input validation on all `/api/*` endpoints.
- [ ] 12. Secure `.env` with:
  ```env
  DATABASE_URL=
  JWT_SECRET=
  PAYSTACK_SECRET_KEY=
  PORT=3000
  ```
- [ ] 13. Verify build using `npm run build` and test server boot with `npm run start`.
