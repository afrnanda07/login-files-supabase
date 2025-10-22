// Initialize Supabase
const SUPABASE_URL = 'https://kpvkjcfsffqcqvnxwzfu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwdmtqY2ZzZmZxY3F2bnh3emZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMDI2MzUsImV4cCI6MjA3NjY3ODYzNX0.MI8dXhhtyFDbg55YLFJRUHA08Id942OfNAnrXf-MrAg';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Check if user is already logged in
supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
        window.location.href = 'dashboard.html';
    }
});

function switchTab(tab) {
    const tabs = document.querySelectorAll('.tab');
    const forms = document.querySelectorAll('.form-content');

    tabs.forEach(t => t.classList.remove('active'));
    forms.forEach(f => f.classList.remove('active'));

    if (tab === 'login') {
        tabs[0].classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    } else {
        tabs[1].classList.add('active');
        document.getElementById('registerForm').classList.add('active');
    }

    hideAlert();
}

function showAlert(message, type) {
    const alert = document.getElementById('alert');
    alert.textContent = message;
    alert.className = `alert alert-${type} show`;
}

function hideAlert() {
    const alert = document.getElementById('alert');
    alert.classList.remove('show');
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
}

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const btn = document.getElementById('loginBtn');
    const btnText = document.getElementById('loginBtnText');

    btn.disabled = true;
    btnText.innerHTML = '<span class="loading"></span>';
    hideAlert();

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) throw error;

        showAlert('Login berhasil! Mengalihkan...', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);

    } catch (error) {
        showAlert(error.message || 'Login gagal. Periksa email dan password Anda.', 'error');
        btn.disabled = false;
        btnText.textContent = 'Masuk';
    }
}

async function handleRegister(event) {
    event.preventDefault();

    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const btn = document.getElementById('registerBtn');
    const btnText = document.getElementById('registerBtnText');

    if (password !== confirmPassword) {
        showAlert('Password tidak cocok!', 'error');
        return;
    }

    btn.disabled = true;
    btnText.innerHTML = '<span class="loading"></span>';
    hideAlert();

    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) throw error;

        showAlert('Registrasi berhasil! silahkan verifikasi akun terlebih dahulu ', 'success');

        // Clear form
        document.getElementById('registerEmail').value = '';
        document.getElementById('registerPassword').value = '';
        document.getElementById('registerConfirmPassword').value = '';

        // Switch to login tab after 2 seconds
        setTimeout(() => {
            switchTab('login');
        }, 2000);

    } catch (error) {
        showAlert(error.message || 'Registrasi gagal. Silakan coba lagi.', 'error');
    } finally {
        btn.disabled = false;
        btnText.textContent = 'Daftar Sekarang';
    }
}
