using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace WebBanCongNghe.Models.Entities
{
    public class ThongTinThietBi
    {
        [Key]
        public int Uid { get; set; }
        public string TenThietBi { get; set; } = string.Empty;
        public string DanhMuc { get; set; } = string.Empty;
        public string TieuDeChinh { get; set; } = string.Empty;
        public string TieuDePhu { get; set; } = string.Empty;

        [Precision(18, 2)]
        public decimal GiaGoc { get; set; }

        [Precision(18, 2)]
        public decimal GiaDatTruoc { get; set; }

        public string AnhThietBi { get; set; } = string.Empty;
        public string LinkYoutubeReview { get; set; } = string.Empty;
        public string MaThuongHieu { get; set; } = string.Empty;
        public string ThongSoKyThuat { get; set; } = string.Empty; // Chuỗi JSON hoặc HTML mô tả thông số
        public string DanhSachAnhHandsOn { get; set; } = string.Empty;
    }
}