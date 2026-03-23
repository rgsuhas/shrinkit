import { Link2 } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Shrinkit",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Link2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold">Shrinkit</span>
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: March 2025</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Shrinkit, you agree to be bound by these Terms of Service.
              If you do not agree, please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">2. Use of the Service</h2>
            <p>You agree not to use Shrinkit to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Shorten URLs that link to illegal, harmful, or malicious content.</li>
              <li>Distribute spam, phishing links, or malware.</li>
              <li>Circumvent rate limits or abuse the service programmatically.</li>
              <li>Impersonate other individuals or entities.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">3. Account Responsibility</h2>
            <p>
              You are responsible for all activity that occurs under your account. Keep your
              credentials secure. We reserve the right to suspend accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">4. Link Availability</h2>
            <p>
              We do not guarantee permanent availability of shortened links. Links may be removed
              if they violate these terms. Expired links (as set by you) will no longer redirect.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">5. Intellectual Property</h2>
            <p>
              The Shrinkit name, logo, and service are our property. You retain ownership of
              the URLs and content you submit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">6. Disclaimer of Warranties</h2>
            <p>
              Shrinkit is provided "as is" without warranties of any kind. We do not guarantee
              uptime, accuracy, or fitness for a particular purpose. Use the service at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Shrinkit shall not be liable for any
              indirect, incidental, or consequential damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">8. Changes to Terms</h2>
            <p>
              We may update these terms at any time. Continued use of the service after changes
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">9. Contact</h2>
            <p>
              For questions about these terms, please reach out via the contact information on
              our homepage.
            </p>
          </section>
        </div>
      </main>

      <footer className="max-w-3xl mx-auto px-6 py-8 mt-8 border-t border-gray-200 text-sm text-gray-400 flex gap-6">
        <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
        <Link href="/privacy-policy" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
      </footer>
    </div>
  );
}
