# Sheet Pusat Omzet — Pizza Nyantuy

## File di Google Drive (folder "Monitoring Omzet", TIDAK dibagikan)
- Folder: https://drive.google.com/drive/folders/16W-abmkaksvXb9rhqFg6q7z3qx7zD871
- Rekap Omzet (Master): https://docs.google.com/spreadsheets/d/13cjUgqJ059e6HOaQSbJlRNu5I6io4og7KVWuuPX0Bt4/edit
  tab: rekap_mingguan, rekap_bulanan, rekap_tahunan, outlet, target, target_channel, config, log
- Data Omzet Harian 2025: https://docs.google.com/spreadsheets/d/1sOGqc9MVxiIy69lZKfDWdiPFxe3rJoC37d_eSkjBn1Q/edit (93 baris, Des 2025)
- Data Omzet Harian 2026: https://docs.google.com/spreadsheets/d/1Z6YkLIv3e4S83D-Ft-cn6WRv8UtLoLeW-WpMaRl35zI/edit (1.769 baris, Jan–26 Okt)

## Kenapa 1 file per tahun + 1 master
Batas Google Sheets 10 juta sel. 20 outlet × 366 hari × 40 kolom ≈ 293 rb sel/tahun → 30 tahun ≈ 8,8 jt sel
kalau disatukan (mepet batas, dan n8n jadi lambat membaca semuanya tiap 30 menit). Per tahun cuma ±2–6% batas.
Dashboard cukup baca master (rekap_mingguan / rekap_bulanan sudah berisi target, achieve, peringkat) → 1–2 node Baca.

## Langkah Nana
1. Bagikan "Rekap Omzet (Master)", "Data Omzet Harian 2025" dan "Data Omzet Harian 2026" ke email Service Account
   (credential "Google Service Account account") sebagai EDITOR. 7 file kasir cukup Viewer (sudah dipakai flow lain).
2. n8n → Import from File → n8n-qc-sinkron-kasir-nana.json → cek credential di node Sheets → Execute sekali.
3. Cek tab log di master: baris pertama harus "baru 0 / berubah …" atau tidak ada log kalau semua sama (itu normal).
4. Aktifkan flow (tiap 30 menit).
5. Tiap bulan isi tab target (key BULAN|KODE). Tiap akhir tahun: buat "Data Omzet Harian <tahun>"
   (salin file tahun ini, kosongkan isi tab data kecuali judul) lalu isi config data_file_<tahun>.

## Aturan sinkron
- Kunci baris: key = KODE|YYYY-MM-DD. row_hash beda → ditimpa; sama → dilewati.
- Status terverifikasi / kunci di sheet pusat TIDAK ditimpa → dicatat di log (detail sekali sehari jam 07 WITA).
- Tgl 1–7: tab arsip bulan lalu (format {Bulan}{Tahun}, mis. Oktober2026) ikut disinkron.
- Sheet pusat gagal dibaca → tidak menulis apa pun, hanya log.
- omzet = tunai + qris + ojol (tanpa ongkir).

## Online Organik / Online Ads / Live Shopping (tab OnlineHarian admin) — TAMBAHAN MANUAL
Flow sinkron baru membaca tab **OnlineHarian** di tiap file kasir (diisi admin, lihat panduan-tab-OnlineHarian.md).
Agar tersimpan, tambahkan 6 judul kolom di **baris 1 tab data** pada **Data Omzet Harian 2025** dan **2026**,
tepat SETELAH kolom `synced_at` (AH) — ketik persis (huruf kecil, garis bawah):

| Kolom | Judul | Isi |
|---|---|---|
| AI | ch_organik | Online Organik dari admin (Rp) |
| AJ | ch_ads | Online Ads dari admin (Rp) |
| AK | ch_online | total online = organik+ads+live (admin) atau WhatsApp kasir (cadangan) |
| AL | ch_online_sumber | `admin` / `kasir` (format kolom: Teks biasa) |
| AM | ch_selisih_online | (organik+ads+live) − WhatsApp kasir |
| AN | ch_live | Live Shopping dari admin (Rp) — **baru, versi skema 3 (40 kolom)** |

- Kolom ch_whatsapp tetap ada (angka asli kasir). Angka admin = acuan pemisahan; hari admin belum isi → ch_online = WhatsApp kasir (ch_online_sumber = kasir).
- Kalau kolom belum ditambah: flow tetap jalan normal, data online tidak disimpan, dan log mencatat "kolom belum ada".
- Sudah menambah AI–AM sebelumnya? Cukup tambah **`ch_live` di AN** pada kedua file (2025 dan 2026). Flow menulis berdasarkan judul kolom, jadi urutan aman.
- Kalau `ch_live` belum ditambah: Live Shopping tetap masuk ke ch_online, tetapi tidak tersimpan terpisah; log mencatat "kolom ch_live belum ada" dan dashboard menampilkan "kolom ch_live belum ada" (bukan 0).
- Opsional: tab rekap_mingguan/rekap_bulanan/rekap_tahunan di master boleh ditambah judul `ch_organik`, `ch_ads`, `ch_online`, `hari_online_admin`, `ch_live` di kolom kosong paling kanan (tidak wajib; dashboard membaca tab data).
- Tab OnlineHarian belum ada / gagal dibaca di suatu outlet → hanya dicatat sebagai "gagal (opsional)", sinkron omzet tetap ok.
- Data online tidak ikut row_hash dan tetap diperbarui walau baris berstatus terverifikasi/kunci (angka kas tetap dikunci).

## Target channel di dashboard
- Terukur langsung: Takeaway Outlet (Offline kasir), Online Organik, Online Ads, **Live Shopping** (admin, kolom ch_live), Ojol (kasir).
- Live Shopping target 2% (Okt 2026: Rp22.680.000). % capaian tampil hanya bila cakupan admin 100% hari ber-omzet.
- CRM tetap **tidak terukur** (tidak dicatat kasir maupun admin).
