import { Metadata } from "next";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about VisaHelper's mission to simplify Australian visa applications and connect applicants with verified immigration lawyers.",
  openGraph: {
    title: "About VisaHelper",
    description: "Simplifying Australian visa applications since 2024.",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="bg-[#0052cc] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">About VisaHelper</h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Simplifying the Australian visa journey for everyone.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              At VisaHelper, we believe that applying for an Australian visa shouldn&apos;t be complicated 
              or stressful. Our mission is to democratize access to immigration information and services, 
              making the journey to Australia accessible to everyone.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We combine technology with human expertise to provide a platform that guides applicants 
              through every step of their visa journey, from initial research to final submission.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { number: "50K+", label: "Happy Users" },
              { number: "95%", label: "Success Rate" },
              { number: "200+", label: "Verified Lawyers" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 text-center">
                <div className="text-4xl font-bold text-[#0052cc] mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Expert Guidance",
                  description: "Access to verified immigration lawyers and comprehensive visa guides.",
                },
                {
                  title: "Affordable Pricing",
                  description: "Transparent pricing with no hidden fees. $49 per visa application.",
                },
                {
                  title: "Real-time Tracking",
                  description: "Track your application progress and processing times in real-time.",
                },
                {
                  title: "Secure Platform",
                  description: "Your data is protected with enterprise-grade security.",
                },
              ].map((feature) => (
                <div key={feature.title}>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
