# Panduan Tab **OnlineHarian** (diisi Admin) — Pizza Nyantuy

Tujuan: admin mencatat omzet online harian per outlet, dipisah **Online Organik**, **Online Ads**, dan **Live Shopping** (wajib diisi admin).
Flow n8n "Sinkron Kasir" membaca tab ini dari 7 file kasir. Angka admin menjadi acuan pemisahan online.
Kolom **Whatsapp** di tab ChannelHarian kasir **tetap diisi kasir seperti biasa**, sebagai cadangan dan pembanding.

> Dibuat oleh Nana (pemilik file). Kerjakan dulu di 1 file outlet, cek, lalu salin ke 6 file lainnya (langkah 9).

## 1. Buat tab
- Buka file kasir outlet, klik **+** (kiri bawah), lalu beri nama tab persis **`OnlineHarian`** (tanpa spasi; huruf O dan H besar).
- Nama tab dan judul kolom **harus sama persis di ketujuh outlet**.

## 2. Judul kolom (baris 1)
| Sel | Judul (ketik persis) | Diisi oleh |
|---|---|---|
| A1 | `Tanggal` | sudah terisi (dikunci) |
| B1 | `Online Organik` | **admin** |
| C1 | `Online Ads` | **admin** |
| D1 | `Live Shopping` | **admin** |
| E1 | `Total Online` | rumus (dikunci) |
| F1 | `Selisih vs WhatsApp kasir` | rumus (dikunci) |

Jangan menambah kolom lain di antara A–F. Catatan admin boleh ditaruh di kolom H ke kanan.
Sistem membaca kolom **berdasarkan judul**, jadi judul harus persis seperti di atas.

> **Sudah punya tab versi lama (A–E tanpa Live Shopping)?** Klik kanan kolom **D** → **Sisipkan 1 kolom di kiri**, ketik `Live Shopping` di D1,
> lalu ganti rumus E2 dan F2 dengan rumus di langkah 4 dan salin ke bawah. Perbarui juga rentang validasi (langkah 6) dan proteksi (langkah 8) di ketujuh file.

## 3. Isi tanggal 1 Okt 2026 – 31 Mar 2027 (baris 2–183)
1. Di **A2** ketik: `=DATE(2026;10;1)+ROW()-2`
2. Salin A2 ke bawah sampai **A183**. Caranya: klik A2, lalu Ctrl+C. Pilih A3:A183 (ketik `A3:A183` di kotak nama kiri atas, lalu Enter), lalu Ctrl+V. A183 harus menampilkan 31/03/2027.
3. Ubah rumus menjadi nilai tetap. Pilih A2:A183, tekan Ctrl+C, lalu **Ctrl+Shift+V** (tempel nilai saja).
4. Format tanggal: pilih kolom A, lalu **Format → Angka → Tanggal dan waktu kustom**, lalu ketik `dd/MM/yyyy` dan Terapkan.

## 4. Rumus (locale Indonesia memakai titik koma `;`)
- **E2** (Total Online = Organik + Ads + Live Shopping):
  `=IF(COUNT(B2:D2)=0;"";SUM(B2:D2))`
- **F2** (Selisih vs WhatsApp kasir; kosong bila admin atau kasir belum isi):
  `=IF(E2="";"";LET(w;IFNA(XLOOKUP(A2;ChannelHarian!$A$2:$A;ChannelHarian!$B$2:$B);"");IF(w="";"";E2-w)))`
- Salin E2:F2 ke bawah sampai baris **183**.
- Contoh: Organik 1.900.000 + Ads 900.000 + Live 117.000 = Total 2.917.000; WhatsApp kasir 2.917.000 → Selisih 0.
- Artinya: F = 0 berarti angka admin sama dengan WhatsApp kasir. Plus berarti admin lebih besar, minus berarti lebih kecil.
  (ChannelHarian kolom A = Tanggal, kolom B = Whatsapp.)
- Kalau muncul #ERROR!, cek pemisah: locale file harus Indonesia (**File → Setelan → Lokal: Indonesia**). Kalau lokalnya English (US), ganti `;` dengan `,`.

## 5. Format angka
- Pilih **B2:F183**, lalu **Format → Angka → Format angka kustom**, ketik `#,##0` dan Terapkan. Dengan lokal Indonesia, angka tampil sebagai 1.250.000.
- Admin cukup mengetik angka polos, misalnya `1250000`, tanpa "Rp" dan tanpa titik.

