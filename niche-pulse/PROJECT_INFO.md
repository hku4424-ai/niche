## Informasi Project

**Nama**: Niche Pulse
**Versi**: 1.0.0
**Status**: Production Ready

### Supabase Configuration

- **Project ID**: lhprpegxgkrksoyezawf
- **URL**: https://lhprpegxgkrksoyezawf.supabase.co
- **Region**: Asia Pacific

### Database Tables

Semua tabel sudah dibuat dengan RLS policies:
- searches
- saved_niches
- ideas
- channel_snapshots
- cache_niche
- cache_channel

### Edge Functions Deployed

1. **analyze-niche** - Analisis niche dengan scoring
2. **analyze-channel** - Analisis channel YouTube
3. **generate-ideas** - Generate ide konten video

### Storage Buckets

- **exports** - Bucket untuk export files (CSV, JSON, thumbnails)
  - Public access enabled
  - File size limit: 10MB
  - Allowed types: CSV, JSON, PNG, JPEG

## Yang Perlu Dilakukan User

### 1. Tambahkan YouTube API Key

**Ke Supabase Edge Functions:**
1. Login ke Supabase Dashboard
2. Settings > Edge Functions > Environment variables
3. Tambahkan: `YOUTUBE_API_KEY` = your_key_here

**Ke Local Development:**
1. Edit file `.env.local`
2. Set `YOUTUBE_API_KEY=your_key_here`

**Cara mendapatkan YouTube API Key:**
- Buka https://console.cloud.google.com/
- Buat/pilih project
- Enable YouTube Data API v3
- Create Credentials > API Key

### 2. Deploy ke VPS

**Quick Deploy:**
```bash
# 1. Clone project ke VPS
git clone <repo-url>
cd niche-pulse

# 2. Copy dan edit environment file
cp .env.example .env
nano .env  # Edit dan isi semua credentials

# 3. Run deploy script
chmod +x deploy.sh
./deploy.sh
```

**Manual Deploy:**
```bash
docker-compose build
docker-compose up -d
```

### 3. Setup SSL (Opsional tapi Recommended)

```bash
# Install certbot
sudo apt install certbot

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Copy to project
sudo mkdir -p ssl
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/

# Edit nginx.conf - uncomment SSL section
# Restart nginx
docker-compose restart nginx
```

## Testing Checklist

- [ ] Dashboard - Analisis niche working
- [ ] Channel Analyzer - Analisis channel working
- [ ] Idea Generator - Generate ide working
- [ ] Saved Niches - Save/delete working
- [ ] Authentication - Signup/signin working
- [ ] API responses - All endpoints responding correctly

## Monitoring

**View Logs:**
```bash
docker-compose logs -f niche-pulse
```

**Check Status:**
```bash
docker-compose ps
```

**Restart Services:**
```bash
docker-compose restart
```

## Support

Jika ada masalah:
1. Check logs: `docker-compose logs -f`
2. Verify API keys sudah benar
3. Check Supabase RLS policies
4. Review troubleshooting guide di README.md

## Next Steps

1. Tambahkan YouTube API key
2. Deploy ke VPS
3. Setup SSL certificate
4. Test all features
5. Monitor performance
6. Setup backup strategy
