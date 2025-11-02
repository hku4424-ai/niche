'use client';

import React, { useState } from 'react';
import { Youtube, Users, Eye, TrendingUp } from 'lucide-react';
import { supabase, type ChannelAnalysis } from '@/lib/supabase';
import { MetricCard, Button, LoadingSkeleton } from '@/components/ui';

export default function ChannelPage() {
  const [channelId, setChannelId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ChannelAnalysis | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelId.trim()) {
      setError('Masukkan Channel ID');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const { data, error: apiError } = await supabase.functions.invoke('analyze-channel', {
        body: { channelId }
      });

      if (apiError) throw apiError;
      if (data?.error) throw new Error(data.error.message);

      setResult(data.data);
    } catch (err: any) {
      setError(err.message || 'Gagal menganalisis channel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Analisis Channel YouTube
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6 mb-8">
        <form onSubmit={handleAnalyze}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Channel ID atau URL
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              placeholder="UC..."
              className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
            <Button type="submit" isLoading={loading}>
              Analisis
            </Button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {loading && <LoadingSkeleton className="h-64 w-full" />}

      {result && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
            <div className="flex items-start gap-4">
              <img src={result.thumbnail} alt={result.channelName} className="w-24 h-24 rounded-full" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.channelName}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{result.description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard label="Subscribers" value={result.subscriberCount.toLocaleString()} icon={<Users className="h-5 w-5" />} />
            <MetricCard label="Total Views" value={result.totalViewCount.toLocaleString()} icon={<Eye className="h-5 w-5" />} />
            <MetricCard label="Videos" value={result.videoCount.toLocaleString()} icon={<Youtube className="h-5 w-5" />} />
            <MetricCard label="Avg Views" value={result.avgViews.toLocaleString()} icon={<TrendingUp className="h-5 w-5" />} />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Video Terbaru</h3>
            <div className="space-y-3">
              {result.recentVideos?.map((video, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm">{video.title}</span>
                  <span className="text-sm text-gray-600">{video.views.toLocaleString()} views</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
