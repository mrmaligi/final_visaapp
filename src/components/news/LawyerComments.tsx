'use client';

import { useState } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Flag, 
  CheckCircle2,
  Award
} from 'lucide-react';

interface LawyerComment {
  id: string;
  lawyer: {
    id: string;
    name: string;
    firm: string;
    avatar: string;
    isVerified: boolean;
    specialization: string;
    yearsExperience: number;
  };
  date: string;
  content: string;
  likes: number;
  isHelpful: boolean;
  replyCount: number;
  isPinned?: boolean;
}

interface LawyerCommentsProps {
  comments: LawyerComment[];
  articleId: string;
}

export default function LawyerComments({ comments, articleId }: LawyerCommentsProps) {
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const toggleExpanded = (commentId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedComments(newExpanded);
  };

  const toggleLike = (commentId: string) => {
    const newLiked = new Set(likedComments);
    if (newLiked.has(commentId)) {
      newLiked.delete(commentId);
    } else {
      newLiked.add(commentId);
    }
    setLikedComments(newLiked);
  };

  const handleSubmitReply = (commentId: string) => {
    if (!replyText.trim()) return;
    // In production, this would submit to Supabase
    console.log('Submitting reply to comment', commentId, replyText);
    setReplyText('');
    setReplyingTo(null);
  };

  const pinnedComments = comments.filter(c => c.isPinned);
  const regularComments = comments.filter(c => !c.isPinned);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5" style={{ color: '#0052cc' }} />
          <h2 className="text-xl font-bold text-slate-900">
            Expert Legal Commentary
          </h2>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            {comments.length} comments
          </span>
        </div>
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 outline-none">
          <option>Most Helpful</option>
          <option>Newest First</option>
          <option>Oldest First</option>
        </select>
      </div>

      {/* Pinned Comments */}
      {pinnedComments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Pinned by VisaHelper Team</span>
          </div>
          {pinnedComments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              isExpanded={expandedComments.has(comment.id)}
              isLiked={likedComments.has(comment.id)}
              isReplying={replyingTo === comment.id}
              replyText={replyText}
              onToggleExpand={() => toggleExpanded(comment.id)}
              onToggleLike={() => toggleLike(comment.id)}
              onReply={() => setReplyingTo(comment.id)}
              onCancelReply={() => setReplyingTo(null)}
              onReplyTextChange={setReplyText}
              onSubmitReply={() => handleSubmitReply(comment.id)}
              isPinned
            />
          ))}
        </div>
      )}

      {/* Regular Comments */}
      <div className="space-y-4">
        {regularComments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            isExpanded={expandedComments.has(comment.id)}
            isLiked={likedComments.has(comment.id)}
            isReplying={replyingTo === comment.id}
            replyText={replyText}
            onToggleExpand={() => toggleExpanded(comment.id)}
            onToggleLike={() => toggleLike(comment.id)}
            onReply={() => setReplyingTo(comment.id)}
            onCancelReply={() => setReplyingTo(null)}
            onReplyTextChange={setReplyText}
            onSubmitReply={() => handleSubmitReply(comment.id)}
          />
        ))}
      </div>

      {/* Load More */}
      {comments.length > 5 && (
        <button className="w-full py-3 rounded-lg border-2 font-semibold hover:bg-gray-50 transition-colors"
          style={{ borderColor: '#0052cc', color: '#0052cc' }}
        >
          Load More Comments
        </button>
      )}
    </div>
  );
}

interface CommentCardProps {
  comment: LawyerComment;
  isExpanded: boolean;
  isLiked: boolean;
  isReplying: boolean;
  replyText: string;
  onToggleExpand: () => void;
  onToggleLike: () => void;
  onReply: () => void;
  onCancelReply: () => void;
  onReplyTextChange: (text: string) => void;
  onSubmitReply: () => void;
  isPinned?: boolean;
}

function CommentCard({
  comment,
  isExpanded,
  isLiked,
  isReplying,
  replyText,
  onToggleExpand,
  onToggleLike,
  onReply,
  onCancelReply,
  onReplyTextChange,
  onSubmitReply,
  isPinned,
}: CommentCardProps) {
  const shouldTruncate = comment.content.length > 300;
  const displayContent = isExpanded || !shouldTruncate
    ? comment.content
    : comment.content.slice(0, 300) + '...';

  return (
    <div className={`p-5 rounded-xl border ${isPinned ? 'border-amber-200 bg-amber-50/30' : 'border-gray-100 bg-gray-50/50'}`}>
      {/* Lawyer Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: '#0052cc' }}
            >
              {comment.lawyer.avatar}
            </div>
            {comment.lawyer.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-slate-900">{comment.lawyer.name}</p>
              {isPinned && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                  <Award className="w-3 h-3 inline mr-1" />
                  Pinned
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500">{comment.lawyer.firm}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
              <span>{comment.lawyer.specialization}</span>
              <span>•</span>
              <span>{comment.lawyer.yearsExperience} years exp.</span>
            </div>
          </div>
        </div>
        <span className="text-sm text-slate-400">{comment.date}</span>
      </div>

      {/* Comment Content */}
      <div className="text-slate-700 leading-relaxed mb-4">
        {displayContent}
        {shouldTruncate && (
          <button
            onClick={onToggleExpand}
            className="ml-1 text-sm font-medium hover:underline"
            style={{ color: '#0052cc' }}
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            isLiked ? 'text-[#0052cc]' : 'text-slate-500 hover:text-[#0052cc]'
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          <span>{comment.likes + (isLiked ? 1 : 0)}</span>
        </button>
        <button
          onClick={onReply}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0052cc] transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Reply</span>
        </button>
        <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors ml-auto">
          <Flag className="w-4 h-4" />
          <span>Report</span>
        </button>
      </div>

      {/* Reply Input */}
      {isReplying && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <textarea
            value={replyText}
            onChange={(e) => onReplyTextChange(e.target.value)}
            placeholder="Write your reply..."
            className="w-full p-3 rounded-lg border border-gray-200 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 outline-none resize-none"
            rows={3}
          />
          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              onClick={onCancelReply}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSubmitReply}
              disabled={!replyText.trim()}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: '#0052cc' }}
            >
              Post Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
