using System.Text.RegularExpressions;

namespace WebBanCongNghe.Helpers
{
    public static class EmailValidatorHelper
    {
        private static readonly string[] InvalidSuffixes = { ".con", ".comm", ".coom", ".cmo", ".gmai.com", ".gmil.com", ".gmal.com" };

        /// <summary>
        /// Xóa sạch mọi ký tự khoảng trắng (space, tab, newline) trong chuỗi email.
        /// </summary>
        public static string NormalizeEmail(string? email)
        {
            if (string.IsNullOrWhiteSpace(email)) return string.Empty;
            return Regex.Replace(email.Trim(), @"\s+", string.Empty).ToLowerInvariant();
        }

        /// <summary>
        /// Bắt toàn bộ lỗi định dạng email sai cú pháp.
        /// </summary>
        public static (bool IsValid, string ErrorMessage) ValidateEmailFormat(string rawEmail)
        {
            string email = NormalizeEmail(rawEmail);

            if (string.IsNullOrEmpty(email))
                return (false, "Email không được để trống.");

            // 1. Chống lỗi thiếu hoặc dư thừa ký tự @ (ví dụ: user@@gmail.com)
            int atCount = email.Count(c => c == '@');
            if (atCount == 0)
                return (false, "Email phải chứa ký tự '@'.");
            if (atCount > 1)
                return (false, "Email không hợp lệ (chứa nhiều hơn 1 ký tự '@').");

            // 2. Chống lỗi dấu chấm liên tiếp (ví dụ: gmail.com..com hoặc user..name@gmail.com)
            if (email.Contains(".."))
                return (false, "Email chứa ký tự dấu chấm sai cú pháp ('..').");

            // 3. Chống lỗi gõ nhầm đuôi tên miền (.con, .comm, .gmai.com...)
            foreach (var suffix in InvalidSuffixes)
            {
                if (email.EndsWith(suffix, StringComparison.OrdinalIgnoreCase))
                    return (false, $"Đuôi email '{suffix}' không hợp lệ. Bạn có muốn nhập '.com'?");
            }

            // 4. Kiểm tra Regex chuẩn RFC 5322
            string pattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
            if (!Regex.IsMatch(email, pattern))
                return (false, "Định dạng Email không đúng chuẩn (Ví dụ: example@gmail.com).");

            return (true, string.Empty);
        }
    }
}