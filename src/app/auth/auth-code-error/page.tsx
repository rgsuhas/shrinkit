import { Link2 } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication Error — Shrinkit",
};

export default function AuthCodeError() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-indigo-600 rounded-xl">
            <Link2 className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Sign-in failed</h1>
        <p className="text-gray-500 mb-8">
          Something went wrong during authentication. This can happen if the link expired or was
          already used. Please try signing in again.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md"
        >
          Back to Shrinkit
        </Link>
      </div>
    </div>
  );
}
