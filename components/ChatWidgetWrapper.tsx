'use client';

import dynamic from 'next/dynamic';

// Lazy load ChatWidget to reduce initial JS bundle by ~250-350kb
// This wrapper enables ssr: false in a Client Component context
const ChatWidget = dynamic(
  () => import('@/components/ChatWidget').then(mod => ({ default: mod.ChatWidget })),
  { ssr: false }
);

export function ChatWidgetWrapper() {
  return <ChatWidget />;
}
