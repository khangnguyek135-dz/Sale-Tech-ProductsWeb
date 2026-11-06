using System.ComponentModel.DataAnnotations;

namespace WebBanCongNghe.Models.Entities
{
    public class ThuongHieu
    {
        [Key]
        public string MaThuongHieu { get; set; } = string.Empty;
        public string TenThuongHieu { get; set; } = string.Empty;
        public string GioiThieu { get; set; } = string.Empty;
        public string Logo { get; set; } = string.Empty;
    }
}