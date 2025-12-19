import { permanentRedirect } from 'next/navigation';

export default function LegacyIptvVsCableRedirect() {
  permanentRedirect('/learn/what-is-iptv');
}
