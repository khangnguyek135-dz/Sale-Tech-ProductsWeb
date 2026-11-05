using System.Globalization;
using System.Net;
using Microsoft.EntityFrameworkCore;
using WebBanCongNghe.Helpers;
using WebBanCongNghe.Models.EF;
using WebBanCongNghe.Models.Entities;
using WebBanCongNghe.Models.Requests;
using WebBanCongNghe.Models.Responses;
using WebBanCongNghe.Validators;

namespace WebBanCongNghe.Services
{
    public class GadgetServices : IGadgetServices
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ILogger<GadgetServices> _logger;
        private readonly IConfiguration _configuration;
        private readonly IServiceScopeFactory _scopeFactory;

        public GadgetServices(
            ApplicationDbContext context,
            IWebHostEnvironment webHostEnvironment,
            ILogger<GadgetServices> logger,
            IConfiguration configuration,
            IServiceScopeFactory scopeFactory)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
            _logger = logger;
            _configuration = configuration;
            _scopeFactory = scopeFactory;
        }

        public Task<ThongTinThietBi?> GetGadgetAsync()
        {
            return _context.ThongTinThietBis.AsNoTracking().FirstOrDefaultAsync();
        }

        public Task<ThuongHieu?> GetBrandAsync(string maThuongHieu)
        {
            return _context.ThuongHieus.AsNoTracking().FirstOrDefaultAsync(x => x.MaThuongHieu == maThuongHieu);
        }

        public Task<List<DanhGia>> GetReviewsAsync()
        {
            return _context.DanhGias.AsNoTracking().OrderBy(x => x.Uid).ToListAsync();
        }

        public async Task<DonDatHang?> CreatePreOrderAsync(DatHangRequest request)
        {
            var thietBi = await _context.ThongTinThietBis.FindAsync(request.UidThietBi);
            if (thietBi is null) return null;

            var tamTinh = thietBi.GiaDatTruoc * request.SoLuong;
            var phiGiaoHang = tamTinh >= WebConstants.FreeShippingFrom ? 0m : WebConstants.ShippingFee;
            var now = DateTime.Now;

            var donHang = new DonDatHang
            {
                MaDonHang = $"PO{now:yyMMddHHmmss}{Random.Shared.Next(100, 1000)}",
                UidThietBi = request.UidThietBi,
                SoLuong = request.SoLuong,
                TenKhachHang = request.TenKhachHang.Trim(),
                SDT = DatHangRequestValidator.NormalizePhone(request.SDT),
                Email = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.Trim(),
                DiaChi = request.DiaChi.Trim(),
                MaHinhThucThanhToan = request.MaHinhThucThanhToan,
                MaTinhTrang = WebConstants.MaTinhTrangMoi,
                ThoiGianDat = now,
                TongTien = tamTinh + phiGiaoHang,
                GhiChu = request.GhiChu?.Trim() ?? string.Empty
            };

            _context.DonDatHangs.Add(donHang);
            await _context.SaveChangesAsync();

            return donHang;
        }

        public ThongTinChuyenKhoan TaoThongTinChuyenKhoan(DonDatHang donHang)
        {
            var thongTin = new ThongTinChuyenKhoan
            {
                MaDonHang = donHang.MaDonHang,
                NganHang = WebConstants.TenNganHangNhan,
                SoTaiKhoan = WebConstants.SoTaiKhoanNhan,
                TenTaiKhoan = WebConstants.TenTaiKhoanNhan,
                SoTien = donHang.TongTien,
                NoiDung = donHang.MaDonHang
            };

            try
            {
                string fileName = $"{donHang.MaDonHang}.png";
                string fileQRSavePath = Path.Combine(_webHostEnvironment.WebRootPath, WebConstants.QRFolder, fileName);
                string logoFile = Path.Combine(_webHostEnvironment.WebRootPath, WebConstants.QRLogo);

                if (!File.Exists(fileQRSavePath))
                {
                    string qrCode = Utils.GenerateQRCode(
                        bankCode: WebConstants.NganHangNhan,
                        accountNumber: WebConstants.SoTaiKhoanNhan,
                        amount: decimal.Round(donHang.TongTien).ToString("0"),
                        message: donHang.MaDonHang
                    );

                    Utils.GenerateQRCodeImageWithLogo(
                        qrCode,
                        fileQRSavePath,
                        logoFile,
                        300,
                        WebConstants.QRColor
                    );
                }

                thongTin.AnhQR = $"/{WebConstants.QRFolder}/{fileName}";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Không tạo được mã QR cho đơn đặt trước {MaDonHang}", donHang.MaDonHang);
            }

            return thongTin;
        }

        public ThongTinDonHang TaoThongTinDonHang(DonDatHang donHang)
        {
            bool chuyenKhoan = donHang.MaHinhThucThanhToan == WebConstants.MaThanhToanChuyenKhoan;

            return new ThongTinDonHang
            {
                MaDonHang = donHang.MaDonHang,
                SoLuong = donHang.SoLuong,
                TongTien = donHang.TongTien,
                MaHinhThucThanhToan = donHang.MaHinhThucThanhToan,
                TenHinhThucThanhToan = chuyenKhoan ? "Chuyển khoản đặt cọc" : "Thanh toán khi nhận hàng (COD)",
                ChuyenKhoan = chuyenKhoan ? TaoThongTinChuyenKhoan(donHang) : null
            };
        }

        public void GuiEmailDatHangThanhCongTrongNen(DonDatHang donHang)
        {
            _ = Task.Run(async () =>
            {
                using var scope = _scopeFactory.CreateScope();
                var gadgetServices = scope.ServiceProvider.GetRequiredService<IGadgetServices>();
                await gadgetServices.GuiEmailDatHangThanhCongAsync(donHang);
            });
        }

        public async Task GuiEmailDatHangThanhCongAsync(DonDatHang donHang)
        {
            if (string.IsNullOrWhiteSpace(donHang.Email)) return;

            try
            {
                var template = await _context.CaiDats.AsNoTracking()
                    .Where(x => x.SettingKey == WebConstants.KeyEmailDatHangThanhCong)
                    .OrderByDescending(x => x.CreateDate)
                    .Select(x => x.SettingContent)
                    .FirstOrDefaultAsync();

                if (string.IsNullOrWhiteSpace(template))
                {
                    _logger.LogWarning("Chưa cấu hình mẫu email trong bảng CaiDats");
                    return;
                }

                var thongTin = TaoThongTinDonHang(donHang);
                var vi = CultureInfo.GetCultureInfo("vi-VN");
                string Html(string? value) => WebUtility.HtmlEncode(value ?? string.Empty);

                const string qrContentId = "qr-chuyen-khoan";
                var inlineImages = new Dictionary<string, string>();
                string qrHtml = string.Empty;

                if (thongTin.ChuyenKhoan is { } ck)
                {
                    string qrFile = Path.Combine(_webHostEnvironment.WebRootPath, WebConstants.QRFolder, $"{donHang.MaDonHang}.png");
                    string qrRow = string.Empty;
                    if (File.Exists(qrFile))
                    {
                        inlineImages[qrContentId] = qrFile;
                        qrRow = $"<tr><td colspan=\"2\" align=\"center\" style=\"padding:18px 16px 6px;\"><img src=\"cid:{qrContentId}\" width=\"220\" height=\"220\" alt=\"Mã QR thanh toán cọc\" style=\"display:block;width:220px;height:220px;background-color:#FFFFFF;padding:8px;border-radius:10px;\"></td></tr>";
                    }

                    qrHtml =
                        "<p style=\"margin:0 0 10px;font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#845A24;\">Thông tin chuyển khoản cọc</p>" +
                        "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"background-color:#EAE0D2;border-radius:12px;\">" +
                        qrRow +
                        $"<tr><td style=\"padding:8px 16px;font-size:14px;color:#6B6378;\">Ngân hàng</td><td align=\"right\" style=\"padding:8px 16px;font-size:14px;\">{Html(ck.NganHang)}</td></tr>" +
                        $"<tr><td style=\"padding:8px 16px;font-size:14px;color:#6B6378;\">Số tài khoản</td><td align=\"right\" style=\"padding:8px 16px;font-size:14px;font-weight:bold;color:#34205E;\">{Html(ck.SoTaiKhoan)}</td></tr>" +
                        $"<tr><td style=\"padding:8px 16px;font-size:14px;color:#6B6378;vertical-align:top;\">Chủ tài khoản</td><td align=\"right\" style=\"padding:8px 16px;font-size:14px;\">{Html(ck.TenTaiKhoan)}</td></tr>" +
                        $"<tr><td style=\"padding:8px 16px;font-size:14px;color:#6B6378;\">Số tiền</td><td align=\"right\" style=\"padding:8px 16px;font-size:14px;font-weight:bold;color:#34205E;\">{ck.SoTien.ToString("N0", vi)}đ</td></tr>" +
                        $"<tr><td style=\"padding:8px 16px 16px;font-size:14px;color:#6B6378;\">Nội dung</td><td align=\"right\" style=\"padding:8px 16px 16px;font-size:14px;font-weight:bold;color:#34205E;\">{Html(ck.NoiDung)}</td></tr>" +
                        "</table>";
                }

                string body = template
                    .Replace("{HoVaTen}", Html(donHang.TenKhachHang))
                    .Replace("{Email}", Html(donHang.Email))
                    .Replace("{DienThoai}", Html(donHang.SDT))
                    .Replace("{MaDonHang}", Html(donHang.MaDonHang))
                    .Replace("{DiaChi}", Html(donHang.DiaChi))
                    .Replace("{GhiChu}", string.IsNullOrWhiteSpace(donHang.GhiChu) ? "Không có" : Html(donHang.GhiChu))
                    .Replace("{HinhThucThanhToan}", Html(thongTin.TenHinhThucThanhToan))
                    .Replace("{QRChuyenKhoan}", qrHtml)
                    .Replace("{SoLuong}", donHang.SoLuong.ToString())
                    .Replace("{TongTien}", donHang.TongTien.ToString("N0", vi) + "đ");

                var smtp = _configuration.GetSection("GmailSMTP");
                await Utils.SendEmailAsync(
                    host: smtp["Host"] ?? "smtp.gmail.com",
                    port: smtp.GetValue("Port", 587),
                    fromEmail: smtp["From"] ?? string.Empty,
                    appPassword: smtp["AppPassword"] ?? string.Empty,
                    toEmail: donHang.Email!,
                    subject: WebConstants.TieuDeEmailDatHangThanhCong,
                    htmlBody: body,
                    inlineImages: inlineImages,
                    fromName: WebConstants.TenNguoiGuiEmail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Không gửi được email xác nhận cho đơn {MaDonHang}", donHang.MaDonHang);
            }
        }
    }
}