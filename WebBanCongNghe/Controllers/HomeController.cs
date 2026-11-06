using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using WebBanCongNghe.Models;
using WebBanCongNghe.Models.Requests;
using WebBanCongNghe.Services;
using WebBanCongNghe.Validators;

namespace WebBanCongNghe.Controllers
{
    public class HomeController : Controller
    {
        private readonly IGadgetServices _gadgetServices;
        private readonly ILogger<HomeController> _logger;

        public HomeController(IGadgetServices gadgetServices, ILogger<HomeController> logger)
        {
            _gadgetServices = gadgetServices;
            _logger = logger;
        }

        public async Task<IActionResult> Index()
        {
            var gadget = await _gadgetServices.GetGadgetAsync();
            var brand = gadget != null ? await _gadgetServices.GetBrandAsync(gadget.MaThuongHieu) : null;
            var reviews = await _gadgetServices.GetReviewsAsync();

            ViewData["Gadget"] = gadget;
            ViewData["Brand"] = brand;
            ViewData["Reviews"] = reviews;

            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DatHang([FromBody] DatHangRequest request)
        {
            if (request == null)
            {
                var detail = string.Join("; ", ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => string.IsNullOrEmpty(e.ErrorMessage) ? e.Exception?.Message : e.ErrorMessage));
                return Json(new { status = 0, message = "Dữ liệu đơn hàng không đọc được: " + detail });
            }
            var validator = new DatHangRequestValidator();
            var validationResult = await validator.ValidateAsync(request);

            if (!validationResult.IsValid)
            {
                var errorMsg = string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage));
                return Json(new { status = 0, message = errorMsg });
            }

            var donHang = await _gadgetServices.CreatePreOrderAsync(request);
            if (donHang is null)
            {
                return Json(new { status = 0, message = "Sản phẩm không tồn tại hoặc đã hết suất đặt trước." });
            }

            _gadgetServices.GuiEmailDatHangThanhCongTrongNen(donHang);
            var thongTinDonHang = _gadgetServices.TaoThongTinDonHang(donHang);

            return Json(new { status = 1, message = "Đặt hàng thành công!", data = thongTinDonHang });
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}