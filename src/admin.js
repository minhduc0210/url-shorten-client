import './style.css';
import { api } from './api/api';

const tableBody = document.querySelector('#urlTableBody');
const editModal = document.querySelector('#editModal');
const editForm = document.querySelector('#editForm');

/**
 * Hiển thị Toast
 */
function showToast(message, type = 'success') {
  const container = document.querySelector('#toast-container');
  const toast = document.createElement('div');
  const color = type === 'success' ? 'bg-green-600' : 'bg-red-600';
  toast.className = `${color} text-white px-6 py-3 rounded-xl shadow-lg mb-3 animate-bounce-in flex items-center font-medium`;
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/**
 * Kiểm tra mã truy cập Admin
 */
function getApiKey() {
  let key = localStorage.getItem('admin_key');
  if (!key) {
    key = prompt('Nhập mã bí mật để quản lý:');
    if (key) localStorage.setItem('admin_key', key);
  }
  return key;
}

/**
 * Tải dữ liệu từ Server
 */
async function fetchUrls() {
  const key = getApiKey();
  if (!key) return;

  try {
    const res = await api.getUrls(key);
    if (res.success) {
      renderTable(res.data);
    } else {
      if (res.error?.statusCode === 401) {
        localStorage.removeItem('admin_key');
        showToast('Mã truy cập không đúng!', 'error');
        setTimeout(() => location.reload(), 1000);
      }
    }
  } catch (err) {
    showToast('Lỗi kết nối Server', 'error');
  }
}

/**
 * Đổ dữ liệu vào bảng
 */
function renderTable(urls) {
  tableBody.innerHTML = urls.map(url => `
    <tr class="hover:bg-gray-50 transition">
      <td class="px-6 py-4 text-sm text-gray-500 font-mono">${url.id}</td>
      <td class="px-6 py-4 text-sm font-medium text-gray-800 max-w-xs truncate">${url.longUrl}</td>
      <td class="px-6 py-4 text-sm font-bold text-indigo-600 font-mono">${url.shortCode}</td>
      <td class="px-6 py-4 text-sm text-gray-500">${new Date(url.createdAt).toLocaleDateString()}</td>
      <td class="px-6 py-4 text-center space-x-4">
        <button onclick="window.editItem(${url.id}, '${url.longUrl}', '${url.shortCode}')" class="text-indigo-600 hover:text-indigo-900 font-bold transition">Sửa</button>
        <button onclick="window.deleteItem(${url.id})" class="text-red-500 hover:text-red-700 font-bold transition">Xóa</button>
      </td>
    </tr>
  `).join('');
}

// Đưa hàm ra phạm vi toàn cục (window) để gọi từ HTML string
window.deleteItem = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa liên kết này?')) return;
  const key = getApiKey();
  const res = await api.deleteUrl(id, key);
  if (res.success) {
    showToast('Đã xóa thành công');
    fetchUrls();
  }
};

window.editItem = (id, longUrl, shortCode) => {
  document.querySelector('#editId').value = id;
  document.querySelector('#editLongUrl').value = longUrl;
  document.querySelector('#editShortCode').value = shortCode;
  editModal.classList.remove('hidden');
  editModal.classList.add('flex');
};

document.querySelector('#closeModal').onclick = () => {
  editModal.classList.add('hidden');
  editModal.classList.remove('flex');
};

editForm.onsubmit = async (e) => {
  e.preventDefault();
  const id = document.querySelector('#editId').value;
  const longUrl = document.querySelector('#editLongUrl').value;
  const shortCode = document.querySelector('#editShortCode').value;
  const key = getApiKey();

  const res = await api.updateUrl(id, longUrl, shortCode, key);
  if (res.success) {
    showToast('Cập nhật thành công!');
    editModal.classList.add('hidden');
    editModal.classList.remove('flex');
    fetchUrls();
  } else {
    showToast(res.error?.message || 'Cập nhật thất bại', 'error');
  }
};

document.querySelector('#logoutBtn').onclick = () => {
  localStorage.removeItem('admin_key');
  location.reload();
};

document.querySelector('#refreshBtn').onclick = fetchUrls;

// Khởi chạy khi load trang
fetchUrls();