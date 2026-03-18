import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | VisaHelper - Simplifying Australian Immigration',
  description: 'Learn about VisaHelper\'s mission to make Australian visa applications simple, transparent, and accessible for everyone.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 py-20 lg:py-28">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Our Mission
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              To make Australian visa applications simple, transparent, and accessible for everyone, 
              regardless of their background or circumstances.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>
                    VisaHelper was founded in 2024 by a team of immigration professionals and tech entrepreneurs 
                    who saw a gap in the market for affordable, accessible visa assistance.
                  </p>
                  <p>
                    We noticed that many people struggled with complex visa applications, often paying thousands 
                    of dollars for services they didn't fully understand. We believed there had to be a better way.
                  </p>
                  <p>
                    Today, we've helped thousands of applicants navigate the Australian immigration system, 
                    connecting them with verified lawyers and providing the tools they need for success.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 aspect-square flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0052cc' }}>
                      <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">VisaHelper</p>
                    <p className="text-slate-600 mt-2">Making immigration simple</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: '10,000+', label: 'Applications Processed' },
                { number: '500+', label: 'Verified Lawyers' },
                { number: '98%', label: 'Success Rate' },
                { number: '24/7', label: 'Support Available' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-4xl font-bold text-slate-900 mb-2" style={{ color: '#0052cc' }}>
                    {stat.number}
                  </p>
                  <p className="text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">Our Values</h2>
              <div className="mt-4 h-1.5 w-20 mx-auto rounded-full" style={{ backgroundColor: '#0052cc' }}></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
                  title: 'Transparency',
                  description: 'We believe in clear, upfront pricing and honest communication. No hidden fees, no surprises.',
                },
                {
                  icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
                  title: 'Accessibility',
                  description: 'Immigration services should be accessible to everyone, not just those who can afford expensive lawyers.',
                },
                {
                  icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
                  title: 'Innovation',
                  description: 'We constantly improve our platform using the latest technology to make the process smoother and faster.',
                },
              ].map((value) => (
                <div key={value.title} className="p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: '#0052cc' }}>
                    <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={value.icon} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Join thousands of successful applicants who chose VisaHelper for their Australian visa needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/visas"
                className="px-8 py-4 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 transition-all transform hover:-translate-y-0.5 text-center"
                style={{ backgroundColor: '#0052cc' }}
              >
                Explore Visas
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:border-[#0052cc] hover:text-[#0052cc] transition-all text-center"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
