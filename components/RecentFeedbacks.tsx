import StarsDisplay from "@/components/StarsDisplay";
import { formatDateTime } from "@/lib/format";

interface FeedbackItem {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  created_at: string;
}

interface RecentFeedbacksProps {
  feedbacks: FeedbackItem[];
  emptyMessage?: string;
}

export default function RecentFeedbacks({
  feedbacks,
  emptyMessage = "Aucun feedback pour le moment.",
}: RecentFeedbacksProps) {
  if (feedbacks.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-gray-100">
        <p className="text-sm text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {feedbacks.map((feedback) => (
        <div
          key={feedback.id}
          className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-gray-100"
        >
          <div className="mb-2 flex items-center justify-between gap-4">
            <StarsDisplay rating={feedback.rating} />
            <span className="text-xs text-gray-400">
              {formatDateTime(feedback.created_at)}
            </span>
          </div>

          {feedback.title && (
            <p className="mb-1 text-sm font-medium text-gray-900">
              {feedback.title}
            </p>
          )}

          <p className="text-sm text-gray-600">{feedback.comment}</p>
        </div>
      ))}
    </div>
  );
}
