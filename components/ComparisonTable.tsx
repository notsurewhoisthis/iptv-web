import { Check, X, Minus, Trophy, Star } from 'lucide-react';

interface ComparisonRow {
  feature: string;
  item1Value: string | boolean | number;
  item2Value: string | boolean | number;
  winner?: 1 | 2 | 'tie';
  description?: string;
}

interface ComparisonTableProps {
  item1Name: string;
  item2Name: string;
  item1Rating?: number;
  item2Rating?: number;
  rows: ComparisonRow[];
  winner?: {
    id: 1 | 2;
    reason: string;
  };
}

export function ComparisonTable({
  item1Name,
  item2Name,
  item1Rating,
  item2Rating,
  rows,
  winner,
}: ComparisonTableProps) {
  const renderValue = (value: string | boolean | number) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="h-5 w-5 text-green-600 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-red-500 mx-auto" />
      );
    }
    if (value === 'N/A' || value === '-') {
      return <Minus className="h-5 w-5 text-gray-400 mx-auto" />;
    }
    return <span>{value}</span>;
  };

  const getWinnerStyle = (rowWinner: 1 | 2 | 'tie' | undefined, column: 1 | 2) => {
    if (!rowWinner || rowWinner === 'tie') return '';
    return rowWinner === column
      ? 'bg-green-50 dark:bg-green-900/20 font-medium text-green-700 dark:text-green-400'
      : '';
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 mb-8">
      {/* Header */}
      <div className="grid grid-cols-3 bg-gray-50 dark:bg-gray-900">
        <div className="p-4 border-r border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Feature</span>
        </div>
        <div className="p-4 text-center border-r border-gray-200 dark:border-gray-700">
          <div className="font-semibold text-gray-900 dark:text-white">{item1Name}</div>
          {item1Rating && (
            <div className="flex items-center justify-center gap-1 mt-1">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{item1Rating}</span>
            </div>
          )}
        </div>
        <div className="p-4 text-center">
          <div className="font-semibold text-gray-900 dark:text-white">{item2Name}</div>
          {item2Rating && (
            <div className="flex items-center justify-center gap-1 mt-1">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{item2Rating}</span>
            </div>
          )}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {rows.map((row, index) => (
          <div key={index} className="grid grid-cols-3">
            <div className="p-4 border-r border-gray-200 dark:border-gray-700">
              <span className="font-medium text-gray-900 dark:text-white text-sm">{row.feature}</span>
              {row.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{row.description}</p>
              )}
            </div>
            <div
              className={`p-4 text-center text-sm border-r border-gray-200 dark:border-gray-700 ${getWinnerStyle(
                row.winner,
                1
              )}`}
            >
              {renderValue(row.item1Value)}
            </div>
            <div className={`p-4 text-center text-sm ${getWinnerStyle(row.winner, 2)}`}>
              {renderValue(row.item2Value)}
            </div>
          </div>
        ))}
      </div>

      {/* Winner Banner */}
      {winner && (
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-4 border-t border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
            <div>
              <span className="font-semibold text-gray-900 dark:text-white">
                Winner: {winner.id === 1 ? item1Name : item2Name}
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400">{winner.reason}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Quick comparison card for smaller comparisons
interface QuickCompareProps {
  items: Array<{
    name: string;
    rating: number;
    price: string;
    bestFor: string;
    link: string;
  }>;
}

export function QuickCompareCards({ items }: QuickCompareProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4 mb-8">
      {items.map((item, index) => (
        <div
          key={item.name}
          className={`rounded-lg p-5 border-2 ${
            index === 0
              ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
          }`}
        >
          {index === 0 && (
            <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded mb-3">
              Recommended
            </span>
          )}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
          <div className="flex items-center gap-2 mt-2">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium">{item.rating}</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600 dark:text-gray-400">{item.price}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Best for: {item.bestFor}</p>
          <a
            href={item.link}
            className="inline-block mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            View details →
          </a>
        </div>
      ))}
    </div>
  );
}

// Specs comparison for devices
interface SpecsCompareProps {
  specs: Array<{
    label: string;
    item1: string;
    item2: string;
  }>;
  item1Name: string;
  item2Name: string;
}

export function SpecsCompareTable({ specs, item1Name, item2Name }: SpecsCompareProps) {
  return (
    <div className="overflow-x-auto mb-8">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">Specification</th>
            <th className="text-center p-3 font-semibold text-gray-900 dark:text-white">{item1Name}</th>
            <th className="text-center p-3 font-semibold text-gray-900 dark:text-white">{item2Name}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {specs.map((spec, index) => (
            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
              <td className="p-3 text-gray-700 dark:text-gray-300">{spec.label}</td>
              <td className="p-3 text-center text-gray-900 dark:text-white">{spec.item1}</td>
              <td className="p-3 text-center text-gray-900 dark:text-white">{spec.item2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
