type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-full border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:border-emerald-300 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-500/30 dark:text-emerald-200 dark:hover:border-emerald-400/50 dark:hover:text-emerald-100"
      >
        Prev
      </button>
      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          onClick={() => onPageChange(pageNumber)}
          className={`min-w-10 rounded-full px-3 py-1 text-xs font-semibold transition ${pageNumber === page
              ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/30"
              : "border border-emerald-200 text-emerald-700 hover:border-emerald-300 hover:text-emerald-800 dark:border-emerald-500/30 dark:text-emerald-200 dark:hover:border-emerald-400/50 dark:hover:text-emerald-100"
            }`}
        >
          {pageNumber}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="rounded-full border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:border-emerald-300 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-500/30 dark:text-emerald-200 dark:hover:border-emerald-400/50 dark:hover:text-emerald-100"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
