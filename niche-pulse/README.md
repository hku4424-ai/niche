# Niche Pulse

Platform analisis tren niche YouTube secara real-time dengan skor peluang 0-100, tren 7-30 hari, volume pencarian, tingkat kompetisi, dan estimasi CPM.

## Fitur Utama

- **Analisis Niche**: Skor peluang 0-100 berdasarkan algoritma komprehensif dengan bobot dinamis
- **API Fallback**: Automatic fallback ke Serp API saat YouTube API quota exceeded
- **Channel Analyzer**: Analisis mendalam performa channel YouTube
- **Idea Generator**: Generate ide konten video dengan judul, outline, hook, dan CTA
- **Niche Explorer**: Filter dan explore niche dengan multi-kriteria (skor, kompetisi, volume)
- **Saved Niches**: Simpan dan kelola niche favorit
- **Real-time Data**: Integrasi YouTube Data API v3 untuk data terkini
- **Smart Caching**: Sistem caching dengan auto-cleanup setiap 6 jam via cron job
- **Input Validation**: Zod schema validation untuk semua input forms
- **Dynamic Scoring**: Algoritma scoring yang dapat dikonfigurasi via database
- **Responsive Design**: Interface modern yang works di desktop dan mobile

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions, Storage)
- **External APIs**: YouTube Data API v3
- **Deployment**: Docker Compose + Nginx

## Prerequisites

- Node.js 20+ (untuk development)
- Docker & Docker Compose (untuk deployment)
- Account Supabase (sudah dikonfigurasi)
- YouTube Data API v3 Key

## Setup Development

### 1. Install Dependencies

```bash
cd niche-pulse
pnpm install
```

### 2. Konfigurasi Environment Variables

Copy file `.env.example` ke `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` dan isi dengan kredensial yang sesuai:

```env
# Supabase (sudah dikonfigurasi)
NEXT_PUBLIC_SUPABASE_URL=https://lhprpegxgkrksoyezawf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# YouTube Data API v3 (WAJIB diisi)
YOUTUBE_API_KEY=your_youtube_api_key_here

# Optional: Serp API (fallback)
SERP_API_KEY=your_serp_api_key_here
```

### 3. Cara Mendapatkan YouTube API Key

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang sudah ada
3. Aktifkan YouTube Data API v3:
   - Navigation Menu > APIs & Services > Library
   - Cari "YouTube Data API v3"
   - Klik "Enable"
4. Buat API Key:
   - Navigation Menu > APIs & Services > Credentials
   - Klik "Create Credentials" > "API Key"
   - Copy API key dan paste ke `.env.local`
5. (Opsional) Restrict API key untuk keamanan:
   - Edit API key
   - Application restrictions: HTTP referrers atau IP addresses
   - API restrictions: Restrict key > YouTube Data API v3

### 4. Run Development Server

```bash
pnpm dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## Database Schema

Database schema sudah di-setup di Supabase dengan tabel berikut:

- `searches`: Riwayat pencarian user
- `saved_niches`: Niche yang disimpan user
- `ideas`: Ide konten yang di-generate
- `channel_snapshots`: Historical data channel
- `cache_niche`: Cache hasil analisis niche
- `cache_channel`: Cache hasil analisis channel
- `scoring_config`: Konfigurasi bobot algoritma scoring (dinamis)

Row Level Security (RLS) sudah dikonfigurasi untuk semua tabel.

## Edge Functions

Edge functions yang sudah di-deploy:

1. **analyze-niche**: Analisis niche dengan YouTube API + Serp API fallback + dynamic scoring
2. **analyze-channel**: Analisis channel YouTube
3. **generate-ideas**: Generate ide konten video
4. **purge-cache**: Cron job untuk cleanup cache expired (runs every 6 hours)

### Menambahkan YouTube API Key ke Edge Functions

Edge functions akan otomatis menggunakan environment variable `YOUTUBE_API_KEY` dari Supabase. Untuk menambahkan:

1. Login ke Supabase Dashboard
2. Pilih project Anda
3. Settings > Edge Functions > Environment variables
4. Tambahkan variable baru:
   - Name: `YOUTUBE_API_KEY`
   - Value: your_youtube_api_key_here
5. Restart edge functions (automatic)

## Deployment ke VPS

### 1. Persiapan VPS

Update sistem dan install Docker:

```bash
# Update package list
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Clone Repository

```bash
git clone <repository-url>
cd niche-pulse
```

### 3. Konfigurasi Environment

Create `.env` file di root directory:

```bash
cp .env.example .env
```

Edit `.env` dan isi semua kredensial:

```env
NEXT_PUBLIC_SUPABASE_URL=https://lhprpegxgkrksoyezawf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here
SERP_API_KEY=your_serp_api_key_here
```

