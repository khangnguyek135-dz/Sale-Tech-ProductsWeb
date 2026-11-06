/* =========================================================
   Khởi tạo chung: Đổ dữ liệu giá/nhà sách, năm bản quyền,
   hiệu ứng reveal, cùng toàn bộ logic Xác thực & Quản lý Tài khoản.
   File này nạp CUỐI để quan sát cả các phần tử do JS khác render.
   ========================================================= */
(function () {
    'use strict';

    window.NGK = window.NGK || {};
    var data = window.NGK.data || {};
    var esc = window.NGK.escapeHTML || function (str) { return str || ''; };
    var formatVND = window.NGK.formatVND || function (val) { return Number(val).toLocaleString('vi-VN') + 'đ'; };

    /* ---------------------------------------------------------
       1. KHỞI TẠO DỮ LIỆU ĐỘNG (GIÁ, THÔNG TIN STORE, FOOTER, YEAR)
       --------------------------------------------------------- */
    if (data.product && data.product.price) {
        document.querySelectorAll('[data-price]').forEach(function (el) {
            el.textContent = formatVND(data.product.price);
        });
    }

    var store = data.store || {};
    document.querySelectorAll('[data-store]').forEach(function (el) {
        var key = el.getAttribute('data-store');
        if (store[key]) el.textContent = store[key];
    });

    var contact = document.getElementById('footer-contact');
    if (contact && store.address) {
        var rows = [
            { icon: 'fa-location-dot', html: esc(store.address) },
            store.phone
                ? { icon: 'fa-phone', html: '<a class="footer-link" href="tel:' + esc(store.phone.replace(/\s/g, '')) + '">' + esc(store.phone) + '</a>' }
                : { icon: 'fa-phone', html: 'Cập nhật số điện thoại' },
            store.email
                ? { icon: 'fa-envelope', html: '<a class="footer-link" href="mailto:' + esc(store.email) + '">' + esc(store.email) + '</a>' }
                : { icon: 'fa-envelope', html: 'Cập nhật email' },
            { icon: 'fa-clock', html: esc(store.hours) }
        ];
        contact.innerHTML = rows.map(function (r) {
            return '<li class="flex min-h-10 items-start gap-3 py-1.5">' +
                '<i class="fa-solid ' + r.icon + ' mt-1 w-4 text-antique-gold" aria-hidden="true"></i>' +
                '<span>' + r.html + '</span></li>';
        }).join('');
    }

    var social = document.getElementById('footer-social');
    if (social && store.social) {
        var networks = [
            { key: 'facebook', icon: 'fa-facebook-f', label: 'Facebook' },
            { key: 'youtube', icon: 'fa-youtube', label: 'YouTube' },
            { key: 'tiktok', icon: 'fa-tiktok', label: 'TikTok' }
        ].filter(function (n) { return store.social && store.social[n.key]; });

        social.innerHTML = networks.map(function (n) {
            return '<a class="social-btn" href="' + esc(store.social[n.key]) + '" target="_blank" rel="noopener" aria-label="' + n.label + ' của nhà sách (mở tab mới)">' +
                '<i class="fa-brands ' + n.icon + '" aria-hidden="true"></i></a>';
        }).join('');
    }

    document.querySelectorAll('[data-year]').forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });

    /* ---------------------------------------------------------
       2. HIỆU ỨNG REVEAL KHU VỰC CUỘN TRANG
       --------------------------------------------------------- */
    var revealEls = document.querySelectorAll('.reveal');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

        revealEls.forEach(function (el) { observer.observe(el); });
    }

    /* ---------------------------------------------------------
       3. TIỆN ÍCH LẤY ANTIFORGERY TOKEN TỪ FORM
       --------------------------------------------------------- */
    function getCsrfToken() {
        var tokenInput = document.querySelector('input[name="__RequestVerificationToken"]');
        return tokenInput ? tokenInput.value : '';
    }

    /* ---------------------------------------------------------
       4. XỬ LÝ MỞ / ĐÓNG MODAL AUTH & PROFILE
       --------------------------------------------------------- */
    window.openAuthModal = function (tab) {
        var dialog = document.getElementById('auth-dialog');
        if (dialog) {
            window.switchAuthTab(tab || 'login');
            dialog.showModal();
        }
    };

    window.closeAuthModal = function () {
        var dialog = document.getElementById('auth-dialog');
        if (dialog) dialog.close();
    };

    window.switchAuthTab = function (tabName) {
        var loginForm = document.getElementById('auth-form-login');
        var regForm = document.getElementById('auth-form-register');
        var forgotForm = document.getElementById('auth-form-forgot');

        if (loginForm) loginForm.hidden = tabName !== 'login';
        if (regForm) regForm.hidden = tabName !== 'register';
        if (forgotForm) forgotForm.hidden = tabName !== 'forgot';
    };

    window.openProfileModal = function () {
        var dialog = document.getElementById('profile-dialog');
        if (dialog) {
            dialog.showModal();
            window.loadOrderHistory();
        }
    };

    window.closeProfileModal = function () {
        var dialog = document.getElementById('profile-dialog');
        if (dialog) dialog.close();
    };

    window.switchProfileTab = function (tabName) {
        var isOrders = tabName === 'orders';
        var ordersTab = document.getElementById('profile-tab-orders');
        var infoTab = document.getElementById('profile-tab-info');
        var btnOrders = document.getElementById('tab-btn-orders');
        var btnInfo = document.getElementById('tab-btn-info');

        if (ordersTab) ordersTab.hidden = !isOrders;
        if (infoTab) infoTab.hidden = isOrders;

        if (btnOrders && btnInfo) {
            if (isOrders) {
                btnOrders.className = "px-4 py-2 text-xs font-bold rounded-lg bg-cyan-400 text-slate-950 transition";
                btnInfo.className = "px-4 py-2 text-xs font-bold rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-400 transition";
            } else {
                btnInfo.className = "px-4 py-2 text-xs font-bold rounded-lg bg-cyan-400 text-slate-950 transition";
                btnOrders.className = "px-4 py-2 text-xs font-bold rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-400 transition";
            }
        }
    };

    /* ---------------------------------------------------------
       5. XỬ LÝ SUBMIT ĐĂNG NHẬP (TỰ ĐỘNG XÓA KHOẢNG TRẮNG EMAIL)
       --------------------------------------------------------- */
    // Hàm xử lý Submit Form Đăng nhập
    window.handleLoginSubmit = async function (event) {
        event.preventDefault();

        // Lấy thông tin từ Input
        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');
        const loginModal = document.getElementById('login-dialog') || document.querySelector('dialog[open]');

        const payload = {
            email: emailInput.value.replace(/\s+/g, ''),
            matKhau: passwordInput.value,
            ghiNho: true
        };

        try {
            const response = await fetch('/Account/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': document.querySelector('input[name="__RequestVerificationToken"]')?.value || ''
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            // FIX LỖI POPUP NÚP SAU MODAL: Đóng dialog đang mở trước khi bật SweetAlert
            if (loginModal && typeof loginModal.close === 'function') {
                loginModal.close();
            }

            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Đăng nhập thành công!',
                    text: data.isAdmin ? 'Đang chuyển hướng vào Trang Quản Trị Admin...' : 'Chào mừng bạn quay trở lại!',
                    timer: 1200,
                    showConfirmButton: false,
                    background: '#0f172a',
                    color: '#f8fafc'
                }).then(() => {
                    // TỰ ĐỘNG CHUYỂN HƯỚNG VÀO ADMIN NẾU LÀ TÀI KHOẢN ADMIN
                    if (data.redirectUrl) {
                        window.location.href = data.redirectUrl;
                    } else {
                        window.location.reload();
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Đăng nhập thất bại',
                    text: data.message,
                    background: '#0f172a',
                    color: '#f8fafc',
                    confirmButtonColor: '#0ea5e9'
                });
            }
        } catch (error) {
            if (loginModal && typeof loginModal.close === 'function') loginModal.close();
            Swal.fire({
                icon: 'error',
                title: 'Lỗi kết nối',
                text: 'Không thể kết nối tới máy chủ.',
                background: '#0f172a',
                color: '#f8fafc'
            });
        }
    };

    /* ---------------------------------------------------------
       6. XỬ LÝ SUBMIT ĐĂNG KÝ (VALIDATE EMAIL & MẶC ĐỊNH ROLE USER)
       --------------------------------------------------------- */
    window.handleRegisterSubmit = async function (e) {
        e.preventDefault();
        var fullName = document.getElementById('reg-fullname').value;
        var email = document.getElementById('reg-email').value.replace(/\s+/g, '').toLowerCase();
        var pass = document.getElementById('reg-password').value;
        var confirmPass = document.getElementById('reg-confirm-password').value;

        if (pass !== confirmPass) {
            if (typeof Swal !== 'undefined') {
                Swal.fire({ icon: 'warning', title: 'Lỗi', text: 'Mật khẩu xác nhận không trùng khớp.' });
            } else {
                alert('Mật khẩu xác nhận không trùng khớp.');
            }
            return;
        }

        try {
            var res = await fetch('/Account/Register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': getCsrfToken()
                },
                body: JSON.stringify({ hoTen: fullName, email: email, matKhau: pass, xacNhanMatKhau: confirmPass })
            });

            if (!res.ok) {
                if (typeof Swal !== 'undefined') {
                    Swal.fire({ icon: 'error', title: 'Lỗi máy chủ', text: 'Mã lỗi HTTP: ' + res.status });
                } else {
                    alert('Lỗi máy chủ HTTP: ' + res.status);
                }
                return;
            }

            var result = await res.json();
            if (result.success) {
                if (typeof Swal !== 'undefined') {
                    Swal.fire({ icon: 'success', title: 'Đăng ký thành công', text: result.message })
                        .then(function () { window.switchAuthTab('login'); });
                } else {
                    alert(result.message);
                    window.switchAuthTab('login');
                }
            } else {
                if (typeof Swal !== 'undefined') {
                    Swal.fire({ icon: 'error', title: 'Đăng ký không hợp lệ', text: result.message });
                } else {
                    alert(result.message);
                }
            }
        } catch (err) {
            alert('Lỗi kết nối máy chủ.');
        }
    };

    /* ---------------------------------------------------------
       7. XỬ LÝ SUBMIT QUÊN MẬT KHẨU
       --------------------------------------------------------- */
    window.handleForgotSubmit = async function (e) {
        e.preventDefault();
        var email = document.getElementById('forgot-email').value.replace(/\s+/g, '').toLowerCase();

        try {
            var res = await fetch('/Account/ForgotPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': getCsrfToken()
                },
                body: JSON.stringify({ email: email })
            });

            if (!res.ok) {
                alert('Lỗi máy chủ HTTP: ' + res.status);
                return;
            }

            var result = await res.json();
            if (result.success) {
                if (typeof Swal !== 'undefined') {
                    Swal.fire({ icon: 'info', title: 'Thông báo', text: result.message });
                } else {
                    alert(result.message);
                }
                window.switchAuthTab('login');
            } else {
                if (typeof Swal !== 'undefined') {
                    Swal.fire({ icon: 'error', title: 'Lỗi', text: result.message });
                } else {
                    alert(result.message);
                }
            }
        } catch (err) {
            alert('Lỗi kết nối mạng.');
        }
    };

    /* ---------------------------------------------------------
       8. TẢI LỊCH SỬ ĐẶT HÀNG TỪ BẢNG DonDatHang VÀO POPUP INDEX
       --------------------------------------------------------- */
    window.loadOrderHistory = async function () {
        var tbody = document.getElementById('order-history-tbody');
        if (!tbody) return;

        tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-slate-400">Đang tải lịch sử đơn hàng...</td></tr>';

        try {
            var res = await fetch('/Account/GetOrderHistory');
            if (!res.ok) {
                tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-red-400">Không thể tải danh sách đơn hàng.</td></tr>';
                return;
            }

            var result = await res.json();

            if (result.success && result.data && result.data.length > 0) {
                tbody.innerHTML = result.data.map(function (item) {
                    return '<tr class="hover:bg-slate-900/60 transition border-b border-slate-800/60">' +
                        '<td class="p-3 font-mono font-bold text-cyan-400">' + esc(item.maDonHang) + '</td>' +
                        '<td class="p-3 text-slate-300">' + esc(item.thoiGianDat) + '</td>' +
                        '<td class="p-3 text-center font-bold">' + item.soLuong + '</td>' +
                        '<td class="p-3 text-amber-400 font-bold">' + formatVND(item.tongTien) + '</td>' +
                        '<td class="p-3"><span class="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-cyan-300 border border-slate-700">' + esc(item.maHinhThucThanhToan) + '</span></td>' +
                        '<td class="p-3"><span class="rounded bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">' + esc(item.maTinhTrang) + '</span></td>' +
                        '</tr>';
                }).join('');
            } else {
                tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-slate-400">Bạn chưa có đơn đặt hàng nào trong hệ thống.</td></tr>';
            }
        } catch (err) {
            tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-red-400">Không thể lấy dữ liệu đơn hàng từ máy chủ.</td></tr>';
        }
    };

    /* ---------------------------------------------------------
       9. CẬP NHẬT THÔNG TIN TÀI KHOẢN VÀ MẬT KHẨU (KHÔNG CHO SỬA ROLE)
       --------------------------------------------------------- */
    window.handleUpdateProfileSubmit = async function (e) {
        e.preventDefault();
        var hoTen = document.getElementById('up-fullname').value;
        var email = document.getElementById('up-email').value.replace(/\s+/g, '').toLowerCase();
        var currPass = document.getElementById('up-curr-pass').value;
        var newPass = document.getElementById('up-new-pass').value;
        var confirmPass = document.getElementById('up-confirm-pass').value;

        try {
            var res = await fetch('/Account/UpdateProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': getCsrfToken()
                },
                body: JSON.stringify({
                    hoTen: hoTen,
                    email: email,
                    matKhauHienTai: currPass,
                    matKhauMoi: newPass,
                    xacNhanMatKhauMoi: confirmPass
                })
            });

            if (!res.ok) {
                alert('Lỗi máy chủ HTTP: ' + res.status);
                return;
            }

            var result = await res.json();
            if (result.success) {
                if (typeof Swal !== 'undefined') {
                    Swal.fire({ icon: 'success', title: 'Thành công', text: result.message })
                        .then(function () { window.location.reload(); });
                } else {
                    alert(result.message);
                    window.location.reload();
                }
            } else {
                if (typeof Swal !== 'undefined') {
                    Swal.fire({ icon: 'error', title: 'Cập nhật thất bại', text: result.message });
                } else {
                    alert(result.message);
                }
            }
        } catch (err) {
            alert('Không thể hoàn tất cập nhật thông tin.');
        }
    };
})();