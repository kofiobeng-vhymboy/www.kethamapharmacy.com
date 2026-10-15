import { Product, Article, PharmacyService } from './types';
import prescriptionImage from './assets/images/services-prescription-ghana.webp';
import testingImage from './assets/images/services-testing-ghana.webp';
import firstAidImage from './assets/images/services-first-aid-ghana.webp';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Wellman Original', brand: 'Vitabiotics',
    image: 'https://www.vitabiotics.com/cdn/shop/files/wellman_original_30_front_2D-CTWEL030T24WL1E_resized.png?crop=center&height=1024&v=1746718726&width=1024',
    category: 'Multivitamins', tags: ['Men', 'Daily Wellness'], productType: 'Supplement',
    description: 'A multivitamin and mineral supplement formulated for men. Pack format and current availability are confirmed by the pharmacy.',
    keyDetails: ['Men’s multivitamin', 'Vitabiotics Wellman range'],
  },
  {
    id: '2',
    name: 'Wellwoman Original', brand: 'Vitabiotics',
    image: 'https://www.vitabiotics.com/cdn/shop/products/wellwoman-originalusethisfront_ca9d6ff2-093e-48de-b13f-43f4de384943.png?crop=center&height=1024&v=1587029042&width=1024',
    category: 'Multivitamins', tags: ['Women', 'Daily Wellness'], productType: 'Supplement',
    description: 'A multivitamin and mineral supplement formulated for women. Pack format and current availability are confirmed by the pharmacy.',
    keyDetails: ['Women’s multivitamin', 'Vitabiotics Wellwoman range'],
  },
  {
    id: '3',
    name: 'Wellteen Him', brand: 'Vitabiotics',
    image: 'https://www.vitabiotics.com/cdn/shop/products/preview-gallery-Wellteen_Him__Front__CTWTN030T5WL2E_a5f653ce-307b-4e60-b3f3-5c0ab864944b.png?crop=center&height=1024&v=1579273529&width=1024',
    category: 'Multivitamins', tags: ['Teen', 'Daily Wellness'], productType: 'Supplement',
    description: 'A multivitamin and mineral supplement formulated for teenage boys. Ask a pharmacist whether a supplement is suitable.',
    keyDetails: ['Teen multivitamin', 'Vitabiotics Wellteen range'],
    safetyNote: 'For a teenager, check the pack age guidance and ask a parent, guardian or pharmacist before use.',
  },
  {
    id: '4',
    name: 'Wellteen Her', brand: 'Vitabiotics',
    image: 'https://www.vitabiotics.com/cdn/shop/files/WellteenHerFront.png?crop=center&height=1024&v=1741085805&width=1024',
    category: 'Multivitamins', tags: ['Teen', 'Daily Wellness'], productType: 'Supplement',
    description: 'A multivitamin and mineral supplement formulated for teenage girls. Ask a pharmacist whether a supplement is suitable.',
    keyDetails: ['Teen multivitamin', 'Vitabiotics Wellteen range'],
    safetyNote: 'For a teenager, check the pack age guidance and ask a parent, guardian or pharmacist before use.',
  },
  {
    id: '5', name: 'Biotin 2,500 mcg', brand: 'Nature Made',
    image: 'https://images.fravega.com/f1000/0e4be8f006070596d76f772049116f9f.jpg',
    category: 'Vitamins', tags: ['Biotin', 'Hair, Skin & Nails'], productType: 'Supplement',
    description: 'Biotin supplement shown in a 2,500 mcg pack. Check the actual pack label and availability with the pharmacy.',
    keyDetails: ['Biotin 2,500 mcg per serving (pictured pack)'],
    safetyNote: 'Biotin can affect some laboratory test results. Tell your clinician or laboratory if you take it.',
  },
  {
    id: '6', name: 'Vitamin A 10,000 IU', brand: 'GNC',
    image: 'https://www.gnc.com/dw/image/v2/BBLB_PRD/on/demandware.static/-/Sites-master-catalog-gnc/default/dw2c445e18/hi-res/004222_web_GNC%20Vitamin%20A_Front_Bottle.jpg?sh=305&sm=fit&sw=305',
    category: 'Vitamins', tags: ['Vitamin A'], productType: 'Supplement',
    description: 'High-strength vitamin A supplement, pictured as a 10,000 IU pack. Confirm exact label and suitability with a pharmacist.',
    keyDetails: ['10,000 IU per serving (pictured pack)'],
    safetyNote: 'High-dose vitamin A may be harmful, especially during pregnancy. Seek pharmacist advice before use.',
  },
  {
    id: '7', name: 'Vitamin B Complex', brand: 'NaturaLife Labs',
    image: 'https://sa.getkuwa.com/cdn/shop/files/71ZGR0xLUyL._AC_SL1500.jpg?v=1762758055',
    category: 'Vitamins', tags: ['Vitamin B', 'Energy'], productType: 'Supplement',
    description: 'B-complex supplement containing B vitamins. The formulation and serving details can differ by pack; check the label before purchase.',
    keyDetails: ['B-complex supplement', 'Pack details confirmed on enquiry'],
    safetyNote: 'Ask a pharmacist if you take other supplements or medicines, or have a health condition.',
  },
  {
    id: '8', name: 'Vitamin B12 1,000 mcg', brand: 'Reliable-1',
    image: 'https://images.squarespace-cdn.com/content/v1/5f5fa5e3cedf2b6664f1a535/1600196886342-Z78209KHRF4TTOBR7XUD/VITAMIN-B121000mcg_100tabs-copy.jpg',
    category: 'Vitamins', tags: ['Vitamin B12', 'Energy'], productType: 'Supplement',
    description: 'Vitamin B12 supplement shown as 1,000 mcg tablets. Ask a clinician or pharmacist whether supplementation is appropriate for you.',
    keyDetails: ['Vitamin B12 1,000 mcg (pictured pack)'],
  },
  {
    id: '9', name: 'Vitamin C 500 mg', brand: 'Nature Made',
    image: 'https://www.naturemade.com/cdn/shop/files/NM1485PK001327VITC_5A044150ccfront_1100x.png?v=1692222786',
    category: 'Vitamins', tags: ['Vitamin C', 'Immunity'], productType: 'Supplement',
    description: 'Vitamin C supplement shown as 500 mg tablets. Confirm exact pack and serving details with the pharmacy.',
    keyDetails: ['Vitamin C 500 mg (pictured pack)'],
  },
  {
    id: '10', name: 'Vitamin C + Zinc Effervescent', brand: 'Reedy',
    image: 'https://twelvegh.com/img/pharmPImgs/222_1.jpeg',
    category: 'Immune Support', tags: ['Vitamin C', 'Zinc', 'Effervescent'], productType: 'Supplement',
    description: 'Effervescent vitamin C and zinc product shown in a Ghanaian pharmacy listing. Confirm strengths and pack size on the label at enquiry.',
    keyDetails: ['Vitamin C + zinc combination', 'Effervescent format'],
    safetyNote: 'Check the pack directions and ask a pharmacist if you take other supplements or medicines.',
  },
  {
    id: '11', name: 'Vitamin D3 1,000 IU', brand: 'Nature Made',
    image: 'https://www.naturemade.com/cdn/shop/products/NM1870PK000981VITD3_5A044150ccfront_1100x.png?v=1679686566',
    category: 'Vitamins', tags: ['Vitamin D', 'Bone Health'], productType: 'Supplement',
    description: 'Vitamin D3 supplement shown as 1,000 IU tablets. Pack and availability are confirmed by the pharmacy.',
    keyDetails: ['Vitamin D3 1,000 IU (pictured pack)'],
    safetyNote: 'Ask a pharmacist before combining vitamin D with other supplements or if you have a health condition.',
  },
  {
    id: '12', name: 'Vitamin E 400 IU', brand: 'NatureWise',
    image: 'https://www.naturewise.com/cdn/shop/files/NW_-_Vitamin_E_60_FRONT.jpg?v=1730329098',
    category: 'Vitamins', tags: ['Vitamin E'], productType: 'Supplement',
    description: 'Vitamin E supplement shown as 400 IU softgels. Confirm the pack and suitability with a pharmacist.',
    keyDetails: ['Vitamin E 400 IU (pictured pack)'],
    safetyNote: 'Vitamin E supplements can interact with some medicines, including blood thinners. Ask a pharmacist before use.',
  },
  {
    id: '13', name: 'Zinc 30 mg', brand: 'Nature Made',
    image: 'https://www.naturemade.com/cdn/shop/files/NM1277PK001254ZINC_5A044150ccfront.png?v=1692222450',
    category: 'Minerals', tags: ['Zinc', 'Immune Support'], productType: 'Supplement',
    description: 'Zinc supplement shown as 30 mg tablets. Confirm the label and ask a pharmacist if it is suitable alongside your other medicines.',
    keyDetails: ['Zinc 30 mg (pictured pack)'],
  },
  {
    id: '14', name: 'Omega-3 Fish Oil', brand: 'Nordic Naturals',
    image: 'https://tradevits.com/media/catalog/product/n/n/nn-0080_front_14576_1000x1000.jpg',
    category: 'Supplements', tags: ['Omega-3', 'Daily Wellness'], productType: 'Supplement',
    description: 'Omega-3 fish oil supplement. Exact strength, form and serving details should be checked on the pack.',
    keyDetails: ['Omega-3 fish oil', 'Pack details confirmed on enquiry'],
  },
  {
    id: '15', name: 'Panadol 500 mg Tablets', brand: 'Panadol',
    image: 'https://nationalpharmacies.lbcdn.io/app/uploads/2025/10/Panadol-Tab-50-scaled.jpg',
    category: 'OTC Medicines', tags: ['Pain Relief', 'Fever'], productType: 'OTC medicine',
    description: 'Paracetamol tablets shown as 500 mg. Confirm the exact product and pack with the pharmacist before purchase.',
    keyDetails: ['Paracetamol 500 mg (pictured pack)'],
    safetyNote: 'Follow the product label. Do not combine with other paracetamol-containing products; ask a pharmacist if unsure.',
  },
  {
    id: '16', name: 'Dextrolite Oral Rehydration Salts', brand: 'Dextrolite',
    image: 'https://www.scabpharmacy.com/wp-content/uploads/2023/09/Dextrolite-600ml-KNP-scaled.jpg',
    category: 'OTC Medicines', tags: ['Rehydration', 'ORS'], productType: 'OTC medicine',
    description: 'Oral rehydration salts product shown in a Ghanaian pharmacy listing. Check pack instructions and ask the pharmacist for guidance.',
    keyDetails: ['Oral rehydration salts', 'Pack size and preparation instructions vary by product'],
    safetyNote: 'Seek prompt medical advice for severe dehydration, persistent vomiting, blood in stool, or symptoms in an infant.',
  },
  {
    id: '17', name: 'Amoksiclav 625 mg', brand: 'Sandoz',
    image: 'https://www.scabpharmacy.com/wp-content/uploads/2024/03/Amoksiclav-625mg-tabs-scaled.jpg',
    category: 'Prescription Medicines', tags: ['Antibiotic', 'Prescription Required'], productType: 'Prescription medicine', prescriptionRequired: true,
    description: 'Amoxicillin and clavulanic acid combination shown as 625 mg tablets. This prescription medicine is supplied only after pharmacist review of a valid prescription.',
    keyDetails: ['Amoxicillin + clavulanic acid', '625 mg (pictured pack)'],
    safetyNote: 'Antibiotics require a valid prescription and professional review. Do not use without a prescriber’s advice.',
  },
  {
    id: '18', name: 'Skyclav 625 mg', brand: 'Skyclav',
    image: 'https://agooha.com/images/products/5e5321da-5711-4302-b0e5-0913d241fce6.png',
    category: 'Prescription Medicines', tags: ['Antibiotic', 'Prescription Required'], productType: 'Prescription medicine', prescriptionRequired: true,
    description: 'Amoxicillin and clavulanic acid combination shown as 625 mg tablets. This prescription medicine is supplied only after pharmacist review of a valid prescription.',
    keyDetails: ['Amoxicillin + clavulanic acid', '625 mg (pictured pack)'],
    safetyNote: 'Antibiotics require a valid prescription and professional review. Do not use without a prescriber’s advice.',
  },
];

