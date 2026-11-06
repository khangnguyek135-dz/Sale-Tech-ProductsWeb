/* =========================================================
   DỮ LIỆU CẤU HÌNH CYBERBOARD ULTRA - DARK TECH EDITION
   ---------------------------------------------------------
   Chứa thông tin Pre-order, Biến thể, Sound Test, Exploded
   Gallery, Đánh giá Tech Reviewer, FAQ và QR Ngân hàng.
   ========================================================= */
window.NGK = window.NGK || {};

window.NGK.data = {
    product: {
        id: 'cyberboard-ultra-75',
        uid: 1,
        title: 'CyberBoard Ultra 75%',
        brand: 'CyberCraft Labs',
        edition: 'Vỏ Nhôm CNC 6063 Nguyên Khối · Batch 01',
        cover: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=85',
        price: 5200000,                  // Giá ưu đãi Pre-order (VND)
        originalPrice: 6500000,          // Giá niêm yết (VND)
        depositAmount: 1000000,          // Tiền cọc giữ suất mỗi phím (VND)
        maxQuantity: 5
    },

    /* ---------- Cấu hình Đếm ngược & Số suất Pre-Order ---------- */
    preorder: {
        durationHours: 86,
        totalSlots: 100,
        claimedSlots: 78,
        batchCode: 'CB-ULTRA-B01',
        estimatedDelivery: 'Dự kiến trả hàng: 15/11/2026 - 20/11/2026'
    },

    /* ---------- Các phiên bản Màu vỏ & Switch ---------- */
    variants: {
        colors: [
            {
                id: 'cyber-purple',
                name: 'Anodized Cyber Purple',
                shortName: 'Cyber Purple',
                image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=85'
            },
            {
                id: 'space-gray',
                name: 'Space Gray',
                shortName: 'Space Gray',
                image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=1200&q=85'
            },
            {
                id: 'e-white',
                name: 'E-White',
                shortName: 'E-White',
                image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=85'
            }
        ],
        switches: [
            {
                id: 'linear-silent',
                name: 'Linear Silent (42g)',
                shortName: 'Linear Silent'
            },
            {
                id: 'tactile-thocky',
                name: 'Tactile Thocky (55g)',
                shortName: 'Tactile Thocky'
            },
            {
                id: 'clicky-crisp',
                name: 'Clicky Crisp (50g)',
                shortName: 'Clicky Crisp'
            }
        ]
    },

    shipping: {
        fee: 35000,
        freeFrom: 3000000,
        policy: 'Miễn phí vận chuyển toàn quốc có bảo hiểm hàng hóa cho mọi đơn Pre-Order. Bảo hành chính hãng 12 tháng, 1 đổi 1 trong 30 ngày đầu nếu phát sinh lỗi nhà sản xuất.'
    },

    order: {
        apiEndpoint: '/Home/DatHang',
        timeoutMs: 15000,
        bankTransferFallback: {
            bankId: 'MB',
            bankName: 'Ngân hàng TMCP Quân Đội (MB Bank)',
            accountNo: '888866669999',
            accountName: 'CONG TY TNHH CYBERCRAFT LABS'
        }
    },

    /* ---------- Video Review & Cấu hình 3 Video Sound Test ---------- */
    media: {
        featured: {
            youtubeId: 'Akk3arsPMYY',
            title: 'Review & Sound Test Bàn Phím Cơ Custom CyberBoard Ultra 75%',
            source: 'TechReview Studio',
            thumbnail: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=85'
        },
        soundTests: [
            {
                id: 'linear',
                name: 'Linear Silent Switch',
                youtubeId: 'keEmycz1d3I', // Thay mã YouTube video test phím Linear tại đây
                specs: 'Lực nhấn 42g · Hành trình 3.6mm · Pre-lubed Krytox 205g0',
                description: 'Hành trình trơn mượt không khấc, âm gõ trầm đục (Deep Creamy), phù hợp làm việc đêm và chơi game tốc độ cao.',
                freqProfile: 'Profile: Deep Creamy · 160Hz - 950Hz',
                audioUrl: '',
                synthParams: { baseFreq: 165, thockDecay: 0.085, clackFreq: 920, clickiness: 0.08 }
            },
            {
                id: 'tactile',
                name: 'Tactile Thocky Switch',
                youtubeId: 'G0MY0Dza4r8', // Thay mã YouTube video test phím Tactile tại đây
                specs: 'Lực nhấn 55g · Khấc phản hồi chữ D · Stem POM dài',
                description: 'Khấc phản hồi rõ ràng ngay đầu hành trình, âm chạm đáy tròn trịa (Marble Thocky) đặc trưng trên khung nhôm CNC.',
                freqProfile: 'Profile: Marble Thock · 210Hz - 1.4kHz',
                audioUrl: '',
                synthParams: { baseFreq: 215, thockDecay: 0.075, clackFreq: 1380, clickiness: 0.25 }
            },
            {
                id: 'clicky',
                name: 'Clicky Crisp Switch',
                youtubeId: 'PShIQH_n5M4', // Thay mã YouTube video test phím Clicky tại đây
                specs: 'Lực nhấn 50g · Cơ chế Click-bar kép · Phản hồi đanh gọn',
                description: 'Âm thanh Click sắc nét ở cả chiều nhấn xuống và nhả lên, mang lại cảm giác gõ giàu năng lượng và chính xác.',
                freqProfile: 'Profile: Crisp Clicky · 450Hz - 3.8kHz',
                audioUrl: '',
                synthParams: { baseFreq: 290, thockDecay: 0.055, clackFreq: 3200, clickiness: 0.85 }
            }
        ]
    },

    /* ---------- Dữ liệu 4 Tab Bóc Tách Linh Kiện (Exploded Gallery) ---------- */
    explodedTabs: [
        {
            id: 'toan-canh',
            tabLabel: 'Toàn cảnh phím',
            icon: 'fa-keyboard',
            badge: '01 / TOÀN CẢNH PHÍM',
            subLabel: 'Kiến trúc công thái học 75%',
            heading: 'Khung Nhôm CNC 6063 Nguyên Khối & Keycap PBT Double-Shot',
            image: "data:image/svg+xml;utf8," + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750" width="1200" height="750">
                    <defs>
                        <linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stop-color="#050814"/>
                            <stop offset="100%" stop-color="#0f172a"/>
                        </linearGradient>
                        <linearGradient id="caseGrad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stop-color="#3b2667"/>
                            <stop offset="50%" stop-color="#1e1b4b"/>
                            <stop offset="100%" stop-color="#0f172a"/>
                        </linearGradient>
                        <linearGradient id="cyanGlow" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stop-color="#22d3ee"/>
                            <stop offset="50%" stop-color="#a855f7"/>
                            <stop offset="100%" stop-color="#22d3ee"/>
                        </linearGradient>
                    </defs>
                    <rect width="1200" height="750" fill="url(#bg1)"/>
                    <g stroke="#1e293b" stroke-width="1" opacity="0.6">
                        <line x1="0" y1="150" x2="1200" y2="150"/><line x1="0" y1="300" x2="1200" y2="300"/>
                        <line x1="0" y1="450" x2="1200" y2="450"/><line x1="0" y1="600" x2="1200" y2="600"/>
                        <line x1="200" y1="0" x2="200" y2="750"/><line x1="400" y1="0" x2="400" y2="750"/>
                        <line x1="600" y1="0" x2="600" y2="750"/><line x1="800" y1="0" x2="800" y2="750"/>
                        <line x1="1000" y1="0" x2="1000" y2="750"/>
                    </g>
                    <rect x="130" y="135" width="940" height="450" rx="28" fill="url(#caseGrad)" stroke="#22d3ee" stroke-width="2.5"/>
                    <rect x="150" y="155" width="900" height="410" rx="18" fill="#090d16" stroke="#475569" stroke-width="1.5"/>
                    <rect x="180" y="578" width="840" height="7" rx="3.5" fill="url(#cyanGlow)"/>
                    <rect x="865" y="172" width="110" height="58" rx="8" fill="#020617" stroke="#22d3ee" stroke-width="2"/>
                    <text x="878" y="196" fill="#22d3ee" font-family="monospace" font-size="14" font-weight="bold">98% 2.4G</text>
                    <text x="878" y="218" fill="#f59e0b" font-family="monospace" font-size="13" font-weight="bold">118 WPM</text>
                    <circle cx="1012" cy="201" r="27" fill="#1e293b" stroke="#22d3ee" stroke-width="2.5"/>
                    <circle cx="1012" cy="201" r="18" fill="#0f172a" stroke="#94a3b8" stroke-width="1.5"/>
                    <line x1="1012" y1="183" x2="1012" y2="195" stroke="#22d3ee" stroke-width="2.5"/>
                    <g fill="#1e293b" stroke="#334155" stroke-width="1.5">
                        <rect x="170" y="175" width="48" height="48" rx="7" fill="#312e81" stroke="#818cf8"/>
                        <rect x="230" y="175" width="48" height="48" rx="7"/><rect x="284" y="175" width="48" height="48" rx="7"/>
                        <rect x="338" y="175" width="48" height="48" rx="7"/><rect x="392" y="175" width="48" height="48" rx="7"/>
                        <rect x="456" y="175" width="48" height="48" rx="7"/><rect x="510" y="175" width="48" height="48" rx="7"/>
                        <rect x="564" y="175" width="48" height="48" rx="7"/><rect x="618" y="175" width="48" height="48" rx="7"/>
                        <rect x="682" y="175" width="48" height="48" rx="7"/><rect x="736" y="175" width="48" height="48" rx="7"/>
                        <rect x="790" y="175" width="48" height="48" rx="7"/>
                        <rect x="170" y="242" width="52" height="52" rx="7"/><rect x="228" y="242" width="52" height="52" rx="7"/>
                        <rect x="286" y="242" width="52" height="52" rx="7"/><rect x="344" y="242" width="52" height="52" rx="7"/>
                        <rect x="402" y="242" width="52" height="52" rx="7"/><rect x="460" y="242" width="52" height="52" rx="7"/>
                        <rect x="518" y="242" width="52" height="52" rx="7"/><rect x="576" y="242" width="52" height="52" rx="7"/>
                        <rect x="634" y="242" width="52" height="52" rx="7"/><rect x="692" y="242" width="52" height="52" rx="7"/>
                        <rect x="750" y="242" width="52" height="52" rx="7"/><rect x="808" y="242" width="52" height="52" rx="7"/>
                        <rect x="866" y="242" width="105" height="52" rx="7" fill="#312e81"/><rect x="980" y="242" width="52" height="52" rx="7"/>
                        <rect x="170" y="302" width="78" height="52" rx="7" fill="#312e81"/>
                        <rect x="254" y="302" width="52" height="52" rx="7"/><rect x="312" y="302" width="52" height="52" rx="7"/>
                        <rect x="370" y="302" width="52" height="52" rx="7"/><rect x="428" y="302" width="52" height="52" rx="7"/>
                        <rect x="486" y="302" width="52" height="52" rx="7"/><rect x="544" y="302" width="52" height="52" rx="7"/>
                        <rect x="602" y="302" width="52" height="52" rx="7"/><rect x="660" y="302" width="52" height="52" rx="7"/>
                        <rect x="718" y="302" width="52" height="52" rx="7"/><rect x="776" y="302" width="52" height="52" rx="7"/>
                        <rect x="834" y="302" width="52" height="52" rx="7"/><rect x="892" y="302" width="79" height="52" rx="7"/>
                        <rect x="980" y="302" width="52" height="52" rx="7"/>
                        <rect x="170" y="362" width="92" height="52" rx="7" fill="#312e81"/>
                        <rect x="268" y="362" width="52" height="52" rx="7"/><rect x="326" y="362" width="52" height="52" rx="7"/>
                        <rect x="384" y="362" width="52" height="52" rx="7"/><rect x="442" y="362" width="52" height="52" rx="7"/>
                        <rect x="500" y="362" width="52" height="52" rx="7"/><rect x="558" y="362" width="52" height="52" rx="7"/>
                        <rect x="616" y="362" width="52" height="52" rx="7"/><rect x="674" y="362" width="52" height="52" rx="7"/>
                        <rect x="732" y="362" width="52" height="52" rx="7"/><rect x="790" y="362" width="52" height="52" rx="7"/>
                        <rect x="848" y="362" width="123" height="52" rx="7" fill="#06b6d4" stroke="#67e8f9"/>
                        <rect x="980" y="362" width="52" height="52" rx="7"/>
                        <rect x="170" y="422" width="118" height="52" rx="7" fill="#312e81"/>
                        <rect x="294" y="422" width="52" height="52" rx="7"/><rect x="352" y="422" width="52" height="52" rx="7"/>
                        <rect x="410" y="422" width="52" height="52" rx="7"/><rect x="468" y="422" width="52" height="52" rx="7"/>
                        <rect x="526" y="422" width="52" height="52" rx="7"/><rect x="584" y="422" width="52" height="52" rx="7"/>
                        <rect x="642" y="422" width="52" height="52" rx="7"/><rect x="700" y="422" width="52" height="52" rx="7"/>
                        <rect x="758" y="422" width="52" height="52" rx="7"/><rect x="816" y="422" width="90" height="52" rx="7" fill="#312e81"/>
                        <rect x="916" y="422" width="52" height="52" rx="7" fill="#0891b2"/><rect x="980" y="422" width="52" height="52" rx="7"/>
                        <rect x="170" y="482" width="68" height="52" rx="7" fill="#312e81"/>
                        <rect x="244" y="482" width="68" height="52" rx="7" fill="#312e81"/>
                        <rect x="318" y="482" width="68" height="52" rx="7" fill="#312e81"/>
                        <rect x="392" y="482" width="330" height="52" rx="7" fill="#06b6d4" stroke="#67e8f9"/>
                        <rect x="728" y="482" width="60" height="52" rx="7" fill="#312e81"/>
                        <rect x="794" y="482" width="60" height="52" rx="7" fill="#312e81"/>
                        <rect x="860" y="482" width="52" height="52" rx="7" fill="#0891b2"/>
                        <rect x="916" y="482" width="52" height="52" rx="7" fill="#0891b2"/>
                        <rect x="972" y="482" width="52" height="52" rx="7" fill="#0891b2"/>
                    </g>
                    <text x="135" y="105" fill="#22d3ee" font-family="sans-serif" font-size="18" font-weight="bold">CNC 6063 ALUMINUM UNIBODY · 75% LAYOUT (81 KEYS + SMART OLED + ROTARY KNOB)</text>
                    <text x="135" y="650" fill="#94a3b8" font-family="monospace" font-size="15">WEIGHT: 2.20 KG  |  TYPING ANGLE: 6.5°  |  FRONT HEIGHT: 18.5MM  |  KEYCAPS: DOUBLE-SHOT PBT</text>
                </svg>
            `),
            body: [
                'Layout 75% (81 phím + cụm màn hình OLED) tối ưu diện tích di chuột mà vẫn giữ trọn dãy phím chức năng F-row và cụm phím điều hướng.',
                'Góc nghiêng công thái học 6.5 độ kết hợp chiều cao cạnh trước hạ thấp còn 18.5mm giúp cổ tay luôn ở tư thế thư giãn tự nhiên.'
            ],
            highlights: [
                'Trọng lượng thân phím đạt 2.2kg kèm tạ đáy PVD gương chống trượt',
                'Keycap PBT Double-shot dày 1.6mm không bóng nhẵn sau nhiều năm sử dụng',
                'Lớp mạ Anodized 220-mesh mịn màng, chống bám mồ hôi tay'
            ]
        },
        {
            id: 'mach-pcb-foam',
            tabLabel: 'Mạch PCB & Foam',
            icon: 'fa-microchip',
            badge: '02 / MẠCH PCB & FOAM',
            subLabel: 'Hệ thống tiêu âm 5 lớp tiêu chuẩn phòng thu',
            heading: 'Bo Mạch Hotswap 1.2mm Flex-Cut & 5 Lớp Foam Poron',
            image: "data:image/svg+xml;utf8," + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750" width="1200" height="750">
                    <rect width="1200" height="750" fill="#060a17"/>
                    <text x="80" y="85" fill="#22d3ee" font-family="sans-serif" font-size="22" font-weight="bold">5-LAYER ACOUSTIC DAMPENING &amp; 1.2MM FLEX-CUT PCB ARCHITECTURE</text>
                    <text x="80" y="115" fill="#94a3b8" font-family="monospace" font-size="15">Cấu trúc bóc tách các lớp tiêu âm Poron + IXPE + PET + Mạch Hotswap 5-Pin</text>
                    <polygon points="150,200 720,150 860,210 290,260" fill="#1e293b" fill-opacity="0.85" stroke="#38bdf8" stroke-width="2.5"/>
                    <text x="890" y="205" fill="#38bdf8" font-family="sans-serif" font-size="17" font-weight="bold">1. Plate Polycarbonate Flex-Cut</text>
                    <polygon points="150,280 720,230 860,290 290,340" fill="#312e81" fill-opacity="0.85" stroke="#a855f7" stroke-width="2.5"/>
                    <text x="890" y="285" fill="#c084fc" font-family="sans-serif" font-size="17" font-weight="bold">2. Poron Plate Foam (Dày 3.5mm)</text>
                    <polygon points="150,360 720,310 860,370 290,420" fill="#064e3b" fill-opacity="0.85" stroke="#10b981" stroke-width="2.5"/>
                    <text x="890" y="365" fill="#34d399" font-family="sans-serif" font-size="17" font-weight="bold">3. Tấm IXPE 0.5mm + Màng PET Âm Học</text>
                    <polygon points="150,445 720,395 860,455 290,505" fill="#0f172a" stroke="#f59e0b" stroke-width="3"/>
                    <line x1="250" y1="455" x2="730" y2="415" stroke="#f59e0b" stroke-width="2" stroke-dasharray="12,8"/>
                    <line x1="270" y1="475" x2="750" y2="435" stroke="#22d3ee" stroke-width="2" stroke-dasharray="8,6"/>
                    <text x="890" y="445" fill="#fbbf24" font-family="sans-serif" font-size="17" font-weight="bold">4. Mạch PCB 1.2mm Hotswap 5-Pin RGB</text>
                    <text x="890" y="468" fill="#94a3b8" font-family="monospace" font-size="13">Kailh Socket + ARM Cortex-M4 QMK/VIA</text>
                    <polygon points="150,530 720,480 860,540 290,590" fill="#1e1b4b" fill-opacity="0.9" stroke="#818cf8" stroke-width="2.5"/>
                    <text x="890" y="535" fill="#818cf8" font-family="sans-serif" font-size="17" font-weight="bold">5. Foam Đáy Poron Tiêu Âm Rỗng</text>
                    <polygon points="150,610 720,560 860,620 290,670" fill="#090d16" stroke="#22d3ee" stroke-width="2.5"/>
                    <text x="890" y="615" fill="#22d3ee" font-family="sans-serif" font-size="17" font-weight="bold">6. Lót Đáy Silicone EPDM Chống Vang</text>
                </svg>
            `),
            body: [
                'Mạch PCB 1.2mm cắt rãnh Flex-cut từng hàng phím kết hợp Plate Polycarbonate giúp lực nhấn phân bổ êm ái trên mọi vị trí.',
                'Hệ thống 5 lớp tiêu âm gồm: Foam Plate Poron 3.5mm, tấm IXPE 0.5mm, màng PET âm học, Foam đáy Poron và lót EPDM triệt tiêu hoàn toàn âm vang kim loại.'
            ],
            highlights: [
                'Socket Kailh Hotswap 5-pin hỗ trợ thay nóng 99% loại Switch cơ học',
                'Mạch LED RGB xuôi (South-facing) không gây cấn keycap Cherry profile',
                'Chip vi điều khiển ARM Cortex-M4 hỗ trợ QMK/VIA remap phím trực tiếp'
            ]
        },
        {
            id: 'man-hinh-oled',
            tabLabel: 'Màn hình OLED',
            icon: 'fa-tv',
            badge: '03 / MÀN HÌNH OLED',
            subLabel: 'Trung tâm điều khiển trực quan',
            heading: 'Màn Hình Màu Smart OLED 1.14 Inch & Núm Xoay CNC',
            image: "data:image/svg+xml;utf8," + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750" width="1200" height="750">
                    <defs>
                        <linearGradient id="oledBg" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stop-color="#040711"/>
                            <stop offset="100%" stop-color="#111827"/>
                        </linearGradient>
                        <radialGradient id="knobMetal" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stop-color="#475569"/>
                            <stop offset="70%" stop-color="#1e293b"/>
                            <stop offset="100%" stop-color="#090d16"/>
                        </radialGradient>
                    </defs>
                    <rect width="1200" height="750" fill="url(#oledBg)"/>
                    <rect x="70" y="90" width="1060" height="570" rx="36" fill="#17153b" stroke="#22d3ee" stroke-width="3"/>
                    <rect x="105" y="125" width="990" height="500" rx="24" fill="#090d16" stroke="#334155" stroke-width="2"/>
                    <rect x="155" y="175" width="540" height="330" rx="20" fill="#020617" stroke="#22d3ee" stroke-width="4"/>
                    <rect x="172" y="192" width="506" height="296" rx="12" fill="#030712" stroke="#0891b2" stroke-width="1.5"/>
                    <rect x="195" y="212" width="95" height="32" rx="6" fill="#083344" stroke="#22d3ee"/>
                    <text x="210" y="233" fill="#22d3ee" font-family="monospace" font-size="17" font-weight="bold">2.4GHz</text>
                    <rect x="305" y="212" width="110" height="32" rx="6" fill="#1e1b4b" stroke="#a855f7"/>
                    <text x="320" y="233" fill="#e9d5ff" font-family="monospace" font-size="16" font-weight="bold">MAC / WIN</text>
                    <rect x="545" y="214" width="85" height="28" rx="5" fill="none" stroke="#10b981" stroke-width="2"/>
                    <rect x="630" y="221" width="6" height="14" rx="2" fill="#10b981"/>
                    <rect x="550" y="219" width="70" height="18" rx="3" fill="#10b981"/>
                    <text x="485" y="234" fill="#34d399" font-family="monospace" font-size="18" font-weight="bold">98%</text>
                    <text x="195" y="315" fill="#ffffff" font-family="monospace" font-size="56" font-weight="bold">21:45</text>
                    <text x="370" y="295" fill="#22d3ee" font-family="monospace" font-size="16">POLLING: 1000Hz · 1ms</text>
                    <text x="370" y="320" fill="#cbd5e1" font-family="monospace" font-size="15">TEMP: 31°C · RGB WAVE</text>
                    <rect x="195" y="350" width="460" height="115" rx="10" fill="#090d16" stroke="#1e293b" stroke-width="2"/>
                    <text x="215" y="388" fill="#94a3b8" font-family="sans-serif" font-size="15" font-weight="bold">TYPING SPEED (REAL-TIME)</text>
                    <text x="215" y="442" fill="#f59e0b" font-family="monospace" font-size="44" font-weight="bold">124 WPM</text>
                    <g fill="#22d3ee">
                        <rect x="460" y="415" width="12" height="32" rx="3"/><rect x="480" y="390" width="12" height="57" rx="3"/>
                        <rect x="500" y="370" width="12" height="77" rx="3" fill="#a855f7"/><rect x="520" y="395" width="12" height="52" rx="3"/>
                        <rect x="540" y="378" width="12" height="69" rx="3" fill="#22d3ee"/><rect x="560" y="405" width="12" height="42" rx="3"/>
                        <rect x="580" y="368" width="12" height="79" rx="3" fill="#f59e0b"/><rect x="600" y="392" width="12" height="55" rx="3"/>
                        <rect x="620" y="412" width="12" height="35" rx="3"/>
                    </g>
                    <circle cx="895" cy="340" r="145" fill="url(#knobMetal)" stroke="#22d3ee" stroke-width="4"/>
                    <circle cx="895" cy="340" r="122" fill="none" stroke="#64748b" stroke-width="6" stroke-dasharray="10,10"/>
                    <circle cx="895" cy="340" r="95" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
                    <line x1="895" y1="245" x2="895" y2="285" stroke="#22d3ee" stroke-width="6" stroke-linecap="round"/>
                    <text x="895" y="345" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="bold">CNC KNOB</text>
                    <text x="895" y="370" text-anchor="middle" fill="#22d3ee" font-family="monospace" font-size="14">VOL / RGB / GIF</text>
                    <text x="155" y="565" fill="#22d3ee" font-family="sans-serif" font-size="20" font-weight="bold">1.14" SMART COLOR TFT-OLED (60FPS GIF)  +  ALUMINUM CNC ROTARY ENCODER</text>
                    <text x="155" y="595" fill="#94a3b8" font-family="monospace" font-size="15">Hiển thị % Pin, Chế độ kết nối, WPM, Ảnh GIF cá nhân hóa · Xoay chỉnh âm lượng &amp; hiệu ứng LED</text>
                </svg>
            `),
            body: [
                'Màn hình OLED góc phải hiển thị theo thời gian thực: dung lượng pin theo phần trăm, chế độ kết nối (USB / 2.4G / BT), hệ điều hành (Win/Mac) và tốc độ gõ WPM.',
                'Hỗ trợ tải lên ảnh động GIF cá nhân hóa thông qua phần mềm CyberCraft Hub mà không chiếm dụng tài nguyên máy tính.'
            ],
            highlights: [
                'Tấm nền độ tương phản cao, tần số quét 60fps hiển thị GIF sắc nét',
                'Chuyển nhanh chế độ kết nối và hiệu ứng LED ngay trên màn hình',
                'Kính cường lực phủ AR chống trầy xước và chống chói'
            ]
        },
        {
            id: 'cau-truc-gasket',
            tabLabel: 'Cấu trúc Gasket',
            icon: 'fa-layer-group',
            badge: '04 / CẤU TRÚC GASKET',
            subLabel: 'Cơ chế treo đàn hồi cô lập rung chấn',
            heading: 'Gasket Mount Đệm Silicone Y Tế & Ball-Catch Tháo Nhanh',
            image: "data:image/svg+xml;utf8," + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750" width="1200" height="750">
                    <rect width="1200" height="750" fill="#060a17"/>
                    <text x="90" y="90" fill="#22d3ee" font-family="sans-serif" font-size="22" font-weight="bold">SILICONE GASKET MOUNT (30A) &amp; SCREWLESS BALL-CATCH MECHANISM</text>
                    <text x="90" y="122" fill="#94a3b8" font-family="monospace" font-size="15">Mặt cắt cơ khí hệ thống đệm treo đàn hồi 12 điểm &amp; Khóa bi tháo nhanh không ốc vít</text>
                    <path d="M120,210 L360,210 L360,310 L220,310 L220,420 L120,420 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
                    <path d="M1080,210 L840,210 L840,310 L980,310 L980,420 L1080,420 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
                    <text x="145" y="255" fill="#38bdf8" font-family="sans-serif" font-size="16" font-weight="bold">TOP CASE CNC</text>
                    <circle cx="170" cy="425" r="22" fill="#f59e0b" stroke="#fef08a" stroke-width="3"/>
                    <circle cx="1030" cy="425" r="22" fill="#f59e0b" stroke="#fef08a" stroke-width="3"/>
                    <text x="90" y="495" fill="#fbbf24" font-family="sans-serif" font-size="16" font-weight="bold">KHÓA BI BALL-CATCH (THÁO MỞ 3 GIÂY)</text>
                    <rect x="245" y="320" width="110" height="36" rx="12" fill="#a855f7" stroke="#e9d5ff" stroke-width="2.5"/>
                    <rect x="245" y="395" width="110" height="36" rx="12" fill="#a855f7" stroke="#e9d5ff" stroke-width="2.5"/>
                    <rect x="845" y="320" width="110" height="36" rx="12" fill="#a855f7" stroke="#e9d5ff" stroke-width="2.5"/>
                    <rect x="845" y="395" width="110" height="36" rx="12" fill="#a855f7" stroke="#e9d5ff" stroke-width="2.5"/>
                    <text x="240" y="302" fill="#c084fc" font-family="sans-serif" font-size="16" font-weight="bold">SILICONE GASKET 30A</text>
                    <rect x="280" y="358" width="640" height="16" rx="4" fill="#22d3ee"/>
                    <rect x="300" y="376" width="600" height="18" rx="4" fill="#312e81"/>
                    <rect x="290" y="396" width="620" height="16" rx="4" fill="#10b981"/>
                    <polygon points="545,215 655,215 675,285 525,285" fill="#0f172a" stroke="#22d3ee" stroke-width="3"/>
                    <rect x="565" y="285" width="70" height="72" rx="6" fill="#334155" stroke="#94a3b8" stroke-width="2"/>
                    <text x="600" y="258" text-anchor="middle" fill="#22d3ee" font-family="sans-serif" font-size="16" font-weight="bold">PBT KEYCAP</text>
                    <path d="M600,435 L600,490" stroke="#22d3ee" stroke-width="4" stroke-dasharray="6,6"/>
                    <text x="600" y="520" text-anchor="middle" fill="#22d3ee" font-family="sans-serif" font-size="17" font-weight="bold">HÀNH TRÌNH ĐÀN HỒI CÔ LẬP RUNG CHẤN KIM LOẠI</text>
                    <path d="M120,435 L220,435 L220,555 L980,555 L980,435 L1080,435 L1080,625 L120,625 Z" fill="#0f172a" stroke="#475569" stroke-width="3"/>
                    <rect x="380" y="595" width="440" height="28" rx="6" fill="#eab308" stroke="#fef08a" stroke-width="2"/>
                    <text x="600" y="615" text-anchor="middle" fill="#090d16" font-family="sans-serif" font-size="15" font-weight="bold">MIRROR PVD BRASS WEIGHT (TẠ ĐỒNG PVD GƯƠNG)</text>
                </svg>
            `),
            body: [
                'Thay vì bắt vít cứng vào vỏ, toàn bộ cụm Plate và PCB được nâng đỡ bởi 12 điểm đệm Silicone Gasket độ cứng 30A giúp cô lập hoàn toàn va chạm cơ khí.',
                'Cơ chế khóa bi (Ball-catch structure) cho phép tháo mở khung trên chỉ trong 3 giây mà không cần tua vít để người dùng tùy biến foam và switch.'
            ],
            highlights: [
                'Stabilizer PCB-Mount được tinh chỉnh (Plumber mod & Lubed) sẵn từ nhà máy',
                'Không còn tiếng lọc xọc ở các phím dài (Spacebar, Enter, Shift)',
                'Tặng kèm bộ đệm Gasket dự phòng với 2 mức độ đàn hồi khác nhau'
            ]
        }
    ],

    /* ---------- Đánh giá từ Tech Reviewer & Cộng đồng ---------- */
    reviews: {
        items: [
            {
                name: 'Tuấn Ngọc (GearVN Studio)',
                role: 'Senior Tech Reviewer',
                variant: 'Cyber Purple · Tactile Thocky',
                rating: 5,
                date: '2026-10-18',
                verified: true,
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                content: 'Cầm khối nhôm 2.2kg lên là thấy ngay độ hoàn thiện CNC vượt tầm giá 5 triệu. Âm gõ nguyên bản với 5 lớp foam đã đạt 95% độ chuẩn của phím custom tự build, đặc biệt thanh Spacebar được cân wire cực chuẩn không một tiếng tích.'
            },
            {
                name: 'Hoàng Minh (Keycap Vietnam)',
                role: 'Custom Keyboard Modder',
                variant: 'Space Gray · Linear Silent',
                rating: 5,
                date: '2026-10-12',
                verified: true,
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                content: 'Điểm ăn tiền nhất là cơ chế Ball-catch tháo vỏ không ốc vít và mạch Flex-cut 1.2mm. Mình cắm thử 2.4GHz bắn Valorant suốt 1 tuần liền, polling rate 1000Hz ổn định tuyệt đối không trễ nhịp nào.'
            },
            {
                name: 'Lê Thanh Thảo',
                role: 'Senior Software Engineer',
                variant: 'E-White · Linear Silent',
                rating: 5,
                date: '2026-10-05',
                verified: true,
                avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
                content: 'Mình code trên cả MacBook Pro và PC Windows, gạt công tắc chuyển Bluetooth sang 2.4G mất chưa tới 1 giây. Switch Linear Silent lube sẵn gõ êm ru, mang lên văn phòng gõ cả ngày đồng nghiệp bên cạnh không nghe thấy tiếng ồn.'
            }
        ]
    },

    /* ---------- Câu hỏi thường gặp (FAQ Accordion) ---------- */
    faqs: [
        {
            question: 'Bao lâu thì nhận được phím sau khi đặt cọc?',
            answer: 'Đợt Pre-Order Batch 01 sẽ chốt danh sách khi đủ 100 suất hoặc khi đồng hồ đếm ngược kết thúc. Sản phẩm đã hoàn tất khâu CNC và đang trong giai đoạn lắp ráp QC cuối cùng. Toàn bộ đơn đặt cọc sẽ được xuất kho bàn giao từ ngày 15/11/2026 đến 20/11/2026 kèm mã vận đơn theo dõi thời gian thực.'
        },
        {
            question: 'Chính sách bảo hành và đổi trả như thế nào?',
            answer: 'CyberBoard Ultra được bảo hành chính hãng 12 tháng cho bo mạch PCB, màn hình OLED, pin và module không dây. Áp dụng chính sách 1 đổi 1 máy mới trong 30 ngày đầu nếu phát sinh bất kỳ lỗi phần cứng nào từ nhà sản xuất. Việc người dùng tự tháo phím thay Switch (Hotswap) hoặc thay Keycap hoàn toàn KHÔNG làm mất bảo hành.'
        },
        {
            question: 'Phím có tương thích với macOS và Windows không?',
            answer: 'Tương thích 100% với cả macOS, Windows, Linux, iPadOS và Android. Cạnh sau bàn phím có công tắc vật lý chuyển đổi layout Win/Mac tức thì (tự động đổi cụm phím Command/Option) và tặng kèm sẵn các nút Keycap Mac bổ sung trong hộp.'
        },
        {
            question: 'Số tiền đặt cọc 1.000.000đ được đảm bảo như thế nào?',
            answer: 'Ngay sau khi chuyển khoản đặt cọc qua mã QR hệ thống cung cấp, bạn sẽ nhận được email và SMS xác nhận Mã Đơn Pre-Order định danh. Nếu quá thời hạn cam kết giao hàng mà chưa nhận được sản phẩm, CyberCraft Labs hoàn trả 100% tiền cọc kèm khoản bồi hoàn 20% giá trị cọc.'
        }
    ],

    provinces: [
        'Thành phố Hồ Chí Minh', 'Thành phố Hà Nội', 'Thành phố Đà Nẵng', 'Thành phố Hải Phòng',
        'Thành phố Cần Thơ', 'Thành phố Huế', 'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Ninh',
        'Bình Dương', 'Bình Định', 'Bình Phước', 'Bình Thuận', 'Cà Mau', 'Đắk Lắk', 'Đồng Nai',
        'Đồng Tháp', 'Gia Lai', 'Hà Tĩnh', 'Hải Dương', 'Hưng Yên', 'Khánh Hòa', 'Kiên Giang',
        'Lâm Đồng', 'Long An', 'Nam Định', 'Nghệ An', 'Ninh Bình', 'Phú Thọ', 'Quảng Nam',
        'Quảng Ngãi', 'Quảng Ninh', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên', 'Thanh Hóa', 'Vĩnh Phúc'
    ]
};

/* ---------- Hàm tiện ích định dạng tiền tệ & chống XSS ---------- */
window.NGK.formatVND = function (value) {
    if (typeof value !== 'number' || !isFinite(value)) return 'Liên hệ';
    return value.toLocaleString('vi-VN') + 'đ';
};

window.NGK.escapeHTML = function (str) {
    return String(str == null ? '' : str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};