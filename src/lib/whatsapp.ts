export interface CartItemForWhatsapp {
  name: string;
  brand: string;
  price?: number;
  quantity: number;
}

export interface UserForWhatsapp {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

const WHATSAPP_NUMBER = '233244537326'; // Standard international format for +233 244537326

export function buildWhatsappUrl(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Encodes and opens a WhatsApp link with the given text.
 */
export function sendWhatsappMessage(text: string): boolean {
  const url = buildWhatsappUrl(text);

  // A noopener window.open() is allowed to return null even when it succeeds.
  // Dispatching a link cannot confirm that WhatsApp opened or a message was sent.
  // Callers must describe this as a handoff and offer a retry.
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.click();
  return true;
}

/**
 * Formats a shopping cart into a clean WhatsApp order summary and sends it.
 */
export function checkoutViaWhatsapp(items: CartItemForWhatsapp[], totalPrice: number, user: UserForWhatsapp | null): boolean {
  let message = `*🛒 NEW ORDER - KETHAMA PHARMACY*\n\n`;
  
  if (user && user.name) {
    message += `*Customer details:*\n`;
    message += `• *Name:* ${user.name}\n`;
    message += `• *Email:* ${user.email || 'N/A'}\n`;
    if (user.phone) message += `• *Phone:* ${user.phone}\n`;
    if (user.address) message += `• *Delivery Address:* ${user.address}\n`;
    message += `\n`;
  } else {
    message += `*Customer details:* Guest Customer\n\n`;
  }
  
  message += `*Items Ordered:*\n`;
  items.forEach((item, index) => {
    message += `${index + 1}. *${item.name}* (${item.brand}) - Qty: ${item.quantity}${item.price == null ? ' - Price to confirm' : ` - ₵${(item.price * item.quantity).toFixed(2)}`}\n`;
  });

  const hasUnpricedItems = items.some(item => item.price == null);
  message += `\n*Total Amount:* ${hasUnpricedItems ? 'To be confirmed by the pharmacy' : `₵${totalPrice.toFixed(2)}`}\n\n`;
  message += `Please confirm product availability, pricing and share payment and delivery options. Thank you!`;
  
  return sendWhatsappMessage(message);
}

/**
 * Formats a generic inquiry or medical question and sends it.
 */
export function sendInquiryViaWhatsapp(query: string, user: UserForWhatsapp | null, topic?: string): boolean {
  let message = `*❓ NEW INQUIRY - KETHAMA PHARMACY*\n\n`;
  
  if (topic) {
    message += `*Topic:* ${topic}\n`;
  }
  
  if (user && user.name) {
    message += `*From:* ${user.name} (${user.email || 'N/A'})\n\n`;
  }
  
  message += `*Inquiry/Question:*\n"${query}"\n\n`;
  message += `Please advise on this. Thank you!`;
  
  return sendWhatsappMessage(message);
}

export function sendProductInquiryViaWhatsapp(product: { name: string; brand: string; category?: string }, user: UserForWhatsapp | null): boolean {
  const message = `*PRODUCT ENQUIRY - KETHAMA PHARMACY*\n\n*Product:* ${product.name}\n*Brand:* ${product.brand}${product.category ? `\n*Category:* ${product.category}` : ''}\n\nHello, I would like to know the current price, availability, and delivery options for this product.`;
  return sendInquiryViaWhatsapp(message, user, 'Product availability and pricing');
}
