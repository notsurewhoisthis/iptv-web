'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Minimize2, ExternalLink } from 'lucide-react';
import { Chat } from './Chat';
import Link from 'next/link';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  // Show a subtle bounce animation after 10 seconds if not interacted
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setHasNewMessage(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setHasNewMessage(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  return (
    <>
      {/* Floating button (always visible when chat is closed) */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center ${
            hasNewMessage ? 'animate-bounce' : ''
          }`}
          aria-label="Open chat assistant"
        >
          <MessageCircle className="w-6 h-6" />
          {hasNewMessage && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white">1</span>
            </span>
          )}
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isMinimized
              ? 'bottom-6 right-6 w-72'
              : 'bottom-6 right-6 w-96 sm:w-[420px]'
          }`}
        >
          <div
            className={`bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden ${
              isMinimized ? 'h-14' : 'h-[500px]'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <span className="font-semibold">IPTV Assistant</span>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href="/ask"
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  title="Open full page"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <button
                  onClick={handleMinimize}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClose}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat content (hidden when minimized) */}
            {!isMinimized && (
              <div className="h-[calc(100%-52px)]">
                <Chat />
              </div>
            )}

            {/* Minimized state - click to expand */}
            {isMinimized && (
              <button
                onClick={() => setIsMinimized(false)}
                className="w-full h-full px-4 text-left text-sm text-gray-500 hover:bg-gray-50"
              >
                Click to expand chat...
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
