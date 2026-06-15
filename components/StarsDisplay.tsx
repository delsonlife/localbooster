interface StarsDisplayProps {
  rating: number;
  size?: "sm" | "md";
}

export default function StarsDisplay({ rating, size = "sm" }: StarsDisplayProps) {
  const dimension = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((value) => (
        <svg
          key={value}
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`${dimension} ${
            value <= rating ? "text-amber-400" : "text-gray-200"
          }`}
        >
          <path d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.58L12 17.6l-5.9 3.08 1.13-6.58L2.45 9.44l6.6-.96L12 2.5z" />
        </svg>
      ))}
    </div>
  );
}
