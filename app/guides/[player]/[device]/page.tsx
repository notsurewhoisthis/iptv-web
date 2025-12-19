import { notFound, permanentRedirect } from 'next/navigation';
import { getPlayerDeviceGuide, getPlayer, getDevice } from '@/lib/data-loader';

interface PageProps {
  params: Promise<{ player: string; device: string }>;
}

export default async function LegacyGuideRedirect({ params }: PageProps) {
  const { player, device } = await params;
  const guide = await getPlayerDeviceGuide(player, device);

  if (guide) {
    permanentRedirect(`/guides/${player}/setup/${device}`);
  }

  const [playerData, deviceData] = await Promise.all([
    getPlayer(player),
    getDevice(device),
  ]);

  if (playerData) {
    permanentRedirect(`/players/${playerData.slug}`);
  }

  if (deviceData) {
    permanentRedirect(`/devices/${deviceData.slug}`);
  }

  notFound();
}
