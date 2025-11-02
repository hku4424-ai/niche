'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { validateInput, explorerFiltersSchema, type ExplorerFilters } from '@/lib/validation';
import { MetricCard, ScoreCard, Button, LoadingSkeleton } from '@/components/ui';

type NicheItem = {
  id: string;
  niche_name: string;
  score: number;
  search_volume: number;
  competition_level: string;
  estimated_cpm: number;
  trend_7d: number;
  trend_30d: number;
  created_at: string;
};

export default function ExplorerPage() {
  const [niches, setNiches] = useState<NicheItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [minScore, setMinScore] = useState<number>(0);
  const [maxScore, setMaxScore] = useState<number>(100);
  const [competitionLevel, setCompetitionLevel] = useState<string>('');
  const [sortBy, setSortBy] = useState<'score' | 'search_volume' | 'created_at'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const limit = 20;

  useEffect(() => {
    loadNiches();
  }, [page, sortBy, sortOrder]);

  const loadNiches = async () => {
    setLoading(true);
    try {
      // Build query
      let query = supabase
        .from('saved_niches')
        .select('*', { count: 'exact' });

      // Apply filters
      if (searchQuery) {
        query = query.ilike('niche_name', `%${searchQuery}%`);
      }
      if (minScore > 0) {
        query = query.gte('score', minScore);
      }
      if (maxScore < 100) {
        query = query.lte('score', maxScore);
      }
      if (competitionLevel) {
        query = query.eq('competition_level', competitionLevel);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      setNiches(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error loading niches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadNiches();
  };

  const handleReset = () => {
    setSearchQuery('');
    setMinScore(0);
    setMaxScore(100);
    setCompetitionLevel('');
    setSortBy('score');
    setSortOrder('desc');
    setPage(1);
    loadNiches();
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Niche Explorer
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Jelajahi dan filter niche berdasarkan kriteria spesifik
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Cari niche..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button onClick={handleSearch}>
            Cari
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Skor Minimum
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={minScore}
                  onChange={(e) => setMinScore(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Skor Maximum
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={maxScore}
                  onChange={(e) => setMaxScore(parseInt(e.target.value) || 100)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tingkat Kompetisi
                </label>
                <select
                  value={competitionLevel}
                  onChange={(e) => setCompetitionLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Semua</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Urutkan Berdasarkan
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="score">Skor</option>
                  <option value="search_volume">Volume Pencarian</option>
                  <option value="created_at">Tanggal Dibuat</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Urutan:
                </label>
                <button
                  onClick={() => setSortOrder('desc')}
                  className={`px-3 py-1 text-sm rounded ${
                    sortOrder === 'desc'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  Descending
                </button>
                <button
                  onClick={() => setSortOrder('asc')}
                  className={`px-3 py-1 text-sm rounded ${
                    sortOrder === 'asc'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  Ascending
                </button>
              </div>
              <Button onClick={handleReset} variant="ghost" size="sm">
                <X className="h-4 w-4 mr-1" />
                Reset Filter
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <LoadingSkeleton key={i} className="h-48" />
          ))}
        </div>
      ) : niches.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600 dark:text-gray-400">
            Tidak ada niche ditemukan. Coba sesuaikan filter Anda.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Menampilkan {niches.length} dari {totalCount} niche
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {niches.map((niche) => (
              <div
                key={niche.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {niche.niche_name}
                </h3>

                <div className="space-y-3">
                  <ScoreCard score={niche.score} size="sm" />
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Volume</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {niche.search_volume.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">CPM</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        ${niche.estimated_cpm}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Kompetisi</p>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {niche.competition_level}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Trend 7d</p>
                      <p className={`font-medium ${
                        niche.trend_7d > 0 ? 'text-green-600' : niche.trend_7d < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {niche.trend_7d > 0 ? '+' : ''}{niche.trend_7d.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Dibuat: {new Date(niche.created_at).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {page} of {totalPages}
              </span>

              <Button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
