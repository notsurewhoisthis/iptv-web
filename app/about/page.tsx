import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Target, Users, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About IPTV Guide - Our Mission & Methodology',
  description:
    'Learn about IPTV Guide, our testing methodology, and commitment to providing accurate, unbiased IPTV player reviews and guides.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About IPTV Guide
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your trusted resource for IPTV player reviews, setup guides, and troubleshooting.
            We help you make informed decisions about streaming software.
          </p>
        </header>

        {/* Mission */}
        <section className="mb-12">
          <div className="bg-blue-50 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-8 w-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              IPTV Guide exists to simplify the complex world of IPTV streaming. With dozens of players,
              countless devices, and endless configuration options, finding the right setup can be overwhelming.
              We provide clear, accurate, and actionable information to help you get the best streaming experience.
            </p>
          </div>
        </section>

        {/* How We Test */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Test & Review</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Real Device Testing</h3>
              <p className="text-gray-600 text-sm">
                Every player is tested on actual hardware - Firestick, Apple TV, Android TV boxes,
                and more. We do not rely on emulators or specifications alone.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Feature Verification</h3>
              <p className="text-gray-600 text-sm">
                We verify each feature claim by the developers. EPG support, recording capabilities,
                multi-screen functionality - everything is tested firsthand.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Regular Updates</h3>
              <p className="text-gray-600 text-sm">
                IPTV apps update frequently. We re-test players after major updates and keep our
                reviews current with the latest versions.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">User Feedback</h3>
              <p className="text-gray-600 text-sm">
                We incorporate community feedback and common issues reported by users to provide
                comprehensive troubleshooting guides.
              </p>
            </div>
          </div>
        </section>

        {/* What We Cover */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Cover</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-sm text-gray-600">IPTV Players Reviewed</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-sm text-gray-600">Devices Supported</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-sm text-gray-600">Setup Guides</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
              <div className="text-sm text-gray-600">Troubleshooting Articles</div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Values</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Accuracy First</h3>
                <p className="text-gray-600 text-sm">
                  We verify every claim and update content when things change. Outdated information helps no one.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Unbiased Reviews</h3>
                <p className="text-gray-600 text-sm">
                  We are not affiliated with any IPTV player or service. Our recommendations are based solely on merit.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Users className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">User-Focused</h3>
                <p className="text-gray-600 text-sm">
                  Every guide is written with real users in mind. We explain concepts clearly and provide step-by-step instructions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="bg-gray-50 rounded-lg p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Important Disclaimer</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            IPTV Guide provides information about IPTV player software and streaming devices. We do not provide,
            sell, or promote any IPTV services, subscriptions, or content. Users are responsible for ensuring
            they use IPTV services in compliance with applicable laws and regulations. We encourage the use of
            legitimate, licensed streaming services.
          </p>
        </section>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Ready to find your perfect IPTV setup?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/players"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Browse Players
            </Link>
            <Link
              href="/guides"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition"
            >
              View Guides
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
