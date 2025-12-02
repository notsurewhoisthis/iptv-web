'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { Send, Bot, User, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface ChatProps {
  fullScreen?: boolean;
}

// Parse markdown links in text
function parseLinks(text: string) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: (string | React.ReactNode)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Add the link
    const [, linkText, linkUrl] = match;
    parts.push(
      <Link
        key={match.index}
        href={linkUrl}
        className="text-blue-600 hover:text-blue-800 underline"
      >
        {linkText}
      </Link>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

// Format message content with basic markdown
function formatMessage(content: string) {
  return content.split('\n').map((line, i) => (
    <span key={i}>
      {parseLinks(line)}
      {i < content.split('\n').length - 1 && <br />}
    </span>
  ));
}

export function Chat({ fullScreen = false }: ChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    setMessages,
  } = useChat({
    api: '/api/chat',
    onFinish: () => {
      // Scroll to bottom after message
      scrollToBottom();
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Only scroll when a new message is added AND user has interacted
  const prevMessageCount = useRef(0);
  useEffect(() => {
    if (hasInteracted && messages.length > prevMessageCount.current) {
      scrollToBottom();
    }
    prevMessageCount.current = messages.length;
  }, [messages.length, hasInteracted]);

  // Focus input on mount - use preventScroll to avoid page jumping
  useEffect(() => {
    if (fullScreen) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [fullScreen]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    setHasInteracted(true);
    handleSubmit(e);
  };

  const suggestedQuestions = [
    "What's the best IPTV player for Firestick?",
    "How do I fix buffering issues?",
    "Which player works best on Apple TV?",
    "What is EPG and how do I set it up?",
  ];

  const handleSuggestedQuestion = (question: string) => {
    setHasInteracted(true);
    setMessages([...messages, { id: Date.now().toString(), role: 'user', content: question }]);
    // Trigger the chat submission
    const fakeEvent = {
      preventDefault: () => {},
    } as React.FormEvent;
    handleInputChange({ target: { value: question } } as React.ChangeEvent<HTMLInputElement>);
    setTimeout(() => {
      handleSubmit(fakeEvent);
    }, 0);
  };

  return (
    <div className={`flex flex-col ${fullScreen ? 'h-full' : 'h-[400px]'} bg-white`}>
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Welcome message */}
        {messages.length === 0 && !hasInteracted && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Bot className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 bg-gray-100 rounded-lg p-3 text-sm text-gray-700">
                <p className="font-medium mb-2">Hi! I&apos;m your IPTV assistant.</p>
                <p>
                  I can help you choose the right IPTV player, set it up on your device,
                  and troubleshoot any issues. What would you like to know?
                </p>
              </div>
            </div>

            {/* Suggested questions */}
            <div className="pl-11">
              <p className="text-xs text-gray-500 mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chat messages */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user'
                  ? 'bg-gray-900'
                  : 'bg-blue-100'
              }`}
            >
              {message.role === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div
              className={`flex-1 rounded-lg p-3 text-sm ${
                message.role === 'user'
                  ? 'bg-gray-900 text-white ml-12'
                  : 'bg-gray-100 text-gray-700 mr-12'
              }`}
            >
              {formatMessage(message.content)}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <span>Something went wrong. Please try again.</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about IPTV players, setup, or troubleshooting..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Powered by AI. For setup help only - not affiliated with IPTV providers.
        </p>
      </div>
    </div>
  );
}
