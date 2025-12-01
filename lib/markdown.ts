import { marked } from 'marked';

// Configure marked for better output
marked.setOptions({
  gfm: true,
  breaks: true,
  async: false, // Force synchronous parsing
});

export function parseMarkdown(content: string): string {
  // Check if content is already HTML (starts with < tag)
  if (content.trim().startsWith('<')) {
    return content;
  }

  // Parse markdown to HTML synchronously
  const result = marked.parse(content, { async: false });
  return result as string;
}
