import { TrendingUp, Users, Globe, Tv, DollarSign, BarChart3 } from 'lucide-react';

interface StatItem {
  value: string;
  label: string;
  source?: string;
  icon: 'trending' | 'users' | 'globe' | 'tv' | 'dollar' | 'chart';
}

const iconMap = {
  trending: TrendingUp,
  users: Users,
  globe: Globe,
  tv: Tv,
  dollar: DollarSign,
  chart: BarChart3,
};

// Default IPTV market statistics (2024 data)
const defaultStats: StatItem[] = [
  { value: '$72.2B', label: 'Global IPTV Market (2024)', source: 'Grand View Research', icon: 'dollar' },
  { value: '12.4%', label: 'Annual Growth Rate (CAGR)', source: '2024-2030 forecast', icon: 'trending' },
  { value: '1.8B', label: 'IPTV Subscribers Worldwide', source: 'Statista 2024', icon: 'users' },
  { value: '190+', label: 'Countries with IPTV Services', source: 'Industry reports', icon: 'globe' },
];

interface MarketStatsProps {
  stats?: StatItem[];
  title?: string;
  subtitle?: string;
  showSource?: boolean;
}

export function MarketStats({
  stats = defaultStats,
  title = 'IPTV Industry at a Glance',
  subtitle = 'The streaming revolution continues to reshape how we watch TV',
  showSource = true,
}: MarketStatsProps) {
  return (
    <section className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 rounded-2xl p-8 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-400">{subtitle}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = iconMap[stat.icon];
          return (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600/20 mb-3">
                <Icon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
              {showSource && stat.source && (
                <div className="text-xs text-gray-500 mt-1">{stat.source}</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// Compact inline stats for articles
interface InlineStatsProps {
  stats: Array<{ value: string; label: string }>;
}

export function InlineStats({ stats }: InlineStatsProps) {
  return (
    <div className="flex flex-wrap gap-4 py-4 px-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stat.value}</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</span>
          {index < stats.length - 1 && <span className="text-gray-300 dark:text-gray-600 ml-2">|</span>}
        </div>
      ))}
    </div>
  );
}

// Trend indicator component
interface TrendIndicatorProps {
  value: number;
  label: string;
  direction: 'up' | 'down';
}

export function TrendIndicator({ value, label, direction }: TrendIndicatorProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
      <TrendingUp
        className={`h-4 w-4 ${
          direction === 'up' ? 'text-green-500' : 'text-red-500 rotate-180'
        }`}
      />
      <span className={direction === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
        {direction === 'up' ? '+' : '-'}{value}%
      </span>
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
    </div>
  );
}

// Authority badge for establishing trust
export function AuthorityBadge({ text = 'Trusted by 50,000+ streamers' }: { text?: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full text-sm">
      <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <span className="text-green-700 dark:text-green-400 font-medium">{text}</span>
    </div>
  );
}