export const ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Understanding the Role of B Vitamins in Daily Energy',
    category: 'Nutrition',
    date: 'Oct 24, 2023',
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&q=80&w=600',
    author: 'Kethama Health Hub',
    authorRole: 'Health Education',
    excerpt: 'B vitamins are crucial for converting food into cellular energy and maintaining healthy nerve function...',
    content: `
      B vitamins are a group of eight essential nutrients that play a critical role in keeping your body’s many systems running smoothly. While they each have unique functions, they generally work together to help your body manage energy levels and keep your cells healthy.

      ### Why B Vitamins Matter
      The B-complex vitamins include B1 (thiamine), B2 (riboflavin), B3 (niacin), B5 (pantothenic acid), B6 (pyridoxine), B7 (biotin), B9 (folate), and B12 (cobalamin). These vitamins are water-soluble, meaning your body doesn't store them in large amounts, so you need to get them from your diet every day.

      ### Energy Production
      Their most well-known role is "energy metabolism." This doesn't mean they provide energy themselves, but they act as cofactors that help enzymes break down carbohydrates, fats, and proteins into glucose, which your body uses for fuel.

      ### Nerve and Brain Health
      Vitamins B1, B6, and B12 are particularly important for maintaining a healthy nervous system. They help in the production of neurotransmitters (your brain's chemical messengers) and the maintenance of the myelin sheath, which protects your nerve fibers.

      ### Dietary Sources
      You can find B vitamins in a variety of foods:
      - **Whole grains** (brown rice, barley)
      - **Meat** (poultry, red meat)
      - **Eggs and dairy products**
      - **Legumes** (beans, lentils)
      - **Seeds and nuts**
      - **Dark leafy greens** (broccoli, spinach)

      If you're feeling chronically fatigued, a deficiency in B12 or iron is often one of the first things a pharmacist or doctor will look for.
    `
  },
  {
    id: '2',
    title: '5 Tips for Better Sleep Hygiene for Working Professionals',
    category: 'Wellness',
    date: 'Oct 20, 2023',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=600',
    author: 'Kethama Health Hub',
    authorRole: 'Health Education',
    excerpt: 'Quality sleep is the foundation of good health. Learn how small changes can improve your rest...',
    content: `
      In today's fast-paced corporate world, sleep is often the first thing we sacrifice. However, chronic sleep deprivation can lead to serious health issues, including heart disease, diabetes, and weakened immunity.

      ### What is Sleep Hygiene?
      Sleep hygiene refers to the healthy habits and environmental factors that promote quality, restorative sleep. For working professionals in Ghana, balancing late-night emails with early-morning traffic makes this especially challenging.

      ### 1. Consistency is Key
      Try to go to bed and wake up at the same time every day, even on weekends. This helps regulate your body's internal clock (circadian rhythm), making it easier to fall asleep and wake up naturally.

      ### 2. Create a Digital Sunset
      The blue light emitted by phones and laptops suppresses melatonin, the hormone that makes you sleepy. Aim to turn off all screens at least 60 minutes before bed. Try reading a physical book or listening to a podcast instead.

      ### 3. Watch Your Caffeine Intake
      While that 4 PM coffee might seem necessary to finish your reports, caffeine can stay in your system for up to 8 hours. Try switching to herbal tea or water after lunch.

      ### 4. Optimize Your Environment
      Your bedroom should be a sanctuary for sleep. Keep it dark, quiet, and as cool as possible. If the sounds of the city are too loud, consider using white noise from a fan or a dedicated app.

      ### 5. Wind Down Physically
      Physical activity during the day can help you fall asleep faster at night. However, avoid intense exercise right before bed as it raises your body temperature and heart rate, which can keep you awake.

      Implementing just two of these tips can significantly improve your mental clarity and productivity during the workday.
    `
  },
  {
    id: 'nutrition-balanced-plate',
    title: 'Building a Balanced Plate with Everyday Foods',
    category: 'Nutrition',
    date: 'Oct 7, 2026',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1200',
    author: 'Kethama Health Hub',
    authorRole: 'Health education',
    excerpt: 'A varied mix of vegetables, fruit, pulses, whole grains and protein can make everyday meals more nourishing.',
    content: `
      A healthy eating pattern is built over time. It does not depend on one “superfood” or a perfect meal. A useful starting point is to include a variety of foods across the day and choose minimally processed options where practical.

      ### Mix food groups
      Pair familiar staples such as maize, millet, rice or yam with beans or other pulses, vegetables, fruit, and a source of protein such as fish, eggs or poultry. Different foods contribute different nutrients, so variety matters.

      ### Make small, realistic changes
      Add a vegetable or fruit to a meal you already enjoy, choose beans more often, or swap some refined grains for whole-grain options when they are available and affordable. There is no single plate that suits everyone.

      ### Keep personal needs in mind
      Nutrition needs can differ with age, health conditions, pregnancy, culture and food access. If you have a medical condition or need a therapeutic diet, ask a qualified health professional for advice tailored to you.
    `,
    sources: [{ label: 'WHO: Healthy diet', url: 'https://www.who.int/en/news-room/fact-sheets/detail/healthy-diet' }]
  },
  {
    id: 'nutrition-vitamin-d',
    title: 'Vitamin D: Food, Sunlight and Supplements',
    category: 'Nutrition',
    date: 'Oct 7, 2026',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1200',
    author: 'Kethama Health Hub',
    authorRole: 'Health education',
    excerpt: 'Learn what vitamin D does, where it comes from, and why it is worth checking before starting a supplement.',
    content: `
      Vitamin D helps the body absorb calcium and supports healthy bones. The body can make vitamin D after exposure to sunlight, and some foods provide it, including oily fish, egg yolks and foods fortified with vitamin D. Fortification varies by product and location.

      ### Supplements are not one-size-fits-all
      Some people may need a supplement, but the right choice depends on age, diet, health and other factors. More is not always better: very high intakes can be harmful.

      ### Ask before taking a high dose
      Check with a pharmacist or clinician if you are considering a vitamin D supplement, already take other supplements or medicines, or have a health condition. They can help you decide whether a supplement is appropriate and how to use it safely.
    `,
    sources: [{ label: 'NIH Office of Dietary Supplements: Vitamin D fact sheet', url: 'https://ods.od.nih.gov/factsheets/VitaminD-Consumer/' }]
  },
  {
    id: 'nutrition-fibre',
    title: 'Everyday Ways to Add More Fibre',
    category: 'Nutrition',
    date: 'Oct 7, 2026',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=1200',
    author: 'Kethama Health Hub',
    authorRole: 'Health education',
    excerpt: 'Beans, vegetables, fruit and whole grains are practical ways to bring more fibre into meals.',
    content: `
      Fibre is found in plant foods. Beans and peas, vegetables, fruit, nuts, seeds and whole grains can all contribute to a varied diet. Choosing several of these foods across the week is more useful than relying on one product.

      ### Start with foods you already eat
      Add beans to a stew, serve vegetables alongside a staple, choose whole fruit, or try a whole-grain option when available. Increase higher-fibre foods gradually and drink fluids regularly, unless a clinician has advised you to limit fluids.

      ### Get advice for persistent symptoms
      A sudden change in bowel habits, ongoing discomfort, or a condition that affects digestion deserves individual advice. Ask a pharmacist or clinician before using fibre supplements, especially if you take medicines or have a medical condition.
    `,
    sources: [{ label: 'WHO: Healthy diet', url: 'https://www.who.int/en/news-room/fact-sheets/detail/healthy-diet' }]
  },
  {
    id: 'wellness-movement',
    title: 'Making Movement Part of Your Week',
    category: 'Wellness',
    date: 'Oct 7, 2026',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1200',
    author: 'Kethama Health Hub',
    authorRole: 'Health education',
    excerpt: 'Walking, active transport and short movement breaks can help make physical activity more achievable.',
    content: `
      Regular physical activity supports physical and mental health. It does not need to happen in a gym: brisk walking, dancing, active travel, gardening and other activities that raise your breathing can count.

      ### Build up gradually
      Adults are generally advised to aim for 150–300 minutes of moderate-intensity activity per week, or an equivalent amount of vigorous activity, and to do muscle-strengthening activity on at least two days. Some movement is better than none, and activity can be spread across the week.

      ### Choose what works for you
      Start at a comfortable level and increase gradually. If you have a chronic condition, are pregnant, have been inactive for a long time, or are unsure what is safe, ask a health professional for personalized guidance.
    `,
    sources: [{ label: 'WHO: Physical activity', url: 'https://www.who.int/news-room/fact-sheets/detail/physical-activity' }]
  },
  {
    id: 'wellness-stress',
    title: 'Simple Skills for Managing Everyday Stress',
    category: 'Wellness',
    date: 'Oct 7, 2026',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200',
    author: 'Kethama Health Hub',
    authorRole: 'Health education',
    excerpt: 'A steady routine, supportive relationships and small moments of recovery can help when life feels demanding.',
    content: `
      Stress is a common response to difficult or demanding situations. A little stress can pass on its own, but when it becomes overwhelming or affects everyday life, support may help.

      ### Try small, repeatable steps
      Keep a simple daily routine, make time for rest and sleep, stay connected with someone you trust, and include enjoyable movement or relaxation where possible. Focus on steps that feel realistic rather than trying to change everything at once.

      ### Reach out when stress persists
      If stress is hard to manage, disrupts sleep or daily activities, or leaves you feeling unsafe, speak with a health professional or trusted support service. These strategies can support wellbeing but are not a substitute for care when it is needed.
    `,
    sources: [{ label: 'WHO: Stress — questions and answers', url: 'https://www.who.int/news-room/questions-and-answers/item/stress/' }]
  },
  {
    id: 'wellness-sleep',
    title: 'A More Restful Sleep Routine',
    category: 'Wellness',
    date: 'Oct 7, 2026',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1200',
    author: 'Kethama Health Hub',
    authorRole: 'Health education',
    excerpt: 'A consistent schedule and a calm wind-down routine can support better sleep for many adults.',
    content: `
      Sleep needs vary by age and person, but most adults aged 18–60 are advised to get at least seven hours each night. Sleep quality and a regular schedule matter too.

      ### Set up a routine
      Try going to bed and waking up at similar times, make your room comfortable for rest, and create a relaxing wind-down period. Reducing late caffeine and bright screens may help some people settle.

      ### Ask for help with ongoing sleep problems
      If difficulty sleeping continues or affects your daytime wellbeing, speak with a clinician. Medicines and supplements for sleep can have side effects or interact with other treatments, so ask a pharmacist before using them.
    `,
    sources: [{ label: 'CDC: About sleep', url: 'https://www.cdc.gov/sleep/about/index.html' }]
  },
  {
    id: 'medication-medicine-list',
    title: 'Keep a Clear List of Your Medicines',
    category: 'Medication',
    date: 'Oct 7, 2026',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1200',
    author: 'Kethama Health Hub',
    authorRole: 'Health education',
    excerpt: 'An up-to-date medicine list makes it easier to answer questions and spot possible mix-ups during care.',
    content: `
      Keep a current list of prescription medicines, over-the-counter products, vitamins and herbal supplements. Include each product's name, strength and how you use it, and update the list when something changes.

      ### Bring it to health visits
      Share your list with your pharmacist, doctor or other care professional, especially when a new medicine is prescribed. Mention allergies and any unwanted effects you have experienced.

      ### Take medicines as directed
      Follow the label or the instructions from your prescriber. If a direction is unclear, do not guess—ask a pharmacist or prescriber to explain it. Store medicines as directed and keep them away from children.
    `,
    sources: [{ label: 'FDA: Use medicines wisely', url: 'https://www.fda.gov/consumers/womens-health/use-medicines-wisely' }]
  },
  {
    id: 'medication-antibiotics',
    title: 'Antibiotics: Use Them Only as Prescribed',
    category: 'Medication',
    date: 'Oct 7, 2026',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=1200',
    author: 'Kethama Health Hub',
    authorRole: 'Health education',
    excerpt: 'Antibiotics treat certain bacterial infections, not viral illnesses such as colds and flu.',
    content: `
      Antibiotics work against some bacterial infections. They do not treat viruses such as colds or flu, and taking them when they are not needed can still cause side effects and contribute to antibiotic resistance.

      ### Follow the prescription
      Use antibiotics only when prescribed for you, and follow the prescriber's directions. Do not share antibiotics, use someone else's medicine or keep leftover antibiotics for another illness.

      ### Check if you are unsure
      Ask the pharmacist or prescriber if you are uncertain how to take an antibiotic, miss a dose, develop a side effect or do not improve as expected. Never change or stop a prescribed course without getting advice.
    `,
    sources: [{ label: 'CDC: Antibiotic do’s and don’ts', url: 'https://www.cdc.gov/antibiotic-use/about/index.html' }]
  },
  {
    id: 'medication-otc-labels',
    title: 'Before You Choose an Over-the-Counter Medicine',
    category: 'Medication',
    date: 'Oct 7, 2026',
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=1200',
    author: 'Kethama Health Hub',
    authorRole: 'Health education',
    excerpt: 'Reading the active ingredients, directions and warnings can help you use non-prescription medicines more safely.',
    content: `
      Over-the-counter medicines can still cause side effects or interact with other medicines. Before choosing one, check the active ingredient, intended use, dose directions, warnings and expiry date.

      ### Check your circumstances
      Ask a pharmacist before use if you take other medicines, have a long-term condition, are pregnant or breastfeeding, or are choosing a medicine for a child. Some products contain the same active ingredient, so taking more than one can lead to an accidental extra dose.

      ### Get help if symptoms persist
      If you are unsure which product is suitable or symptoms are severe, worsening or not improving, seek advice from a pharmacist or clinician instead of repeatedly self-treating.
    `,
    sources: [{ label: 'FDA: Over-the-counter medicines — what’s right for you?', url: 'https://www.fda.gov/drugs/understanding-over-counter-medicines/over-counter-medicines-whats-right-you' }]
  },
  {
    id: 'mental-health-self-care',
    title: 'Self-Care That Supports Mental Wellbeing',
    category: 'Mental Health',
    date: 'Oct 7, 2026',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200',
    author: 'Kethama Health Hub',
    authorRole: 'Health education',
    excerpt: 'Rest, connection, movement and manageable routines can support wellbeing alongside professional care.',
    content: `
      Self-care means making time for habits that support your health and wellbeing. It can include getting enough rest, eating regularly, moving in ways that feel manageable, keeping in touch with supportive people and making space for activities you enjoy.

      ### Keep it practical
      Choose one small step that fits your circumstances, such as a short walk, a regular meal or a check-in with someone you trust. There is no single routine that works for everyone.

      ### Self-care is not a replacement for care
      If distress is persistent, difficult to manage or interfering with everyday life, consider speaking with a qualified mental-health professional or clinician. If you or someone else is in immediate danger, contact local emergency services or go to the nearest emergency department.
    `,
    sources: [{ label: 'NIMH: Caring for your mental health', url: 'https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health' }]
  },
  {
    id: 'mental-health-anxiety',
    title: 'When Worry Starts to Affect Daily Life',
    category: 'Mental Health',
    date: 'Oct 7, 2026',
    image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80&w=1200',
    author: 'Kethama Health Hub',
    authorRole: 'Health education',
    excerpt: 'Occasional worry is part of life, but persistent anxiety that disrupts daily activities deserves support.',
    content: `
      Feeling anxious from time to time is a normal response to stress. When fear or worry is intense, continues over time or makes it difficult to manage everyday activities, it can be helpful to talk with a health professional.

      ### You do not need to figure it out alone
      A clinician can listen, assess what is going on and discuss support options. Evidence-based psychological treatments and other care can help; what is appropriate depends on the person.

      ### Offer steady support
      If someone you care about is struggling, listen without judgment and encourage them to reach out for professional support. If there is an immediate safety concern, seek urgent local help.
    `,
    sources: [{ label: 'WHO: Anxiety disorders', url: 'https://www.who.int/news-room/fact-sheets/detail/anxiety-disorders' }]
  },
  {
    id: 'mental-health-reaching-out',
    title: 'How to Reach Out for Mental Health Support',
    category: 'Mental Health',
    date: 'Oct 7, 2026',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200',
    author: 'Kethama Health Hub',
    authorRole: 'Health education',
    excerpt: 'Starting a conversation with someone you trust or a health professional can be a useful first step.',
    content: `
      It can be difficult to talk about mental health, but you do not need to wait until things feel unmanageable. Consider starting with a trusted person or arranging a conversation with a qualified health professional.

      ### Make the first step easier
      You could write down what has been bothering you, how long it has been going on and what kind of support you hope for. Share only what you feel ready to share. A pharmacist can help discuss medicine questions and guide you toward an appropriate clinician when needed.

      ### Seek urgent help for immediate danger
      If you might harm yourself or someone else, or cannot stay safe, contact local emergency services or go to the nearest emergency department now. Do not rely on an online article for urgent help.
    `,
    sources: [{ label: 'WHO: Mental health — strengthening our response', url: 'https://www.who.int/en/news-room/fact-sheets/detail/mental-health-strengthening-our-response' }]
  }
];

