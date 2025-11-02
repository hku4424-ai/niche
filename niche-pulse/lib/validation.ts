import { z } from 'zod';

// Niche analysis input validation
export const nicheAnalysisSchema = z.object({
  query: z.string().min(2, 'Query minimal 2 karakter').max(100, 'Query maksimal 100 karakter'),
  language: z.string().length(2, 'Kode bahasa harus 2 karakter').default('id'),
  country: z.string().length(2, 'Kode negara harus 2 karakter').default('ID'),
});

export type NicheAnalysisInput = z.infer<typeof nicheAnalysisSchema>;

// Channel analysis input validation
export const channelAnalysisSchema = z.object({
  channelId: z.string().min(10, 'Channel ID tidak valid').max(50, 'Channel ID terlalu panjang'),
});

export type ChannelAnalysisInput = z.infer<typeof channelAnalysisSchema>;

// Idea generation input validation
export const ideaGenerationSchema = z.object({
  niche: z.string().min(2, 'Niche minimal 2 karakter').max(100, 'Niche maksimal 100 karakter'),
  language: z.string().length(2, 'Kode bahasa harus 2 karakter').default('id'),
  count: z.number().min(1).max(10).default(5),
});

export type IdeaGenerationInput = z.infer<typeof ideaGenerationSchema>;

// Save niche input validation
export const saveNicheSchema = z.object({
  niche_name: z.string().min(2).max(100),
  score: z.number().min(0).max(100),
  search_volume: z.number().min(0),
  competition_level: z.enum(['low', 'medium', 'high']),
  estimated_cpm: z.number().min(0),
  trend_7d: z.number(),
  trend_30d: z.number(),
  metadata: z.record(z.any()).optional(),
});

export type SaveNicheInput = z.infer<typeof saveNicheSchema>;

// Explorer filters validation
export const explorerFiltersSchema = z.object({
  tags: z.array(z.string()).optional(),
  languages: z.array(z.string().length(2)).optional(),
  countries: z.array(z.string().length(2)).optional(),
  minScore: z.number().min(0).max(100).optional(),
  maxScore: z.number().min(0).max(100).optional(),
  competitionLevel: z.enum(['low', 'medium', 'high']).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  sortBy: z.enum(['score', 'search_volume', 'created_at']).default('score'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export type ExplorerFilters = z.infer<typeof explorerFiltersSchema>;

// Validate and sanitize input
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { 
  success: boolean; 
  data?: T; 
  error?: string 
} {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return { 
        success: false, 
        error: firstError.message 
      };
    }
    return { success: false, error: 'Validasi gagal' };
  }
}

// API response validation
export const apiResponseSchema = z.object({
  data: z.any().optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }).optional(),
  cached: z.boolean().optional(),
});

export type ApiResponse<T> = {
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  cached?: boolean;
};
