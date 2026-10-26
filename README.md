# Monitoring Omzet – Pizza Nyantuy

Dashboard statis (HTML + Chart.js) untuk memantau omzet outlet Pizza Nyantuy. Data diambil lewat webhook n8n yang membaca Google Sheets (sheet pusat, penutupan kasir, Target Control).

## Tab di dashboard (`monitoring-omzet.html`)

- **Per Outlet** – target vs realisasi tiap outlet, per minggu / per bulan / kumulatif.
- **Per Channel** – target vs realisasi per channel dari tab CONTROL DASHBOARD; filter Per Bulan dan Tahunan (perbandingan bulanan, % Capaian atau Realisasi).
- **Channel per Outlet** – realisasi per channel (Online Organik, Online Ads, Takeaway, Live Shopping, Ojol) untuk tiap outlet; filter Per Bulan / Tahunan dan pilihan outlet.
- **Omzet Tahunan** – grafik omzet Januari–Desember per tahun, dengan garis target dan pertumbuhan per bulan.

`monitoring-omzet-lanjutan.html` adalah versi tampilan sebelumnya/lanjutan.

## Menjalankan lokal

Di PowerShell (Windows):

```powershell
powershell -ExecutionPolicy Bypass -File .\serve-local.ps1
```

Lalu buka `http://localhost:8081/monitoring-omzet.html`.

Alternatif server statis lain di port 8081, misalnya `npx serve -l 8081 .` atau `python -m http.server 8081`.

## Flow n8n

Impor file JSON di bawah ke n8n, sambungkan credential Google Service Account, lalu aktifkan. Sheet yang dibaca harus dibagikan (Viewer) ke email service account tersebut.

| File | Fungsi | Endpoint (GET) |
|---|---|---|
| `n8n-qc-monitoring-omzet-nana.json` | Omzet per outlet | `/webhook/monitoring-omzet` |
| `n8n-qc-monitoring-omzet-okt-nana.json` | Omzet per outlet (Oktober) | `/webhook/monitoring-omzet-okt` |
| `n8n-qc-monitoring-omzet-pusat-nana.json` | Omzet dari sheet pusat | `/webhook/monitoring-omzet-pusat` |
| `n8n-qc-monitoring-channel-controldash-v2-nana.json` | Per Channel (CONTROL DASHBOARD), versi aktif | `/webhook/monitoring-channel-controldash` |
| `n8n-qc-monitoring-channel-controldash-nana.json` | Per Channel versi lama (jangan diaktifkan bersamaan dengan v2) | `/webhook/monitoring-channel-controldash` |
| `n8n-qc-omzet-tahunan-nana.json` | Omzet Tahunan (`?tahun=2026`) | `/webhook/monitoring-omzet-tahunan` |
| `n8n-qc-sinkron-kasir-nana.json` | Sinkron sheet kasir ke sheet pusat (terjadwal tiap 30 menit) | – |

Endpoint lengkap: `https://<host-n8n>/webhook/<path>`.

## Folder `sheet-pusat/`

Dokumentasi struktur sheet pusat (`README-sheet-pusat.md`), panduan tab OnlineHarian, ringkasan backfill, dan salinan flow sinkron kasir. File `.xlsx` tidak disertakan di repo.