import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for IPTV Guide - rules and guidelines for using our website.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-500 mb-8">Last updated: December 2024</p>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using IPTV Guide, you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Use of Our Service</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              IPTV Guide provides informational content about IPTV players, streaming devices, and
              related software. Our content is provided for educational and informational purposes only.
            </p>
            <p className="text-gray-700 leading-relaxed">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
              <li>Use our content for any illegal purpose</li>
              <li>Reproduce, distribute, or sell our content without permission</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of our website</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed">
              The information on IPTV Guide is provided &quot;as is&quot; without warranties of any kind.
              While we strive for accuracy, we cannot guarantee that all information is current,
              complete, or error-free. Software features and availability may change without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">IPTV Services Disclaimer</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">
                <strong>Important:</strong> IPTV Guide does not provide, sell, or endorse any IPTV services
                or subscriptions. We only review and provide guides for IPTV player software. Users are
                solely responsible for ensuring they use IPTV services in compliance with applicable laws
                and regulations in their jurisdiction. We strongly encourage the use of legitimate,
                licensed streaming services.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">External Links</h2>
            <p className="text-gray-700 leading-relaxed">
              Our website may contain links to external websites. We are not responsible for the
              content, privacy practices, or availability of these external sites. Linking to a
              third-party site does not constitute an endorsement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content on IPTV Guide, including text, graphics, logos, and images, is the property
              of IPTV Guide or its content creators and is protected by copyright laws. IPTV player
              names and logos are trademarks of their respective owners.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              To the fullest extent permitted by law, IPTV Guide shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages arising from your
              use of our website or reliance on our content.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. Changes will be
              effective immediately upon posting. Your continued use of our website after changes
              constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service shall be governed by and construed in accordance with
              applicable laws, without regard to conflict of law principles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about these Terms of Service, please contact us through our website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
