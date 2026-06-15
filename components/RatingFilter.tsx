import Link from "next/link";

interface RatingFilterProps {
  basePath: string;
  current?: string;
  options: number[];
}

export default function RatingFilter({
  basePath,
  current,
  options,
}: RatingFilterProps) {
  const items = [
    { label: "Tous", value: undefined as string | undefined },
    ...options.map((value) => ({ label: `${value}★`, value: String(value) })),
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {items.map((item) => {
        const isActive = (current ?? "") === (item.value ?? "");
        const href = item.value ? `${basePath}?rating=${item.value}` : basePath;

        return (
          <Link
            key={item.label}
            href={href}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors ${
              isActive
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-500 ring-1 ring-gray-100 hover:bg-gray-50"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
