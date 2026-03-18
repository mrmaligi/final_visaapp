'use client';

import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // General
  {
    category: 'General',
    question: 'What is VisaHelper?',
    answer: 'VisaHelper is an online platform that simplifies the visa application process. We provide guided form filling, document checklists, status tracking, and expert support to help you navigate visa applications with ease.'
  },
  {
    category: 'General',
    question: 'Which countries do you support?',
    answer: 'We currently support visa applications for Australia, Canada, United Kingdom, United States, and New Zealand. We are continuously adding support for more countries based on user demand.'
  },
  {
    category: 'General',
    question: 'Is VisaHelper an official government service?',
    answer: 'No, VisaHelper is not a government agency. We are a private service that helps you prepare and organize your visa application. All applications are ultimately submitted to the respective government immigration departments.'
  },
  // Payments
  {
    category: 'Payments',
    question: 'How much does VisaHelper cost?',
    answer: 'Our standard application assistance costs $49 per application. This includes form guidance, document checklist, application review, and status tracking. Government visa fees are separate and paid directly to the respective immigration authority.'
  },
  {
    category: 'Payments',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for larger amounts. All payments are processed securely through our PCI-compliant payment processor.'
  },
  {
    category: 'Payments',
    question: 'Can I get a refund if my visa is denied?',
    answer: 'Our service fee is for application assistance and is non-refundable. However, if you are not satisfied with our service before submission, please contact us within 7 days for a refund consideration. Government fees are never refundable.'
  },
  // Lawyers
  {
    category: 'Lawyers',
    question: 'Do I need a lawyer to use VisaHelper?',
    answer: 'No, most standard visa applications do not require a lawyer. Our platform is designed to guide you through simple applications. For complex cases, we offer optional legal consultation services with our partner immigration lawyers.'
  },
  {
    category: 'Lawyers',
    question: 'How do I connect with a lawyer through VisaHelper?',
    answer: 'You can request a legal consultation from your dashboard after creating an account. We will match you with an experienced immigration lawyer who specializes in your visa type and destination country.'
  },
  // Technical
  {
    category: 'Technical',
    question: 'Is my data secure on VisaHelper?',
    answer: 'Yes, we take data security very seriously. All data is encrypted in transit and at rest using industry-standard encryption. We are compliant with GDPR and other privacy regulations. We never sell or share your personal information with third parties.'
  },
  {
    category: 'Technical',
    question: 'What browsers are supported?',
    answer: 'VisaHelper works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated to the latest version for the best experience. Mobile browsers on iOS and Android are also fully supported.'
  },
  {
    category: 'Technical',
    question: 'How do I track my application status?',
    answer: 'Once you submit your application through our platform, you can track its status in real-time from your dashboard. We pull updates from government systems and also notify you via email whenever there is a status change.'
  },
];

const categories = ['All', 'General', 'Payments', 'Lawyers', 'Technical'];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [openItems, setOpenItems] = useState<number[]>([0]);

  const filteredFAQs = activeCategory === 'All' 
    ? faqData 
    : faqData.filter(item => item.category === activeCategory);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-slate-600">
              Find answers to common questions about VisaHelper
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category
                      ? 'text-white'
                      : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                  }`}
                  style={activeCategory === category ? { backgroundColor: '#0052cc' } : {}}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {filteredFAQs.map((item, index) => {
                const globalIndex = faqData.indexOf(item);
                const isOpen = openItems.includes(globalIndex);
                
                return (
                  <div 
                    key={globalIndex}
                    className="border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(globalIndex)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-slate-900 pr-4">{item.question}</span>
                      <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isOpen ? 'bg-[#0052cc] text-white' : 'bg-gray-100 text-slate-600'
                      }`}>
                        <svg 
                          className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>
                    
                    {isOpen && (
                      <div className="px-6 pb-5">
                        <p className="text-slate-600 leading-relaxed">{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Still Have Questions */}
            <div className="mt-16 text-center p-8 rounded-2xl bg-gray-50">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Still have questions?</h3>
              <p className="text-slate-600 mb-6">Can not find the answer you are looking for? Contact our support team.</p>
              <a 
                href="/contact"
                className="inline-block px-8 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
                style={{ backgroundColor: '#0052cc' }}
              >
                Contact Support
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
