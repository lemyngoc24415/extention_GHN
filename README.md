# GHN Helper Pro

Hướng dẫn cài đặt tiện ích mở rộng — chỉ mất khoảng **2 phút**.

> 💡 Tiện ích này **chưa được đăng lên Chrome Web Store** nên cần bật chế độ Developer để cài. Đây là cách cài phổ biến cho các công cụ nội bộ và hoàn toàn an toàn.

## Các bước thực hiện

### 1. 📁 Giải nén thư mục tiện ích
Giải nén file `.zip` bạn nhận được ra một thư mục cố định trên máy tính. **Không xóa thư mục này sau khi cài** — Chrome cần nó để chạy tiện ích.

📂 `GHN-Helper-Pro/`
- `manifest.json`
- `popup.html`
- `popup.js`
- `content.js`
- `inject.js`
- `README.md` ← (file này)

### 2. 🔧 Mở trang quản lý Extension của Chrome
Mở Chrome, copy đường dẫn dưới đây dán vào thanh địa chỉ rồi nhấn `Enter`:
```text
chrome://extensions
```

### 3. 🛠️ Bật chế độ Developer
Ở góc trên bên phải trang Extensions, bật toggle **"Developer mode"** lên.
*(Sau khi bật, sẽ xuất hiện thêm 3 nút mới ở phía trên trang)*

### 4. 📂 Nhấn "Load unpacked" và chọn thư mục
Nhấn nút `Load unpacked` (vừa xuất hiện), sau đó chọn thư mục **GHN-Helper-Pro** mà bạn đã giải nén ở Bước 1.
> ⚠️ Chọn đúng thư mục chứa file `manifest.json`, không chọn file đơn lẻ.

### 5. ✅ Cài đặt hoàn tất!
Tiện ích **GHN Helper Pro** sẽ xuất hiện trong danh sách. Ghim nó vào thanh công cụ bằng cách nhấn icon 🧩 trên Chrome và ghim.

Mở trang **nhanh.ghn.vn**, click vào icon tiện ích và bật toggle **Đang BẬT** để bắt đầu sử dụng.

---

## 🚀 Tính năng của tiện ích

- **KÍCH THƯỚC**: Hiển thị kích thước kiện hàng (DxRxC) ngay trên bảng danh sách đơn hàng
- **PHÂN LOẠI**: Tự động gắn nhãn màu: **Tiktok hoàn hàng** / **Shopee hàng hoàn** / **Shop**
- **TỰ ĐỘNG**: Chạy nền, không cần thao tác thủ công — chỉ cần bật một lần là xong
- **BẬT/TẮT**: Có thể tắt bất cứ lúc nào từ popup, tất cả nhãn được xóa sạch ngay lập tức

---

## ❓ Câu hỏi thường gặp

- **LỖI**: Nếu tiện ích không chạy sau khi bật, hãy **F5 lại trang GHN** một lần để kết nối lại.
- **CẬP NHẬT**: Khi có bản mới, giải nén đè lên thư mục cũ rồi vào trang Extensions nhấn 🔄 Reload là xong.
- **XÓA**: Muốn gỡ: vào `chrome://extensions`, nhấn Remove trên thẻ tiện ích.
- **EDGE**: Nếu dùng Microsoft Edge, các bước tương tự — Edge cũng hỗ trợ extension của Chrome.

---
*GHN Helper Pro · Phiên bản 1.0 · Chỉ hoạt động trên ghn.vn*
