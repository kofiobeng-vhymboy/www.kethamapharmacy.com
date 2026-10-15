import { Link } from 'react-router-dom';
import { ChevronRight, FileText, ShieldCheck } from 'lucide-react';

const sections = [
  {
    id: 'privacy',
    title: 'Privacy notice',
    content: [
      {
        heading: 'Information you choose to share',
        text: 'You can browse the site without submitting personal details. If you choose to contact the pharmacy through WhatsApp or another contact option, the details and message you provide are shared with the recipient service and the pharmacy so they can respond. Please avoid sending sensitive medical information unless it is needed for your enquiry.',
      },
      {
        heading: 'Local browser storage',
        text: 'Some convenience features may save preferences or demo profile information in your browser on your device. This prototype does not currently provide a pharmacy account service or process online payments. Anyone with access to your device or browser profile may be able to see locally saved information.',
      },
      {
        heading: 'Third-party services and links',
        text: 'Links such as WhatsApp, telephone and email open services outside this website. Those services have their own privacy practices and terms; review them before sharing information. The pharmacy does not control how an external service processes data after you leave this site.',
      },
      {
        heading: 'Your choices and questions',
        text: 'You may choose not to submit information, clear locally saved browser data, or contact the pharmacy with a privacy question. Email kethamapharmacy@gmail.com or call +233 24 453 7326.',
      },
    ],
  },
  {
    id: 'terms',
    title: 'Service terms',
    content: [
      {
        heading: 'Website information',
        text: 'This website introduces Kethama Pharmacy and its products and services. Content is general information, may change, and is not a diagnosis, prescription, or substitute for advice from a qualified health professional. Contact the pharmacy to confirm current product availability, prices, service details, and opening arrangements.',
      },
      {
        heading: 'Medicines and health advice',
        text: 'Prescription medicines are subject to review of a valid prescription and applicable requirements. Do not start, stop, or change a medicine based only on website content. Ask a pharmacist or other qualified clinician for advice specific to you; seek urgent medical care for an emergency.',
      },
      {
        heading: 'Enquiries, orders and availability',
        text: 'An enquiry or message sent through the site or an external messaging service is not confirmation of an order, appointment, price, stock, delivery, or treatment. The pharmacy will confirm applicable details directly with you before proceeding. Any purchase or service is subject to confirmation and applicable requirements.',
      },
      {
        heading: 'Acceptable use and updates',
        text: 'Please use the website lawfully and do not interfere with its operation or security. We may update website content or these terms as services and site features change. The version shown here applies from its stated update date; continued use after an update indicates acceptance of the revised terms where permitted by law.',
      },
    ],
  },
];

export default function PrivacyAndTerms() {
  return (
    <main className="min-h-screen bg-white pt-20">
      <section className="bg-surface-container-low px-4 py-12 sm:py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-5xl">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary">
            <Link to="/" className="transition-colors hover:text-primary">Home</Link>
            <ChevronRight aria-hidden="true" className="h-3 w-3 text-outline" />
            <span aria-current="page">Privacy &amp; Service Terms</span>
          </nav>
          <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary shadow-sm sm:h-16 sm:w-16">
            <ShieldCheck aria-hidden="true" className="h-7 w-7 sm:h-8 sm:w-8" />
          </div>
          <h1 className="mb-4 font-display text-3xl font-extrabold leading-tight text-primary sm:text-4xl md:text-5xl">Privacy &amp; Service Terms</h1>
          <p className="max-w-3xl text-base font-medium leading-relaxed text-on-surface-variant sm:text-lg">
            How this website handles information, and what to know when using Kethama Pharmacy&apos;s online information and enquiry features.
          </p>
          <p className="mt-5 text-sm font-semibold text-on-surface-variant">Last updated: 9 October 2026</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:gap-10 sm:py-14 md:px-8 md:py-16">
        <nav aria-label="On this page" className="rounded-2xl border border-outline-variant bg-white p-5 sm:p-6">
          <h2 className="mb-4 font-display text-lg font-bold text-primary">On this page</h2>
          <div className="flex flex-wrap gap-3">
            {sections.map(section => (
              <a key={section.id} href={`#${section.id}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-surface-container-low px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-surface-container-highest focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                {section.id === 'privacy' ? <ShieldCheck aria-hidden="true" className="h-4 w-4" /> : <FileText aria-hidden="true" className="h-4 w-4" />}
                {section.title}
              </a>
            ))}
          </div>
        </nav>

        {sections.map(section => (
          <section key={section.id} id={section.id} className="scroll-mt-28">
            <h2 className="mb-5 font-display text-2xl font-bold text-primary sm:mb-6 sm:text-3xl">{section.title}</h2>
            <div className="grid gap-4 sm:gap-5">
              {section.content.map(item => (
                <article key={item.heading} className="rounded-2xl border border-outline-variant bg-white p-5 sm:p-7">
                  <h3 className="mb-2 font-display text-lg font-bold text-primary">{item.heading}</h3>
                  <p className="text-sm leading-7 text-on-surface-variant sm:text-base">{item.text}</p>
                </article>
              ))}
            </div>
          </section>
        ))}

        <div className="rounded-2xl bg-surface-container-low p-5 text-sm leading-relaxed text-on-surface-variant sm:p-6">
          For questions about these terms or the pharmacy&apos;s services, contact us at <a href="mailto:kethamapharmacy@gmail.com" className="font-bold text-primary underline underline-offset-2">kethamapharmacy@gmail.com</a> or <a href="tel:+233244537326" className="font-bold text-primary underline underline-offset-2">+233 24 453 7326</a>.
        </div>
      </div>
    </main>
  );
}
