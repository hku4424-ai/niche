'use client';

import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { supabase, type VideoIdea } from '@/lib/supabase';
import { Button, LoadingSkeleton } from '@/components/ui';

export default function IdeasPage() {
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<VideoIdea[]>([]);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche.trim()) {
      setError('Masukkan niche');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: apiError } = await supabase.functions.invoke('generate-ideas', {
        body: { niche }
      });

      if (apiError) throw apiError;
      if (data?.error) throw new Error(data.error.message);

      setIdeas(data.data.ideas);
    } catch (err: any) {
      setError(err.message || 'Gagal generate ide');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Generator Ide Konten
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6 mb-8">
        <form onSubmit={handleGenerate}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Niche
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="Masukkan niche"
              className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
            <Button type="submit" isLoading={loading}>
              Generate Ide
            </Button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {loading && <LoadingSkeleton className="h-96 w-full" />}

      {ideas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ideas.map((idea, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
              <div className="flex items-start gap-3 mb-4">
                <Lightbulb className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {idea.title}
                </h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Hook:</p>
                  <p className="text-gray-600 dark:text-gray-400">{idea.hook}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Outline:</p>
                  <pre className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{idea.outline}</pre>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">CTA:</p>
                  <p className="text-gray-600 dark:text-gray-400">{idea.cta}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {idea.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
