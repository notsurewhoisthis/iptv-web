'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, List } from 'lucide-react';

export interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
  title?: string;
}

export function TableOfContents({ items, title = 'Table of Contents' }: TableOfContentsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  if (items.length === 0) return null;

  return (
    <nav className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-8" aria-label="Table of contents">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          <List className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <span className="font-semibold text-gray-900 dark:text-white">{title}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">({items.length} sections)</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <ol className="mt-4 space-y-2">
          {items.map((item, index) => (
            <li
              key={item.id}
              style={{ paddingLeft: `${(item.level - 2) * 16}px` }}
            >
              <button
                onClick={() => scrollToSection(item.id)}
                className={`text-left text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                  activeId === item.id
                    ? 'text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <span className="text-gray-400 dark:text-gray-500 mr-2">{index + 1}.</span>
                {item.title}
              </button>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}

// Sticky sidebar variant for longer pages
export function StickyTableOfContents({ items, title = 'On This Page' }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  if (items.length === 0) return null;

  return (
    <nav className="sticky top-24" aria-label="Table of contents">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">
        {title}
      </h3>
      <ul className="space-y-2 border-l-2 border-gray-200 dark:border-gray-700">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
          >
            <button
              onClick={() => scrollToSection(item.id)}
              className={`block text-left text-sm py-1 pl-3 -ml-[2px] border-l-2 transition-colors ${
                activeId === item.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-medium'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-400'
              }`}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
