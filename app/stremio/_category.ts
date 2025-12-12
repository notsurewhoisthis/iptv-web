export const STREMIO_CATEGORY_META: Record<
  string,
  { title: string; description: string }
> = {
  basics: {
    title: 'Stremio Basics',
    description: 'What Stremio is, how it works, and safe defaults for beginners.',
  },
  setup: {
    title: 'Stremio Setup',
    description: 'Account sync, device checklists, and clean configuration tips.',
  },
  addons: {
    title: 'Stremio Addons',
    description: 'Addon fundamentals, safe choices, and beginner-friendly setup steps.',
  },
  troubleshooting: {
    title: 'Stremio Troubleshooting',
    description: 'Fix buffering, subtitles, casting, and common playback problems.',
  },
  'best-practices': {
    title: 'Stremio Best Practices',
    description: 'Performance, privacy, and reliability tips for smoother streaming.',
  },
  resources: {
    title: 'Stremio Resources',
    description: 'Official links, help pages, and practical references.',
  },
};

export function categoryLabel(category: string): string {
  return STREMIO_CATEGORY_META[category]?.title || category.replace(/[-_]/g, ' ');
}

