using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebBanCongNghe.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "TacGias",
                keyColumn: "MaTacGia",
                keyValue: "paulo-coelho",
                column: "GioiThieu",
                value: "<h2>Paulo Coelho – người kể chuyện của những giấc mơ</h2>\r\n<p>\r\n    Paulo Coelho sinh năm 1947 tại Rio de Janeiro, Brazil. Trước khi trở thành nhà văn, ông từng viết lời\r\n    bài hát, làm việc trong lĩnh vực sân khấu và báo chí. Chuyến hành hương trên con đường Santiago de\r\n    Compostela năm 1986 là bước ngoặt đưa ông đến với sự nghiệp văn chương.\r\n</p>\r\n<p>\r\n    Văn phong của Coelho giản dị, giàu tính biểu tượng và chiêm nghiệm, thường xoay quanh hành trình tìm\r\n    kiếm bản thân, niềm tin và ý nghĩa cuộc sống. <em>Nhà Giả Kim</em> (<em>O Alquimista</em>, 1988) trở thành\r\n    tác phẩm nổi tiếng nhất của ông, được dịch ra rất nhiều ngôn ngữ và truyền cảm hứng cho nhiều thế hệ độc giả.\r\n</p>\r\n<p>\r\n    Các tác phẩm tiêu biểu khác: <em>Hành hương</em>, <em>Bên dòng sông Piedra tôi ngồi khóc</em>,\r\n    <em>Veronika quyết chết</em>, <em>Mười một phút</em>.\r\n</p>\r\n<ul class=\"mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3\">\r\n    <li class=\"fact-chip\"><strong>1947</strong><span>Sinh tại Rio de Janeiro, Brazil</span></li>\r\n    <li class=\"fact-chip\"><strong>1988</strong><span>Xuất bản <em>O Alquimista</em></span></li>\r\n    <li class=\"fact-chip\"><strong>2002</strong><span>Thành viên Viện Hàn lâm Văn chương Brazil</span></li>\r\n</ul>\r\n<blockquote class=\"quote-block mt-8\">\r\n    “Khi bạn khao khát một điều gì, cả vũ trụ sẽ hợp lực giúp bạn đạt được điều đó.”\r\n    <footer class=\"mt-2 text-sm font-normal text-ink/70\">— Trích <cite class=\"not-italic\">Nhà Giả Kim</cite></footer>\r\n</blockquote>");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "TacGias",
                keyColumn: "MaTacGia",
                keyValue: "paulo-coelho",
                column: "GioiThieu",
                value: "<h2>Paulo Coelho – người kể chuyện của những giấc mơ</h2>\n<p>\n    Paulo Coelho sinh năm 1947 tại Rio de Janeiro, Brazil. Trước khi trở thành nhà văn, ông từng viết lời\n    bài hát, làm việc trong lĩnh vực sân khấu và báo chí. Chuyến hành hương trên con đường Santiago de\n    Compostela năm 1986 là bước ngoặt đưa ông đến với sự nghiệp văn chương.\n</p>\n<p>\n    Văn phong của Coelho giản dị, giàu tính biểu tượng và chiêm nghiệm, thường xoay quanh hành trình tìm\n    kiếm bản thân, niềm tin và ý nghĩa cuộc sống. <em>Nhà Giả Kim</em> (<em>O Alquimista</em>, 1988) trở thành\n    tác phẩm nổi tiếng nhất của ông, được dịch ra rất nhiều ngôn ngữ và truyền cảm hứng cho nhiều thế hệ độc giả.\n</p>\n<p>\n    Các tác phẩm tiêu biểu khác: <em>Hành hương</em>, <em>Bên dòng sông Piedra tôi ngồi khóc</em>,\n    <em>Veronika quyết chết</em>, <em>Mười một phút</em>.\n</p>\n<ul class=\"mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3\">\n    <li class=\"fact-chip\"><strong>1947</strong><span>Sinh tại Rio de Janeiro, Brazil</span></li>\n    <li class=\"fact-chip\"><strong>1988</strong><span>Xuất bản <em>O Alquimista</em></span></li>\n    <li class=\"fact-chip\"><strong>2002</strong><span>Thành viên Viện Hàn lâm Văn chương Brazil</span></li>\n</ul>\n<blockquote class=\"quote-block mt-8\">\n    “Khi bạn khao khát một điều gì, cả vũ trụ sẽ hợp lực giúp bạn đạt được điều đó.”\n    <footer class=\"mt-2 text-sm font-normal text-ink/70\">— Trích <cite class=\"not-italic\">Nhà Giả Kim</cite></footer>\n</blockquote>");
        }
    }
}
