import { marked } from 'marked';

// Configure marked for better output
marked.setOptions({
  gfm: true,
  breaks: true,
});

export function parseMarkdown(content: string): string {
  // Check if content is already HTML (starts with < tag)
  if (content.trim().startsWith('<')) {
    return content;
  }

  // Parse markdown to HTML
  return marked.parse(content) as string;
}
