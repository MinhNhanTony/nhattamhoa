
const axios = require('axios');

let intervalId = null;
let isChecking = false;

async function keepOnlineRenDerApp() {
    const apiUrl = 'https://nhattamhoa.com/';
    const intervalTime = 10 * 60 * 1000; // 10 phút

    async function fetchDataFromAPI() {
        if (isChecking) return;

        isChecking = true;

        try {
            const response = await axios.get(apiUrl, {
                timeout: 30000,
            });

            console.log(
                `[Render Monitor] ${new Date().toISOString()} - HTTP ${response.status}`
            );
        } catch (error) {
            console.error(
                '[Render Monitor] Lỗi:',
                error.response?.status || error.message
            );
        } finally {
            isChecking = false;
        }
    }

    // Tránh tạo nhiều setInterval nếu hàm bị gọi nhiều lần
    if (intervalId) return;

    // Kiểm tra ngay khi khởi động
    await fetchDataFromAPI();

    intervalId = setInterval(fetchDataFromAPI, intervalTime);
}

module.exports = { keepOnlineRenDerApp };
