"use client";
import { useEffect } from "react";

export default function RedirectClient({ url }: { url: string }) {
  useEffect(() => {
    window.location.replace(url);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      <div className="text-center">
        <p className="text-gray-400 text-sm">Redirecting you…</p>
        <p className="text-gray-600 text-xs mt-1 max-w-xs truncate">{url}</p>
      </div>
    </div>
  );
}
