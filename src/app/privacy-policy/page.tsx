import { Link2 } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — LinkShrink",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Link2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold">LinkShrink</span>
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: March 2025</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">1. Information We Collect</h2>
            <p>
              When you use LinkShrink, we collect the following information:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Your email address and profile information when you sign in with Google.</li>
              <li>The URLs you submit for shortening.</li>
              <li>Click analytics on your shortened links, including IP address, user agent, and referrer.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">2. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Provide and operate the LinkShrink service.</li>
              <li>Associate shortened URLs with your account.</li>
              <li>Display click analytics on your dashboard.</li>
              <li>Enforce rate limits and prevent abuse.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">3. Data Storage</h2>
            <p>
              Your data is stored securely using Supabase (PostgreSQL) hosted on AWS infrastructure.
              Shortened URL cache data is temporarily stored in Upstash Redis. We do not sell your
              data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">4. Cookies & Sessions</h2>
            <p>
              LinkShrink uses cookies solely to manage your authentication session via Supabase Auth.
              No tracking or advertising cookies are used.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">5. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Supabase</strong> — authentication and database.</li>
              <li><strong>Upstash Redis</strong> — caching and rate limiting.</li>
              <li><strong>Google OAuth</strong> — sign-in provider.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">6. Data Deletion</h2>
            <p>
              You can delete your shortened links at any time from your dashboard. To request full
              account deletion, contact us and we will remove all associated data within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">7. Contact</h2>
            <p>
              If you have questions about this policy, please reach out via the contact information
              on our homepage.
            </p>
          </section>
        </div>
      </main>

      <footer className="max-w-3xl mx-auto px-6 py-8 mt-8 border-t border-gray-200 text-sm text-gray-400 flex gap-6">
        <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
        <Link href="/terms-of-service" className="hover:text-gray-600 transition-colors">Terms of Service</Link>
      </footer>
    </div>
  );
}
