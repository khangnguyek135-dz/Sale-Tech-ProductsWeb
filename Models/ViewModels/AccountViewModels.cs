using System.ComponentModel.DataAnnotations;

namespace WebBanCongNghe.Models.ViewModels
{
    public class CreateOrderDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public string AddressLine { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal TotalAmount { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string? Note { get; set; }
    }
    public class LoginViewModel
    {
        [Required(ErrorMessage = "Vui lòng nhập Email.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vui lòng nhập Mật khẩu.")]
        [DataType(DataType.Password)]
        public string MatKhau { get; set; } = string.Empty;

        public bool GhiNho { get; set; } = false;
    }

    public class RegisterViewModel
    {
        [Required(ErrorMessage = "Vui lòng nhập Họ và tên.")]
        [StringLength(100, ErrorMessage = "Họ tên không vượt quá 100 ký tự.")]
        public string HoTen { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vui lòng nhập Email.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vui lòng nhập Mật khẩu.")]
        [MinLength(6, ErrorMessage = "Mật khẩu tối thiểu 6 ký tự.")]
        [DataType(DataType.Password)]
        public string MatKhau { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vui lòng xác nhận mật khẩu.")]
        [Compare("MatKhau", ErrorMessage = "Mật khẩu xác nhận không trùng khớp.")]
        [DataType(DataType.Password)]
        public string XacNhanMatKhau { get; set; } = string.Empty;
    }

    public class ForgotPasswordViewModel
    {
        [Required(ErrorMessage = "Vui lòng nhập Email đã đăng ký.")]
        public string Email { get; set; } = string.Empty;
    }

    public class UpdateProfileViewModel
    {
        [Required(ErrorMessage = "Họ và tên không được để trống.")]
        public string HoTen { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email không được để trống.")]
        public string Email { get; set; } = string.Empty;

        public string? MatKhauHienTai { get; set; }
        public string? MatKhauMoi { get; set; }
        public string? XacNhanMatKhauMoi { get; set; }
    }
}