CLOUDFLARE PAGES + D1 — ALERT MASA AKTIF KARTU

ISI FILE
- index.html                 Tampilan aplikasi
- functions/api/cards.js     API Cloudflare Pages Functions
- schema.sql                 Struktur database D1
- wrangler.toml.example      Contoh konfigurasi lokal/deploy CLI

LANGKAH SETUP

A. BUAT DATABASE D1
1. Login ke Cloudflare Dashboard.
2. Masuk ke Storage & Databases > D1 SQL Database.
3. Klik Create database.
4. Nama database: kartu-expired-db.
5. Buka database tersebut > Console.
6. Copy seluruh isi schema.sql, paste ke Console, lalu Execute.

B. BUAT CLOUDFLARE PAGES
Metode termudah untuk project yang memakai folder functions adalah GitHub:
1. Buat repository GitHub baru.
2. Upload index.html, folder functions, schema.sql, dan file lain dari ZIP ini.
3. Di Cloudflare buka Workers & Pages > Create application > Pages.
4. Pilih Import an existing Git repository.
5. Framework preset: None.
6. Build command: kosongkan.
7. Build output directory: /
8. Deploy.

C. HUBUNGKAN D1 KE PAGES
1. Buka project Pages yang sudah dibuat.
2. Masuk Settings > Bindings.
3. Tambah D1 database binding.
4. Variable name WAJIB: DB
5. Pilih database kartu-expired-db.
6. Simpan lalu lakukan deployment ulang.

D. TEST
1. Buka URL *.pages.dev.
2. Tambahkan data.
3. Buka URL yang sama dari perangkat lain.
4. Data akan sama. Halaman melakukan refresh sinkron otomatis setiap 30 detik.

CATATAN KEAMANAN
Versi awal ini belum memakai login. Siapa pun yang mengetahui URL dapat menambah,
mengedit, dan menghapus data. Sebelum dipakai umum, sebaiknya tambahkan login atau
Cloudflare Access.

ALERT
Popup/notifikasi browser bekerja ketika halaman dibuka. Alert otomatis ketika browser
tertutup memerlukan Cloudflare Cron Trigger + email/Telegram/WhatsApp.
