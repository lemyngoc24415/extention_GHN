const AutoPackingFeature = {
    id: 'feature_autoPacking',
    isRunning: false,
    observer: null,

    playAudio(num) {
        // We have local sounds from 1.mp3 to 7.mp3
        if (num >= 1 && num <= 7) {
            const url = chrome.runtime.getURL(`assets/sounds/${num}.mp3`);
            new Audio(url).play().catch((e) => console.error("GHN Helper Pro: Lỗi phát âm thanh", e));
        }
    },

    clickBtn(text) {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes(text));
        if (btn) { 
            btn.click(); 
            return true; 
        }
        return false;
    },

    processFromPopup(code) {
        const num = code.toLowerCase().replace('innhom', '').trim();
        console.log('GHN Helper Pro: 🚀 Kích hoạt từ Popup - Kiện số:', num);

        let found = false;
        document.querySelectorAll('p.textSeries--jnEqh').forEach(el => {
            if (el.textContent.trim() === num) {
                const block = el.closest('div');
                if (block) {
                    block.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    block.click();
                    found = true;
                }
            }
        });

        if (found) {
            setTimeout(() => {
                if (this.clickBtn('Hoàn tất đóng kiện')) {
                    this.playAudio(num);
                    setTimeout(() => this.clickBtn('In tem'), 800);
                }
            }, 300);
        }
    },

    start() {
        this.isRunning = true;

        if (!this.observer) {
            this.observer = new MutationObserver(() => {
                if (!this.isRunning) return;

                const modalStrong = document.querySelector('.modalContent--OdsOR strong');
                if (modalStrong) {
                    const errorText = modalStrong.textContent.trim();

                    if (errorText.toLowerCase().startsWith('innhom')) {
                        console.log('GHN Helper Pro: 🎯 Phát hiện mã innhom trong Popup:', errorText);

                        // 1. Bấm nút Đóng ngay lập tức để ẩn lỗi
                        this.clickBtn('Đóng');

                        // 2. Chạy logic đóng kiện
                        this.processFromPopup(errorText);

                        // 3. Xóa sạch ô input cũ để sẵn sàng cho lần sau
                        const input = document.querySelector('#form-input-order-code_orderCode');
                        if (input) input.value = '';
                    }
                }
            });
        }

        this.observer.observe(document.body, { childList: true, subtree: true });
        console.log('GHN Helper Pro: Auto Packing Feature Started');
    },

    stop() {
        this.isRunning = false;
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        console.log('GHN Helper Pro: Auto Packing Feature Stopped');
    }
};

// Register module
if (window.GHNConfigManager) {
    window.GHNConfigManager.registerFeature(AutoPackingFeature.id, AutoPackingFeature);
}
