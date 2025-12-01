import { marked } from 'marked';

// Configure marked for better output
marked.use({
  gfm: true,
  breaks: true,
});

export function parseMarkdown(content: string): string {
  // Check if content is already HTML (starts with < tag)
  if (content.trim().startsWith('<')) {
    return content;
  }

  // Parse markdown to HTML synchronously using parse (v17+ API)
  // In marked v17, parse() is synchronous by default when not using async extensions
  const result = marked.parse(content);

  // If result is a Promise (shouldn't happen without async extensions), handle it
  if (typeof result === 'string') {
    return result;
  }

  // Fallback: return content as-is if parsing fails
  return content;
}
