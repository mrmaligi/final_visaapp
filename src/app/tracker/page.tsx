'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { 
  Search, 
  Filter, 
  Clock, 
  TrendingUp, 
  Users, 
  Calendar,
  ArrowUpDown,
  ChevronDown,
  Plus,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import TrackerSubmissionForm, { TrackerSubmissionData } from '@/components/tracker/TrackerSubmissionForm';
import ProcessingTimeStats from '@/components/tracker/ProcessingTimeStats';
import ProcessingTimeTrends from '@/components/tracker/ProcessingTimeTrends';

// Mock data with realistic Australian visa processing times
const trackerData = [
  { 
    visa: 'Skilled Independent (189)', 
    subclass: '189', 
    recent: 195, 
    median: 285, 
    p25: 180,
    p75: 420,
    trend: 'stable', 
    entries: 1247 
  },
  { 
    visa: 'Skilled Nominated (190)', 
    subclass: '190', 
    recent: 180, 
    median: 270, 
    p25: 165,
    p75: 380,
    trend: 'down', 
    entries: 982 
  },
  { 
    visa: 'Skilled Work Regional (491)', 
    subclass: '491', 
    recent: 210, 
    median: 330, 
    p25: 195,
    p75: 450,
    trend: 'stable', 
    entries: 756 
  },
  { 
    visa: 'Partner Visa (820/801)', 
    subclass: '820/801', 
    recent: 540, 
    median: 630, 
    p25: 480,
    p75: 780,
    trend: 'up', 
    entries: 2156 
  },
  { 
    visa: 'Student Visa', 
    subclass: '500', 
    recent: 28, 
    median: 45, 
    p25: 21,
    p75: 60,
    trend: 'down', 
    entries: 3421 
  },
  { 
    visa: 'Temporary Skill Shortage', 
    subclass: '482', 
    recent: 45, 
    median: 60, 
    p25: 35,
    p75: 85,
    trend: 'stable', 
    entries: 1876 
  },
  { 
    visa: 'Visitor Visa', 
    subclass: '600', 
    recent: 18, 
    median: 25, 
    p25: 12,
    p75: 35,
    trend: 'down', 
    entries: 5632 
  },
  { 
    visa: 'Working Holiday', 
    subclass: '417', 
    recent: 12, 
    median: 18, 
    p25: 8,
    p75: 25,
    trend: 'stable', 
    entries: 2891 
  },
  { 
    visa: 'Business Innovation (188)', 
    subclass: '188', 
    recent: 450, 
    median: 540, 
    p25: 390,
    p75: 720,
    trend: 'up', 
    entries: 432 
  },
  { 
    visa: 'Parent Visa', 
    subclass: '103', 
    recent: 10950, 
    median: 10950, 
    p25: 10950,
    p75: 10950,
    trend: 'stable', 
    entries: 89 
  },
  { 
    visa: 'Temporary Graduate', 
    subclass: '485', 
    recent: 180, 
    median: 240, 
    p25: 150,
    p75: 300,
    trend: 'up', 
    entries: 1567 
  },
  { 
    visa: 'Employer Nomination (186)', 
    subclass: '186', 
    recent: 240, 
    median: 330, 
    p25: 210,
    p75: 420,
    trend: 'stable', 
    entries: 643 
  },
];

// Mock trend data for charts
const trendData = [
  { month: 'Apr 2025', median: 300, p25: 180, p75: 450, entries: 145 },
  { month: 'May 2025', median: 295, p25: 175, p75: 440, entries: 152 },
  { month: 'Jun 2025', median: 290, p25: 175, p75: 435, entries: 168 },
  { month: 'Jul 2025', median: 285, p25: 170, p75: 430, entries: 175 },
  { month: 'Aug 2025', median: 285, p25: 170, p75: 430, entries: 182 },
  { month: 'Sep 2025', median: 280, p25: 165, p75: 420, entries: 190 },
  { month: 'Oct 2025', median: 280, p25: 165, p75: 420, entries: 195 },
  { month: 'Nov 2025', median: 278, p25: 165, p75: 415, entries: 201 },
  { month: 'Dec 2025', median: 275, p25: 160, p75: 410, entries: 210 },
  { month: 'Jan 2026', median: 275, p25: 160, p75: 410, entries: 215 },
  { month: 'Feb 2026', median: 272, p25: 160, p75: 405, entries: 220 },
  { month: 'Mar 2026', median: 270, p25: 165, p75: 380, entries: 225 },
];

const visaOptions = trackerData.map(v => ({
  id: v.subclass,
  subclass: v.subclass,
  name: v.visa,
}));

const categories = [
  { id: 'all', label: 'All Categories' },
  { id: 'work', label: 'Work Visas' },
  { id: 'family', label: 'Family Visas' },
  { id: 'student', label: 'Student Visas' },
  { id: 'visitor', label: 'Visitor Visas' },
  { id: 'business', label: 'Business Visas' },
];

const sortOptions = [
  { value: 'median-asc', label: 'Processing Time: Fastest First' },
  { value: 'median-desc', label: 'Processing Time: Slowest First' },
  { value: 'entries-desc', label: 'Most Data Points' },
  { value: 'trend-improving', label: 'Trend: Improving' },
];

