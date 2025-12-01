import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getPlayerTroubleshooting,
  getDeviceTroubleshooting,
  getPlayers,
  getDevices,
  getIssues,
} from '@/lib/data-loader';
import { AlertTriangle, Tv, Smartphone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'IPTV Troubleshooting - Fix Common Streaming Issues',
  description:
    'Solve common IPTV problems: buffering, playback errors, EPG issues, audio sync, and more. Step-by-step solutions for all players and devices.',
};

export default async function TroubleshootingPage() {
  const [playerIssues, deviceIssues, players, devices, issues] = await Promise.all([
    getPlayerTroubleshooting(),
    getDeviceTroubleshooting(),
    getPlayers(),
    getDevices(),
    getIssues(),
  ]);

  // Get top issues
  const topIssues = issues.slice(0, 6);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">IPTV Troubleshooting</h1>
        <p className="text-gray-600 mb-8">
          Find solutions to common IPTV streaming problems. Select your issue, player, or device below.
        </p>

        {/* Common Issues */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Issues</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topIssues.map((issue) => (
              <div
                key={issue.id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className={`h-5 w-5 ${
                    issue.severity === 'high' ? 'text-red-500' :
                    issue.severity === 'medium' ? 'text-yellow-500' : 'text-gray-400'
                  }`} />
                  <h3 className="font-medium text-gray-900">{issue.name}</h3>
                </div>
                <p className="text-sm text-gray-500 mb-3">{issue.description}</p>
                <div className="flex flex-wrap gap-1">
                  {issue.affectedPlayers.slice(0, 3).map((playerId) => (
                    <Link
                      key={playerId}
                      href={`/troubleshooting/players/${playerId}/${issue.id}`}
                      className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      {playerId}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* By Player */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Tv className="h-6 w-6 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900">By IPTV Player</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.slice(0, 9).map((player) => {
              const playerGuides = playerIssues.filter((g) => g.playerId === player.id);
              return (
                <div
                  key={player.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition"
                >
                  <h3 className="font-medium text-gray-900 mb-2">{player.name}</h3>
                  <div className="space-y-1">
                    {playerGuides.slice(0, 3).map((guide) => (
                      <Link
                        key={guide.slug}
                        href={`/troubleshooting/players/${guide.playerId}/${guide.issueId}`}
                        className="block text-sm text-blue-600 hover:text-blue-800"
                      >
                        {guide.issueName}
                      </Link>
                    ))}
                    {playerGuides.length > 3 && (
                      <span className="text-xs text-gray-400">
                        +{playerGuides.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* By Device */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="h-6 w-6 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900">By Device</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.slice(0, 9).map((device) => {
              const deviceGuides = deviceIssues.filter((g) => g.deviceId === device.id);
              return (
                <div
                  key={device.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition"
                >
                  <h3 className="font-medium text-gray-900 mb-2">{device.shortName}</h3>
                  <div className="space-y-1">
                    {deviceGuides.slice(0, 3).map((guide) => (
                      <Link
                        key={guide.slug}
                        href={`/troubleshooting/devices/${guide.deviceId}/${guide.issueId}`}
                        className="block text-sm text-blue-600 hover:text-blue-800"
                      >
                        {guide.issueName}
                      </Link>
                    ))}
                    {deviceGuides.length > 3 && (
                      <span className="text-xs text-gray-400">
                        +{deviceGuides.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Stats */}
        <div className="p-6 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {playerIssues.length + deviceIssues.length}
              </div>
              <div className="text-sm text-gray-500">Troubleshooting Guides</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{issues.length}</div>
              <div className="text-sm text-gray-500">Common Issues</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {players.length + devices.length}
              </div>
              <div className="text-sm text-gray-500">Players & Devices</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