## 6. Validasi (angka ≥ 0, tolak input salah)
1. Pilih **B2:D183**, lalu buka **Data → Validasi data → Tambahkan aturan**.
2. Kriteria: **Lebih dari atau sama dengan**, nilai `0`.
3. **Opsi lanjutan**: aktifkan **Tampilkan teks bantuan** dengan isi "Isi angka Rupiah tanpa titik, ≥ 0. Kosongkan kalau belum ada data." Lalu pilih **Jika data tidak valid: Tolak input**.
4. Klik Selesai.
5. Tambahkan aturan kedua untuk **A2:A183**: Kriteria **Tanggal yang valid**, lalu **Jika data tidak valid: Tolak input**. (Kolom A juga dikunci di langkah 8; aturan ini pengaman tambahan.)

## 7. Bekukan baris 1
**Tampilan → Bekukan → 1 baris**.

## 8. Proteksi: hanya admin yang bisa mengisi B–D; A, E, F dan judul dikunci
Pastikan dulu email admin punya akses **Editor** ke file kasir (tombol Bagikan). Akun Service Account cukup tetap Viewer.
Lalu buka **Data → Lindungi sheet dan rentang**:
1. **Rentang terkunci (A, E, F, dan judul)**
   - Tambahkan rentang `OnlineHarian!A1:F1`, `OnlineHarian!A2:A183`, dan `OnlineHarian!E2:F183` (pakai "Tambahkan rentang lain").
   - Deskripsi: "OnlineHarian terkunci".
   - Setel izin: **Batasi siapa yang dapat mengedit → Hanya Anda**.
2. **Rentang isian admin**
   - Tambahkan rentang `OnlineHarian!B2:D183` dengan deskripsi "OnlineHarian admin".
   - Setel izin: **Kustom**, lalu centang/isi hanya **email admin** (dan Anda). Hapus kasir dan editor lain dari daftar.

Hasilnya: kasir tidak bisa mengubah OnlineHarian, admin hanya bisa mengisi B–D, dan tanggal, rumus, serta judul aman.

## 9. Salin ke 7 outlet (nama tab dan judul identik)
1. Di file yang sudah jadi, klik kanan tab **OnlineHarian**, pilih **Salin ke → Spreadsheet yang ada**, lalu pilih file kasir outlet berikutnya.
2. Di file tujuan, tab akan bernama "Salinan OnlineHarian". **Ganti nama** menjadi persis `OnlineHarian`.
3. Rumus, format, validasi, dan baris beku ikut tersalin. Rumus F otomatis membaca tab ChannelHarian di file tujuan, jadi cek satu sel F yang kasirnya sudah isi.
4. **Proteksi TIDAK ikut tersalin.** Ulangi langkah 8 di setiap file, dan pastikan admin punya akses Editor ke file tersebut.
5. Ulangi untuk ketujuh outlet: Sungai Poso, Gowa, Sudiang, Barombong, Limbung, Pare-Pare, Tamalate.

## 10. Cara admin mengisi (setiap hari)
- Cari baris tanggal hari itu, lalu isi **Online Organik** (pesanan online tanpa iklan), **Online Ads** (pesanan dari iklan), dan **Live Shopping** (pesanan dari siaran live).
  Ketiganya **wajib** diisi tiap hari. Isi dalam Rupiah, dengan cara hitung yang sama seperti kasir mengisi kolom Whatsapp (tanpa ongkir).
- Kalau salah satu memang tidak ada pesanan (misalnya hari itu tidak live), isi `0`. Kalau hanya sebagian kolom diisi, sistem menganggap kolom lainnya 0.
- Biarkan **kosong** kalau belum direkap. Dashboard akan menampilkan "belum diisi admin", dan WhatsApp kasir dipakai sementara sebagai "Online belum dipisah".
- Angka boleh dikoreksi kapan saja. Sinkron berikutnya (tiap 30 menit) ikut memperbarui. Menghapus isi satu tanggal mengembalikan tanggal itu ke angka WhatsApp kasir.
- Tanggal yang belum terjadi diabaikan sistem.
- Kolom F yang tidak 0 berarti ada selisih dengan WhatsApp kasir; cek bersama kasir.

## 11. Setelah 31 Mar 2027
Nana menambah tanggal lanjutan dengan langkah 3 (mulai dari baris 184). Lalu salin rumus E:F ke bawah dan perluas rentang validasi dan proteksi.

## 12. Ke mana angka ini masuk
Flow Sinkron Kasir menyimpan angka admin di **Data Omzet Harian** (per tahun): `ch_organik` (AI), `ch_ads` (AJ), `ch_online` (AK = Organik+Ads+Live),
`ch_online_sumber` (AL), `ch_selisih_online` (AM = Total Online − WhatsApp kasir), dan **`ch_live` (AN)**.
Judul `ch_live` di kolom AN harus ditambah Nana sekali (lihat README-sheet-pusat.md). Sebelum ditambah, Live Shopping tetap masuk ke total online
tetapi belum tersimpan terpisah, dan dashboard menampilkan "kolom ch_live belum ada".
