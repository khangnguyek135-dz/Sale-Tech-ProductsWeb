using System.ComponentModel.DataAnnotations;

namespace WebBanCongNghe.Models.ViewModels
{
    public class DashboardStatsViewModel
    {
        public decimal TongDoanhThu { get; set; }
        public int TongDonHang { get; set; }
        public int DonHangChoXacNhan { get; set; }
        public int TongThietBi { get; set; }
        public int TongTaiKhoan { get; set; }
        public List<OrderStatusCountDto> ThongKeTrangThai { get; set; } = new();
    }

    public class OrderStatusCountDto
    {
        public string MaTinhTrang { get; set; } = string.Empty;
        public string TenTinhTrang { get; set; } = string.Empty;
        public int SoLuong { get; set; }
    }

    public class DeviceUpsertDto
    {
        public int Uid { get; set; }

        [Required(ErrorMessage = "Tên thiết bị không được để trống.")]
        public string TenThietBi { get; set; } = string.Empty;

        public string DanhMuc { get; set; } = string.Empty;
        public string TieuDeChinh { get; set; } = string.Empty;
        public string TieuDePhu { get; set; } = string.Empty;

        [Range(0, 1000000000, ErrorMessage = "Giá gốc không hợp lệ.")]
        public decimal GiaGoc { get; set; }

        [Range(0, 1000000000, ErrorMessage = "Giá đặt trước không hợp lệ.")]
        public decimal GiaDatTruoc { get; set; }

        public string AnhThietBi { get; set; } = string.Empty;
        public string LinkYoutubeReview { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mã thương hiệu không được để trống.")]
        public string MaThuongHieu { get; set; } = string.Empty;

        public string ThongSoKyThuat { get; set; } = string.Empty;
        public string DanhSachAnhHandsOn { get; set; } = string.Empty;
    }

    public class UserManageDto
    {
        public int Uid { get; set; }

        [Required(ErrorMessage = "Họ tên không để trống.")]
        public string HoTen { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email không để trống.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Role không để trống.")]
        public string Role { get; set; } = string.Empty;

        public string? MatKhauMoi { get; set; }
    }
}