using System.ComponentModel.DataAnnotations;

namespace WebBanCongNghe.Models.Entities
{
    public class TinhTrangDonHang
    {
        [Key]
        public string MaTinhTrang { get; set; } = string.Empty;
        public string TenTinhTrang { get; set; } = string.Empty;
        public int Ordering { get; set; }
    }
}
