import { useState, useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useToast } from "../hooks/useToast";

type ShareButtonProps = {
  tourName: string;
  tourSlug: string;
  size?: "sm" | "md";
};

const ShareButton = ({ tourName, tourSlug, size = "md" }: ShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { showToast } = useToast();
  const location = useRouterState({ select: (s) => s.location });

  const tourUrl = `${window.location.origin}/tours/${tourSlug}`;
  const shareText = `Check out ${tourName} on Natours!`;

  // Close dropdown on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(tourUrl);
      showToast("Link copied to clipboard!", "success");
      setIsOpen(false);
    } catch {
      showToast("Failed to copy link", "error");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: tourName,
          text: shareText,
          url: tourUrl,
        });
        setIsOpen(false);
      } catch (err) {
        // User cancelled or error
      }
    } else {
      handleCopyLink();
    }
  };

  const sizeClasses = size === "sm" ? "h-8 w-8" : "h-10 w-10";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center justify-center rounded-full border border-emerald-200/70 bg-white text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600 dark:border-emerald-500/30 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-400/50 dark:hover:text-emerald-400 ${sizeClasses}`}
        title="Share tour"
        aria-label="Share tour"
      >
        <svg className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[90]"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-12 z-[95] w-48 rounded-lg border border-emerald-200/70 bg-white shadow-xl dark:border-emerald-500/30 dark:bg-slate-900">
            <div className="py-1.5">
              <button
                onClick={handleShare}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-emerald-50 dark:text-slate-200 dark:hover:bg-emerald-500/10"
              >
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Share
              </button>
              <button
                onClick={handleCopyLink}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-emerald-50 dark:text-slate-200 dark:hover:bg-emerald-500/10"
              >
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy link
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(tourUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-emerald-50 dark:text-slate-200 dark:hover:bg-emerald-500/10"
              >
                <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
                Twitter
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(tourUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-emerald-50 dark:text-slate-200 dark:hover:bg-emerald-500/10"
              >
                <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButton;
