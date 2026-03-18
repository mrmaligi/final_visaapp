import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | VisaHelper - Frequently Asked Questions',
  description: 'Find answers to frequently asked questions about Australian visas, our services, and the application process.',
};

const faqs = [
  {
    category: 'General Questions',
    questions: [
      {
        q: 'What is VisaHelper?',
        a: 'VisaHelper is an online platform that simplifies the Australian visa application process. We provide guided forms, document checklists, and access to verified immigration lawyers to help you navigate your visa journey with confidence.',
      },
      {
        q: 'Is VisaHelper affiliated with the Australian government?',
        a: 'No, VisaHelper is an independent private service. We are not affiliated with the Australian Department of Home Affairs. However, we work closely with registered migration agents and lawyers to provide accurate, up-to-date information.',
      },
      {
        q: 'How much does VisaHelper cost?',
        a: 'Our standard visa application guidance costs $49 per visa type. This includes access to our guided forms, document checklists, and application tracking. Lawyer consultations are billed separately at the lawyer\'s hourly rate.',
      },
    ],
  },
  {
    category: 'Visa Applications',
    questions: [
      {
        q: 'What visa types do you support?',
        a: 'We support all major Australian visa categories including Skilled Migration, Family Visas (Partner, Parent, Child), Student Visas, Business and Investment Visas, Visitor Visas, and Work Visas.',
      },
      {
        q: 'Can you guarantee my visa will be approved?',
        a: 'No, we cannot guarantee visa approval. Visa decisions are made by the Australian Department of Home Affairs. However, our tools and guidance are designed to help you submit a complete and accurate application, which can improve your chances of success.',
      },
      {
        q: 'How long does the application process take?',
        a: 'Processing times vary significantly depending on the visa type and your individual circumstances. You can check our Processing Time Tracker for current estimates based on real user data.',
      },
      {
        q: 'What documents do I need to provide?',
        a: 'Required documents vary by visa type but typically include identification (passport), proof of relationship (for family visas), qualifications (for skilled visas), financial evidence, and health/character documents. Our platform provides a personalized checklist once you select your visa.',
      },
    ],
  },
  {
    category: 'Lawyer Consultations',
    questions: [
      {
        q: 'How do I book a consultation with a lawyer?',
        a: 'Browse our lawyer directory, select a lawyer based on their expertise and ratings, choose your preferred consultation duration (30 or 60 minutes), and select an available time slot. Payment is processed securely through our platform.',
      },
      {
        q: 'Are the lawyers on your platform verified?',
        a: 'Yes, all lawyers on our platform are verified. We check their registration with the relevant legal authorities, review their credentials, and verify their professional standing before they can join our platform.',
      },
      {
        q: 'What if I need to reschedule or cancel my consultation?',
        a: 'You can reschedule or cancel your consultation up to 24 hours before the scheduled time for a full refund. Cancellations within 24 hours may be subject to a cancellation fee.',
      },
    ],
  },
  {
    category: 'Payments & Refunds',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. All payments are processed securely through Stripe.',
      },
      {
        q: 'Can I get a refund if I change my mind?',
        a: 'Our $49 visa guidance fee is refundable within 7 days if you haven\'t accessed the premium content. Lawyer consultation fees follow the cancellation policy mentioned above.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Yes, we use Stripe for payment processing, which is PCI DSS compliant. We never store your full credit card details on our servers.',
      },
    ],
  },
  {
    category: 'Account & Technical',
    questions: [
      {
        q: 'How do I create an account?',
        a: 'Click the "Sign Up" button and register using your Google account or email address. The process takes less than a minute.',
      },
      {
        q: 'I forgot my password. How do I reset it?',
        a: 'Click "Forgot Password" on the sign-in page and enter your email address. We\'ll send you a password reset link that expires in 24 hours.',
      },
      {
        q: 'Can I access my application from multiple devices?',
        a: 'Yes, your account and all your applications are synced across all your devices. Simply log in to access your data from anywhere.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gray-50 py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-slate-600">
              Find answers to common questions about our services and the visa application process.
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {faqs.map((category) => (
                <div key={category.category}>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">{category.category}</h2>
                  <div className="space-y-4">
                    {category.questions.map((faq, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <details className="group">
                          <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                            <span className="font-semibold text-slate-900 pr-4">{faq.q}</span>
                            <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
                              <svg
                                className="w-5 h-5 transition-transform group-open:rotate-180"
                                style={{ color: '#0052cc' }}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </span>
                          </summary>
                          <div className="px-6 pb-6">
                            <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                          </div>
                        </details>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Still Have Questions */}
            <div className="mt-16 p-8 rounded-2xl text-center" style={{ backgroundColor: '#DBEAFE' }}>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Still have questions?</h2>
              <p className="text-slate-600 mb-6">
                Can't find the answer you're looking for? Our team is here to help.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 transition-all"
                style={{ backgroundColor: '#0052cc' }}
              >
                Contact Support
                <svg className="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
