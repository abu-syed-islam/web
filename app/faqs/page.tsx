import { Accordion } from '@/components/ui/accordion';

const faqs = [
  {
    id: '1',
    question: 'What services do you offer?',
    answer:
      'We offer comprehensive web development services including custom web applications, e-commerce solutions, responsive web design, API development, cloud deployment, and ongoing maintenance and support. Our team specializes in modern technologies like React, Next.js, Node.js, and various cloud platforms.',
  },
  {
    id: '2',
    question: 'How long does a typical project take?',
    answer:
      'Project timelines vary based on scope and complexity. A simple website typically takes 2-4 weeks, while a full-stack web application can take 2-6 months. During our initial consultation, we provide a detailed timeline with milestones specific to your project requirements.',
  },
  {
    id: '3',
    question: 'What is your development process?',
    answer:
      'Our process follows four main phases: Discovery (understanding your goals and requirements), Design (creating wireframes and mockups), Development (building and testing), and Launch (deployment and handover). We maintain transparent communication throughout with regular updates and demos.',
  },
  {
    id: '4',
    question: 'Do you provide ongoing support and maintenance?',
    answer:
      'Yes, we offer various support packages including bug fixes, security updates, performance optimization, feature additions, and 24/7 monitoring. Support plans can be customized based on your specific needs and budget.',
  },
  {
    id: '5',
    question: 'What technologies do you work with?',
    answer:
      'We specialize in modern web technologies including React, Next.js, TypeScript, Node.js, PostgreSQL, MongoDB, AWS, Vercel, and various other cloud platforms. We stay current with industry best practices and emerging technologies to deliver cutting-edge solutions.',
  },
  {
    id: '6',
    question: 'How do you ensure code quality and security?',
    answer:
      'We follow industry best practices including code reviews, automated testing, security audits, and performance optimization. All projects include proper documentation, version control, and adhere to security standards like OWASP guidelines.',
  },
  {
    id: '7',
    question: 'Can you work with our existing team?',
    answer:
      'Absolutely! We excel at collaborating with in-house teams, designers, and other stakeholders. We can integrate seamlessly into your workflow, provide technical guidance, or work as an independent unit depending on your needs.',
  },
  {
    id: '8',
    question: 'What are your pricing models?',
    answer:
      'We offer flexible pricing models including fixed-price projects, hourly rates, and retainer agreements. Pricing depends on project scope, complexity, and timeline. Contact us for a detailed quote tailored to your specific requirements.',
  },
  {
    id: '9',
    question: 'Do you provide hosting and domain services?',
    answer:
      'While we primarily focus on development, we can help set up hosting, configure domains, and manage deployment. We work with various hosting providers and cloud platforms to find the best solution for your needs and budget.',
  },
  {
    id: '10',
    question: 'How do we get started?',
    answer:
      `Getting started is easy! Simply contact us through our contact form or schedule a free consultation call. We'll discuss your project, answer any questions, and provide a detailed proposal with timeline and pricing. No commitments required for the initial consultation.`,
  },
];

export default function FAQsPage() {
  return (
    <div className="pb-16 pt-12 md:pt-16">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-12 px-6">
        <div className="space-y-3 text-center">
          <p className="text-sm font-semibold text-primary">FAQs</p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Everything you need to know about our services, process, and how we
            work. Can't find what you're looking for? Contact us directly.
          </p>
        </div>

        <Accordion items={faqs} />

        <div className="rounded-2xl border bg-muted/40 p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold">Still have questions?</h3>
          <p className="mb-4 text-muted-foreground">
            We're here to help. Get in touch and we'll respond as soon as
            possible.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
