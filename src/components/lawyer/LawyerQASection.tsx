'use client';

import { useState } from 'react';
import { 
  MessageCircle, 
  Search, 
  Filter,
  ThumbsUp,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface LawyerQA {
  id: string;
  question: {
    author: string;
    avatar: string;
    date: string;
    content: string;
    votes: number;
    tags: string[];
  };
  answer?: {
    lawyerId: string;
    lawyerName: string;
    firm: string;
    avatar: string;
    date: string;
    content: string;
    isVerified: boolean;
    votes: number;
  } | null;
  views: number;
  status: 'answered' | 'pending';
}

interface LawyerQASectionProps {
  questions: LawyerQA[];
  lawyerId: string;
}

export default function LawyerQASection({ questions, lawyerId }: LawyerQASectionProps) {
  const [filter, setFilter] = useState<'all' | 'answered' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [votedItems, setVotedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const toggleVote = (itemId: string) => {
    const newVoted = new Set(votedItems);
    if (newVoted.has(itemId)) {
      newVoted.delete(itemId);
    } else {
      newVoted.add(itemId);
    }
    setVotedItems(newVoted);
  };

  const filteredQuestions = questions.filter(q => {
    const matchesFilter = filter === 'all' || q.status === filter;
    const matchesSearch = !searchQuery || 
      q.question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.question.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
          <MessageCircle className="w-5 h-5" style={{ color: '#0052cc' }} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Q&A</h2>
          <p className="text-sm text-slate-500">{questions.filter(q => q.status === 'answered').length} questions answered</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 outline-none"
          >
            <option value="all">All Questions</option>
            <option value="answered">Answered</option>
            <option value="pending">Awaiting Answer</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((qa) => (
          <div 
            key={qa.id}
            className={`p-5 rounded-xl border transition-all ${
              qa.status === 'answered' 
                ? 'border-gray-200 bg-white' 
                : 'border-amber-200 bg-amber-50/30'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Vote */}
              <button
                onClick={() => toggleVote(qa.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                  votedItems.has(qa.id) 
                    ? 'bg-blue-50 text-[#0052cc]' 
                    : 'bg-gray-50 text-slate-500 hover:bg-gray-100'
                }`}
              >
                <ChevronUp className="w-5 h-5" />
                <span className="text-sm font-semibold">
                  {qa.question.votes + (votedItems.has(qa.id) ? 1 : 0)}
                </span>
              </button>

              <div className="flex-1 min-w-0">
                {/* Question */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold">
                      {qa.question.avatar}
                    </div>
                    <span className="text-sm text-slate-600">{qa.question.author}</span>
                    <span className="text-xs text-slate-400">{qa.question.date}</span>
                  </div>
                  
                  <p className="text-slate-800 font-medium">{qa.question.content}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {qa.question.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Answer */}
                {qa.answer && (
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: '#0052cc' }}
                      >
                        {qa.answer.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-900">{qa.answer.lawyerName}</span>
                          {qa.answer.isVerified && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              <CheckCircle2 className="w-3 h-3" />
                              Verified Lawyer
                            </span>
                          )}
                          <span className="text-xs text-slate-400 ml-auto">{qa.answer.date}</span>
                        </div>
                        
                        <p className="text-xs text-slate-500 mb-2">{qa.answer.firm}</p>
                        
                        <p className={`text-slate-700 text-sm leading-relaxed ${
                          expandedQuestions.has(qa.id) ? '' : 'line-clamp-3'
                        }`}>
                          {qa.answer.content}
                        </p>
                        
                        {qa.answer.content.length > 200 && (
                          <button
                            onClick={() => toggleExpanded(qa.id)}
                            className="text-sm font-medium mt-2 hover:underline"
                            style={{ color: '#0052cc' }}
                          >
                            {expandedQuestions.has(qa.id) ? 'Show less' : 'Read more'}
                          </button>
                        )}
                        
                        <div className="flex items-center gap-4 mt-3">
                          <button
                            onClick={() => toggleVote(`answer-${qa.id}`)}
                            className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#0052cc] transition-colors"
                          >
                            <ThumbsUp className={`w-4 h-4 ${votedItems.has(`answer-${qa.id}`) ? 'fill-current' : ''}`} />
                            <span>Helpful ({qa.answer.votes + (votedItems.has(`answer-${qa.id}`) ? 1 : 0)})</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pending State */}
                {!qa.answer && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="text-sm text-amber-700">Awaiting response from lawyer</span>
                  </div>
                )}

                <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                  <span>{qa.views} views</span>
                  <span>•</span>
                  <button className="hover:text-[#0052cc] transition-colors">
                    Ask follow-up
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-slate-500">No questions found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
