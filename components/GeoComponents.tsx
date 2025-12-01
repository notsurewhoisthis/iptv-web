import { Star, Check, X, Calendar, User } from 'lucide-react';

// QuickAnswer component for GEO optimization - AI extracts this first
export function QuickAnswer({
  question,
  answer,
  highlight,
}: {
  question: string;
  answer: string;
  highlight?: string;
}) {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
      <h2 className="text-lg font-semibold text-blue-900 mb-2">{question}</h2>
      <p className="text-blue-800">
        <strong>Quick Answer:</strong> {answer}
      </p>
      {highlight && (
        <p className="mt-2 text-blue-700 text-sm italic">{highlight}</p>
      )}
    </div>
  );
}

// ComparisonTable for rankings - AI systems love structured tables
interface RankedPlayer {
  rank: number;
  name: string;
  slug: string;
  rating: number;
  pricing: string;
  highlight: string;
  pros?: string[];
  cons?: string[];
}

export function ComparisonTable({
  players,
  showProsCons = false,
}: {
  players: RankedPlayer[];
  showProsCons?: boolean;
}) {
  return (
    <div className="overflow-x-auto mb-8">
      <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Rank</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Player</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Rating</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Price</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b hidden md:table-cell">Why Choose</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr
              key={player.slug}
              className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
            >
              <td className="px-4 py-3 border-b">
                <span
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                    player.rank === 1
                      ? 'bg-yellow-100 text-yellow-700'
                      : player.rank === 2
                      ? 'bg-gray-200 text-gray-600'
                      : player.rank === 3
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {player.rank}
                </span>
              </td>
              <td className="px-4 py-3 border-b">
                <a
                  href={`/players/${player.slug}`}
                  className="font-medium text-gray-900 hover:text-blue-600"
                >
                  {player.name}
                </a>
              </td>
              <td className="px-4 py-3 border-b">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{player.rating}</span>
                </div>
              </td>
              <td className="px-4 py-3 border-b text-gray-600">{player.pricing}</td>
              <td className="px-4 py-3 border-b text-gray-500 text-sm hidden md:table-cell">
                {player.highlight}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// FeatureComparisonTable for detailed player comparisons
interface FeatureComparison {
  feature: string;
  player1: boolean | string;
  player2: boolean | string;
}

export function FeatureComparisonTable({
  player1Name,
  player2Name,
  features,
}: {
  player1Name: string;
  player2Name: string;
  features: FeatureComparison[];
}) {
  return (
    <div className="overflow-x-auto mb-8">
      <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Feature</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">{player1Name}</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">{player2Name}</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-4 py-3 border-b font-medium text-gray-700">{feature.feature}</td>
              <td className="px-4 py-3 border-b text-center">
                {typeof feature.player1 === 'boolean' ? (
                  feature.player1 ? (
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  ) : (
                    <X className="h-5 w-5 text-red-400 mx-auto" />
                  )
                ) : (
                  <span className="text-gray-700">{feature.player1}</span>
                )}
              </td>
              <td className="px-4 py-3 border-b text-center">
                {typeof feature.player2 === 'boolean' ? (
                  feature.player2 ? (
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  ) : (
                    <X className="h-5 w-5 text-red-400 mx-auto" />
                  )
                ) : (
                  <span className="text-gray-700">{feature.player2}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// AuthorBio component for E-E-A-T signals
export function AuthorBio({
  name,
  expertise,
  bio,
  imageUrl,
}: {
  name: string;
  expertise: string;
  bio?: string;
  imageUrl?: string;
}) {
  return (
    <div className="border-t border-gray-200 pt-6 mt-8">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-6 w-6 text-gray-500" />
            </div>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-500">Written by</p>
          <p className="font-semibold text-gray-900">{name}</p>
          <p className="text-sm text-blue-600">{expertise}</p>
          {bio && <p className="text-sm text-gray-600 mt-2">{bio}</p>}
        </div>
      </div>
    </div>
  );
}

// LastUpdated component for freshness signals
export function LastUpdated({ date }: { date: Date | string }) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const formatted = dateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
      <Calendar className="h-4 w-4" />
      <span>Last updated: {formatted}</span>
    </div>
  );
}

// ProsCons component for decision support
export function ProsCons({
  pros,
  cons,
}: {
  pros: string[];
  cons: string[];
}) {
  return (
    <div className="grid md:grid-cols-2 gap-6 my-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
          <Check className="h-5 w-5" />
          Pros
        </h4>
        <ul className="space-y-2">
          {pros.map((pro, i) => (
            <li key={i} className="flex items-start gap-2 text-green-700">
              <Check className="h-4 w-4 mt-1 flex-shrink-0" />
              <span>{pro}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
          <X className="h-5 w-5" />
          Cons
        </h4>
        <ul className="space-y-2">
          {cons.map((con, i) => (
            <li key={i} className="flex items-start gap-2 text-red-700">
              <X className="h-4 w-4 mt-1 flex-shrink-0" />
              <span>{con}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// TLDRBox for quick summaries
export function TLDRBox({
  title,
  points,
}: {
  title?: string;
  points: string[];
}) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-gray-900 mb-2">{title || 'TL;DR'}</h3>
      <ul className="space-y-1">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-2 text-gray-700">
            <span className="text-blue-500 font-bold">•</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
