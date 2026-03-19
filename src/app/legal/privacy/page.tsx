import { Metadata } from "next";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | VisaHelper",
  description: "VisaHelper's privacy policy explains how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="bg-[#0052cc] py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-blue-100">Last updated: March 19, 2026</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600 leading-relaxed">
                VisaHelper (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you use our website and services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
              <div className="space-y-4 text-gray-600">
                <p><strong>Personal Information:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Name, email address, and contact details</li>
                  <li>Passport and identification information</li>
                  <li>Immigration and visa-related information</li>
                  <li>Payment information (processed securely via Stripe)</li>
                </ul>

                <p><strong>Usage Information:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>IP address and browser type</li>
                  <li>Pages visited and features used</li>
                  <li>Device information</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>Provide and improve our visa application services</li>
                <li>Connect you with verified immigration lawyers</li>
                <li>Process payments and maintain your account</li>
                <li>Send important updates about your applications</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing</h2>
              <p className="text-gray-600 leading-relaxed">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4 mt-4">
                <li><strong>Verified Lawyers:</strong> When you book a consultation</li>
                <li><strong>Service Providers:</strong> Payment processing (Stripe), cloud hosting (Supabase/Vercel)</li>
                <li><strong>Legal Requirements:</strong> When required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-600 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information, 
                including encryption, access controls, and regular security audits. Your documents are stored 
                securely in Supabase Storage with row-level security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
              <p className="text-gray-600 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Export your data</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gray-600 mt-4">
                <strong>Email:</strong> privacy@visahelper.com<br />
                <strong>Address:</strong> VisaHelper Pty Ltd, Sydney, Australia
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
