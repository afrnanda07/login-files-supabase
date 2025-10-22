// // Konfigurasi Supabase
// const SUPABASE_URL = 'https://kpvkjcfsffqcqvnxwzfu.supabase.co';
// const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwdmtqY2ZzZmZxY3F2bnh3emZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMDI2MzUsImV4cCI6MjA3NjY3ODYzNX0.MI8dXhhtyFDbg55YLFJRUHA08Id942OfNAnrXf-MrAg';

// // Inisialisasi Supabase Client
// const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// // Ambil elemen form
// const loginForm = document.getElementById('loginForm');
// const emailInput = document.getElementById('email');
// const socialButtons = document.querySelectorAll('.social-btn');

// // Cek apakah user sudah login saat halaman dimuat
// window.addEventListener('DOMContentLoaded', async () => {
//     const { data: { session } } = await supabase.auth.getSession();

//     if (session) {
//         // Jika sudah login, redirect ke dashboard
//         window.location.href = 'dashboard.html';
//     }
// });

// // Handle form submit - Magic Link Login
// loginForm.addEventListener('submit', async function (e) {
//     e.preventDefault();

//     const email = emailInput.value;

//     // Validasi email
//     if (!validateEmail(email)) {
//         showError('Email tidak valid!');
//         return;
//     }

//     // Animasi loading pada button
//     const button = loginForm.querySelector('.btn-login');
//     const buttonText = button.querySelector('span');
//     const originalText = buttonText.textContent;

//     buttonText.textContent = 'Mengirim...';
//     button.style.opacity = '0.7';
//     button.disabled = true;

//     try {
//         // Kirim Magic Link ke email
//         const { data, error } = await supabase.auth.signInWithOtp({
//             email: email,
//             options: {
//                 emailRedirectTo: window.location.origin + '/dashboard.html'
//             }
//         });

//         if (error) {
//             throw error;
//         }

//         // Berhasil mengirim magic link
//         showSuccess('Link login telah dikirim ke email Anda!');
//         showInfo('Silakan cek inbox atau spam email Anda');

//         // Reset form setelah berhasil
//         setTimeout(() => {
//             loginForm.reset();
//         }, 1000);

//     } catch (error) {
//         console.error('Error login:', error);
//         showError(error.message || 'Terjadi kesalahan saat login');
//     } finally {
//         // Reset button
//         buttonText.textContent = originalText;
//         button.style.opacity = '1';
//         button.disabled = false;
//     }
// });

// // Handle social login - Google
// document.querySelector('.social-btn.google').addEventListener('click', async function () {
//     try {
//         const { data, error } = await supabase.auth.signInWithOAuth({
//             provider: 'google',
//             options: {
//                 redirectTo: window.location.origin + '/dashboard.html'
//             }
//         });

//         if (error) {
//             throw error;
//         }
//     } catch (error) {
//         console.error('Error Google login:', error);
//         showError('Gagal login dengan Google');
//     }
// });

// // Handle social login - Facebook
// document.querySelector('.social-btn.facebook').addEventListener('click', async function () {
//     try {
//         const { data, error } = await supabase.auth.signInWithOAuth({
//             provider: 'facebook',
//             options: {
//                 redirectTo: window.location.origin + '/dashboard.html'
//             }
//         });

//         if (error) {
//             throw error;
//         }
//     } catch (error) {
//         console.error('Error Facebook login:', error);
//         showError('Gagal login dengan Facebook');
//     }
// });

// // Listener untuk perubahan auth state
// supabase.auth.onAuthStateChange((event, session) => {
//     console.log('Auth event:', event);

//     if (event === 'SIGNED_IN' && session) {
//         showSuccess('Login berhasil! Mengalihkan ke dashboard...');
//         setTimeout(() => {
//             window.location.href = 'dashboard.html';
//         }, 1000);
//     }

//     if (event === 'SIGNED_OUT') {
//         console.log('User signed out');
//     }
// });

// // Validasi email
// function validateEmail(email) {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
// }

// // Fungsi untuk menampilkan pesan error
// function showError(message) {
//     showNotification(message, 'error');
// }

// // Fungsi untuk menampilkan pesan sukses
// function showSuccess(message) {
//     showNotification(message, 'success');
// }

// // Fungsi untuk menampilkan pesan info
// function showInfo(message) {
//     showNotification(message, 'info');
// }

// // Fungsi untuk menampilkan notifikasi
// function showNotification(message, type) {
//     // Hapus notifikasi yang sudah ada
//     const existingNotif = document.querySelector('.notification');
//     if (existingNotif) {
//         existingNotif.remove();
//     }

//     // Buat elemen notifikasi
//     const notification = document.createElement('div');
//     notification.className = `notification ${type}`;
//     notification.textContent = message;

//     // Style notifikasi
//     notification.style.position = 'fixed';
//     notification.style.top = '20px';
//     notification.style.right = '20px';
//     notification.style.padding = '15px 25px';
//     notification.style.borderRadius = '12px';
//     notification.style.fontWeight = '600';
//     notification.style.fontSize = '14px';
//     notification.style.zIndex = '1000';
//     notification.style.animation = 'slideIn 0.3s ease-out';
//     notification.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)';

//     // Warna berdasarkan type
//     if (type === 'error') {
//         notification.style.background = '#ff4444';
//         notification.style.color = 'white';
//     } else if (type === 'success') {
//         notification.style.background = '#00C851';
//         notification.style.color = 'white';
//     } else {
//         notification.style.background = '#33b5e5';
//         notification.style.color = 'white';
//     }

//     // Tambahkan ke body
//     document.body.appendChild(notification);

//     // Hapus setelah 3 detik
//     setTimeout(() => {
//         notification.style.animation = 'slideOut 0.3s ease-out';
//         setTimeout(() => {
//             notification.remove();
//         }, 300);
//     }, 3000);
// }

// // Tambahkan animasi CSS untuk notifikasi
// const style = document.createElement('style');
// style.textContent = `
//     @keyframes slideIn {
//         from {
//             transform: translateX(100%);
//             opacity: 0;
//         }
//         to {
//             transform: translateX(0);
//             opacity: 1;
//         }
//     }
    
//     @keyframes slideOut {
//         from {
//             transform: translateX(0);
//             opacity: 1;
//         }
//         to {
//             transform: translateX(100%);
//             opacity: 0;
//         }
//     }
// `;
// document.head.appendChild(style);

// // Input animation on focus
// emailInput.addEventListener('focus', function () {
//     this.parentElement.style.transform = 'scale(1.02)';
//     this.parentElement.style.transition = 'transform 0.2s';
// });

// emailInput.addEventListener('blur', function () {
//     this.parentElement.style.transform = 'scale(1)';
// });