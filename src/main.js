import './style.css';
import { api } from './api/api';

const form = document.querySelector('#shortenForm');
const resultDiv = document.querySelector('#result');
const shortUrlLink = document.querySelector('#shortUrl');
const copyBtn = document.querySelector('#copyBtn');
const submitBtn = document.querySelector('#submitBtn');

/**
 * Hiển thị thông báo Toast nhanh gọn.
 */
function showToast(message, type = 'success') {
  const container = document.querySelector('#toast-container');
  const toast = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
  
  toast.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-xl mb-3 toast-animate flex items-center`;
  toast.innerHTML = `<span>${message}</span>`;
  
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Xử lý sự kiện Submit form.
 */
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const longUrl = document.querySelector('#longUrl').value;
  const customAlias = document.querySelector('#customAlias').value;

  // Hiệu ứng Loading
  submitBtn.disabled = true;
  submitBtn.innerText = 'Đang xử lý...';

  try {
    const response = await api.shorten(longUrl, customAlias || undefined);

    if (response.success) {
      const fullShortUrl = `${import.meta.env.VITE_API_BASE_URL}/${response.data.shortCode}`;
      
      shortUrlLink.innerText = fullShortUrl;
      shortUrlLink.href = fullShortUrl;
      resultDiv.classList.remove('hidden');
      
      showToast('Đã tạo link rút gọn!');
    } else {
      showToast(response.error?.message || 'Có lỗi xảy ra', 'error');
    }
  } catch (err) {
    showToast('Không thể kết nối đến máy chủ', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = 'Tạo Link Ngay';
  }
});

/**
 * Xử lý sự kiện Copy.
 */
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(shortUrlLink.innerText).then(() => {
    showToast('Đã sao chép vào bộ nhớ tạm!');
  });
});