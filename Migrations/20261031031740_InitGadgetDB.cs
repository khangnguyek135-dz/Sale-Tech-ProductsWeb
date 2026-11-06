using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebBanCongNghe.Migrations
{
    /// <inheritdoc />
    public partial class InitGadgetDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TacGias");

            migrationBuilder.DropTable(
                name: "ThongTinSachs");

            migrationBuilder.AddColumn<int>(
                name: "UidThietBi",
                table: "DonDatHangs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ThongTinThietBis",
                columns: table => new
                {
                    Uid = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenThietBi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DanhMuc = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TieuDeChinh = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TieuDePhu = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GiaGoc = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    GiaDatTruoc = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    AnhThietBi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LinkYoutubeReview = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MaThuongHieu = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ThongSoKyThuat = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DanhSachAnhHandsOn = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThongTinThietBis", x => x.Uid);
                });

            migrationBuilder.CreateTable(
                name: "ThuongHieus",
                columns: table => new
                {
                    MaThuongHieu = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TenThuongHieu = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GioiThieu = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Logo = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThuongHieus", x => x.MaThuongHieu);
                });

            migrationBuilder.UpdateData(
                table: "DanhGias",
                keyColumn: "Uid",
                keyValue: 1,
                column: "NoiDungDanhGia",
                value: "Vỏ nhôm CNC cực kỳ đầm tay, âm gõ thock ấm đúng gu mình thích. Đặt hàng trước nhận đúng hẹn, đóng gói cẩn thận từng phụ kiện.");

            migrationBuilder.UpdateData(
                table: "DanhGias",
                keyColumn: "Uid",
                keyValue: 2,
                column: "NoiDungDanhGia",
                value: "Màn hình OLED hiển thị GIF siêu độc. Đã test kết nối không dây 2.4G chơi game phản hồi tức thì, không cảm nhận được độ trễ.");

            migrationBuilder.UpdateData(
                table: "DanhGias",
                keyColumn: "Uid",
                keyValue: 3,
                column: "NoiDungDanhGia",
                value: "Thiết kế góc cạnh rất ngầu. LED RGB sáng đều, phần mềm custom phím dễ dùng. Rất đáng tiền trong tầm giá đặt trước.");

            migrationBuilder.UpdateData(
                table: "DanhGias",
                keyColumn: "Uid",
                keyValue: 4,
                column: "NoiDungDanhGia",
                value: "Switch lubed sẵn gõ êm mượt, không bị xước hay lắc rod. Trải nghiệm gõ văn bản hàng giờ liền mà không bị mỏi tay.");

            migrationBuilder.UpdateData(
                table: "DanhGias",
                keyColumn: "Uid",
                keyValue: 5,
                column: "NoiDungDanhGia",
                value: "Giao hàng nhanh, đóng hộp 2 lớp chống sốc tốt. Màu sơn anodized bền đẹp, nhìn thực tế sang hơn trên ảnh nhiều.");

            migrationBuilder.UpdateData(
                table: "DanhGias",
                keyColumn: "Uid",
                keyValue: 6,
                column: "NoiDungDanhGia",
                value: "Pin 4000mAh xài liên tục cả tuần chưa phải sạc. Đã giới thiệu cho bạn bè cùng đặt đợt preorder này.");

            migrationBuilder.InsertData(
                table: "ThongTinThietBis",
                columns: new[] { "Uid", "AnhThietBi", "DanhMuc", "DanhSachAnhHandsOn", "GiaDatTruoc", "GiaGoc", "LinkYoutubeReview", "MaThuongHieu", "TenThietBi", "ThongSoKyThuat", "TieuDeChinh", "TieuDePhu" },
                values: new object[] { 1, "images/cyberboard-ultra.png", "Bàn Phím Cơ Custom", "", 5200000m, 6500000m, "https://www.youtube.com/watch?v=SpYfZOEOyG4", "cybercraft-labs", "CyberBoard Ultra", "Layout 75%, Mạch Gasket Mount, Kết nối Bluetooth 5.2 / 2.4G / USB-C, Pin 4000mAh", "Bàn Phím Cơ Custom CyberBoard Ultra - Vỏ Nhôm CNC Nguyên Khối", "<p>Tuyệt tác công nghệ với vỏ nhôm nhám cao cấp, màn hình OLED hiển thị tùy biến, kết nối 3 chế độ không dây độ trễ siêu thấp và hệ thống mạch Hotswap 5-pin tiêu chuẩn.</p>" });

            migrationBuilder.InsertData(
                table: "ThuongHieus",
                columns: new[] { "MaThuongHieu", "GioiThieu", "Logo", "TenThuongHieu" },
                values: new object[] { "cybercraft-labs", "<h2>CyberCraft Labs - Tiên phong trong thiết bị công nghệ độc bản</h2>\r\n<p>\r\n    CyberCraft Labs được thành lập bởi nhóm các kỹ sư phần cứng và nhà thiết kế công nghiệp đam mê tạo ra\r\n    những thiết bị ngoại vi đột phá. Chúng tôi kết hợp vật liệu cao cấp như nhôm hàng không, màn hình OLED mini\r\n    và mạch PCB tùy biến để mang lại trải nghiệm gõ và làm việc tuyệt hảo.\r\n</p>\r\n<p>\r\n    Mỗi sản phẩm trước khi đưa ra thị trường đều qua hàng trăm giờ thử nghiệm độ bền switch, âm gõ (sound profile)\r\n    và tối ưu hóa độ trễ kết nối không dây. <em>CyberBoard Ultra</em> là minh chứng cho sự kết hợp giữa thiết kế tương lai\r\n    và hiệu năng vượt trội.\r\n</p>\r\n<ul class=\"mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3\">\r\n    <li class=\"fact-chip\"><strong>2021</strong><span>Thành lập phòng nghiên cứu R&D</span></li>\r\n    <li class=\"fact-chip\"><strong>2024</strong><span>Ra mắt bàn phím nhôm nguyên khối đầu tiên</span></li>\r\n    <li class=\"fact-chip\"><strong>100%</strong><span>Kiểm định âm thanh & cảm giác gõ thủ công</span></li>\r\n</ul>\r\n<blockquote class=\"quote-block mt-8\">\r\n    \"Công nghệ không chỉ là công cụ, đó là tác phẩm nghệ thuật trên bàn làm việc của bạn.\"\r\n    <footer class=\"mt-2 text-sm font-normal text-ink/70\">Đội ngũ kỹ sư CyberCraft</footer>\r\n</blockquote>", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJz5a4S33Jd6Zetrh5OCxcJ7YCrPKhntb1sb21mn8HU0ULyTAjsRA71Y0&s=10", "CyberCraft Labs" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ThongTinThietBis");

            migrationBuilder.DropTable(
                name: "ThuongHieus");

            migrationBuilder.DropColumn(
                name: "UidThietBi",
                table: "DonDatHangs");

            migrationBuilder.CreateTable(
                name: "TacGias",
                columns: table => new
                {
                    MaTacGia = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    AnhDaiDien = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GioiThieu = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HoTenTacGia = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TacGias", x => x.MaTacGia);
                });

            migrationBuilder.CreateTable(
                name: "ThongTinSachs",
                columns: table => new
                {
                    Uid = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AnhSach = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileDocThu = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GiaBan = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    GiaGoc = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    LinkYoutube = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MaTacGia = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TenSach = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TheLoai = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TieuDeChinh = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TieuDePhu = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThongTinSachs", x => x.Uid);
                });

            migrationBuilder.UpdateData(
                table: "DanhGias",
                keyColumn: "Uid",
                keyValue: 1,
                column: "NoiDungDanhGia",
                value: "Bìa tím rất đẹp, in chữ vàng nổi bật. Câu chuyện nhẹ nhàng nhưng đọc xong cứ nghĩ mãi về “huyền thoại cá nhân” của chính mình.");

            migrationBuilder.UpdateData(
                table: "DanhGias",
                keyColumn: "Uid",
                keyValue: 2,
                column: "NoiDungDanhGia",
                value: "Mua làm quà sinh nhật cho em gái, sách được gói cẩn thận. Đây là cuốn mình đọc lại nhiều lần nhất.");

            migrationBuilder.UpdateData(
                table: "DanhGias",
                keyColumn: "Uid",
                keyValue: 3,
                column: "NoiDungDanhGia",
                value: "Văn phong giản dị, dễ đọc. Có vài đoạn mang tính ẩn dụ cần đọc chậm để thấm. Rất đáng để sở hữu.");

            migrationBuilder.UpdateData(
                table: "DanhGias",
                keyColumn: "Uid",
                keyValue: 4,
                column: "NoiDungDanhGia",
                value: "Đọc trong một buổi tối mà thấy được tiếp thêm năng lượng. Phù hợp cho những ai đang phân vân trước lựa chọn lớn.");

            migrationBuilder.UpdateData(
                table: "DanhGias",
                keyColumn: "Uid",
                keyValue: 5,
                column: "NoiDungDanhGia",
                value: "Giấy đẹp, chữ dễ đọc. Mình thích nhất đoạn Santiago ở sa mạc cùng nhà giả kim.");

            migrationBuilder.UpdateData(
                table: "DanhGias",
                keyColumn: "Uid",
                keyValue: 6,
                column: "NoiDungDanhGia",
                value: "Cuốn sách nhỏ nhưng chứa nhiều điều lớn. Mỗi lần đọc lại ở một giai đoạn khác nhau lại thấy một ý nghĩa mới.");

            migrationBuilder.InsertData(
                table: "TacGias",
                columns: new[] { "MaTacGia", "AnhDaiDien", "GioiThieu", "HoTenTacGia" },
                values: new object[] { "paulo-coelho", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJz5a4S33Jd6Zetrh5OCxcJ7YCrPKhntb1sb21mn8HU0ULyTAjsRA71Y0&s=10", "<h2>Paulo Coelho – người kể chuyện của những giấc mơ</h2>\r\n<p>\r\n    Paulo Coelho sinh năm 1947 tại Rio de Janeiro, Brazil. Trước khi trở thành nhà văn, ông từng viết lời\r\n    bài hát, làm việc trong lĩnh vực sân khấu và báo chí. Chuyến hành hương trên con đường Santiago de\r\n    Compostela năm 1986 là bước ngoặt đưa ông đến với sự nghiệp văn chương.\r\n</p>\r\n<p>\r\n    Văn phong của Coelho giản dị, giàu tính biểu tượng và chiêm nghiệm, thường xoay quanh hành trình tìm\r\n    kiếm bản thân, niềm tin và ý nghĩa cuộc sống. <em>Nhà Giả Kim</em> (<em>O Alquimista</em>, 1988) trở thành\r\n    tác phẩm nổi tiếng nhất của ông, được dịch ra rất nhiều ngôn ngữ và truyền cảm hứng cho nhiều thế hệ độc giả.\r\n</p>\r\n<p>\r\n    Các tác phẩm tiêu biểu khác: <em>Hành hương</em>, <em>Bên dòng sông Piedra tôi ngồi khóc</em>,\r\n    <em>Veronika quyết chết</em>, <em>Mười một phút</em>.\r\n</p>\r\n<ul class=\"mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3\">\r\n    <li class=\"fact-chip\"><strong>1947</strong><span>Sinh tại Rio de Janeiro, Brazil</span></li>\r\n    <li class=\"fact-chip\"><strong>1988</strong><span>Xuất bản <em>O Alquimista</em></span></li>\r\n    <li class=\"fact-chip\"><strong>2002</strong><span>Thành viên Viện Hàn lâm Văn chương Brazil</span></li>\r\n</ul>\r\n<blockquote class=\"quote-block mt-8\">\r\n    “Khi bạn khao khát một điều gì, cả vũ trụ sẽ hợp lực giúp bạn đạt được điều đó.”\r\n    <footer class=\"mt-2 text-sm font-normal text-ink/70\">— Trích <cite class=\"not-italic\">Nhà Giả Kim</cite></footer>\r\n</blockquote>", "Paulo Coelho" });

            migrationBuilder.InsertData(
                table: "ThongTinSachs",
                columns: new[] { "Uid", "AnhSach", "FileDocThu", "GiaBan", "GiaGoc", "LinkYoutube", "MaTacGia", "TenSach", "TheLoai", "TieuDeChinh", "TieuDePhu" },
                values: new object[] { 1, "images/sach-nha-gia-kim.png", "", 79000m, 79000m, "https://www.youtube.com/watch?v=SpYfZOEOyG4", "paulo-coelho", "Nhà Giả Kim", "Tiểu thuyết", "Nhà Giả Kim", "" });
        }
    }
}
