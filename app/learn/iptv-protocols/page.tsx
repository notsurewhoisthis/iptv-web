import { permanentRedirect } from 'next/navigation';

export default function LegacyIptvProtocolsRedirect() {
  permanentRedirect('/learn/how-iptv-works');
}
