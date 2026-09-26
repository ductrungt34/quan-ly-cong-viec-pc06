# HỆ THỐNG QUẢN LÝ CÔNG VIỆC NỘI BỘ - ĐỘI 2 (PC06 HẢI PHÒNG)

Ứng dụng web quản lý công việc chuyên biệt cho **Đội 2, Phòng Cảnh sát Quản lý hành chính về trật tự xã hội (PC06) - Công an thành phố Hải Phòng**.

**Bản quyền:** Đại úy Phạm Đức Trung - Cán bộ Đội 2 phòng PC06.

---

## 🌟 ĐẶC ĐIỂM NỔI BẬT & CẬP NHẬT MỚI NHẤT

### 1. Giao diện & Huy hiệu chuẩn lực lượng CS QLHC về TTXH
- **Huy hiệu chính thức:** Tích hợp biểu trưng chuẩn tròn viền vàng của lực lượng Cảnh sát Quản lý hành chính về trật tự xã hội tại thanh điều hướng và báo cáo in.
- **Tông màu phông Xanh Lá Mạ (Police Green):** Thay thế toàn bộ màu phông đen bằng màu xanh lá mạ / xanh lục cảnh sát truyền thống (`#143e21`, `#194c29`, điểm xao vàng đồng và xanh cốm `lime-400`), mang lại cảm giác trang trọng, chuẩn mực nghiệp vụ và dịu mắt.
- **Bảng mở rộng toàn màn hình:** Thiết kế bố cục mở rộng sang 2 bên trái/phải, tối ưu hóa kích thước từng cột giúp xem bao quát toàn bộ 11 cột dữ liệu văn bản mà không phải kéo thanh cuộn ngang.

---

### 2. Module 1: Bảng Theo Dõi Văn Bản Hàng Ngày
- **Đầy đủ 11 cột nghiệp vụ:** STT, Số / Ký hiệu VB, Ngày VB, Trích yếu nội dung, Lĩnh vực, Cán bộ thực hiện, Ngày nhận, Thời hạn xử lý, Trạng thái tự động, Kết quả thực hiện, Thao tác.
- **Thẻ Lĩnh vực (Badge) tương phản cao:** Nền pastel nhẹ mắt (`bg-emerald-100`, `bg-lime-100`, `bg-teal-100`...) đi kèm chữ màu đậm nét (`text-emerald-950`...), rõ ràng, dễ phân loại.
- **Tự động hóa trạng thái theo thời gian thực:**
  - Văn bản theo dõi: *"Đang theo dõi"*.
  - Có kết quả thực hiện: *"Đã hoàn thành"* (Xanh lá).
  - Còn > 3 ngày: *"Đang xử lý"* (Xanh dương).
  - Còn ≤ 3 ngày: *"Sắp hết hạn"* (Vàng cam cảnh báo).
  - Quá hạn: *"Đã hết hạn"* (Đỏ cảnh báo kèm số ngày quá hạn).

---

### 3. Module 2: Quản Lý Đôn Đốc Công An Xã Theo Từng Địa Bàn
- **Phân cấp giao việc linh hoạt 2 cấp độ:**
  - *Cấp cán bộ:* Lựa chọn "Giao cho tất cả 21 cán bộ địa bàn" hoặc "Chỉ định cụ thể từng cán bộ" qua danh sách checklist.
  - *Cấp địa bàn xã/phường:* Lựa chọn "Đôn đốc tất cả các địa bàn phụ trách" hoặc "Chỉ định 1 số địa bàn cụ thể" trong số các xã mà cán bộ phụ trách.
- **Tự động khóa khi quá hạn & hiển thị "Chưa đôn đốc":**
  - Quá hạn được giao mà cán bộ chưa thực hiện đôn đốc: Hệ thống tự động KHÓA quyền chỉnh sửa/cập nhật, nút chuyển thành `🔒 Quá hạn (Đã khóa)`.
  - Cột đánh giá trạng thái tự động ghi nhận chuẩn: **"Chưa đôn đốc"** (kèm cảnh báo Quá hạn).
- **Bảng theo dõi thu nhỏ gọn gàng:**
  - Mặc định hiển thị thẻ nhiệm vụ thu nhỏ kèm thanh tiến độ trực quan (`x/21 cán bộ hoàn thành`).
  - Nút **`👁️ Xem chi tiết tiến độ`** cho phép nhấp để mở rộng hoặc thu gọn bảng phân công chi tiết của từng cán bộ.

---

### 4. Tổng Quan & Xếp Hạng Thi Đua Đội 2
- **Bộ lọc xếp hạng theo thời gian tùy chọn:**
  - Lọc xếp hạng chính xác theo bất kỳ khoảng thời gian nào (`Từ ngày` - `Đến ngày`), ví dụ: `01/01/2026 - 01/02/2026`, `01/01/2026 - 01/04/2026` hoặc cả năm.
  - Tự động tính toán lại toàn bộ kết quả tham mưu và đôn đốc phát sinh trong khoảng thời gian đã chọn.
- **Xếp hạng chuẩn theo Tỉ lệ phần trăm (%) đạt được (Không dùng điểm số):**
  - Đã loại bỏ hoàn toàn điểm số, thay thế bằng **Tỉ lệ phần trăm (%) hoàn thành**.
  - **Thang xếp loại 4 bậc:**
    - **≥ 90%:** **Loại A (Xuất sắc)**
    - **80% đến dưới 90%:** **Loại B (Tốt)**
    - **70% đến dưới 80%:** **Loại C (Hoàn thành)**
    - **Dưới 70%:** **Loại D (Cần đôn đốc)**
  - Đánh giá và xếp hạng riêng biệt cho:
    1. **Công tác Tham mưu (việc thực hiện văn bản được giao)**
    2. **Công tác Đôn đốc, theo dõi Công an cấp xã**
    3. **Bảng tổng hợp thi đua chung toàn Đội**

---

## 🚀 HƯỚNG DẪN MỞ VÀ SỬ DỤNG

### 1. Mở ngay trên trình duyệt (Không cần cài đặt)
Nhấp đúp chuột vào tệp **`standalone_preview.html`** để mở trực tiếp trong Safari hoặc Chrome.

### 2. Chạy môi trường Node.js / Vite
```bash
cd "/Users/macbook/Documents/AI TEST/Web-quản lý công việc"
npm run dev
```

### 3. Triển khai lên Vercel
Kết nối thư mục mã nguồn với Vercel để nhận đường link trực tuyến chạy 24/7.
