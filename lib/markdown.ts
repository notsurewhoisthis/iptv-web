import { marked } from 'marked';

// Configure marked for better output
marked.use({
  gfm: true,
  breaks: true,
});

export async function parseMarkdown(content: string): Promise<string> {
  // Check if content is already HTML (starts with < tag)
  if (content.trim().startsWith('<')) {
    return content;
  }

  // Parse markdown to HTML - marked v17 returns a Promise
  const result = await marked.parse(content);
  return result;
}