### 4. Build dan Run dengan Docker

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f niche-pulse
```

### 5. Setup SSL dengan Let's Encrypt (Opsional tapi Direkomendasikan)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Dapatkan SSL certificate
sudo certbot certonly --standalone -d your-domain.com

# Copy certificates ke project
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./ssl/

# Edit nginx.conf dan uncomment SSL server block
# Update server_name dengan domain Anda
```

### 6. Setup Auto-renewal SSL

```bash
# Edit crontab
sudo crontab -e

# Add renewal job (check every day at 2am)
0 2 * * * certbot renew --quiet --post-hook "docker-compose restart nginx"
```

### 7. Configure Firewall

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Monitoring & Maintenance

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f niche-pulse
docker-compose logs -f nginx
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart niche-pulse
```

### Update Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d
```

### Database Backup

```bash
# Manual backup via Supabase Dashboard
# Or use pg_dump with connection string
```

## Troubleshooting

### YouTube API Quota Exceeded

- Implementasi caching sudah ada (6 jam untuk niche, 12 jam untuk channel)
- Monitor usage di Google Cloud Console
- Gunakan fallback API jika available

### Edge Function Errors

1. Check logs di Supabase Dashboard
2. Verify environment variables
3. Test dengan `curl`:

```bash
curl -X POST https://lhprpegxgkrksoyezawf.supabase.co/functions/v1/analyze-niche \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_anon_key" \
  -d '{"query":"teknologi AI","language":"id","country":"ID"}'
```

### Database Connection Issues

- Verify Supabase credentials di `.env`
- Check RLS policies di Supabase Dashboard
- Ensure user is authenticated untuk protected operations

### Docker Issues

```bash
# Remove all containers and rebuild
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

## API Quota Management

YouTube Data API v3 memiliki quota limit. Best practices:

1. **Gunakan Caching**: System sudah implement caching otomatis
2. **Monitor Usage**: Check di Google Cloud Console
3. **Optimize Queries**: Gunakan parameter yang efisien
4. **Rate Limiting**: Implementasi sudah ada di nginx.conf

## Security Checklist

- [ ] Ganti semua default credentials
- [ ] Enable SSL/HTTPS
- [ ] Set proper CORS di Supabase
- [ ] Review RLS policies
- [ ] Restrict API keys (HTTP referrers atau IP)
- [ ] Enable firewall
- [ ] Regular security updates
- [ ] Monitor logs untuk suspicious activity

## Performance Optimization

- Caching: 6 jam (niche), 12 jam (channel)
- Nginx gzip compression
- Next.js automatic optimization
- Database indexes untuk query performance
- Rate limiting untuk prevent abuse

## License

MIT License

## Support

Untuk pertanyaan atau issues, silakan buat issue di repository ini.


## Advanced Features

### 1. API Fallback Strategy

Aplikasi menggunakan strategi fallback untuk memastikan service availability:

**Primary API**: YouTube Data API v3
- Full video statistics
- Channel data
- Search results
- Real-time metrics

**Fallback API**: Serp API
- Aktivasi otomatis saat YouTube quota exceeded
- Parsing video views dari search results
- Estimasi metrics berdasarkan available data

**Configuration**:
```env
YOUTUBE_API_KEY=your_youtube_key  # Primary
SERP_API_KEY=your_serp_key       # Fallback (optional)
```

### 2. Dynamic Scoring Algorithm

Algoritma scoring menggunakan konfigurasi dinamis yang tersimpan di database:

**Default Weights**:
- View Score: 30%
- Engagement: 25%
- Competition: 25%
- Freshness: 20%

**Adjust Scoring via SQL**:
```sql
UPDATE scoring_config 
SET 
  view_score_weight = 35,
  engagement_weight = 30,
  competition_weight = 20,
  freshness_weight = 15,
  view_threshold = 15000,
  low_competition_threshold = 150,
  medium_competition_threshold = 600
WHERE config_name = 'default';
```

**Scoring Formula**:
```
Score = (AvgViews/Threshold * ViewWeight) + 
        (EngagementRate * EngagementWeight) +
        (CompetitionScore * CompetitionWeight) +
        (FreshnessScore * FreshnessWeight)
```

### 3. Input Validation with Zod

Semua input divalidasi menggunakan Zod schemas:

**Niche Analysis**:
- Query: 2-100 characters
- Language: 2-char code (id, en, ms)
- Country: 2-char code (ID, US, MY, SG)

**Channel Analysis**:
- Channel ID: 10-50 characters

**Explorer Filters**:
- Score range: 0-100
- Competition level: low, medium, high
- Sorting: score, search_volume, created_at
- Pagination: max 100 items per page

### 4. Automated Cache Management

**Cron Job Configuration**:
- Schedule: Every 6 hours (0 */6 * * *)
- Function: purge-cache
- Action: Delete expired cache entries
- Configuration: `/workspace/supabase/cron_jobs/job_1.json`

**Cache Duration**:
- Niche analysis: 6 hours
- Channel analysis: 12 hours

**Manual Purge** (if needed):
```bash
curl -X POST https://your-supabase-url/functions/v1/purge-cache \
  -H "Content-Type: application/json"