export default function TrackerPage() {
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [selectedVisa, setSelectedVisa] = useState<typeof trackerData[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('median-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredAndSortedData = useMemo(() => {
    let data = [...trackerData];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(item => 
        item.visa.toLowerCase().includes(query) ||
        item.subclass.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      data = data.filter(item => {
        if (categoryFilter === 'work') return ['189', '190', '491', '482', '186', '494'].includes(item.subclass);
        if (categoryFilter === 'family') return ['820/801', '309/100', '300', '103'].includes(item.subclass);
        if (categoryFilter === 'student') return ['500', '485'].includes(item.subclass);
        if (categoryFilter === 'visitor') return ['600', '417', '601', '651'].includes(item.subclass);
        if (categoryFilter === 'business') return ['188', '888', '132'].includes(item.subclass);
        return true;
      });
    }

    // Sorting
    data.sort((a, b) => {
      switch (sortBy) {
        case 'median-asc':
          return a.median - b.median;
        case 'median-desc':
          return b.median - a.median;
        case 'entries-desc':
          return b.entries - a.entries;
        case 'trend-improving':
          const trendOrder: Record<string, number> = { down: 0, stable: 1, up: 2 };
          return trendOrder[a.trend] - trendOrder[b.trend];
        default:
          return 0;
      }
    });

    return data;
  }, [searchQuery, categoryFilter, sortBy]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(start, start + itemsPerPage);
  }, [filteredAndSortedData, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const handleSubmission = (data: TrackerSubmissionData) => {
    console.log('Submission received:', data);
    // In production, this would submit to Supabase
    setShowSubmissionForm(false);
    // Show success message
    alert('Thank you for contributing! Your data has been submitted for verification.');
  };

  const formatDays = (days: number) => {
    if (days >= 365) {
      const years = Math.round(days / 365 * 10) / 10;
      return `${years} year${years !== 1 ? 's' : ''}`;
    }
    if (days >= 30) {
      const months = Math.round(days / 30 * 10) / 10;
      return `${months} month${months !== 1 ? 's' : ''}`;
    }
    return `${days} days`;
  };

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case 'down':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            ↓ Improving
          </span>
        );
      case 'up':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            ↑ Increasing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            → Stable
          </span>
        );
    }
  };

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
                Community-powered processing time estimates based on {trackerData.reduce((acc, v) => acc + v.entries, 0).toLocaleString()} real applications. 
                Updated daily with median, average, and percentile data.
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
                  <p className="text-2xl font-bold text-green-600">{trackerData.reduce((acc, v) => acc + v.entries, 0).toLocaleString()}</p>
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
                  <p className="text-2xl font-bold text-purple-600">{trackerData.length}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Stats for Selected Visa */}
        {selectedVisa && (
          <section className="py-8 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Detailed Statistics: {selectedVisa.visa}</h2>
                <button
                  onClick={() => setSelectedVisa(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-6">
                <ProcessingTimeStats
                  stats={{
                    median: selectedVisa.median,
                    average: Math.round((selectedVisa.median + selectedVisa.recent) / 2),
                    p25: selectedVisa.p25,
                    p75: selectedVisa.p75,
                    p90: Math.round(selectedVisa.p75 * 1.2),
                    trend: selectedVisa.trend as any,
                    trendPercentage: selectedVisa.trend === 'down' ? -12 : selectedVisa.trend === 'up' ? 8 : 2,
                    totalEntries: selectedVisa.entries,
                    lastUpdated: '2 hours ago',
                  }}
                  visaName={selectedVisa.visa}
                  subclass={selectedVisa.subclass}
                />
                
                <ProcessingTimeTrends data={trendData} />
              </div>
            </div>
          </section>
        )}

        {/* Filters & Data Table */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search visa name or subclass..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 outline-none"
                />
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="appearance-none px-4 py-3 pr-10 rounded-xl border border-gray-200 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 outline-none bg-white"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                  <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none px-4 py-3 pr-10 rounded-xl border border-gray-200 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 outline-none bg-white"
                  >
                    {sortOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Visa Type</th>
                      <th className="text-center py-4 px-6 text-sm font-semibold text-slate-700">Recent</th>
                      <th className="text-center py-4 px-6 text-sm font-semibold text-slate-700">Median</th>
                      <th className="text-center py-4 px-6 text-sm font-semibold text-slate-700">Range</th>
                      <th className="text-center py-4 px-6 text-sm font-semibold text-slate-700">Trend</th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-slate-700">Entries</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedData.map((row, idx) => (
                      <tr 
                        key={idx} 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedVisa(row)}
                      >
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
                          <span className="font-semibold text-slate-900">{formatDays(row.recent)}</span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="font-semibold" style={{ color: '#0052cc' }}>{formatDays(row.median)}</span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="text-sm text-slate-600">{formatDays(row.p25)} - {formatDays(row.p75)}</span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          {getTrendBadge(row.trend)}
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
                Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} visa types
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-sm font-medium">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
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
              Help thousands of applicants by sharing your processing time data. 
              It only takes 2 minutes and your contribution is completely anonymous.
            </p>
            <button 
              onClick={() => setShowSubmissionForm(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold hover:opacity-90 transition-all"
              style={{ backgroundColor: '#0052cc' }}
            >
              <Plus className="w-5 h-5" />
              Contribute Your Data
            </button>
          </div>
        </section>
      </main>

      <Footer />

      {/* Submission Form Modal */}
      {showSubmissionForm && (
        <TrackerSubmissionForm
          visaOptions={visaOptions}
          onSubmit={handleSubmission}
          onClose={() => setShowSubmissionForm(false)}
        />
      )}
    </div>
  );
}
