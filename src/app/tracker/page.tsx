import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { Metadata } from 'next';
import { 
  Search, 
  Filter, 
  Clock, 
  TrendingUp, 
  Users, 
  Calendar,
  ArrowUpDown,
  ChevronDown
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Processing Time Tracker | VisaHelper - Community Data',
  description: 'Track visa processing times based on real community data. See current estimates for Australian visa applications.',
};

// Mock data - in production this would come from Supabase
const trackerData = [
  { visa: 'Skilled Independent (189)', subclass: '189', recent: '8 months', median: '10 months', trend: 'stable', entries: 1247 },
  { visa: 'Skilled Nominated (190)', subclass: '190', recent: '7 months', median: '9 months', trend: 'down', entries: 982 },
  { visa: 'Partner Visa (820/801)', subclass: '820/801', recent: '18 months', median: '21 months', trend: 'up', entries: 2156 },
  { visa: 'Student Visa', subclass: '500', recent: '28 days', median: '45 days', trend: 'down', entries: 3421 },
  { visa: 'Temporary Skill Shortage', subclass: '482', recent: '45 days', median: '60 days', trend: 'stable', entries: 1876 },
  { visa: 'Visitor Visa', subclass: '600', recent: '18 days', median: '25 days', trend: 'down', entries: 5632 },
  { visa: 'Working Holiday', subclass: '417', recent: '12 days', median: '18 days', trend: 'stable', entries: 2891 },
  { visa: 'Business Innovation', subclass: '188', recent: '15 months', median: '18 months', trend: 'up', entries: 432 },
  { visa: 'Parent Visa', subclass: '103', recent: '30+ years', median: '30+ years', trend: 'stable', entries: 89 },
  { visa: 'Graduate Work', subclass: '485', recent: '6 months', median: '8 months', trend: 'up', entries: 1567 },
];

export default function TrackerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Visa Processing Time Tracker
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                Community-powered processing time estimates based on real application data. 
                Updated daily by thousands of applicants.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#DBEAFE' }}>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Users className="w-4 h-4" style={{ color: '#0052cc' }} />
                    <span className="text-sm" style={{ color: '#0052cc' }}>Contributors</span>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: '#0052cc' }}>12,847</p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#D1FAE5' }}>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">Data Points</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">45,231</p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#FEF3C7' }}>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                    <span className="text-sm text-amber-600">Updated</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-600">2 hours ago</p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#F3E8FF' }}>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-purple-600">Visa Types</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">47</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search visa name or subclass..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 outline-none"
                />
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-slate-700 hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4" />
                  Category
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-slate-700 hover:bg-gray-50 transition-colors">
                  <ArrowUpDown className="w-4 h-4" />
                  Sort
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Data Table */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Visa Type</th>
                      <th className="text-center py-4 px-6 text-sm font-semibold text-slate-700">Recent</th>
                      <th className="text-center py-4 px-6 text-sm font-semibold text-slate-700">Median</th>
                      <th className="text-center py-4 px-6 text-sm font-semibold text-slate-700">Trend</th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-slate-700">Entries</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {trackerData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-sm"
                              style={{ backgroundColor: '#DBEAFE', color: '#0052cc' }}
                            >
                              {row.subclass.replace(/\/.*/, '')}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{row.visa}</p>
                              <p className="text-sm text-slate-500">Subclass {row.subclass}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="font-semibold text-slate-900">{row.recent}</span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="font-semibold text-slate-900">{row.median}</span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            row.trend === 'down' ? 'bg-green-100 text-green-700' :
                            row.trend === 'up' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {row.trend === 'down' ? '↓ Improving' : 
                             row.trend === 'up' ? '↑ Increasing' : '→ Stable'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="text-slate-600">{row.entries.toLocaleString()}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-slate-600">
                Showing 1-10 of 47 visa types
              </p>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 rounded-lg border border-gray-200 text-slate-600 hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>
                  Previous
                </button>
                <button className="px-4 py-2 rounded-lg border border-gray-200 text-slate-600 hover:bg-gray-50 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 border-t border-gray-200 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Have recent visa experience?</h2>
            <p className="text-slate-600 mb-6">
              Help others by sharing your processing time data. It only takes a minute!
            </p>
            <button 
              className="px-8 py-4 rounded-xl text-white font-semibold hover:opacity-90 transition-all"
              style={{ backgroundColor: '#0052cc' }}
            >
              Contribute Your Data
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
