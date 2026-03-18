import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Mission Section */}
        <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
              Our Mission
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              To make visa applications accessible, transparent, and stress-free for everyone. 
              We believe that borders should not be barriers, and that technology can bridge 
              the gap between travelers and their destinations.
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>
                    VisaHelper was founded in 2023 by a team of immigrants, travelers, and 
                    technology enthusiasts who experienced firsthand the frustrations of 
                    navigating complex visa processes.
                  </p>
                  <p>
                    What started as a simple idea to help friends and family with their 
                    paperwork has grown into a platform serving thousands of applicants 
                    from over 50 countries.
                  </p>
                  <p>
                    We partner with experienced immigration lawyers and leverage cutting-edge 
                    technology to provide a seamless experience that puts the power back in 
                    the hands of travelers.
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl aspect-square flex items-center justify-center">
                <svg className="h-32 w-32" style={{ color: '#0052cc' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Our Values</h2>
              <div className="mt-4 h-1.5 w-20 mx-auto rounded-full" style={{ backgroundColor: '#0052cc' }}></div>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { title: 'Transparency', desc: 'Clear pricing, honest communication, no hidden fees.' },
                { title: 'Accessibility', desc: 'Making visa help available to everyone, everywhere.' },
                { title: 'Security', desc: 'Your data is protected with enterprise-grade security.' },
                { title: 'Excellence', desc: 'Committed to the highest standards of service.' },
              ].map((value) => (
                <div key={value.title} className="text-center p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-slate-600 text-sm">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Meet Our Team</h2>
              <p className="mt-4 text-lg text-slate-600">The people behind VisaHelper</p>
              <div className="mt-4 h-1.5 w-20 mx-auto rounded-full" style={{ backgroundColor: '#0052cc' }}></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: 'Coming Soon', role: 'Leadership Team', initials: 'VH' },
                { name: 'Coming Soon', role: 'Engineering Team', initials: 'VH' },
                { name: 'Coming Soon', role: 'Support Team', initials: 'VH' },
              ].map((member, idx) => (
                <div key={idx} className="text-center p-8 rounded-2xl border border-gray-100 bg-white">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-xl font-bold text-white" style={{ backgroundColor: '#0052cc' }}>
                    {member.initials}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                  <p className="text-slate-600">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
