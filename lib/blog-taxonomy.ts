import type { BlogPost } from './types';

export function slugifyTaxonomy(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/^=+/, '')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function normalizeCategory(
  raw?: string | null
): { label: string; slug: string } | null {
  if (!raw) return null;
  const label = raw.replace(/^=+/, '').trim();
  if (!label || label === '=') return null;
  if (label.length > 60) return null;
  const slug = slugifyTaxonomy(label);
  if (!slug) return null;
  return { label, slug };
}

export function normalizeTag(
  raw?: string | null
): { label: string; slug: string } | null {
  if (!raw) return null;
  const label = raw.replace(/^=+/, '').trim();
  if (!label || label === '=') return null;
  const slug = slugifyTaxonomy(label);
  if (!slug) return null;
  return { label, slug };
}

export function getBlogCategories(posts: BlogPost[]) {
  const map = new Map<string, { label: string; slug: string; count: number }>();
  posts.forEach((post) => {
    const cat = normalizeCategory(post.category);
    if (!cat) return;
    const existing = map.get(cat.slug);
    map.set(cat.slug, {
      ...cat,
      count: (existing?.count || 0) + 1,
    });
  });
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export function getBlogTags(posts: BlogPost[]) {
  const map = new Map<string, { label: string; slug: string; count: number }>();
  posts.forEach((post) => {
    (post.tags || []).forEach((tag) => {
      const t = normalizeTag(tag);
      if (!t) return;
      const existing = map.get(t.slug);
      map.set(t.slug, {
        ...t,
        count: (existing?.count || 0) + 1,
      });
    });
  });
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

