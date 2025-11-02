import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type NicheAnalysis = {
  niche: string;
  score: number;
  searchVolume: number;
  competitionLevel: string;
  estimatedCpm: number;
  avgViews: number;
  engagementRate: number;
  videoCount: number;
  trend7d: number;
  trend30d: number;
  lastUpdated: string;
};

export type ChannelAnalysis = {
  channelId: string;
  channelName: string;
  description: string;
  subscriberCount: number;
  totalViewCount: number;
  videoCount: number;
  avgViews: number;
  engagementRate: number;
  subscriberToViewRatio: number;
  uploadFrequency: string;
  thumbnail: string;
  recentVideos: Array<{
    videoId: string;
    title: string;
    views: number;
    likes: number;
    comments: number;
  }>;
  lastUpdated: string;
};

export type VideoIdea = {
  title: string;
  outline: string;
  hook: string;
  cta: string;
  tags: string[];
  estimatedDuration?: string;
  difficulty?: string;
};

export type SavedNiche = {
  id: string;
  user_id: string;
  niche_name: string;
  score: number;
  search_volume: number;
  competition_level: string;
  estimated_cpm: number;
  trend_7d: number;
  trend_30d: number;
  metadata: any;
  created_at: string;
  updated_at: string;
};
