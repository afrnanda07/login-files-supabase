# 📂 Sistem Penyimpanan File Menggunakan Supabase dan Login dengan Authentication

## 🧩 Deskripsi Proyek
Proyek ini adalah **aplikasi web penyimpanan file berbasis cloud** yang dibangun menggunakan **Supabase** dan **Netlify**.  
Aplikasi ini memungkinkan pengguna untuk **mendaftar, login, mengunggah, mengunduh, dan menghapus file mereka sendiri** dengan sistem keamanan berbasis autentikasi.  

Tujuan dari proyek ini adalah untuk memanfaatkan layanan **cloud gratis (Supabase & Netlify)** guna membangun sistem penyimpanan file yang aman, efisien, dan mudah digunakan.

---

## 🚀 Fitur Utama
- 🔐 **Register & Login dengan Authentication**  
  Pengguna membuat akun dengan email dan password, lalu harus memverifikasi email sebelum bisa login.
  
- ☁️ **Penyimpanan File di Cloud (Supabase Storage)**  
  File disimpan secara privat di Supabase berdasarkan ID pengguna.

- 📥 **Upload & Download File**  
  Pengguna bisa mengunggah file (maksimal 50MB) dan mengunduhnya kembali kapan saja.

- 🗑️ **Hapus File Aman**  
  File hanya dapat dihapus oleh pemilik akun.

- ✅ **Verifikasi Email Otomatis**  
  Menggunakan sistem email verifikasi bawaan Supabase.

- 🔒 **Kontrol Akses File**  
  Setiap pengguna memiliki direktori tersendiri di storage, sehingga file tidak bisa diakses oleh user lain.

---

## 🧠 Teknologi yang Digunakan
| Komponen | Teknologi | Fungsi |
|-----------|------------|--------|
| **Frontend** | HTML, CSS, JavaScript | Tampilan dan interaksi pengguna |
| **Backend** | Supabase (Auth, Database, Storage) | Autentikasi, penyimpanan, dan pengelolaan file |
| **Hosting** | Netlify | Menyajikan web app dengan HTTPS otomatis |
| **Keamanan** | Supabase Auth + SSL (Netlify) | Melindungi koneksi dan data pengguna |

---

## 🏗️ Arsitektur Sistem
```text
+-----------------------------+
|   Pengguna (Web Browser)    |
|  Akses via Netlify (HTTPS)  |
+-------------+---------------+
              |
              v
+-----------------------------+
|  Supabase Authentication    |
|  - Register / Login / Email |
|  - Verifikasi & Logout      |
+-------------+---------------+
              |
              v
+-----------------------------+
|   Supabase Storage & DB     |
|  - Upload / Download / Hapus|
|  - Metadata File per User   |
+-----------------------------+
```

---

## ⚙️ Cara Kerja Aplikasi
1. Pengguna membuka halaman utama (`index.html`) untuk **login atau register**.  
2. Saat register, Supabase mengirimkan **email verifikasi** ke pengguna.  
3. Setelah verifikasi berhasil, pengguna dapat login ke **dashboard**.  
4. Di dashboard, pengguna bisa:
   - Mengunggah file (maks. 50MB)
   - Melihat daftar file mereka
   - Mengunduh atau menghapus file milik sendiri  
5. Semua file disimpan di **Supabase Storage** dengan nama folder sesuai **user ID**.  
6. Logout menghapus sesi pengguna secara aman.

---

## 🔐 Fitur Keamanan
- Verifikasi email wajib sebelum login.  
- Akses file berdasarkan ID pengguna (private bucket).  
- Koneksi terenkripsi (HTTPS dari Netlify).  
- Logout menghapus token sesi Supabase.  
- Validasi password minimal 6 karakter.  
- Pembatasan ukuran file hingga 50MB.

---

## 💻 Struktur Folder
```bash
project-folder/
│
├── index.html         # Halaman login & register
├── login.js           # Logika autentikasi Supabase
├── dashboard.html     # Halaman dashboard pengguna
├── dashboard.js       # Logika upload, download, dan hapus file
├── style.css          # Desain tampilan login & register
├── dashboard.css      # Desain tampilan dashboard
└── README.md          # Dokumentasi proyek
```

---

## 🧾 Alur Penggunaan
1. **Register akun baru** → masukkan email & password  
2. **Cek email** untuk link verifikasi dari Supabase  
3. **Login** setelah akun diverifikasi  
4. **Upload file** ke cloud storage  
5. **Download atau hapus file** sesuai kebutuhan  
6. **Logout** untuk mengakhiri sesi

---

## 🌐 Deployment
Aplikasi ini di-host menggunakan **Netlify**  
🔗 URL: `https://angga-save-files-supabase.netlify.app`

Backend dijalankan di **Supabase**  
🔗 URL Project: `https://kpvkjcfsffqcqvnxwzfu.supabase.co`

---

## 📦 Hasil Implementasi
- ✅ Register & verifikasi email berjalan baik  
- ✅ Login aman dengan autentikasi Supabase  
- ✅ Upload, download, dan hapus file berfungsi normal  
- ✅ HTTPS aktif otomatis dari Netlify  
- ✅ File hanya bisa diakses oleh pemilik akun  

---

## 📚 Kesimpulan
Aplikasi **“Sistem Penyimpanan File Menggunakan Supabase dan Login dengan Authentication”** berhasil dibangun dengan layanan cloud gratis.  
Dengan memanfaatkan **Supabase** sebagai backend dan **Netlify** sebagai hosting, aplikasi ini menunjukkan implementasi nyata dari konsep **Cloud Computing & Security**, yaitu:
- Autentikasi pengguna yang aman  
- Penyimpanan data berbasis cloud  
- Kontrol akses pengguna  
- Enkripsi koneksi (HTTPS)

Proyek ini dapat menjadi contoh sederhana bagaimana membangun **aplikasi cloud yang aman, modern, dan gratis** menggunakan teknologi open source.
