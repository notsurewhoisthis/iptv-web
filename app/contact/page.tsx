import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MessageCircle, Users, ArrowLeft, Send } from 'lucide-react';
import { getBaseUrl } from '@/lib/data-loader';

export const metadata: Metadata = {
  title: 'Contact Us - Get in Touch',
  description:
    'Contact the IPTV Guide team for questions, feedback, or support. Reach us via email, Telegram, or join our community group.',
  keywords: 'contact iptv guide, iptv support, iptv help, telegram iptv group',
  alternates: {
    canonical: `${getBaseUrl()}/contact`,
  },
  openGraph: {
    title: 'Contact Us - IPTV Guide',
    description:
      'Get in touch with the IPTV Guide team for questions, feedback, or support.',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Have questions about IPTV setup? Want to suggest a feature? We&apos;d love to hear from you.
          </p>
        </div>
      </div>

      {/* Contact Options */}
      <div className="max-w-4xl mx-auto px-4 -mt-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Join Telegram Group */}
          <a
            href="https://t.me/jamrunTV"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-600 transition-all group"
          >
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
              <Users className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Join Our Community
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Connect with other IPTV enthusiasts, get tips, and share your experiences.
            </p>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <span>t.me/jamrunTV</span>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:heniykb@gmail.com"
            className="block bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 hover:shadow-2xl hover:border-green-200 dark:hover:border-green-600 transition-all group"
          >
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
              <Mail className="w-7 h-7 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Email Us
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              For detailed questions, partnerships, or business inquiries.
            </p>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium text-sm">
              <Send className="w-4 h-4" />
              <span>heniykb@gmail.com</span>
            </div>
          </a>

          {/* Direct Message */}
          <a
            href="https://t.me/heycheyc"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 hover:shadow-2xl hover:border-purple-200 dark:hover:border-purple-600 transition-all group"
          >
            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
              <MessageCircle className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Direct Message
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Quick questions? Message me directly on Telegram for faster responses.
            </p>
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium text-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <span>@heycheyc</span>
            </div>
          </a>
        </div>

        {/* Additional Info */}
        <div className="mt-16 mb-12">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Need Instant Help?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto">
              Our AI assistant can answer most IPTV questions immediately. Try it for quick setup help, troubleshooting, and player recommendations.
            </p>
            <Link
              href="/ask"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Ask Live to an Expert
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="pb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
