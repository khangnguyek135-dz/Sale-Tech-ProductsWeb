# CyberCraft Labs – E-Commerce & Pre-Order Landing Page Thiết Bị Công Nghệ Custom

Website giới thiệu và nhận đặt hàng trước (Pre-Order) các dòng bàn phím cơ Custom cao cấp (**CyberBoard Ultra 75%**), được xây dựng trên nền tảng **ASP.NET Core MVC (.NET 10)**, **Entity Framework Core** và **SQL Server**. 

Hệ thống tích hợp đầy đủ tính năng tương tác âm học thời gian thực (Web Audio API), trải nghiệm bóc tách linh kiện (Exploded View), đặt cọc giữ suất và trang **Admin Dashboard** quản trị toàn diện.

---

## 🌟 Tính Năng Nổi Bật

### 1. Dành Cho Khách Hàng (Customer Landing Page)
- **Hero Pre-Order & Đếm Ngược Giữ Suất**: Đồng hồ đếm ngược ưu đãi, thanh tiến độ số suất còn lại thời gian thực và bộ chọn nhanh màu sắc vỏ nhôm CNC (Anodized Cyber Purple, Space Gray, E-White) / Switch.
- **Interactive Sound Lab**: Trình nghe thử chất âm gõ phím nguyên bản (Stock) hỗ trợ 3 hệ Switch (*Linear Silent 42g*, *Tactile Thocky 55g*, *Clicky Crisp 50g*) tích hợp Waveform Visualizer.
- **Interactive 75% Key Rollover Tester**: Trình gõ thử toàn bộ 81 phím trên bàn phím ảo ngay trong trình duyệt, tự động phát âm thanh switch bằng **Web Audio API** khi nhấn phím thật hoặc click chuột.
- **Bóc Tách Cấu Trúc Linh Kiện (Exploded Gallery)**: Xem chi tiết từng lớp vật liệu (Vỏ nhôm 6063, Gasket Mount, PCB Flex-cut, 5 lớp Foam Poron) kết hợp cửa sổ phóng đại Lightbox độ phân giải cao.
- **Đặt Hàng Pre-Order Nhanh**:
  - Modal đặt cọc tự động điền Email/Họ tên của tài khoản đang đăng nhập để đồng bộ Lịch sử giao dịch.
  - Tự động tính tổng đơn và tiền đặt cọc giữ suất (Deposit).
  - Bảo mật Anti-CSRF với `[ValidateAntiForgeryToken]`, kiểm tra ràng buộc 2 lớp (Client & Server với FluentValidation).
  - Hỗ trợ 2 hình thức: Chuyển khoản QR Đặt cọc hoặc Xác nhận giữ suất COD.

