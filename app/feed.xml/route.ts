import { getBlogPosts, getBaseUrl } from '@/lib/data-loader';

export async function GET() {
  const posts = await getBlogPosts();
  const baseUrl = getBaseUrl();

  const rssItems = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <category><![CDATA[${post.category}]]></category>
      <author>noreply@iptvguide.com (${post.author.name})</author>
    </item>`
    )
    .join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>IPTV Guide - Latest Articles</title>
    <link>${baseUrl}</link>
    <description>Setup guides, player comparisons, and troubleshooting tips for all your IPTV streaming needs.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/icon.png</url>
      <title>IPTV Guide</title>
      <link>${baseUrl}</link>
    </image>
    <copyright>Copyright ${new Date().getFullYear()} IPTV Guide</copyright>
    <managingEditor>noreply@iptvguide.com (IPTV Guide Team)</managingEditor>
    <webMaster>noreply@iptvguide.com (IPTV Guide Team)</webMaster>
    <ttl>60</ttl>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
