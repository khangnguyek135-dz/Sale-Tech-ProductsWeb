using System.Text.RegularExpressions;
using FluentValidation;
using WebBanCongNghe.Helpers;
using WebBanCongNghe.Models.Requests;

namespace WebBanCongNghe.Validators
{
    public class DatHangRequestValidator : AbstractValidator<DatHangRequest>
    {
        private static readonly Regex PhoneRegex = new(@"^0(3|5|7|8|9)\d{8}$", RegexOptions.Compiled);

        public DatHangRequestValidator()
        {
            RuleFor(x => x.UidThietBi)
                .GreaterThan(0).WithMessage("Sản phẩm thiết bị không hợp lệ.");

            RuleFor(x => x.SoLuong)
                .InclusiveBetween(1, WebConstants.MaxOrderQuantity)
                .WithMessage($"Số lượng đặt trước phải từ 1 đến {WebConstants.MaxOrderQuantity} sản phẩm/đơn.");

            RuleFor(x => x.TenKhachHang)
                .Must(v => !string.IsNullOrWhiteSpace(v)).WithMessage("Vui lòng nhập họ và tên.")
                .Must(v => v.Trim().Length is >= 2 and <= 100).WithMessage("Họ tên cần từ 2 đến 100 ký tự.");

            RuleFor(x => x.SDT)
                .Must(v => !string.IsNullOrWhiteSpace(v)).WithMessage("Vui lòng nhập số điện thoại.")
                .Must(v => PhoneRegex.IsMatch(NormalizePhone(v))).WithMessage("Số điện thoại chưa đúng định dạng Việt Nam.");

            RuleFor(x => x.Email)
                .MaximumLength(100).WithMessage("Email tối đa 100 ký tự.")
                .EmailAddress().WithMessage("Email chưa đúng định dạng.")
                .When(x => !string.IsNullOrWhiteSpace(x.Email));

            RuleFor(x => x.DiaChi)
                .Must(v => !string.IsNullOrWhiteSpace(v)).WithMessage("Vui lòng nhập địa chỉ nhận hàng.")
                .Must(v => v.Trim().Length is >= 5 and <= 200).WithMessage("Địa chỉ cần từ 5 đến 200 ký tự.");

            RuleFor(x => x.MaHinhThucThanhToan)
                .Must(v => v is WebConstants.MaThanhToanCod or WebConstants.MaThanhToanChuyenKhoan)
                .WithMessage("Phương thức thanh toán không hợp lệ.");

            RuleFor(x => x.GhiChu)
                .MaximumLength(300).WithMessage("Ghi chú tối đa 300 ký tự.");
        }

        public static string NormalizePhone(string? raw)
        {
            var p = Regex.Replace(raw ?? string.Empty, @"[\s.\-()]", "");
            if (p.StartsWith("+84")) return "0" + p[3..];
            if (p.StartsWith("84") && p.Length == 11) return "0" + p[2..];
            return p;
        }
    }
}