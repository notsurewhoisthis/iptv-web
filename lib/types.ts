export interface Player {
  id: string;
  name: string;
  slug: string;
  category: 'premium' | 'free' | 'open-source' | 'freemium' | 'paid';
  platforms: string[];
  features: string[];
  rating: number;
  pricing: {
    model: string;
    price: string;
  };
  description: string;
  shortDescription: string;
  pros: string[];
  cons: string[];
  officialUrl: string;
  downloadUrls: { platform: string; url: string }[];
  lastUpdated: string;
  yearLaunched: number;
  developer: string;
  keywords: string[];
  faqs?: FAQ[];
  // Relationship fields for internal linking
  relatedPlayers?: string[];
  relatedDevices?: string[];
}

export interface Device {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  brand: string;
  category: string;
  os: string;
  supportedPlayers: string[];
  specs: {
    resolution: string;
    storage: string;
    connectivity: string[];
  };
  pricing: string;
  amazonUrl: string | null;
  pros: string[];
  cons: string[];
  description: string;
  shortDescription: string;
  keywords: string[];
  faqs?: FAQ[];
  // Relationship fields for internal linking
  relatedDevices?: string[];
  relatedGuides?: string[];
}

export interface Feature {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  category: string;
  description: string;
  benefits: string[];
  requirements: string[];
  supportedPlayers: string[];
  supportedDevices: string[];
  difficulty: 'easy' | 'medium' | 'advanced';
  keywords: string[];
}

export interface Issue {
  id: string;
  name: string;
  slug: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  commonCauses: string[];
  generalSolutions: string[];
  affectedPlayers: string[];
  affectedDevices: string[];
  keywords: string[];
  description: string;
}

