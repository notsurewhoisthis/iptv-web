import type { Metadata } from 'next';
import { Chat } from '@/components/Chat';
import { MessageCircle, Zap, Shield, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { getBaseUrl } from '@/lib/data-loader';

export const metadata: Metadata = {
  title: 'Ask IPTV Questions - Get Expert Answers Instantly',
  description:
    'Get instant answers to your IPTV questions. Our AI assistant helps with player recommendations, setup guides, and troubleshooting for Firestick, Apple TV, and more.',
  keywords:
    'iptv help, iptv questions, iptv assistant, iptv setup help, iptv troubleshooting help, ask iptv expert',
  alternates: {
    canonical: `${getBaseUrl()}/ask`,
  },
  openGraph: {
    title: 'Ask IPTV Questions - Get Expert Answers Instantly',
    description:
      'Get instant answers to your IPTV questions. Our AI assistant helps with player recommendations, setup guides, and troubleshooting.',
    type: 'website',
  },
};

export default function AskPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
            <MessageCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Ask the IPTV Expert
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Get instant answers to your IPTV questions. From player recommendations
            to troubleshooting tips - I&apos;m here to help.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 -mt-8">
        {/* Chat card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="h-[500px] md:h-[600px]">
            <Chat fullScreen />
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-12 mb-12">
          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-xl mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Answers</h3>
            <p className="text-sm text-gray-600">
              Get immediate responses to your IPTV questions, 24/7.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-xl mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Expert Knowledge</h3>
            <p className="text-sm text-gray-600">
              Trained on comprehensive IPTV guides and troubleshooting resources.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-xl mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Linked Resources</h3>
            <p className="text-sm text-gray-600">
              Responses include links to detailed guides and tutorials.
            </p>
          </div>
        </div>

        {/* Popular topics */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Popular Topics
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/best/best-iptv-player-firestick"
              className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">🔥</span>
              <div>
                <div className="font-medium text-gray-900">Best Players for Firestick</div>
                <div className="text-sm text-gray-500">Top-rated IPTV apps</div>
              </div>
            </Link>
            <Link
              href="/guides/technical/fix-iptv-buffering"
              className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">⚡</span>
              <div>
                <div className="font-medium text-gray-900">Fix Buffering Issues</div>
                <div className="text-sm text-gray-500">Troubleshooting guide</div>
              </div>
            </Link>
            <Link
              href="/learn/what-is-iptv"
              className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">📺</span>
              <div>
                <div className="font-medium text-gray-900">What is IPTV?</div>
                <div className="text-sm text-gray-500">Beginner&apos;s guide</div>
              </div>
            </Link>
            <Link
              href="/guides/technical/setup-epg-guide"
              className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">📋</span>
              <div>
                <div className="font-medium text-gray-900">Setup EPG Guide</div>
                <div className="text-sm text-gray-500">TV guide configuration</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-center text-sm text-gray-500 pb-12">
          <p>
            This assistant provides technical help for IPTV setup only.
            We are not affiliated with any IPTV providers or services.
          </p>
        </div>
      </div>
    </div>
  );
}
