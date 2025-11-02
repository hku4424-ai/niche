'use client';

import React, { useState } from 'react';
import { Search, TrendingUp, DollarSign, Target, Eye, Activity } from 'lucide-react';
import { supabase, type NicheAnalysis } from '@/lib/supabase';
import { MetricCard, ScoreCard, Button, LoadingSkeleton } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';
import { validateInput, nicheAnalysisSchema, saveNicheSchema } from '@/lib/validation';

export default function HomePage() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('id');
  const [country, setCountry] = useState('ID');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NicheAnalysis | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    // Validate input with Zod
    const validation = validateInput(nicheAnalysisSchema, { query, language, country });
    if (!validation.success) {
      setError(validation.error || 'Input tidak valid');
      return;
    }

    setLoading(true);

    try {
      const { data, error: apiError } = await supabase.functions.invoke('analyze-niche', {
        body: validation.data
      });

      if (apiError) throw apiError;

      if (data?.error) {
        throw new Error(data.error.message);
      }

      setResult(data.data);
    } catch (err: any) {
      setError(err.message || 'Gagal menganalisis niche. Pastikan API key sudah dikonfigurasi.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNiche = async () => {
    if (!user || !result) {
      alert('Silakan login untuk menyimpan niche');
      return;
    }

    // Validate save data
    const saveData = {
      niche_name: result.niche,
      score: result.score,
      search_volume: result.searchVolume,
      competition_level: result.competitionLevel,
      estimated_cpm: result.estimatedCpm,
      trend_7d: result.trend7d,
      trend_30d: result.trend30d,
      metadata: result
    };

    const validation = validateInput(saveNicheSchema, saveData);
    if (!validation.success) {
      alert('Data tidak valid: ' + validation.error);
      return;
    }

    try {
      const { error } = await supabase
        .from('saved_niches')
        .insert({
          user_id: user.id,
          ...validation.data
        });

      if (error) throw error;
      alert('Niche berhasil disimpan!');
    } catch (err: any) {
      alert('Gagal menyimpan niche: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analisis Niche YouTube
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Temukan peluang niche terbaik dengan analisis real-time dan skor komprehensif
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <form onSubmit={handleAnalyze}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kata Kunci Niche
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Contoh: tutorial memasak, teknologi AI, gaming mobile"
                  className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bahasa
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="id">Indonesia</option>
                  <option value="en">English</option>
                  <option value="ms">Malay</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Negara
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="ID">Indonesia</option>
                  <option value="US">United States</option>
                  <option value="MY">Malaysia</option>
                  <option value="SG">Singapore</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full"
            >
              Analisis Niche
            </Button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
          <p className="text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          <LoadingSkeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <LoadingSkeleton key={i} className="h-24" />
            ))}
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Hasil Analisis: {result.niche}
              </h2>
              {result.dataSource && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Data source: {result.dataSource === 'youtube' ? 'YouTube API' : 'Serp API'}
                </p>
              )}
            </div>
            {user && (
              <Button onClick={handleSaveNiche} variant="outline">
                Simpan Niche
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <ScoreCard score={result.score} size="lg" />
            </div>

            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <MetricCard
                label="Volume Pencarian"
                value={result.searchVolume.toLocaleString()}
                icon={<Eye className="h-5 w-5" />}
              />
              <MetricCard
                label="Rata-rata Views"
                value={result.avgViews.toLocaleString()}
                icon={<TrendingUp className="h-5 w-5" />}
              />
              <MetricCard
                label="Tingkat Kompetisi"
                value={result.competitionLevel.toUpperCase()}
                icon={<Target className="h-5 w-5" />}
              />
              <MetricCard
                label="Estimasi CPM"
                value={`$${result.estimatedCpm}`}
                icon={<DollarSign className="h-5 w-5" />}
              />
              <MetricCard
                label="Engagement Rate"
                value={`${result.engagementRate.toFixed(2)}%`}
                icon={<Activity className="h-5 w-5" />}
              />
              <MetricCard
                label="Jumlah Video"
                value={result.videoCount.toLocaleString()}
                icon={<Search className="h-5 w-5" />}
              />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
              Interpretasi Skor
            </h3>
            <div className="space-y-2 text-sm text-blue-800 dark:text-blue-400">
              {result.score >= 75 && (
                <p>Peluang sangat bagus! Niche ini memiliki demand tinggi dengan kompetisi yang masih terjangkau.</p>
              )}
              {result.score >= 50 && result.score < 75 && (
                <p>Peluang cukup baik. Dengan konten berkualitas dan konsisten, Anda bisa berkembang di niche ini.</p>
              )}
              {result.score >= 25 && result.score < 50 && (
                <p>Peluang sedang. Pertimbangkan untuk fokus pada sub-niche yang lebih spesifik.</p>
              )}
              {result.score < 25 && (
                <p>Kompetisi sangat tinggi atau demand rendah. Pertimbangkan niche alternatif.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