```

### 5. Niche Explorer Features

**Filtering**:
- Text search by niche name
- Score range (min/max)
- Competition level filter
- Date range (coming soon)

**Sorting**:
- By score (highest/lowest)
- By search volume
- By creation date

**Pagination**:
- 20 items per page
- Previous/Next navigation
- Total count display

## Performance Optimization

### Caching Strategy
1. **First Request**: Hit API, cache result for 6 hours
2. **Cached Request**: Return cached data instantly
3. **Expired Cache**: Auto-purge by cron job, new request hits API

### Database Indexes
Optimized queries dengan indexes:
- `searches`: user_id, created_at
- `saved_niches`: user_id, score
- `cache_niche`: cache_key, expires_at
- `cache_channel`: cache_key, expires_at

### API Quota Management
- Smart caching mengurangi API calls hingga 90%
- Fallback API mencegah service downtime
- Rate limiting di Nginx (10 req/s per IP)

## Customization Guide

### Mengubah Scoring Weights

1. **Via Database**:
```sql
-- Lihat config saat ini
SELECT * FROM scoring_config WHERE config_name = 'default';

-- Update weights
UPDATE scoring_config 
SET 
  view_score_weight = 40,
  engagement_weight = 20,
  competition_weight = 20,
  freshness_weight = 20
WHERE config_name = 'default';
```

2. **Create New Configuration**:
```sql
INSERT INTO scoring_config (
  config_name,
  view_score_weight,
  engagement_weight,
  competition_weight,
  freshness_weight,
  is_active
) VALUES (
  'aggressive',
  40, 20, 20, 20, false
);
```

### Mengubah Cache Duration

Edit edge function `analyze-niche/index.ts`:
```typescript
// Change from 6 hours to 12 hours
const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();
```

### Mengubah Cron Schedule

```sql
-- Via Supabase SQL editor
SELECT cron.unschedule('purge-cache_invoke');
SELECT cron.schedule('purge-cache_invoke', '0 */3 * * *', 'CALL purge_cache_5b7908ac()');
-- This changes from every 6 hours to every 3 hours
```

## API Integration Guide

### YouTube Data API v3

**Required Scopes**:
- YouTube Data API v3

**Quota Costs**:
- Search: 100 units per request
- Videos.list: 1 unit per request
- Default quota: 10,000 units/day

**Optimization Tips**:
- Use caching to reduce API calls
- Monitor usage in Google Cloud Console
- Consider quota increase for production

### Serp API (Optional)

**Pricing**: Pay per search
**Features**:
- YouTube search scraping
- No quota limits (pay per use)
- Faster response time

**Setup**:
1. Register at https://serpapi.com/
2. Get API key from dashboard
3. Add to Supabase environment variables
4. Test with curl:
```bash
curl "https://serpapi.com/search.json?engine=youtube&search_query=test&api_key=YOUR_KEY"
```

## Monitoring & Debugging

### View Cron Job Status

Supabase Dashboard > Database > Functions:
```sql
SELECT * FROM cron.job WHERE jobname = 'purge-cache_invoke';
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
```

### Check Cache Status

```sql
-- Niche cache stats
SELECT 
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE expires_at > NOW()) as active,
  COUNT(*) FILTER (WHERE expires_at <= NOW()) as expired
FROM cache_niche;

-- Recent cache entries
SELECT cache_key, query, expires_at 
FROM cache_niche 
ORDER BY created_at DESC 
LIMIT 10;
```

### Edge Function Logs

Supabase Dashboard > Edge Functions > Select function > Logs

Or via CLI:
```bash
supabase functions logs analyze-niche
```

## Testing Guide

### 1. Test Niche Analysis (with API key)
```bash
curl -X POST https://your-project.supabase.co/functions/v1/analyze-niche \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"query":"gaming mobile","language":"id","country":"ID"}'
```

### 2. Test API Fallback
Temporarily disable YouTube API key and verify Serp API is used.

### 3. Test Input Validation
Try invalid inputs:
```javascript
// Should fail: query too short
{"query":"a","language":"id","country":"ID"}

// Should fail: invalid language code
{"query":"gaming","language":"indonesia","country":"ID"}
```

### 4. Test Niche Explorer
1. Save multiple niches with different scores
2. Use filters to find specific niches
3. Test sorting by different fields
4. Verify pagination works correctly

### 5. Test Cron Job
```bash
# Trigger manually
curl -X POST https://your-project.supabase.co/functions/v1/purge-cache
```

Check database for deleted expired entries.
