import Link from "next/link"

export default function Index() {
  return (
    <div className="flex flex-col items-center w-full">
      <main className="flex flex-col w-full">
        {/* Hero Section */}
        <section className="w-full flex flex-col items-center py-20 bg-blue-50">
          <div className="max-w-4xl text-center flex flex-col items-center gap-6 px-4">
            <h1 className="text-4xl lg:text-6xl font-bold !leading-tight text-gray-900">
              Apply for your Visa <span className="text-blue-600">Securely & Easily</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Our platform streamlines your visa application process. From checking supported countries to submitting documents and tracking your status.
            </p>
            <div className="flex gap-4 mt-4">
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
              <Link
                href="/visa-types"
                className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                View Visa Types
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full max-w-5xl mx-auto py-20 px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Create Account</h3>
              <p className="text-gray-600">Sign up securely and complete your personal profile to get started.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Submit Documents</h3>
              <p className="text-gray-600">Choose your visa type, fill in details, and securely upload your documents.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Track Status</h3>
              <p className="text-gray-600">Get real-time updates and notifications on your application progress.</p>
            </div>
          </div>
        </section>

        {/* Supported Countries */}
        <section className="w-full bg-gray-50 py-20">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Supported Destinations</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['United States', 'United Kingdom', 'Schengen Area', 'Canada', 'Australia', 'Japan', 'Singapore', 'UAE'].map((country) => (
                <div key={country} className="bg-white px-6 py-3 rounded-full border border-gray-200 shadow-sm font-medium text-gray-700">
                  {country}
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/signup" className="text-blue-600 font-semibold hover:underline">
                Start your application today →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
