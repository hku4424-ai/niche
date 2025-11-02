'use client';

import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { supabase, type SavedNiche } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { ScoreCard, MetricCard, Button } from '@/components/ui';

export default function SavedPage() {
  const { user } = useAuth();
  const [niches, setNiches] = useState<SavedNiche[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSavedNiches();
    }
  }, [user]);

  const loadSavedNiches = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_niches')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNiches(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus niche ini?')) return;

    try {
      const { error } = await supabase
        .from('saved_niches')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setNiches(niches.filter(n => n.id !== id));
    } catch (err: any) {
      alert('Gagal menghapus: ' + err.message);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Silakan Login</h2>
        <p>Anda perlu login untuk melihat niche yang disimpan</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Niche Tersimpan
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : niches.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600 dark:text-gray-400">Belum ada niche yang disimpan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {niches.map((niche) => (
            <div key={niche.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {niche.niche_name}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(niche.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ScoreCard score={niche.score} size="sm" />
                <div className="space-y-2">
                  <MetricCard
                    label="Volume"
                    value={niche.search_volume.toLocaleString()}
                    className="text-sm"
                  />
                  <MetricCard
                    label="CPM"
                    value={`$${niche.estimated_cpm}`}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
