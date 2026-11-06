using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WebBanCongNghe.Helpers;
using WebBanCongNghe.Models.EF;
using WebBanCongNghe.Models.Entities;
using WebBanCongNghe.Models.ViewModels;

namespace WebBanCongNghe.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IPasswordHasher<TaiKhoan> _passwordHasher;

        public AccountController(ApplicationDbContext context, IPasswordHasher<TaiKhoan> passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            if (!ModelState.IsValid)
                return Json(new { success = false, message = "Dữ liệu nhập không hợp lệ." });

            string cleanEmail = EmailValidatorHelper.NormalizeEmail(model.Email);
            var user = await _context.TaiKhoans.FirstOrDefaultAsync(u => u.Email == cleanEmail);

            if (user == null)
                return Json(new { success = false, message = "Tài khoản Email không tồn tại trong hệ thống." });

            var verifyResult = _passwordHasher.VerifyHashedPassword(user, user.MatKhau, model.MatKhau);
            bool isValidPassword = verifyResult == PasswordVerificationResult.Success || user.MatKhau == model.MatKhau;

            if (!isValidPassword)
                return Json(new { success = false, message = "Mật khẩu không chính xác." });

            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Uid.ToString()),
        new Claim(ClaimTypes.Name, user.HoTen),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, string.IsNullOrWhiteSpace(user.Role) ? "User" : user.Role)
    };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var authProperties = new AuthenticationProperties
            {
                IsPersistent = model.GhiNho,
                ExpiresUtc = DateTimeOffset.UtcNow.AddDays(7)
            };

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), authProperties);

            // Xác định đường dẫn chuyển hướng dựa trên Role
            string redirectUrl = string.Equals(user.Role, "Admin", StringComparison.OrdinalIgnoreCase) ? "/Admin" : "";

            return Json(new
            {
                success = true,
                message = "Đăng nhập thành công!",
                isAdmin = string.Equals(user.Role, "Admin", StringComparison.OrdinalIgnoreCase),
                redirectUrl = redirectUrl
            });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
        {
            if (!ModelState.IsValid)
            {
                var firstError = ModelState.Values.SelectMany(v => v.Errors).FirstOrDefault()?.ErrorMessage;
                return Json(new { success = false, message = firstError ?? "Dữ liệu đăng ký không hợp lệ." });
            }

            var (isValidEmail, emailError) = EmailValidatorHelper.ValidateEmailFormat(model.Email);
            if (!isValidEmail)
                return Json(new { success = false, message = emailError });

            string cleanEmail = EmailValidatorHelper.NormalizeEmail(model.Email);
            bool emailExists = await _context.TaiKhoans.AnyAsync(u => u.Email == cleanEmail);
            if (emailExists)
                return Json(new { success = false, message = "Email này đã được sử dụng cho tài khoản khác." });

            var newUser = new TaiKhoan
            {
                Email = cleanEmail,
                HoTen = model.HoTen.Trim(),
                Role = "User" // Mặc định role là User bình thường
            };
            newUser.MatKhau = _passwordHasher.HashPassword(newUser, model.MatKhau);

            _context.TaiKhoans.Add(newUser);
            await _context.SaveChangesAsync();

            return Json(new { success = true, message = "Đăng ký thành công! Bạn có thể đăng nhập ngay." });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordViewModel model)
        {
            string cleanEmail = EmailValidatorHelper.NormalizeEmail(model.Email);
            var (isValidEmail, emailError) = EmailValidatorHelper.ValidateEmailFormat(cleanEmail);
            if (!isValidEmail)
                return Json(new { success = false, message = emailError });

            var user = await _context.TaiKhoans.FirstOrDefaultAsync(u => u.Email == cleanEmail);
            if (user == null)
                return Json(new { success = false, message = "Email chưa được đăng ký trên hệ thống." });

            string tempPassword = Guid.NewGuid().ToString("N")[..8];
            user.MatKhau = _passwordHasher.HashPassword(user, tempPassword);

            _context.TaiKhoans.Update(user);
            await _context.SaveChangesAsync();

            return Json(new { success = true, message = $"Khôi phục thành công! Mật khẩu mới của bạn là: {tempPassword}" });
        }

        [Authorize]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileViewModel model)
        {
            string? userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out int userId))
                return Json(new { success = false, message = "Phiên làm việc không hợp lệ." });

            var user = await _context.TaiKhoans.FindAsync(userId);
            if (user == null)
                return Json(new { success = false, message = "Không tìm thấy dữ liệu người dùng." });

            var (isValidEmail, emailError) = EmailValidatorHelper.ValidateEmailFormat(model.Email);
            if (!isValidEmail)
                return Json(new { success = false, message = emailError });

            string cleanEmail = EmailValidatorHelper.NormalizeEmail(model.Email);
            if (cleanEmail != user.Email)
            {
                bool exists = await _context.TaiKhoans.AnyAsync(u => u.Email == cleanEmail && u.Uid != user.Uid);
                if (exists)
                    return Json(new { success = false, message = "Email mới đã được đăng ký bởi tài khoản khác." });
                user.Email = cleanEmail;
            }

            user.HoTen = model.HoTen.Trim();
            // LƯU Ý BẢO MẬT: Giữ nguyên user.Role, tuyệt đối không gán giá trị mới từ Request.

            if (!string.IsNullOrWhiteSpace(model.MatKhauMoi))
            {
                if (string.IsNullOrWhiteSpace(model.MatKhauHienTai))
                    return Json(new { success = false, message = "Vui lòng nhập mật khẩu hiện tại để xác nhận đổi mật khẩu." });

                var verifyResult = _passwordHasher.VerifyHashedPassword(user, user.MatKhau, model.MatKhauHienTai);
                if (verifyResult == PasswordVerificationResult.Failed && user.MatKhau != model.MatKhauHienTai)
                    return Json(new { success = false, message = "Mật khẩu hiện tại không chính xác." });

                if (model.MatKhauMoi.Length < 6)
                    return Json(new { success = false, message = "Mật khẩu mới phải từ 6 ký tự trở lên." });

                if (model.MatKhauMoi != model.XacNhanMatKhauMoi)
                    return Json(new { success = false, message = "Xác nhận mật khẩu mới không trùng khớp." });

                user.MatKhau = _passwordHasher.HashPassword(user, model.MatKhauMoi);
            }

            _context.TaiKhoans.Update(user);
            await _context.SaveChangesAsync();

            // Cập nhật lại Identity Principal Claims Cookie
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Uid.ToString()),
                new Claim(ClaimTypes.Name, user.HoTen),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));

            return Json(new { success = true, message = "Cập nhật thông tin tài khoản thành công!" });
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetOrderHistory()
        {
            string rawEmail = User.FindFirstValue(ClaimTypes.Email) ?? string.Empty;
            string cleanEmail = EmailValidatorHelper.NormalizeEmail(rawEmail);

            if (string.IsNullOrEmpty(cleanEmail))
                return Json(new { success = false, message = "Phiên làm việc hết hạn." });

            var orders = await _context.DonDatHangs
                .Where(d => d.Email != null && d.Email.ToLower().Trim() == cleanEmail)
                .OrderByDescending(d => d.ThoiGianDat)
                .Select(d => new
                {
                    d.Uid,
                    d.MaDonHang,
                    d.TenKhachHang,
                    d.SDT,
                    d.DiaChi,
                    d.SoLuong,
                    d.TongTien,
                    d.MaHinhThucThanhToan,
                    d.MaTinhTrang,
                    ThoiGianDat = d.ThoiGianDat.ToString("dd/MM/yyyy HH:mm"),
                    d.GhiChu
                })
                .ToListAsync();

            return Json(new { success = true, data = orders });
        }
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            // Lấy Email tài khoản đăng nhập hiện tại
            string? loggedInEmail = User.FindFirstValue(ClaimTypes.Email);

            // Nếu người dùng đang đăng nhập, ưu tiên lấy Email tài khoản để đồng bộ Lịch sử giao dịch
            string finalEmail = !string.IsNullOrWhiteSpace(loggedInEmail)
                ? EmailValidatorHelper.NormalizeEmail(loggedInEmail)
                : EmailValidatorHelper.NormalizeEmail(dto.Email);

            var order = new DonDatHang
            {
                MaDonHang = "DH" + DateTime.Now.ToString("yyyyMMddHHmmss"),
                TenKhachHang = dto.FullName.Trim(),
                SDT = dto.Phone.Trim(),
                Email = finalEmail, // Email đã được làm sạch khoảng trắng
                DiaChi = dto.AddressLine.Trim() + ", " + dto.Province,
                SoLuong = dto.Quantity,
                TongTien = dto.TotalAmount,
                MaHinhThucThanhToan = dto.PaymentMethod,
                MaTinhTrang = "Chờ xác nhận cọc",
                ThoiGianDat = DateTime.Now,
                GhiChu = dto.Note ?? ""
            };

            _context.DonDatHangs.Add(order);
            await _context.SaveChangesAsync();

            return Json(new { success = true, maDonHang = order.MaDonHang });
        }
        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Index", "Home");
        }
    }
}