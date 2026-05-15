const OrderCheckerFeature = {
    id: 'feature_orderChecker',
    isRunning: false,
    pendingOrders: [],
    processedCount: 0,
    totalOrders: 0,
    urlCheckInterval: null,
    lastURL: null,
    inputListener: null,

    CONFIG: {
        selectors: {
            pendingSection: '.viewTitle--drJ9b',
            orderItem: '.itemOrder--GOjNj',
            activeOrder: 'itemOrder__active--gQbmN',
            inputField: '#orderCode'
        },
        checkDelay: 800
    },

    playSound(index) {
        const idx = Math.min(index, 7); // Max is 7.mp3
        const url = chrome.runtime.getURL(`assets/sounds/${idx}.mp3`);
        const audio = new Audio(url);
        audio.volume = 0.9;
        audio.play().catch(() => setTimeout(() => audio.play(), 300));
    },

    loadPendingOrders() {
        const result = [];
        const sections = document.querySelectorAll(this.CONFIG.selectors.pendingSection);

        sections.forEach(sec => {
            if (sec.textContent.includes("ĐH Chờ Trả")) {
                const wrap = sec.nextElementSibling;
                if (!wrap) return;

                wrap.querySelectorAll(this.CONFIG.selectors.orderItem).forEach(item => {
                    if (!item.classList.contains(this.CONFIG.selectors.activeOrder)) {
                        const code = item.textContent.trim();
                        if (code) result.push(code);
                    }
                });
            }
        });

        return result;
    },

    checkOrder(code) {
        if (!this.isRunning) return;

        const items = document.querySelectorAll(this.CONFIG.selectors.orderItem);
        let isActive = false;

        items.forEach(item => {
            if (
                item.textContent.trim() === code &&
                item.classList.contains(this.CONFIG.selectors.activeOrder)
            ) {
                isActive = true;
            }
        });

        if (isActive) {
            this.processedCount++;
            console.log(`GHN Helper Pro: ACTIVE ${code}: ${this.processedCount}/${this.totalOrders}`);

            this.playSound(this.processedCount);

            this.pendingOrders = this.pendingOrders.filter(x => x !== code);
        }
    },

    setupInput() {
        const input = document.querySelector(this.CONFIG.selectors.inputField);
        if (!input) {
            if (this.isRunning) {
                setTimeout(() => this.setupInput(), 300);
            }
            return;
        }

        if (input.hasAttribute('data-ghn-checker-listener')) return;

        this.inputListener = (e) => {
            if (!this.isRunning) return;
            if (e.key === "Enter") {
                const code = input.value.trim();
                
                // Allow original event to process first before we clear/check
                setTimeout(() => {
                    if (!code) return;

                    if (!this.pendingOrders.includes(code)) {
                        console.log("GHN Helper Pro: Không phải đơn chờ trả:", code);
                        return;
                    }

                    setTimeout(() => this.checkOrder(code), this.CONFIG.checkDelay);
                }, 50);
            }
        };

        input.addEventListener("keydown", this.inputListener);
        input.setAttribute('data-ghn-checker-listener', 'true');
    },

    initPage() {
        if (!window.location.pathname.includes("/lastmile/check-scan")) return;

        this.processedCount = 0;
        this.pendingOrders = this.loadPendingOrders();
        this.totalOrders = this.pendingOrders.length;

        console.log("GHN Helper Pro: Order Checker - Tổng đơn ban đầu:", this.totalOrders);

        this.setupInput();
    },

    start() {
        this.isRunning = true;
        this.lastURL = location.href;

        this.initPage();

        if (!this.urlCheckInterval) {
            this.urlCheckInterval = setInterval(() => {
                if (location.href !== this.lastURL) {
                    this.lastURL = location.href;
                    if (this.isRunning) {
                        setTimeout(() => this.initPage(), 500);
                    }
                }
            }, 1500);
        }
    },

    stop() {
        this.isRunning = false;
        
        if (this.urlCheckInterval) {
            clearInterval(this.urlCheckInterval);
            this.urlCheckInterval = null;
        }

        const input = document.querySelector(this.CONFIG.selectors.inputField);
        if (input && this.inputListener) {
            input.removeEventListener("keydown", this.inputListener);
            input.removeAttribute('data-ghn-checker-listener');
        }
    }
};

// Register module
if (window.GHNConfigManager) {
    window.GHNConfigManager.registerFeature(OrderCheckerFeature.id, OrderCheckerFeature);
}
