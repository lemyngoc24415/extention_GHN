const BulkDeleteFeature = {
    id: 'feature_bulkDelete',
    isRunning: false,
    observer: null,
    monitorInterval: null,

    addDeleteAllButton() {
        const header = document.querySelector('.orderHeader--i0YBu');
        if (!header) return;

        if (header.querySelector('.ghn-delete-all-btn')) return;

        const actionHeader = document.createElement('span');
        actionHeader.className = 'ghn-delete-action-header';
        actionHeader.style.width = '30%';
        actionHeader.style.display = 'flex';
        actionHeader.style.justifyContent = 'end';
        actionHeader.style.alignItems = 'center';

        const deleteAllButton = document.createElement('button');
        deleteAllButton.className = 'ant-btn ant-btn-default btn-outline-dark ghn-delete-all-btn';
        deleteAllButton.innerHTML = '<span>Xoá Tất Cả</span>';

        actionHeader.appendChild(deleteAllButton);
        header.appendChild(actionHeader);

        deleteAllButton.addEventListener('click', function() {
            const orderList = document.querySelector('.orderList--HNiFA');
            if (!orderList) return;

            const rows = orderList.querySelectorAll('.orderItem--lVNtU');
            const selectedRows = Array.from(rows).filter(row => {
                const checkbox = row.querySelector('input[type="checkbox"]');
                return checkbox && checkbox.checked;
            });

            if (selectedRows.length === 0) {
                alert('Vui lòng chọn ít nhất một đơn hàng để xóa.');
                return;
            }

            if (confirm('Bạn có chắc chắn muốn xóa tất cả các đơn hàng đã chọn khỏi danh sách?')) {
                selectedRows.forEach(row => {
                    const deleteButton = row.querySelector('button.ant-btn');
                    if (deleteButton) {
                        deleteButton.click(); 
                    }
                });

                if (orderList.children.length === 0) {
                    const emptyItem = document.createElement('li');
                    emptyItem.className = 'orderItem--lVNtU';
                    emptyItem.style.textAlign = 'center';
                    emptyItem.textContent = 'Không còn đơn hàng nào trong danh sách.';
                    orderList.appendChild(emptyItem);
                }

                const selectAllCheckbox = header.querySelector('.selectAllCheckbox--ZgZ8H');
                if (selectAllCheckbox) selectAllCheckbox.checked = false;
            }
        });
    },

    enableCheckboxes() {
        const orderList = document.querySelector('.orderList--HNiFA');
        if (!orderList) return;

        const checkboxes = orderList.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (checkbox.disabled) {
                checkbox.removeAttribute('disabled');
            }
        });

        const selectAllCheckbox = document.querySelector('.selectAllCheckbox--ZgZ8H');
        if (selectAllCheckbox) {
            if (selectAllCheckbox.disabled) {
                selectAllCheckbox.removeAttribute('disabled');
            }

            if (!selectAllCheckbox.hasAttribute('data-ghn-listener')) {
                selectAllCheckbox.setAttribute('data-ghn-listener', 'true');
                selectAllCheckbox.addEventListener('change', function() {
                    const isChecked = this.checked;
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = isChecked;
                        if (checkbox.disabled) checkbox.removeAttribute('disabled');
                    });
                });
            }
        }
    },

    monitorCheckboxes() {
        const checkboxes = document.querySelectorAll('.orderList--HNiFA input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (checkbox.disabled) {
                checkbox.removeAttribute('disabled');
            }
        });
        const selectAllCheckbox = document.querySelector('.selectAllCheckbox--ZgZ8H');
        if (selectAllCheckbox && selectAllCheckbox.disabled) {
            selectAllCheckbox.removeAttribute('disabled');
        }
    },

    start() {
        this.isRunning = true;
        
        this.enableCheckboxes();
        this.addDeleteAllButton();

        if (!this.monitorInterval) {
            this.monitorInterval = setInterval(() => this.monitorCheckboxes(), 1000);
        }

        if (!this.observer) {
            this.observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        const header = document.querySelector('.orderHeader--i0YBu');
                        if (header && !document.querySelector('.ghn-delete-all-btn')) {
                            this.enableCheckboxes();
                            this.addDeleteAllButton();
                        }
                    }
                }
            });
        }

        this.observer.observe(document.body, { childList: true, subtree: true });
    },

    stop() {
        this.isRunning = false;
        
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
            this.monitorInterval = null;
        }

        if (this.observer) {
            this.observer.disconnect();
        }

        // Cleanup injected UI
        const actionHeader = document.querySelector('.ghn-delete-action-header');
        if (actionHeader) {
            actionHeader.remove();
        }
    }
};

// Register module
if (window.GHNConfigManager) {
    window.GHNConfigManager.registerFeature(BulkDeleteFeature.id, BulkDeleteFeature);
}
