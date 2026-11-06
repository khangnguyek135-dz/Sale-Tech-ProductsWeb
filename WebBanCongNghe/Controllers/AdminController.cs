using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebBanCongNghe.Helpers;
using WebBanCongNghe.Models.EF;
using WebBanCongNghe.Models.Entities;
using WebBanCongNghe.Models.ViewModels;

namespace WebBanCongNghe.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IPasswordHasher<TaiKhoan> _passwordHasher;

        public AdminController(ApplicationDbContext context, IPasswordHasher<TaiKhoan> passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        public IActionResult Index()
        {
            return View();
        }

        // ================= 1. THỐNG KÊ DASHBOARD =================
        [HttpGet]
        public async Task<IActionResult> GetDashboardStats()
        {
            var counts = await _context.DonDatHangs
                .GroupBy(d => d.MaTinhTrang)
                .Select(g => new { Ma = g.Key, SoLuong = g.Count() })
                .ToListAsync();
            var names = await _context.TinhTrangDonHangs
                .ToDictionaryAsync(t => t.MaTinhTrang, t => t.TenTinhTrang);

            var stats = new DashboardStatsViewModel
            {
                TongDoanhThu = await _context.DonDatHangs.SumAsync(d => d.TongTien),
                TongDonHang = await _context.DonDatHangs.CountAsync(),
                DonHangChoXacNhan = await _context.DonDatHangs.CountAsync(d => d.MaTinhTrang == "CHO_XAC_NHAN" || d.MaTinhTrang == "Chờ xác nhận cọc"),
                TongThietBi = await _context.ThongTinThietBis.CountAsync(),
                TongTaiKhoan = await _context.TaiKhoans.CountAsync(),
                ThongKeTrangThai = counts.Select(x => new OrderStatusCountDto
                {
                    MaTinhTrang = x.Ma,
                    TenTinhTrang = x.Ma != null && names.TryGetValue(x.Ma, out var ten) ? ten : x.Ma,
                    SoLuong = x.SoLuong
                }).ToList()
            };

            return Json(new { success = true, data = stats });
        }

        // ================= 2. QUẢN LÝ ĐƠN HÀNG (DonDatHang) =================
        [HttpGet]
        public async Task<IActionResult> GetOrders(string? search, string? status)
        {
            var query = _context.DonDatHangs.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                string kw = search.Trim().ToLower();
                query = query.Where(o => o.MaDonHang.ToLower().Contains(kw) ||
                                         o.TenKhachHang.ToLower().Contains(kw) ||
                                         o.SDT.Contains(kw) ||
                                         (o.Email != null && o.Email.ToLower().Contains(kw)));
            }

            if (!string.IsNullOrWhiteSpace(status) && status != "ALL")
            {
                query = query.Where(o => o.MaTinhTrang == status);
            }

            var list = await query.OrderByDescending(o => o.ThoiGianDat).ToListAsync();
            return Json(new { success = true, data = list });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, string status)
        {
            var order = await _context.DonDatHangs.FindAsync(orderId);
            if (order == null)
                return Json(new { success = false, message = "Không tìm thấy đơn hàng." });

            if (!await _context.TinhTrangDonHangs.AnyAsync(t => t.MaTinhTrang == status))
                return Json(new { success = false, message = "Mã trạng thái không tồn tại." });

            order.MaTinhTrang = status;
            _context.DonDatHangs.Update(order);
            await _context.SaveChangesAsync();

            return Json(new { success = true, message = "Cập nhật trạng thái đơn hàng thành công!" });
        }

        // ================= 3. QUẢN LÝ THIẾT BỊ (ThongTinThietBi) =================
        [HttpGet]
        public async Task<IActionResult> GetDevices()
        {
            var list = await _context.ThongTinThietBis.ToListAsync();
            return Json(new { success = true, data = list });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpsertDevice([FromBody] DeviceUpsertDto dto)
        {
            if (!ModelState.IsValid)
                return Json(new { success = false, message = "Dữ liệu thiết bị không hợp lệ." });

            if (!await _context.ThuongHieus.AnyAsync(b => b.MaThuongHieu == dto.MaThuongHieu.Trim()))
                return Json(new { success = false, message = "Thương hiệu không tồn tại. Hãy thêm thương hiệu trước." });

            if (dto.Uid == 0)
            {
                var device = new ThongTinThietBi
                {
                    TenThietBi = dto.TenThietBi.Trim(),
                    DanhMuc = dto.DanhMuc.Trim(),
                    TieuDeChinh = dto.TieuDeChinh.Trim(),
                    TieuDePhu = dto.TieuDePhu.Trim(),
                    GiaGoc = dto.GiaGoc,
                    GiaDatTruoc = dto.GiaDatTruoc,
                    AnhThietBi = dto.AnhThietBi.Trim(),
                    LinkYoutubeReview = dto.LinkYoutubeReview.Trim(),
                    MaThuongHieu = dto.MaThuongHieu.Trim(),
                    ThongSoKyThuat = dto.ThongSoKyThuat,
                    DanhSachAnhHandsOn = dto.DanhSachAnhHandsOn
                };
                _context.ThongTinThietBis.Add(device);
            }
            else
            {
                var device = await _context.ThongTinThietBis.FindAsync(dto.Uid);
                if (device == null)
                    return Json(new { success = false, message = "Không tìm thấy thiết bị." });

                device.TenThietBi = dto.TenThietBi.Trim();
                device.DanhMuc = dto.DanhMuc.Trim();
                device.TieuDeChinh = dto.TieuDeChinh.Trim();
                device.TieuDePhu = dto.TieuDePhu.Trim();
                device.GiaGoc = dto.GiaGoc;
                device.GiaDatTruoc = dto.GiaDatTruoc;
                device.AnhThietBi = dto.AnhThietBi.Trim();
                device.LinkYoutubeReview = dto.LinkYoutubeReview.Trim();
                device.MaThuongHieu = dto.MaThuongHieu.Trim();
                device.ThongSoKyThuat = dto.ThongSoKyThuat;
                device.DanhSachAnhHandsOn = dto.DanhSachAnhHandsOn;

                _context.ThongTinThietBis.Update(device);
            }

            await _context.SaveChangesAsync();
            return Json(new { success = true, message = "Lưu thông tin thiết bị thành công!" });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteDevice(int id)
        {
            var device = await _context.ThongTinThietBis.FindAsync(id);
            if (device == null)
                return Json(new { success = false, message = "Thiết bị không tồn tại." });

            _context.ThongTinThietBis.Remove(device);
            await _context.SaveChangesAsync();
            return Json(new { success = true, message = "Đã xóa thiết bị." });
        }

        // ================= 4. QUẢN LÝ THƯƠNG HIỆU (ThuongHieu) =================
        [HttpGet]
        public async Task<IActionResult> GetBrands()
        {
            var list = await _context.ThuongHieus.ToListAsync();
            return Json(new { success = true, data = list });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpsertBrand([FromBody] ThuongHieu brand)
        {
            if (string.IsNullOrWhiteSpace(brand.MaThuongHieu))
                return Json(new { success = false, message = "Mã thương hiệu không được để trống." });
            if (string.IsNullOrWhiteSpace(brand.TenThuongHieu))
                return Json(new { success = false, message = "Tên thương hiệu không được để trống." });

            brand.MaThuongHieu = brand.MaThuongHieu.Trim();
            brand.TenThuongHieu = brand.TenThuongHieu.Trim();
            var existing = await _context.ThuongHieus.FindAsync(brand.MaThuongHieu);
            if (existing == null)
            {
                _context.ThuongHieus.Add(brand);
            }
            else
            {
                existing.TenThuongHieu = brand.TenThuongHieu;
                existing.GioiThieu = brand.GioiThieu;
                existing.Logo = brand.Logo;
                _context.ThuongHieus.Update(existing);
            }

            await _context.SaveChangesAsync();
            return Json(new { success = true, message = "Cập nhật thương hiệu thành công!" });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteBrand(string code)
        {
            var brand = await _context.ThuongHieus.FindAsync(code);
            if (brand == null)
                return Json(new { success = false, message = "Thương hiệu không tồn tại." });

            int used = await _context.ThongTinThietBis.CountAsync(d => d.MaThuongHieu == code);
            if (used > 0)
                return Json(new { success = false, message = $"Còn {used} thiết bị đang dùng thương hiệu này. Đổi hoặc xóa các thiết bị đó trước." });

            _context.ThuongHieus.Remove(brand);
            await _context.SaveChangesAsync();
            return Json(new { success = true, message = "Đã xóa thương hiệu." });
        }

        // ================= 5. QUẢN LÝ TRẠNG THÁI ĐƠN HÀNG (TinhTrangDonHang) =================
        [HttpGet]
        public async Task<IActionResult> GetOrderStatuses()
        {
            var list = await _context.TinhTrangDonHangs.OrderBy(t => t.Ordering).ToListAsync();
            return Json(new { success = true, data = list });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpsertOrderStatus([FromBody] TinhTrangDonHang item)
        {
            if (string.IsNullOrWhiteSpace(item.MaTinhTrang) || string.IsNullOrWhiteSpace(item.TenTinhTrang))
                return Json(new { success = false, message = "Mã và tên trạng thái không được để trống." });

            item.MaTinhTrang = item.MaTinhTrang.Trim();
            item.TenTinhTrang = item.TenTinhTrang.Trim();
            var existing = await _context.TinhTrangDonHangs.FindAsync(item.MaTinhTrang);
            if (existing == null)
            {
                _context.TinhTrangDonHangs.Add(item);
            }
            else
            {
                existing.TenTinhTrang = item.TenTinhTrang;
                existing.Ordering = item.Ordering;
                _context.TinhTrangDonHangs.Update(existing);
            }

            await _context.SaveChangesAsync();
            return Json(new { success = true, message = "Cập nhật trạng thái thành công!" });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteOrderStatus(string code)
        {
            var item = await _context.TinhTrangDonHangs.FindAsync(code);
            if (item == null)
                return Json(new { success = false, message = "Trạng thái không tồn tại." });

            int used = await _context.DonDatHangs.CountAsync(o => o.MaTinhTrang == code);
            if (used > 0)
                return Json(new { success = false, message = $"Còn {used} đơn hàng đang ở trạng thái này. Chuyển các đơn đó sang trạng thái khác trước." });

            _context.TinhTrangDonHangs.Remove(item);
            await _context.SaveChangesAsync();
            return Json(new { success = true, message = "Đã xóa trạng thái." });
        }

        // ================= 6. QUẢN LÝ ĐÁNH GIÁ (DanhGia) =================
        [HttpGet]
        public async Task<IActionResult> GetReviews()
        {
            var list = await _context.DanhGias.ToListAsync();
            return Json(new { success = true, data = list });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var item = await _context.DanhGias.FindAsync(id);
            if (item == null)
                return Json(new { success = false, message = "Đánh giá không tồn tại." });

            _context.DanhGias.Remove(item);
            await _context.SaveChangesAsync();
            return Json(new { success = true, message = "Đã xóa đánh giá." });
        }

        // ================= 7. QUẢN LÝ TÀI KHOẢN (TaiKhoan - Cho phép sửa Role Admin/User) =================
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var list = await _context.TaiKhoans
                .Select(u => new { u.Uid, u.Email, u.HoTen, u.Role })
                .ToListAsync();
            return Json(new { success = true, data = list });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateUser([FromBody] UserManageDto dto)
        {
            var user = await _context.TaiKhoans.FindAsync(dto.Uid);
            if (user == null)
                return Json(new { success = false, message = "Không tìm thấy tài khoản." });

            string cleanEmail = EmailValidatorHelper.NormalizeEmail(dto.Email);
            if (cleanEmail != user.Email)
            {
                bool exists = await _context.TaiKhoans.AnyAsync(u => u.Email == cleanEmail && u.Uid != user.Uid);
                if (exists)
                    return Json(new { success = false, message = "Email trùng với tài khoản khác." });
                user.Email = cleanEmail;
            }

            user.HoTen = dto.HoTen.Trim();
            user.Role = dto.Role.Trim(); // Quản trị viên được quyền gán Role (Admin/User)

            if (!string.IsNullOrWhiteSpace(dto.MatKhauMoi))
            {
                user.MatKhau = _passwordHasher.HashPassword(user, dto.MatKhauMoi);
            }

            _context.TaiKhoans.Update(user);
            await _context.SaveChangesAsync();
            return Json(new { success = true, message = "Cập nhật thông tin tài khoản thành công!" });
        }

        // ================= 8. QUẢN LÝ CÀI ĐẶT HỆ THỐNG (CaiDat) =================
        [HttpGet]
        public async Task<IActionResult> GetSettings()
        {
            var list = await _context.CaiDats.ToListAsync();
            return Json(new { success = true, data = list });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SaveSetting([FromBody] CaiDat setting)
        {
            if (string.IsNullOrWhiteSpace(setting.SettingKey))
                return Json(new { success = false, message = "Khóa cấu hình không được để trống." });

            setting.SettingKey = setting.SettingKey.Trim();
            var existing = await _context.CaiDats.FirstOrDefaultAsync(s => s.SettingKey == setting.SettingKey);
            if (existing == null)
            {
                setting.CreateDate = DateTime.Now;
                _context.CaiDats.Add(setting);
            }
            else
            {
                existing.SettingContent = setting.SettingContent;
                _context.CaiDats.Update(existing);
            }

            await _context.SaveChangesAsync();
            return Json(new { success = true, message = "Lưu cấu hình hệ thống thành công!" });
        }
    }
}