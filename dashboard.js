const SUPABASE_URL = 'https://kpvkjcfsffqcqvnxwzfu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwdmtqY2ZzZmZxY3F2bnh3emZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMDI2MzUsImV4cCI6MjA3NjY3ODYzNX0.MI8dXhhtyFDbg55YLFJRUHA08Id942OfNAnrXf-MrAg';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let selectedFile = null;
let currentUser = null;

// Check authentication
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = 'index.html';
        return;
    }
    currentUser = session.user;
    document.getElementById('userEmail').textContent = currentUser.email;
    loadFiles();
}

checkAuth();

async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
}

// Drag and drop handlers
const uploadArea = document.getElementById('uploadArea');

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect({ target: { files } });
    }
});

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
        showAlert('Ukuran file maksimal 50MB', 'error');
        return;
    }

    selectedFile = file;
    document.getElementById('selectedFileName').textContent = file.name;
    document.getElementById('selectedFileSize').textContent = formatFileSize(file.size);
    document.getElementById('selectedFile').classList.add('show');
    document.getElementById('uploadBtn').style.display = 'block';
}

async function uploadFile() {
    if (!selectedFile) return;

    const uploadBtn = document.getElementById('uploadBtn');
    const uploadBtnText = document.getElementById('uploadBtnText');
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');

    uploadBtn.disabled = true;
    uploadBtnText.innerHTML = '<span class="loading"></span>';
    progressBar.classList.add('show');
    hideAlert();

    try {
        // Generate unique filename
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${currentUser.id}/${fileName}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('user-files')
            .upload(filePath, selectedFile, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) throw uploadError;

        // Save metadata to database
        const { error: dbError } = await supabase
            .from('files')
            .insert([{
                user_id: currentUser.id,
                file_name: selectedFile.name,
                file_path: filePath,
                file_size: selectedFile.size,
                file_type: selectedFile.type || 'application/octet-stream'
            }]);

        if (dbError) throw dbError;

        // Simulate progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            progressFill.style.width = progress + '%';
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    progressBar.classList.remove('show');
                    progressFill.style.width = '0%';
                }, 500);
            }
        }, 50);

        showAlert('File berhasil diupload!', 'success');

        // Reset form
        selectedFile = null;
        document.getElementById('fileInput').value = '';
        document.getElementById('selectedFile').classList.remove('show');
        document.getElementById('uploadBtn').style.display = 'none';

        // Reload files list
        loadFiles();

    } catch (error) {
        showAlert('Gagal mengupload file: ' + error.message, 'error');
        progressBar.classList.remove('show');
    } finally {
        uploadBtn.disabled = false;
        uploadBtnText.textContent = 'Upload File';
    }
}

async function loadFiles() {
    const { data: files, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading files:', error);
        return;
    }

    const filesList = document.getElementById('filesList');

    if (!files || files.length === 0) {
        filesList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📭</div>
                        <p>Belum ada file yang diupload</p>
                    </div>
                `;
        return;
    }

    filesList.innerHTML = files.map(file => `
    <div class="file-card">
        <div class="file-icon">${getFileIcon(file.file_type)}</div>
        <div class="file-name">${file.file_name}</div>
        <div class="file-info">
            ${formatFileSize(file.file_size)} • ${formatDate(file.created_at)}
        </div>
        <div class="file-actions">
            <button class="btn-download" onclick="downloadFile('${file.file_path}', '${file.file_name}')">
                Download
            </button>
            <button class="btn-delete" onclick="deleteFile('${file.id}', '${file.file_path}')">
                Hapus
            </button>
        </div>
    </div>
    `).join('');
}

async function downloadFile(filePath, fileName) {
    try {
        const { data, error } = await supabase.storage
            .from('user-files')
            .download(filePath);

        if (error) throw error;

        const url = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showAlert('File berhasil didownload!', 'success');
    } catch (error) {
        showAlert('Gagal mendownload file: ' + error.message, 'error');
    }
}

async function deleteFile(fileId, filePath) {
    if (!confirm('Yakin ingin menghapus file ini?')) return;

    try {
        // Delete from storage
        const { error: storageError } = await supabase.storage
            .from('user-files')
            .remove([filePath]);

        if (storageError) throw storageError;

        // Delete from database
        const { error: dbError } = await supabase
            .from('files')
            .delete()
            .eq('id', fileId);

        if (dbError) throw dbError;

        showAlert('File berhasil dihapus!', 'success');
        loadFiles();
    } catch (error) {
        showAlert('Gagal menghapus file: ' + error.message, 'error');
    }
}

function getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.startsWith('video/')) return '🎥';
    if (fileType.startsWith('audio/')) return '🎵';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    if (fileType.includes('zip') || fileType.includes('rar')) return '🗜️';
    return '📎';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Hari ini';
    if (days === 1) return 'Kemarin';
    if (days < 7) return days + ' hari lalu';

    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function showAlert(message, type) {
    const alert = document.getElementById('alert');
    alert.textContent = message;
    alert.className = `alert alert-${type} show`;
    setTimeout(() => hideAlert(), 5000);
}

function hideAlert() {
    const alert = document.getElementById('alert');
    alert.classList.remove('show');
}
