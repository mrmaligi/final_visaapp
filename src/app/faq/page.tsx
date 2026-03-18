import { Metadata } from "next";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Find answers to common questions about Australian visas, the application process, and VisaHelper services.",
  openGraph: {
    title: "FAQ | VisaHelper",
    description: "Common questions about Australian visa applications.",
  },
};

const faqs = [
  {
    question: "How does VisaHelper work?",
    answer: "VisaHelper simplifies the Australian visa application process. Browse visa categories, pay a one-time fee of $49 to unlock premium content including detailed guides and application forms, complete your application with our guided tools, and optionally book consultations with verified immigration lawyers.",
  },
  {
    question: "What is included in the $49 fee?",
    answer: "The $49 fee gives you lifetime access to premium content for a specific visa type, including detailed application guides, document checklists, step-by-step form assistance, and progress tracking. You can access this content anytime.",
  },
  {
    question: "Are the lawyers on your platform verified?",
    answer: "Yes, all lawyers on VisaHelper go through a rigorous verification process. We verify their registration with Australian legal authorities, review their credentials, and collect feedback from users to maintain quality standards.",
  },
  {
    question: "How do I book a consultation with a lawyer?",
    answer: "After browsing our lawyer directory, select a lawyer based on their expertise and reviews. Choose your preferred consultation duration (30 or 60 minutes), select an available time slot, and complete payment. You\'ll receive confirmation and meeting details via email.",
  },
  {
    question: "Can I get a refund if I change my mind?",
    answer: "We offer a 14-day money-back guarantee if you haven\'t accessed the premium content. If you\'ve already started using the materials, refunds are handled on a case-by-case basis. Please contact our support team for assistance.",
  },
  {
    question: "Is my personal information secure?",
    answer: "Absolutely. We use enterprise-grade encryption and security measures to protect your data. All documents are stored securely in Supabase with row-level security, and we never share your information with third parties without your consent.",
  },
  {
    question: "What types of visas do you support?",
    answer: "We support all major Australian visa categories including skilled migration (189, 190, 491), family visas (partner, parent, child), student visas (500), business visas, visitor visas (600), and protection visas.",
  },
  {
    question: "How accurate is the processing time tracker?",
    answer: "Our tracker is powered by real user contributions. While we can\'t guarantee exact processing times (as these are determined by the Department of Home Affairs), our community-driven data provides realistic estimates based on recent applications.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="bg-[#0052cc] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Find answers to common questions about our services.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-[#0052cc] text-white font-semibold rounded-lg hover:bg-[#0052cc]/90 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
