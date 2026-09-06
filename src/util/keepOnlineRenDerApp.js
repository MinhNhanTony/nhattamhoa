const axios = require('axios');

async function keepOnlineRenDerApp() {
    // Hàm gọi API
        async function fetchDataFromAPI() {
            const apiUrl = 'https://qana-sneaker.onrender.com';

            try {
            const response = await axios.get(apiUrl);
            return response.status;
            } catch (error) {
            console.error('Error fetching data:', error.message);
            throw error;
            }
        }

         // Thời gian cách nhau giữa mỗi lần gọi API (đơn vị là milliseconds)
         const callAfterMinutes =  10;
         const intervalTime = callAfterMinutes * 60 * 1000; 

        // Hàm bắt đầu gọi API sử dụng setInterval
        function startAPICalls() {
        fetchDataFromAPI()
            .then(data => {
            console.log(data);
            // Tiếp tục xử lý dữ liệu ở đây nếu cần thiết
            })
            .catch(error => {
            console.error('Error:', error);
            });
        }

        // Bắt đầu gọi API ban đầu
        startAPICalls();

        // Lập lịch gọi API sử dụng setInterval
        setInterval(startAPICalls, intervalTime);
}

module.exports = { keepOnlineRenDerApp };