### 2. Trang Quản Trị Hệ Thống (Admin Dashboard - `/Admin`)
- **Giao Diện Dark Vibe**: Thiết kế chuẩn tone màu Cyber-Dark (#0b0f19), khoảng cách hiển thị thoáng đãng và chuẩn hóa Font Size.
- **Single-Page Workspace**: Chuyển đổi linh hoạt 8 phân khu quản trị mà không nạp lại trang:
  - **Dashboard Thống Kê**: Doanh thu tổng, tổng số đơn đặt cọc, đơn chờ xác nhận và biểu đồ phân phối trạng thái đơn hàng.
  - **Quản Lý Đơn Đặt Hàng (`DonDatHang`)**: Bộ lọc tìm kiếm nhanh theo mã đơn, SĐT, tên khách; đổi trạng thái đơn hàng trực tiếp qua AJAX.
  - **Quản Lý Thiết Bị (`ThongTinThietBi`)**: Thêm/Sửa/Xóa thông số kỹ thuật bàn phím, giá đặt trước, link Youtube Review và bộ sưu tập ảnh Hands-on.
  - **Quản Lý Thương Hiệu (`ThuongHieu`)**: Cấu hình các đối tác và logo thương hiệu.
  - **Trạng Thái Đơn Hàng (`TinhTrangDonHang`)**: Cấu hình quy trình xử lý đơn.
  - **Quản Lý Đánh Giá (`DanhGia`)**: Duyệt và xóa đánh giá từ Reviewer.
  - **Quản Lý Tài Khoản & Phân Quyền (`TaiKhoan`)**: Phân quyền Hạn người dùng (`Admin` / `User`), hỗ trợ cấp lại mật khẩu.
  - **Cài Đặt Hệ Thống (`CaiDat`)**: Cấu hình chuỗi/JSON dạng Key/Value.

---

## 🛠 Công Nghệ Sử Dụng

| Thành Phần | Công Nghệ & Thư Viện |
|---|---|
| **Backend** | ASP.NET Core MVC (.NET 10), C# 13 |
| **ORM & Database** | Entity Framework Core 10, SQL Server (`WebGadgetDB`) |
| **Authentication & Security** | Cookie Authentication (Claims-based), PasswordHasher, Anti-CSRF Token |
| **Validation** | FluentValidation |
| **Frontend UI** | Razor Views, Tailwind CSS v4, Font Awesome 6 Pro, CSS Custom Properties |
| **Interactive & Audio** | Vanilla JavaScript (ES6+), Web Audio API (Tổng hợp âm thanh Switch) |
| **Popup & Thông Báo** | SweetAlert2 (Tối ưu Z-Index cao hơn Top-layer Dialog) |

---

## 📂 Cấu Trúc Thư Mục Project

```
WebBanSach/
├── Controllers/
│   ├── AccountController.cs       # Đăng nhập, Đăng ký, Đổi thông tin, Lịch sử giao dịch
│   ├── AdminController.cs         # Quản trị hệ thống (/Admin - Đã khóa [Authorize(Roles="Admin")])
│   ├── HomeController.cs          # Hiển thị Landing page chính
│   └── OrderController.cs         # Xử lý tạo mới đơn đặt hàng Pre-Order
├── Helpers/
│   ├── EmailValidatorHelper.cs    # Chuẩn hóa & Validate Email
│   └── WebConstants.cs            # Các hằng số định cấu hình
├── Models/
│   ├── EF/
│   │   └── ApplicationDbContext.cs # Khai báo 7 DbSet và cấu hình Precision
│   ├── Entities/                  # 7 Entity Mapping CSDL
│   │   ├── CaiDat.cs
│   │   ├── DanhGia.cs
│   │   ├── DonDatHang.cs
│   │   ├── TaiKhoan.cs
│   │   ├── ThongTinThietBi.cs
│   │   ├── ThuongHieu.cs
│   │   └── TinhTrangDonHang.cs
│   └── ViewModels/                # DTOs & ViewModels cho Admin và Đặt hàng
│       ├── AdminViewModels.cs
│       └── AccountViewModels.cs
├── Views/
│   ├── Admin/
│   │   └── Index.cshtml           # Single-Page Workspace Admin
│   ├── Home/
│   │   └── Index.cshtml           # Landing Page CyberBoard Ultra 75%
│   └── Shared/
│       ├── _AdminLayout.cshtml    # Master Layout dành riêng cho Admin (Dark Theme)
│       └── _Layout.cshtml         # Master Layout Landing Page
└── wwwroot/
    ├── css/
    │   ├── admin.css              # Styling độc lập cho Admin Center (Dark Vibe)
    │   └── site.css
    └── js/
        ├── data.js                # Dữ liệu tĩnh mảng cấu hình âm thanh, linh kiện & FAQ
        ├── order.js               # Logic xử lý Form đặt hàng Pre-Order
        └── preview.js             # Controls cho Gallery Lightbox & Sound Lab
```

---

## 🗄 7 Bảng CSDL (Database Schema)

| Tên Bảng | Khóa Chính | Khóa Ngoại / Liên Kết | Mô Tả |
|---|---|---|---|
| `ThongTinThietBis` | `Uid` (int) | `MaThuongHieu` | Danh mục sản phẩm công nghệ (bàn phím, giá bán, cấu hình âm học) |
| `ThuongHieus` | `MaThuongHieu` (string) | - | Thông tin hãng sản xuất (Logo, giới thiệu) |
| `DonDatHangs` | `Uid` (int) | `UidThietBi` | Thông tin đơn đặt cọc Pre-Order của khách hàng |
| `TinhTrangDonHangs` | `MaTinhTrang` (string) | - | Trạng thái quy trình đơn hàng (`MOI`, `CHO_COC`, `HOAN_TAT`...) |
| `DanhGias` | `Uid` (int) | - | Nhận xét & đánh giá sao từ các Tech Reviewer |
| `TaiKhoans` | `Uid` (int) | - | Tài khoản người dùng & Quản trị viên (`Role` = 'Admin' / 'User') |
| `CaiDats` | `Uid` (int) | - | Lưu cấu hình hệ thống dạng `SettingKey` / `SettingContent` |

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### Yêu Cầu Môi Trường
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- **SQL Server 2019+** (hoặc SQL Express / LocalDB)
- Visual Studio 2022 (phiên bản 17.10+) hoặc VS Code

### Các Bước Thực Hiện

#### 1. Clone Dự Án
```bash
git clone <repository-url>
cd WebBanSach/WebBanSach
```

#### 2. Cấu Hình Chuỗi Kết Nối CSDL
Mở file `appsettings.json` và cập nhật thông số kết nối SQL Server tại key `WebBanSachCST`:

```json
"ConnectionStrings": {
  "WebBanSachCST": "Server=YOUR_SERVER_NAME;Database=WebGadgetDB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True;"
}
```

#### 3. Tạo CSDL & Migration (EF Core)
Mở **Package Manager Console** hoặc Terminal tại thư mục project và chạy:

```bash
dotnet ef database update
```

#### 4. Phân Quyền Tài Khoản Admin
Sau khi đăng ký một tài khoản trên giao diện web, mở **SQL Server Management Studio (SSMS)** và cập nhật quyền `Admin` cho tài khoản đó:

```sql
USE WebGadgetDB;
GO

UPDATE TaiKhoans 
SET Role = 'Admin' 
WHERE Email = 'your-email@example.com';
GO
```

#### 5. Khởi Chạy Ứng Dụng
```bash
dotnet run
```
Mở trình duyệt và truy cập `https://localhost:7144`.

---

## 🔐 Truy Cập Trang Quản Trị (Admin Center)

1. Đăng xuất tài khoản hiện tại (nếu đang đăng nhập dưới dạng `User`).
2. Đăng nhập lại với tài khoản đã được cấp quyền `Admin` ở bước trên.
3. Hệ thống sẽ **tự động chuyển hướng** vào Dashboard, hoặc bạn có thể truy cập trực tiếp đường dẫn:
   `https://localhost:7144/Admin`

---

## ⚡ API Endpoint Đặt Hàng (`CreateOrderDto`)

**Request**: `POST /Order/CreateOrder` (JSON Format)

```json
{
  "fullName": "Nguyễn Lê Quốc Anh",
  "phone": "0912345678",
  "email": "anhnguyen14nt@gmail.com",
  "province": "TP. Hồ Chí Minh",
  "addressLine": "123 Đường Nguyễn Huệ, Quận 1",
  "quantity": 1,
  "totalAmount": 5200000,
  "paymentMethod": "CHUYEN_KHOAN",
  "note": "Yêu cầu mod sẵn Stab Lubed 205g0"
}
```

**Response**:
```json
{
  "success": true,
  "maDonHang": "DH20261105213000"
}
```