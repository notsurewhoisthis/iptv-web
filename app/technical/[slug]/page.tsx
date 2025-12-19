import { notFound, permanentRedirect } from 'next/navigation';
import { getTechnicalGuide } from '@/lib/data-loader';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function LegacyTechnicalRedirect({ params }: PageProps) {
  const { slug } = await params;
  const guide = await getTechnicalGuide(slug);

  if (!guide) {
    notFound();
  }

  permanentRedirect(`/guides/technical/${slug}`);
}
