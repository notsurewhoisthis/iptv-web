import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

const BLOG_DIR = path.join(process.cwd(), 'public', 'blog-data');

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const authHeader = request.headers.get('authorization');
    const expectedSecret = process.env.N8N_WEBHOOK_SECRET;

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.slug || !body.title || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, title, content' },
        { status: 400 }
      );
    }

    // Ensure blog directory exists
    await fs.mkdir(BLOG_DIR, { recursive: true });

    // Create blog post JSON
    const blogPost = {
      slug: body.slug,
      title: body.title,
      description: body.description || body.title,
      content: body.content,
      category: body.category || 'General',
      keywords: body.keywords || [],
      tags: body.tags || [],
      publishedAt: body.publishedAt || new Date().toISOString(),
      updatedAt: body.updatedAt || new Date().toISOString(),
      author: body.author || {
        name: 'IPTV Guide Team',
        bio: 'Expert IPTV enthusiasts helping you get the most out of streaming',
      },
      metrics: body.metrics || {
        readingTime: Math.ceil(body.content.split(/\s+/).length / 225),
        wordCount: body.content.split(/\s+/).length,
      },
      // Optional featured/hero image URL (used by /blog and /blog/[slug])
      featuredImage:
        body.featuredImage ||
        body.featured_image ||
        body.post_image ||
        undefined,
    };

    // Write to file
    const filePath = path.join(BLOG_DIR, `${body.slug}.json`);
    await fs.writeFile(filePath, JSON.stringify(blogPost, null, 2));

    // Revalidate blog pages
    revalidatePath('/blog');
    revalidatePath(`/blog/${body.slug}`);
    revalidatePath('/sitemap.xml');

    return NextResponse.json({
      success: true,
      message: `Blog post created: ${body.slug}`,
      path: `/blog/${body.slug}`,
    });
  } catch (error) {
    console.error('Blog webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Blog webhook endpoint active',
    usage: 'POST with JSON body containing slug, title, and content',
  });
}
