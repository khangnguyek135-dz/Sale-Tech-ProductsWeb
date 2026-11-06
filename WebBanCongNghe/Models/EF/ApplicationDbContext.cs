using Microsoft.EntityFrameworkCore;
using WebBanCongNghe.Models.Entities;

namespace WebBanCongNghe.Models.EF
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<ThongTinThietBi> ThongTinThietBis { get; set; }
        public DbSet<DonDatHang> DonDatHangs { get; set; }
        public DbSet<TinhTrangDonHang> TinhTrangDonHangs { get; set; }
        public DbSet<DanhGia> DanhGias { get; set; }
        public DbSet<CaiDat> CaiDats { get; set; }
        public DbSet<TaiKhoan> TaiKhoans { get; set; }
        public DbSet<ThuongHieu> ThuongHieus { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            const string maThuongHieu = "cybercraft-labs";

            modelBuilder.Entity<ThuongHieu>().HasData(new ThuongHieu
            {
                MaThuongHieu = maThuongHieu,
                TenThuongHieu = "CyberCraft Labs",
                Logo = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJz5a4S33Jd6Zetrh5OCxcJ7YCrPKhntb1sb21mn8HU0ULyTAjsRA71Y0&s=10",
                GioiThieu = """
                    <h2>CyberCraft Labs - Tiên phong trong thiết bị công nghệ độc bản</h2>
                    <p>
                        CyberCraft Labs được thành lập bởi nhóm các kỹ sư phần cứng và nhà thiết kế công nghiệp đam mê tạo ra
                        những thiết bị ngoại vi đột phá. Chúng tôi kết hợp vật liệu cao cấp như nhôm hàng không, màn hình OLED mini
                        và mạch PCB tùy biến để mang lại trải nghiệm gõ và làm việc tuyệt hảo.
                    </p>
                    <p>
                        Mỗi sản phẩm trước khi đưa ra thị trường đều qua hàng trăm giờ thử nghiệm độ bền switch, âm gõ (sound profile)
                        và tối ưu hóa độ trễ kết nối không dây. <em>CyberBoard Ultra</em> là minh chứng cho sự kết hợp giữa thiết kế tương lai
                        và hiệu năng vượt trội.
                    </p>
                    <ul class="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <li class="fact-chip"><strong>2021</strong><span>Thành lập phòng nghiên cứu R&D</span></li>
                        <li class="fact-chip"><strong>2024</strong><span>Ra mắt bàn phím nhôm nguyên khối đầu tiên</span></li>
                        <li class="fact-chip"><strong>100%</strong><span>Kiểm định âm thanh & cảm giác gõ thủ công</span></li>
                    </ul>
                    <blockquote class="quote-block mt-8">
                        "Công nghệ không chỉ là công cụ, đó là tác phẩm nghệ thuật trên bàn làm việc của bạn."
                        <footer class="mt-2 text-sm font-normal text-ink/70">Đội ngũ kỹ sư CyberCraft</footer>
                    </blockquote>
                    """
            });

            modelBuilder.Entity<ThongTinThietBi>().HasData(new ThongTinThietBi
            {
                Uid = 1,
                TenThietBi = "CyberBoard Ultra",
                DanhMuc = "Bàn Phím Cơ Custom",
                TieuDeChinh = "Bàn Phím Cơ Custom CyberBoard Ultra - Vỏ Nhôm CNC Nguyên Khối",
                TieuDePhu = "<p>Tuyệt tác công nghệ với vỏ nhôm nhám cao cấp, màn hình OLED hiển thị tùy biến, kết nối 3 chế độ không dây độ trễ siêu thấp và hệ thống mạch Hotswap 5-pin tiêu chuẩn.</p>",
                GiaGoc = 6500000m,
                GiaDatTruoc = 5200000m,
                AnhThietBi = "images/cyberboard-ultra.png",
                LinkYoutubeReview = "https://www.youtube.com/watch?v=SpYfZOEOyG4",
                MaThuongHieu = maThuongHieu,
                ThongSoKyThuat = "Layout 75%, Mạch Gasket Mount, Kết nối Bluetooth 5.2 / 2.4G / USB-C, Pin 4000mAh",
                DanhSachAnhHandsOn = ""
            });

            modelBuilder.Entity<DanhGia>().HasData(
                new DanhGia
                {
                    Uid = 1,
                    HoTen = "Minh Anh",
                    SoSao = 5,
                    AnhDaiDien = "https://randomuser.me/api/portraits/women/44.jpg",
                    NoiDungDanhGia = "Vỏ nhôm CNC cực kỳ đầm tay, âm gõ thock ấm đúng gu mình thích. Đặt hàng trước nhận đúng hẹn, đóng gói cẩn thận từng phụ kiện."
                },
                new DanhGia
                {
                    Uid = 2,
                    HoTen = "Quốc Bảo",
                    SoSao = 5,
                    AnhDaiDien = "https://randomuser.me/api/portraits/men/32.jpg",
                    NoiDungDanhGia = "Màn hình OLED hiển thị GIF siêu độc. Đã test kết nối không dây 2.4G chơi game phản hồi tức thì, không cảm nhận được độ trễ."
                },
                new DanhGia
                {
                    Uid = 3,
                    HoTen = "Thu Hà",
                    SoSao = 4,
                    AnhDaiDien = "https://randomuser.me/api/portraits/women/68.jpg",
                    NoiDungDanhGia = "Thiết kế góc cạnh rất ngầu. LED RGB sáng đều, phần mềm custom phím dễ dùng. Rất đáng tiền trong tầm giá đặt trước."
                },
                new DanhGia
                {
                    Uid = 4,
                    HoTen = "Hoàng Nam",
                    SoSao = 5,
                    AnhDaiDien = "https://randomuser.me/api/portraits/men/75.jpg",
                    NoiDungDanhGia = "Switch lubed sẵn gõ êm mượt, không bị xước hay lắc rod. Trải nghiệm gõ văn bản hàng giờ liền mà không bị mỏi tay."
                },
                new DanhGia
                {
                    Uid = 5,
                    HoTen = "Lan Phương",
                    SoSao = 4,
                    AnhDaiDien = "https://randomuser.me/api/portraits/women/12.jpg",
                    NoiDungDanhGia = "Giao hàng nhanh, đóng hộp 2 lớp chống sốc tốt. Màu sơn anodized bền đẹp, nhìn thực tế sang hơn trên ảnh nhiều."
                },
                new DanhGia
                {
                    Uid = 6,
                    HoTen = "Đức Huy",
                    SoSao = 5,
                    AnhDaiDien = "https://randomuser.me/api/portraits/men/51.jpg",
                    NoiDungDanhGia = "Pin 4000mAh xài liên tục cả tuần chưa phải sạc. Đã giới thiệu cho bạn bè cùng đặt đợt preorder này."
                });
        }
    }
}