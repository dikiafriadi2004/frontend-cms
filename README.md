# Website Frontend

Next.js frontend application untuk sistem website yang terintegrasi dengan CMS.

## Fitur Utama

- ✅ **Dynamic Menu** - Menu yang dapat dikonfigurasi dari CMS
- ✅ **Dynamic Content** - Konten halaman yang dapat dikelola dari CMS  
- ✅ **Blog System** - Sistem blog terintegrasi
- ✅ **Responsive Design** - Tampilan yang responsif di semua device
- ✅ **SEO Optimized** - Optimasi untuk mesin pencari

## Tech Stack

- **Next.js 16** - React framework dengan App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **CMS Integration** - Headless CMS backend

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` dan sesuaikan dengan konfigurasi CMS Anda:
   ```
   NEXT_PUBLIC_CMS_BASE_URL=http://localhost:8000
   NEXT_PUBLIC_CMS_TOKEN=your_cms_token
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   Buka [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── home/           # Homepage sections
│   ├── layout/         # Layout components (Header, Footer)
│   └── ui/             # Reusable UI components
├── contexts/           # React contexts (API, etc.)
├── lib/                # Utility functions and API calls
└── types/              # TypeScript type definitions
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_CMS_BASE_URL` | CMS base URL | `http://localhost:8000` |
| `NEXT_PUBLIC_CMS_TOKEN` | CMS authentication token | - |
| `ENABLE_FALLBACK_DATA` | Enable fallback data when CMS unavailable | `true` |
| `DEBUG_API_CALLS` | Enable API call debugging | `false` |

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## CMS Integration

Project ini terintegrasi dengan CMS untuk:

- **Menu Management** - Kelola menu navigasi
- **Page Content** - Kelola konten halaman
- **Blog Posts** - Kelola artikel blog
- **Site Settings** - Konfigurasi situs (logo, warna, kontak, dll)

## Deployment

1. **Build project**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## Troubleshooting

### Client-side Exception Error
Jika mengalami error "Application error: a client-side exception has occurred", pastikan:

1. ✅ CMS backend berjalan di URL yang benar
2. ✅ Environment variables sudah dikonfigurasi dengan benar
3. ✅ Tidak ada komponen yang error (sudah diperbaiki dalam versi ini)

### CMS Connection Issues
Jika tidak bisa terhubung ke CMS:

1. Cek apakah CMS backend berjalan
2. Pastikan `NEXT_PUBLIC_CMS_BASE_URL` benar
3. Periksa CORS settings di CMS backend
4. Aktifkan `ENABLE_FALLBACK_DATA=true` untuk development

## License

MIT License