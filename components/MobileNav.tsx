'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronRight } from 'lucide-react';

const navLinks = [
  { href: '/players', label: 'Players' },
  { href: '/devices', label: 'Devices' },
  { href: '/features', label: 'Features' },
  { href: '/issues', label: 'Issues' },
  { href: '/guides', label: 'Guides' },
  { href: '/use-cases', label: 'Use Cases' },
  { href: '/learn', label: 'Learn IPTV' },
  { href: '/stremio', label: 'Stremio' },
  { href: '/legal-iptv', label: 'Legal IPTV' },
  { href: '/troubleshooting', label: 'Troubleshooting' },
  { href: '/compare', label: 'Compare' },
  { href: '/best', label: 'Best Picks' },
  { href: '/glossary', label: 'Glossary' },
  { href: '/blog', label: 'Blog' },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -mr-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-in Menu */}
      <div
        id="mobile-menu"
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span className="text-lg font-semibold text-gray-900">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 -mr-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
            aria-label="Close navigation menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4">
          <ul className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Links */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-4 text-sm text-gray-500">
            <Link href="/about" className="hover:text-gray-700">
              About
            </Link>
            <Link href="/privacy" className="hover:text-gray-700">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-gray-700">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
