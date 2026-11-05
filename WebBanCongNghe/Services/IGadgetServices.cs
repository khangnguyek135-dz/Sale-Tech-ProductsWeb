using WebBanCongNghe.Models.Entities;
using WebBanCongNghe.Models.Requests;
using WebBanCongNghe.Models.Responses;

namespace WebBanCongNghe.Services
{
    public interface IGadgetServices
    {
        Task<ThongTinThietBi?> GetGadgetAsync();
        Task<ThuongHieu?> GetBrandAsync(string maThuongHieu);
        Task<List<DanhGia>> GetReviewsAsync();
        Task<DonDatHang?> CreatePreOrderAsync(DatHangRequest request);
        ThongTinChuyenKhoan TaoThongTinChuyenKhoan(DonDatHang donHang);
        ThongTinDonHang TaoThongTinDonHang(DonDatHang donHang);
        Task GuiEmailDatHangThanhCongAsync(DonDatHang donHang);
        void GuiEmailDatHangThanhCongTrongNen(DonDatHang donHang);
    }
}