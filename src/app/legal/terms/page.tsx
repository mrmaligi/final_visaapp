import { Metadata } from "next";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | VisaHelper",
  description: "VisaHelper's terms of service outline the rules and regulations for using our platform.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="bg-[#0052cc] py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-blue-100">Last updated: March 19, 2026</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using VisaHelper (&quot;the Platform&quot;), you accept and agree to be bound by 
                these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Services</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                VisaHelper provides a platform that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>Offers visa application guidance and tools</li>
                <li>Connects users with verified immigration lawyers</li>
                <li>Provides processing time tracking and immigration news</li>
                <li>Facilitates document management and storage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
              <div className="space-y-4 text-gray-600">
                <p><strong>Registration:</strong> You must provide accurate and complete information when creating an account.</p>
                <p><strong>Security:</strong> You are responsible for maintaining the confidentiality of your account credentials.</p>
                <p><strong>Termination:</strong> We reserve the right to suspend or terminate accounts that violate these terms.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Payments and Refunds</h2>
              <div className="space-y-4 text-gray-600">
                <p><strong>Visa Premium Access ($49):</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>One-time payment per visa type</li>
                  <li>Grants lifetime access to premium content</li>
                  <li>No refunds once access is granted</li>
                </ul>

                <p><strong>Lawyer Consultations:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Payment required at time of booking</li>
                  <li>Cancellation policy varies by lawyer</li>
                  <li>No refunds for no-shows</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Not Legal Advice</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-semibold mb-2">IMPORTANT DISCLAIMER</p>
                <p className="text-yellow-700">
                  VisaHelper does not provide legal advice. Our platform offers general information and tools 
                  to assist with visa applications. For legal advice, you must consult with a qualified 
                  immigration lawyer. Information on our platform should not be considered a substitute for 
                  professional legal counsel.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. User Responsibilities</h2>
              <p className="text-gray-600 mb-4">You agree to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>Provide accurate and truthful information</li>
                <li>Not use the platform for fraudulent purposes</li>
                <li>Not upload malicious content or viruses</li>
                <li>Respect the intellectual property rights of others</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
              <p className="text-gray-600 leading-relaxed">
                All content on VisaHelper, including text, graphics, logos, and software, is the property 
                of VisaHelper Pty Ltd or its licensors and is protected by copyright and other intellectual 
                property laws. You may not reproduce, distribute, or create derivative works without our 
                express permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed">
                To the maximum extent permitted by law, VisaHelper shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages arising from your use of the platform. 
                This includes but is not limited to visa application outcomes, data loss, or business interruption.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Governing Law</h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of Australia. 
                Any disputes arising under these terms shall be subject to the exclusive jurisdiction of 
                the courts of Australia.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of significant 
                changes via email or platform notifications. Continued use of the platform after changes 
                constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
              <p className="text-gray-600">
                For questions about these Terms of Service, please contact us:
              </p>
              <p className="text-gray-600 mt-4">
                <strong>Email:</strong> legal@visahelper.com<br />
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
