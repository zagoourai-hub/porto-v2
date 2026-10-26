# Portfolio v2

## Validasi

Jalankan `pnpm lint --max-warnings 0` dan `pnpm build`, lalu `pnpm test:auth` untuk menguji registrasi, login, sesi, akses dashboard, dan logout. Tes autentikasi memerlukan Node.js 22.13+ serta hasil build terbaru, memakai database SQLite sementara, dan tidak mengubah database aplikasi. Atur `NODE_ENV=production` saat build bila sesi terminal menetapkannya ke `development`.

## Menjalankan dengan Docker

1. Salin `.env.example` menjadi `.env`, lalu isi `BETTER_AUTH_SECRET` dan `OPENROUTER_API_KEY` sesuai kebutuhan.
2. Jalankan:

   ```bash
   docker compose up --build -d
   ```

3. Buka <http://localhost:3000>. Data SQLite disimpan pada named volume `portfolio-data` dan tetap ada saat container dibuat ulang.

Untuk menghentikan aplikasi, jalankan `docker compose down`. Gunakan `docker compose down -v` hanya jika ingin menghapus database persisten.