export interface Step {
  stepNumber: number;
  title: string;
  description: string;
  tips?: string[];
  warnings?: string[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface PlayerDeviceGuide {
  slug: string;
  playerId: string;
  deviceId: string;
  playerName: string;
  deviceName: string;
  deviceShortName: string;
  title: string;
  metaTitle: string;
  description: string;
  content: {
    intro: string;
    requirements: string[];
    steps: Step[];
    troubleshooting: string[];
    faqs: FAQ[];
    conclusion: string;
  };
  relatedGuides: string[];
  tags: string[];
  keywords: string[];
  lastUpdated: string;
  playerRating: number;
  playerPricing: { model: string; price: string };
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  keywords: string[];
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  author: {
    name: string;
    bio: string;
    expertise?: string;
  };
  metrics: {
    readingTime: number;
    wordCount: number;
  };
}

export interface PlayerFeatureGuide {
  slug: string;
  playerId: string;
  featureId: string;
  playerName: string;
  featureName: string;
  title: string;
  metaTitle: string;
  description: string;
  content: {
    intro: string;
    requirements: string[];
    steps: Step[];
    tips: string[];
    faqs: FAQ[];
  };
  keywords: string[];
  lastUpdated: string;
}

export interface DeviceFeatureGuide {
  slug: string;
  deviceId: string;
  featureId: string;
  deviceName: string;
  featureName: string;
  title: string;
  metaTitle: string;
  description: string;
  content: {
    intro: string;
    requirements: string[];
    steps: Step[];
    tips: string[];
    faqs: FAQ[];
  };
  keywords: string[];
  lastUpdated: string;
}

export interface PlayerTroubleshootingGuide {
  slug: string;
  type: 'player';
  playerId: string;
  issueId: string;
  playerName: string;
  issueName: string;
  title: string;
  metaTitle: string;
  description: string;
  content: {
    intro: string;
    severity: string;
    commonCauses: string[];
    solutions: string[];
    playerSpecificTips: string[];
    faqs: FAQ[];
  };
  keywords: string[];
  lastUpdated: string;
}

export interface DeviceTroubleshootingGuide {
  slug: string;
  type: 'device';
  deviceId: string;
  issueId: string;
  deviceName: string;
  issueName: string;
  title: string;
  metaTitle: string;
  description: string;
  content: {
    intro: string;
    severity: string;
    commonCauses: string[];
    solutions: string[];
    deviceSpecificTips: string[];
    faqs: FAQ[];
  };
  keywords: string[];
  lastUpdated: string;
}

export interface PlayerComparison {
  slug: string;
  type: 'player';
  player1Id: string;
  player2Id: string;
  player1Name: string;
  player2Name: string;
  title: string;
  metaTitle: string;
  description: string;
  content: {
    intro: string;
    comparison: Record<string, unknown>;
    player1Summary: {
      name: string;
      description: string;
      pros: string[];
      cons: string[];
      bestFor: string;
    };
    player2Summary: {
      name: string;
      description: string;
      pros: string[];
      cons: string[];
      bestFor: string;
    };
    verdict: string;
    faqs: FAQ[];
  };
  relatedGuides: string[];
  tags: string[];
  keywords: string[];
  lastUpdated: string;
}

export interface DeviceComparison {
  slug: string;
  type: 'device';
  device1Id: string;
  device2Id: string;
  device1Name: string;
  device1ShortName: string;
  device2Name: string;
  device2ShortName: string;
  title: string;
  metaTitle: string;
  description: string;
  content: {
    intro: string;
    comparison: Record<string, unknown>;
    device1Summary: {
      name: string;
      description: string;
      pros: string[];
      cons: string[];
      supportedPlayers: string[];
    };
    device2Summary: {
      name: string;
      description: string;
      pros: string[];
      cons: string[];
      supportedPlayers: string[];
    };
    verdict: string;
    faqs: FAQ[];
  };
  relatedGuides: string[];
  tags: string[];
  keywords: string[];
  lastUpdated: string;
}

export interface BestForPage {
  slug: string;
  deviceId: string;
  deviceName: string;
  deviceShortName: string;
  title: string;
  metaTitle: string;
  description: string;
  content: {
    intro: string;
    topPick: {
      name: string;
      slug: string;
      rating: number;
      description: string;
      features: string[];
      pricing: { model: string; price: string };
      pros: string[];
      cons: string[];
      whyTopPick: string;
    } | null;
    runnerUp: {
      name: string;
      slug: string;
      rating: number;
      description: string;
      pricing: { model: string; price: string };
      pros: string[];
    } | null;
    budgetPick: {
      name: string;
      slug: string;
      rating: number;
      description: string;
      pricing: { model: string; price: string };
      whyBudget: string;
    } | null;
    allRankings: {
      rank: number;
      name: string;
      slug: string;
      rating: number;
      pricing: string;
      highlight: string;
    }[];
    faqs: FAQ[];
  };
  relatedGuides: string[];
  tags: string[];
  keywords: string[];
  lastUpdated: string;
}

// GEO-optimized Use-Case Pages (e.g., "best free iptv players", "best iptv for sports")
export interface UseCasePage {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  quickAnswer: {
    question: string;
    answer: string;
    highlight?: string;
  };
  content: {
    intro: string;
    whyItMatters: string;
  };
  rankings: {
    rank: number;
    playerId: string;
    whyRanked: string;
    bestFor: string;
  }[];
  faqs: FAQ[];
  keywords: string[];
  lastUpdated: string;
  author: {
    name: string;
    expertise: string;
  };
}

// Benchmark data for IPTV players
export interface BenchmarkMetric {
  value: number | null;
  unit: string;
  description: string;
}

export interface PlayerBenchmark {
  playerId: string;
  name: string;
  metrics: {
    startupTime: BenchmarkMetric;
    channelSwitchTime: BenchmarkMetric;
    memoryUsage: BenchmarkMetric;
    epgLoadTime: BenchmarkMetric;
    bufferRecoveryTime: BenchmarkMetric;
    cpuUsage: BenchmarkMetric;
  };
  stability: {
    crashFrequency: string;
    score: number;
  };
  features: {
    '4kSupport': boolean;
    catchupSupport: boolean;
    multiView: boolean;
    recording: boolean;
    parentalControls: boolean;
  };
}

export interface BenchmarkData {
  metadata: {
    lastUpdated: string;
    testingDevice: string;
    testingNetwork: string;
    methodology: string;
  };
  playerBenchmarks: PlayerBenchmark[];
  comparisons: {
    fastestChannelSwitch: string[];
    lowestMemoryUsage: string[];
    fastestStartup: string[];
    bestStability: string[];
    mostFeatureRich: string[];
  };
  recommendations: {
    [key: string]: {
      description: string;
      players: string[];
      reason: string;
    };
  };
}

// Technical Guides (troubleshooting, setup guides)
export interface TechnicalGuideStep {
  title: string;
  description: string;
}

export interface TechnicalGuideSection {
  title: string;
  content?: string;
  steps?: TechnicalGuideStep[];
}

export interface TechnicalGuide {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  category: 'troubleshooting' | 'setup' | 'optimization';
  quickAnswer: {
    question: string;
    answer: string;
    highlight?: string;
  };
  content: {
    intro: string;
    sections: TechnicalGuideSection[];
  };
  faqs: FAQ[];
  keywords: string[];
  lastUpdated: string;
  author: {
    name: string;
    expertise: string;
  };
  relatedGuides?: string[];
  // Relationship fields for internal linking
  relatedPlayers?: string[];
  relatedDevices?: string[];
}