export const SERVICES: PharmacyService[] = [
  {
    id: '1',
    title: 'Prescription Medicines & Antibiotics',
    description: 'Enquire about prescribed medicines, including antibiotics, with pharmacist support.',
    longDescription: 'Prescription medicines, including antibiotics, are supplied only following review of a valid prescription by the pharmacy team. Availability depends on the prescription and current stock. Please do not use antibiotics without professional advice.',
    icon: 'Pill',
    image: prescriptionImage,
    features: ['Valid prescription required', 'Pharmacist review', 'Availability confirmed on enquiry', 'Medication-use guidance'],
    pricing: 'Contact us to confirm current pricing'
  },
  {
    id: '2',
    title: 'Malaria & Health Testing',
    description: 'Enquire about malaria rapid testing and other health checks available at the pharmacy.',
    longDescription: 'Ask our team about available in-pharmacy checks, including malaria rapid testing, blood glucose monitoring, cholesterol screening and blood pressure measurement. Test availability and suitability can be confirmed with the pharmacy.',
    icon: 'TestTube',
    image: testingImage,
    features: ['Malaria rapid testing', 'Blood glucose checks', 'Cholesterol screening', 'Blood pressure checks'],
    pricing: 'Contact us to confirm current pricing'
  },
  {
    id: '5',
    title: 'First Aid & Wound Care Essentials',
    description: 'Ask about cotton wool, gauze, dressings and other everyday first-aid supplies.',
    longDescription: 'The pharmacy can help you enquire about common first-aid and wound-care essentials. Product brands and availability may vary, so contact us to confirm what is currently in stock. For serious wounds or urgent symptoms, seek medical care.',
    icon: 'Bandage',
    image: firstAidImage,
    features: ['Cotton wool and gauze', 'Dressings and bandages', 'Antiseptic wound-care products', 'Ask us to confirm current stock']
  }
];
