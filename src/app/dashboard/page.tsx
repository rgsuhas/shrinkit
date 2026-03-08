"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Link2, ExternalLink, BarChart2, Plus, Trash2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

interface UrlData {
  id: number;
  originalUrl: string;
  shortCode: string;
  clickCount: number;
  createdAt: string;
}

export default function Dashboard() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
      } else {
        setUser(user);
        fetchUserUrls();
      }
    };
    init();
  }, []);

  const fetchUserUrls = async () => {
    try {
      const res = await fetch("/api/user-urls");
      const data = await res.json();
      if (data.urls) {
        setUrls(data.urls);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getFullShortUrl = (code: string) => {
    return `${window.location.origin}/${code}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Link2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">LinkShrink</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                Logged in as <strong>{user?.email}</strong>
              </span>
              <button
                onClick={() => router.push("/")}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Your Links</h1>
            <p className="text-gray-600">Track and manage your shortened URLs.</p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md"
          >
            <Plus className="w-5 h-5" />
            Create New
          </button>
        </div>

        {urls.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Link2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">No links found</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              You haven't shortened any links yet. Start by shrinking your first long URL!
            </p>
            <button
              onClick={() => router.push("/")}
              className="text-indigo-600 font-bold hover:underline"
            >
              Go to homepage →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {urls.map((url) => (
              <div
                key={url.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col lg:flex-row gap-6"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">
                      Active
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(url.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold truncate mb-1">
                    <a
                      href={getFullShortUrl(url.shortCode)}
                      target="_blank"
                      className="hover:text-indigo-600 transition-colors"
                    >
                      {getFullShortUrl(url.shortCode)}
                    </a>
                  </h2>
                  <p className="text-sm text-gray-500 truncate mb-4">{url.originalUrl}</p>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700">
                      <BarChart2 className="w-4 h-4 text-gray-400" />
                      {url.clickCount} clicks
                    </div>
                    <a
                      href={getFullShortUrl(url.shortCode)}
                      target="_blank"
                      className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                      Visit
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-6 self-center lg:self-auto border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-6">
                  <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <QRCodeSVG
                      value={getFullShortUrl(url.shortCode)}
                      size={64}
                      fgColor="#4f46e5"
                    />
                  </div>
                  <button className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
