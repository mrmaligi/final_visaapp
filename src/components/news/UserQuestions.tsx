'use client';

import { useState } from 'react';
import { 
  MessageCircle, 
  ThumbsUp, 
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  User
} from 'lucide-react';

interface UserQuestion {
  id: string;
  user: {
    name: string;
    avatar?: string;
    isVerifiedApplicant?: boolean;
  };
  date: string;
  question: string;
  votes: number;
  answers: {
    id: string;
    user: {
      name: string;
      isLawyer: boolean;
      firm?: string;
      avatar: string;
    };
    date: string;
    content: string;
    isAccepted?: boolean;
    votes: number;
  }[];
  isAnswered: boolean;
}

interface UserQuestionsProps {
  questions: UserQuestion[];
  articleId: string;
}

export default function UserQuestions({ questions, articleId }: UserQuestionsProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [votedQuestions, setVotedQuestions] = useState<Set<string>>(new Set());
  const [showAskForm, setShowAskForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [filter, setFilter] = useState<'all' | 'answered' | 'unanswered'>('all');

  const toggleExpanded = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const toggleVote = (questionId: string) => {
    const newVoted = new Set(votedQuestions);
    if (newVoted.has(questionId)) {
      newVoted.delete(questionId);
    } else {
      newVoted.add(questionId);
    }
    setVotedQuestions(newVoted);
  };

  const handleSubmitQuestion = () => {
    if (!newQuestion.trim()) return;
    // In production, submit to Supabase
    console.log('Submitting question:', newQuestion);
    setNewQuestion('');
    setShowAskForm(false);
  };

  const filteredQuestions = questions.filter(q => {
    if (filter === 'answered') return q.isAnswered;
    if (filter === 'unanswered') return !q.isAnswered;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" style={{ color: '#0052cc' }} />
          <h2 className="text-xl font-bold text-slate-900">
            Community Questions
          </h2>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-slate-600">
            {questions.length} questions
          </span>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 outline-none"
          >
            <option value="all">All Questions</option>
            <option value="answered">Answered</option>
            <option value="unanswered">Unanswered</option>
          </select>
          <button
            onClick={() => setShowAskForm(!showAskForm)}
            className="px-4 py-2 rounded-lg text-white font-medium text-sm hover:opacity-90 transition-colors"
            style={{ backgroundColor: '#0052cc' }}
          >
            Ask a Question
          </button>
        </div>
      </div>

      {/* Ask Question Form */}
      {showAskForm && (
        <div className="p-5 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50">
          <h3 className="font-semibold text-slate-900 mb-3">Ask the Community</h3>
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="What would you like to know about this topic? Be specific to get better answers."
            className="w-full p-3 rounded-lg border border-gray-200 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 outline-none resize-none"
            rows={3}
          />
          <div className="flex items-center justify-end gap-2 mt-3">
            <button
              onClick={() => setShowAskForm(false)}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitQuestion}
              disabled={!newQuestion.trim()}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: '#0052cc' }}
            >
              Post Question
            </button>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            isExpanded={expandedQuestions.has(question.id)}
            isVoted={votedQuestions.has(question.id)}
            onToggleExpand={() => toggleExpanded(question.id)}
            onToggleVote={() => toggleVote(question.id)}
          />
        ))}

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-slate-500">No questions found in this category.</p>
            <button
              onClick={() => setFilter('all')}
              className="mt-2 text-sm font-medium hover:underline"
              style={{ color: '#0052cc' }}
            >
              View all questions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface QuestionCardProps {
  question: UserQuestion;
  isExpanded: boolean;
  isVoted: boolean;
  onToggleExpand: () => void;
  onToggleVote: () => void;
}

function QuestionCard({
  question,
  isExpanded,
  isVoted,
  onToggleExpand,
  onToggleVote,
}: QuestionCardProps) {
  return (
    <div className="p-5 rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-shadow">
      {/* Question Header */}
      <div className="flex items-start gap-4">
        {/* Vote Button */}
        <button
          onClick={onToggleVote}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
            isVoted ? 'bg-blue-50 text-[#0052cc]' : 'bg-gray-50 text-slate-500 hover:bg-gray-100'
          }`}
        >
          <ChevronUp className="w-5 h-5" />
          <span className="text-sm font-semibold">{question.votes + (isVoted ? 1 : 0)}</span>
        </button>

        <div className="flex-1 min-w-0">
          {/* User Info */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-3 h-3 text-gray-500" />
            </div>
            <span className="text-sm font-medium text-slate-900">{question.user.name}</span>
            {question.user.isVerifiedApplicant && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                <CheckCircle2 className="w-3 h-3" />
                Verified Applicant
              </span>
            )}
            <span className="text-xs text-slate-400">{question.date}</span>
          </div>

          {/* Question Text */}
          <p className="text-slate-800 font-medium mb-3">{question.question}</p>

          {/* Status & Actions */}
          <div className="flex items-center gap-4">
            {question.isAnswered ? (
              <span className="flex items-center gap-1.5 text-sm text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                Answered ({question.answers.length})
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-sm text-amber-600">
                <AlertCircle className="w-4 h-4" />
                Awaiting Answer
              </span>
            )}
            <button
              onClick={onToggleExpand}
              className="flex items-center gap-1 text-sm font-medium hover:underline"
              style={{ color: '#0052cc' }}
            >
              {isExpanded ? (
                <><ChevronUp className="w-4 h-4" /> Hide answers</>
              ) : (
                <><ChevronDown className="w-4 h-4" /> {question.isAnswered ? 'Show answers' : 'Be the first to answer'}</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Answers Section */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
          {question.answers.map((answer) => (
            <AnswerCard key={answer.id} answer={answer} />
          ))}

          {question.answers.length === 0 && (
            <div className="text-center py-6">
              <p className="text-slate-500 text-sm mb-3">No answers yet. Be the first to help!</p>
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-colors"
                style={{ backgroundColor: '#0052cc' }}
              >
                Write an Answer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface AnswerCardProps {
  answer: UserQuestion['answers'][0];
}

function AnswerCard({ answer }: AnswerCardProps) {
  return (
    <div className={`p-4 rounded-lg ${answer.isAccepted ? 'bg-green-50/50 border border-green-200' : 'bg-gray-50'}`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
          answer.user.isLawyer ? 'bg-[#0052cc]' : 'bg-gray-400'
        }`}>
          {answer.user.avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-slate-900 text-sm">{answer.user.name}</span>
            {answer.user.isLawyer && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                Lawyer
              </span>
            )}
            {answer.isAccepted && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                <CheckCircle2 className="w-3 h-3" />
                Accepted Answer
              </span>
            )}
            <span className="text-xs text-slate-400 ml-auto">{answer.date}</span>
          </div>
          {answer.user.firm && (
            <p className="text-xs text-slate-500 mb-2">{answer.user.firm}</p>
          )}
          <p className="text-slate-700 text-sm leading-relaxed">{answer.content}</p>
          <div className="flex items-center gap-4 mt-2">
            <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#0052cc] transition-colors">
              <ThumbsUp className="w-3 h-3" />
              <span>{answer.votes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
