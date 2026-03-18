export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-6">Last updated: March 18, 2026</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p className="text-gray-700 mb-4">
            Visa Helper Platform is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Data We Collect</h2>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>Personal information (name, email, phone)</li>
            <li>Visa application details</li>
            <li>Documents uploaded</li>
            <li>Consultation history</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Data</h2>
          <p className="text-gray-700 mb-4">
            We use your data to provide visa assistance services, connect you with lawyers, and improve our platform.
          </p>
        </div>
      </div>
    </div>
  );
}
