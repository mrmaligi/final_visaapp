import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                Your Journey <br />Starts Here
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
                Simplifying your visa application process with speed, transparency, and expert guidance. Join thousands of travelers who trust VisaHelper.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/signup"
                  className="px-8 py-4 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all transform hover:-translate-y-0.5 text-center"
                  style={{ backgroundColor: '#0052cc' }}
                >
                  Start Application
                </Link>
                <Link 
                  href="/tracker"
                  className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:border-[#0052cc] hover:text-[#0052cc] transition-all text-center"
                >
                  Check Status
                </Link>
              </div>
            </div>
            
            {/* Hero Image Placeholder */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 bg-gradient-to-br from-blue-50 to-indigo-100 aspect-[4/3] flex items-center justify-center">
                <div className="text-center p-8">
                  <svg className="h-24 w-24 mx-auto mb-4" style={{ color: '#0052cc' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-slate-600 font-medium">Global Visa Solutions</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-12 bg-gray-50 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">Trusted by global travelers & official partners</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50">
              {['Home Affairs', 'Immigration Dept', 'Travel Association', 'Legal Partners', 'Secure SSL'].map((partner) => (
                <span key={partner} className="text-sm font-semibold text-slate-500">{partner}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white" id="services">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Seamless Visa Solutions</h2>
              <div className="mt-4 h-1.5 w-20 mx-auto rounded-full" style={{ backgroundColor: '#0052cc' }}></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 group">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#0052cc] transition-colors">
                  <svg className="h-8 w-8 group-hover:text-white" style={{ color: '#0052cc' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Easy Application</h3>
                <p className="text-slate-600 leading-relaxed">
                  Fill out your forms in minutes with our intuitive interface. No complex jargon, just clear steps.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 group">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#0052cc] transition-colors">
                  <svg className="h-8 w-8 group-hover:text-white" style={{ color: '#0052cc' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Track Progress</h3>
                <p className="text-slate-600 leading-relaxed">
                  Get real-time updates on your application status every step of the way. Transparency at its best.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 group">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#0052cc] transition-colors">
                  <svg className="h-8 w-8 group-hover:text-white" style={{ color: '#0052cc' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Expert Support</h3>
                <p className="text-slate-600 leading-relaxed">
                  Our team of visa specialists is here to help you 24/7. Expert advice is just a click away.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">How It Works</h2>
              <p className="mt-4 text-lg text-slate-600">Four simple steps to your visa</p>
              <div className="mt-4 h-1.5 w-20 mx-auto rounded-full" style={{ backgroundColor: '#0052cc' }}></div>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Select Visa', desc: 'Choose the visa type that matches your travel needs' },
                { step: '02', title: 'Fill Forms', desc: 'Complete our simplified digital application forms' },
                { step: '03', title: 'Upload Docs', desc: 'Submit required documents securely through our platform' },
                { step: '04', title: 'Track & Receive', desc: 'Monitor progress and receive your visa notification' },
              ].map((item, idx) => (
                <div key={idx} className="relative text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-2xl font-bold text-white" style={{ backgroundColor: '#0052cc' }}>
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                  {idx < 3 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gray-200"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 bg-white" id="pricing">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Simple, Transparent Pricing</h2>
              <p className="mt-4 text-lg text-slate-600">No hidden fees, no surprises</p>
              <div className="mt-4 h-1.5 w-20 mx-auto rounded-full" style={{ backgroundColor: '#0052cc' }}></div>
            </div>
            <div className="max-w-md mx-auto">
              <div className="p-8 rounded-2xl border-2 text-center" style={{ borderColor: '#0052cc' }}>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Standard Application</h3>
                <div className="my-6">
                  <span className="text-5xl font-extrabold text-slate-900">$49</span>
                  <span className="text-slate-600">/application</span>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  {[
                    'Complete form guidance',
                    'Document checklist',
                    'Application review',
                    'Status tracking',
                    'Email support',
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <svg className="h-5 w-5 flex-shrink-0" style={{ color: '#0052cc' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/signup"
                  className="block w-full py-4 text-white font-bold rounded-lg hover:opacity-90 transition-all"
                  style={{ backgroundColor: '#0052cc' }}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
