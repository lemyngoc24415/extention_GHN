// Bắt Fetch API
const originalFetch = window.fetch;
window.fetch = async function (...args) {
    const response = await originalFetch.apply(this, args);
    try {
        const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url ? args[0].url : "");
        if (url.includes('oms/v2/order') || url.includes('ready-to-pick')) {
            const clone = response.clone();
            clone.json().then(data => {
                window.dispatchEvent(new CustomEvent('GHN_API_DATA_EXT', { detail: data }));
            }).catch(e => { });
        }
    } catch (e) { }
    return response;
};

// Bắt XHR (Bổ sung phòng hờ)
const originalXHR = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function () {
    this.addEventListener('load', function () {
        try {
            if (this.responseURL && (this.responseURL.includes('oms/v2/order') || this.responseURL.includes('ready-to-pick'))) {
                const data = JSON.parse(this.responseText);
                window.dispatchEvent(new CustomEvent('GHN_API_DATA_EXT', { detail: data }));
            }
        } catch (e) { }
    });
    originalXHR.apply(this, arguments);
};
console.log("[GHN-EXT] Đã tiêm mã bắt API Fetch & XHR thành công!");