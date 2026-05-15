document.addEventListener('DOMContentLoaded', () => {
    const toggleGlobal = document.getElementById('toggleGlobal');
    const statusText = document.getElementById('statusText');
    const featureList = document.getElementById('featureList');
    
    const featureIds = [
        'feature_orderInfo',
        'feature_hideReceipt',
        'feature_bulkDelete',
        'feature_autoPacking',
        'feature_orderChecker',
        'feature_packageAlert'
    ];

    // Lấy trạng thái đã lưu
    chrome.storage.local.get(['globalEnabled', 'featuresConfig'], (result) => {
        const isEnabled = result.globalEnabled !== false; // Default true
        toggleGlobal.checked = isEnabled;
        updateUI(isEnabled);

        const config = result.featuresConfig || {};
        featureIds.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                // Mặc định bật tất cả các tính năng nếu chưa có config
                checkbox.checked = config[id] !== false;
                checkbox.disabled = !isEnabled;
                
                checkbox.addEventListener('change', saveAndNotify);
            }
        });
    });

    toggleGlobal.addEventListener('change', () => {
        const isEnabled = toggleGlobal.checked;
        featureIds.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) checkbox.disabled = !isEnabled;
        });
        updateUI(isEnabled);
        saveAndNotify();
    });

    function saveAndNotify() {
        const config = {};
        featureIds.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) config[id] = checkbox.checked;
        });

        const globalEnabled = toggleGlobal.checked;

        chrome.storage.local.set({ 
            globalEnabled: globalEnabled,
            featuresConfig: config 
        }, () => {
            // Gửi message cập nhật cấu hình cho trang web đang mở
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0] && tabs[0].url && tabs[0].url.includes("ghn.vn")) {
                    chrome.tabs.sendMessage(tabs[0].id, { 
                        command: "UPDATE_CONFIG", 
                        globalEnabled: globalEnabled,
                        config: config
                    }).catch(err => {
                        console.warn("GHN Helper Pro: Vui lòng tải lại trang (F5) để kết nối.");
                    });
                }
            });
        });
    }

    function updateUI(isEnabled) {
        statusText.innerText = isEnabled ? "Hệ thống đang BẬT" : "Hệ thống đã TẮT";
        statusText.style.color = isEnabled ? "#2ecc71" : "#e74c3c";
        featureList.style.opacity = isEnabled ? "1" : "0.5";
    }
});