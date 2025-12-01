'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search as SearchIcon, X, Command, ArrowRight, Tv, Smartphone, BookOpen, FileText } from 'lucide-react';
import Fuse from 'fuse.js';

interface SearchItem {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'player' | 'device' | 'guide' | 'blog';
  keywords?: string[];
}

interface SearchProps {
  items: SearchItem[];
}

const typeConfig = {
  player: { icon: Tv, label: 'Player', color: 'text-blue-600 bg-blue-50' },
  device: { icon: Smartphone, label: 'Device', color: 'text-green-600 bg-green-50' },
  guide: { icon: BookOpen, label: 'Guide', color: 'text-purple-600 bg-purple-50' },
  blog: { icon: FileText, label: 'Blog', color: 'text-orange-600 bg-orange-50' },
};

export function Search({ items }: SearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Initialize Fuse.js
  const fuse = useRef(
    new Fuse(items, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'description', weight: 0.3 },
        { name: 'keywords', weight: 0.3 },
      ],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 2,
    })
  );

  // Update fuse when items change
  useEffect(() => {
    fuse.current = new Fuse(items, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'description', weight: 0.3 },
        { name: 'keywords', weight: 0.3 },
      ],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, [items]);

  // Search when query changes
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const searchResults = fuse.current.search(query).slice(0, 8);
    setResults(searchResults.map((r) => r.item));
    setSelectedIndex(0);
  }, [query]);

  // Open modal handler
  const openSearch = useCallback(() => {
    setIsOpen(true);
    setQuery('');
    setResults([]);
    setSelectedIndex(0);
  }, []);

  // Close modal handler
  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
  }, []);

  // Navigate to result
  const navigateToResult = useCallback(
    (item: SearchItem) => {
      closeSearch();
      router.push(item.url);
    },
    [closeSearch, router]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          closeSearch();
        } else {
          openSearch();
        }
        return;
      }

      // Close with Escape
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        closeSearch();
        return;
      }

      // Navigate results with arrow keys
      if (isOpen && results.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % results.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          navigateToResult(results[selectedIndex]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, openSearch, closeSearch, navigateToResult]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
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

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={openSearch}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        aria-label="Search (Press Cmd+K)"
      >
        <SearchIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 text-xs bg-white rounded border border-gray-300">
          <Command className="h-3 w-3" />K
        </kbd>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-[15vh]"
          onClick={closeSearch}
          aria-hidden="true"
        >
          {/* Modal Content */}
          <div
            className="w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Search"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
              <SearchIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search players, devices, guides..."
                className="flex-1 text-base outline-none placeholder:text-gray-400"
                aria-label="Search query"
              />
              <button
                onClick={closeSearch}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {query.length < 2 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  <p>Type at least 2 characters to search</p>
                  <p className="text-sm mt-2">
                    Try searching for &quot;TiviMate&quot;, &quot;Firestick&quot;, or &quot;buffering&quot;
                  </p>
                </div>
              ) : results.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  <p>No results found for &quot;{query}&quot;</p>
                  <p className="text-sm mt-2">Try different keywords</p>
                </div>
              ) : (
                <ul className="py-2" role="listbox">
                  {results.map((item, index) => {
                    const config = typeConfig[item.type];
                    const Icon = config.icon;
                    const isSelected = index === selectedIndex;

                    return (
                      <li key={item.id} role="option" aria-selected={isSelected}>
                        <button
                          onClick={() => navigateToResult(item)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                            isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${config.color}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 truncate">
                                {item.title}
                              </span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${config.color}`}>
                                {config.label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">{item.description}</p>
                          </div>
                          <ArrowRight
                            className={`h-4 w-4 flex-shrink-0 transition-opacity ${
                              isSelected ? 'opacity-100 text-gray-400' : 'opacity-0'
                            }`}
                          />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-300">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-300">↓</kbd>
                  to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-300">↵</kbd>
                  to select
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-300">esc</kbd>
                to close
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
