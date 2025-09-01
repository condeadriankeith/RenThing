"use client"

import { SpinningLogo } from "@/components/ui/spinning-logo";

export default function PageTransitionLoader({ show = false }: { show?: boolean }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-blue-100/80 to-indigo-200/80 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <SpinningLogo size="xl" className="text-blue-500" />
        <span className="text-lg font-bold text-blue-700 dark:text-white tracking-wide">Loading...</span>
      </div>
    </div>
  );
}
