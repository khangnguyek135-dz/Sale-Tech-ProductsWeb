/* =========================================================
   ORDER & PRE-ORDER ENGINE (order.js)
   ---------------------------------------------------------
   1. Đồng hồ đếm ngược Pre-Order & Thanh tiến độ suất đặt.
   2. Đồng bộ chọn Màu vỏ / Loại Switch giữa Hero & Modal.
   3. Tính tự động Tổng tiền, Tiền cọc (Deposit) & Phần còn lại.
   4. Gửi API /Home/DatHang kèm mã QR chuyển khoản tự động.
   ========================================================= */
(function () {
    'use strict';

    var NGK = window.NGK || {};
    var data = NGK.data || {};
    var product = data.product || {};
    var preorder = data.preorder || {};
    var shipping = data.shipping || {};
    var orderCfg = data.order || {};
    var fmt = NGK.formatVND;
    var esc = NGK.escapeHTML;

    /* Loại bỏ modal cũ nếu tồn tại trùng lặp trong _Layout.cshtml */
    var allDialogs = document.querySelectorAll('#order-dialog');
    if (allDialogs.length > 1) {
        allDialogs.forEach(function (d) {
            if (!d.hasAttribute('data-tech-modal')) d.remove();
        });
    }

    var dialog = document.getElementById('order-dialog');
    var form = document.getElementById('order-form');
    var result = document.getElementById('order-result');
    var statusEl = document.getElementById('order-status');
    var submitBtn = form ? form.querySelector('[data-submit]') : null;
    var submitLabel = form ? form.querySelector('[data-submit-label]') : null;
    var qtyInput = form ? form.elements.quantity : null;
    var provinceSelect = form ? form.elements.province : null;
    var modalColorSelect = document.getElementById('modal-color');
    var modalSwitchSelect = document.getElementById('modal-switch');
    var modalPaymentSelect = document.getElementById('modal-payment');

    /* Trạng thái biến thể đang chọn */
    var selectedState = {
        colorId: 'cyber-purple',
        colorLabel: 'Anodized Cyber Purple',
        switchId: 'linear-silent',
        switchLabel: 'Linear Silent (42g)'
    };

    /* ---------- 1. Khởi tạo Giá & Thanh Tiến Độ Suất Đặt Trước ---------- */
    var unitPrice = (NGK.server && Number(NGK.server.price) > 0) ? Number(NGK.server.price) : (product.price || 5200000);
    var depositUnit = product.depositAmount || 1000000;

    document.querySelectorAll('[data-price]').forEach(function (el) { el.textContent = fmt(unitPrice); });
    document.querySelectorAll('[data-original-price]').forEach(function (el) { el.textContent = fmt(product.originalPrice || 6500000); });
    document.querySelectorAll('[data-deposit-amount]').forEach(function (el) { el.textContent = fmt(depositUnit); });

    function initPreorderProgress() {
        var total = preorder.totalSlots || 100;
        var claimed = preorder.claimedSlots || 78;
        var remaining = Math.max(total - claimed, 1);
        var pct = Math.min(Math.round((claimed / total) * 100), 99);

        document.querySelectorAll('[data-slot-total]').forEach(function (el) { el.textContent = total; });
        document.querySelectorAll('[data-slot-claimed]').forEach(function (el) { el.textContent = claimed; });
        document.querySelectorAll('[data-slot-remaining-text]').forEach(function (el) {
            el.textContent = 'Chỉ còn ' + remaining + ' suất ưu đãi';
        });

        var bar = document.getElementById('slot-progress-bar');
        if (bar) bar.style.width = pct + '%';
    }
    initPreorderProgress();

    /* ---------- 2. Đồng hồ đếm ngược Pre-Order ---------- */
    function initCountdown() {
        var cdRoot = document.getElementById('preorder-countdown');
        if (!cdRoot) return;

        var storageKey = 'ngk_cyberboard_deadline_v1';
        var savedDeadline = null;
        try { savedDeadline = localStorage.getItem(storageKey); } catch (e) { }

        var now = Date.now();
        var deadline = savedDeadline ? parseInt(savedDeadline, 10) : 0;
        var durationMs = (preorder.durationHours || 86) * 3600 * 1000;

        if (!deadline || isNaN(deadline) || deadline <= now) {
            deadline = now + durationMs;
            try { localStorage.setItem(storageKey, String(deadline)); } catch (e) { }
        }

        var elDays = cdRoot.querySelector('[data-cd="days"]');
        var elHours = cdRoot.querySelector('[data-cd="hours"]');
        var elMinutes = cdRoot.querySelector('[data-cd="minutes"]');
        var elSeconds = cdRoot.querySelector('[data-cd="seconds"]');

        function pad(n) { return n < 10 ? '0' + n : String(n); }

        function tick() {
            var diff = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
            var d = Math.floor(diff / 86400);
            var h = Math.floor((diff % 86400) / 3600);
            var m = Math.floor((diff % 3600) / 60);
            var s = diff % 60;

            if (elDays) elDays.textContent = pad(d);
            if (elHours) elHours.textContent = pad(h);
            if (elMinutes) elMinutes.textContent = pad(m);
            if (elSeconds) elSeconds.textContent = pad(s);
        }

        tick();
        setInterval(tick, 1000);
    }
    initCountdown();

    /* ---------- 3. Bộ chọn biến thể nhanh tại Hero & Đồng bộ Modal ---------- */
    function syncVariantUI() {
        var colorLabelEl = document.getElementById('hero-selected-color-label');
        var switchLabelEl = document.getElementById('hero-selected-switch-label');
        var hudBadge = document.getElementById('hud-variant-badge');
        var stickyVariant = document.getElementById('sticky-variant-label');
        var summaryVariant = document.getElementById('summary-variant-text');
        var heroImg = document.getElementById('hero-product-img');

        if (colorLabelEl) colorLabelEl.textContent = selectedState.colorLabel;
        if (switchLabelEl) switchLabelEl.textContent = selectedState.switchLabel.replace(/\s*\(.*?\)/, '');

        var shortColor = selectedState.colorLabel.replace('Anodized ', '').toUpperCase();
        var shortSwitch = selectedState.switchLabel.split(' ')[0].toUpperCase();
        if (hudBadge) hudBadge.textContent = shortColor + ' // ' + shortSwitch;
        if (stickyVariant) stickyVariant.textContent = '(' + selectedState.colorLabel.replace('Anodized ', '') + ')';
        if (summaryVariant) summaryVariant.textContent = selectedState.colorLabel + ' · ' + selectedState.switchLabel;

        if (data.variants && Array.isArray(data.variants.colors)) {
            var matched = data.variants.colors.find(function (c) { return c.id === selectedState.colorId; });
            if (matched && matched.image) {
                if (heroImg && heroImg.getAttribute('src') !== matched.image) heroImg.src = matched.image;
                swapModalImage(matched.image);
            }
        }

        /* Đồng bộ trạng thái active của các chip màu ở Hero (khi đổi màu từ popup) */
        document.querySelectorAll('#hero-color-selector [data-variant-color]').forEach(function (b) {
            var on = b.getAttribute('data-variant-color') === selectedState.colorId;
            b.classList.toggle('is-active', on);
            b.setAttribute('aria-checked', on ? 'true' : 'false');
        });

        if (modalColorSelect && modalColorSelect.value !== selectedState.colorLabel) {
            modalColorSelect.value = selectedState.colorLabel;
        }
        if (modalSwitchSelect && modalSwitchSelect.value !== selectedState.switchLabel) {
            modalSwitchSelect.value = selectedState.switchLabel;
        }
    }

    /* Đổi ảnh trong popup đặt hàng theo màu vỏ, có hiệu ứng mờ dần */
    function swapModalImage(src) {
        var img = document.getElementById('modal-product-img');
        if (!img || img.getAttribute('data-src') === src) return;
        img.setAttribute('data-src', src);
        img.classList.add('is-swapping');
        var pre = new Image();
        var done = function () {
            img.src = src;
            setTimeout(function () { img.classList.remove('is-swapping'); }, 30);
        };
        pre.onload = done;
        pre.onerror = function () { img.classList.remove('is-swapping'); };
        pre.src = src;
    }

    /* Tìm id màu từ tên hiển thị trong select của popup */
    function colorIdFromLabel(label) {
        var list = (data.variants && data.variants.colors) || [];
        var hit = list.find(function (c) { return c.name === label; });
        return hit ? hit.id : selectedState.colorId;
    }

    var heroColorWrap = document.getElementById('hero-color-selector');
    if (heroColorWrap) {
        heroColorWrap.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-variant-color]');
            if (!btn) return;
            heroColorWrap.querySelectorAll('[data-variant-color]').forEach(function (b) {
                b.classList.remove('is-active');
                b.setAttribute('aria-checked', 'false');
            });
            btn.classList.add('is-active');
            btn.setAttribute('aria-checked', 'true');
            selectedState.colorId = btn.getAttribute('data-variant-color');
            selectedState.colorLabel = btn.getAttribute('data-label') || 'Anodized Cyber Purple';
            syncVariantUI();
        });
    }

    var heroSwitchWrap = document.getElementById('hero-switch-selector');
    if (heroSwitchWrap) {
        heroSwitchWrap.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-variant-switch]');
            if (!btn) return;
            heroSwitchWrap.querySelectorAll('[data-variant-switch]').forEach(function (b) {
                b.classList.remove('is-active');
                b.setAttribute('aria-checked', 'false');
            });
            btn.classList.add('is-active');
            btn.setAttribute('aria-checked', 'true');
            selectedState.switchId = btn.getAttribute('data-variant-switch');
            selectedState.switchLabel = btn.getAttribute('data-label') || 'Linear Silent (42g)';
            syncVariantUI();
        });
    }

    if (modalColorSelect) {
        modalColorSelect.addEventListener('change', function () {
            selectedState.colorLabel = modalColorSelect.value;
            selectedState.colorId = colorIdFromLabel(modalColorSelect.value);
            syncVariantUI();
        });
    }

    if (modalSwitchSelect) {
        modalSwitchSelect.addEventListener('change', function () {
            selectedState.switchLabel = modalSwitchSelect.value;
            syncVariantUI();
        });
    }

    if (!dialog || !form) return;

    var lastTrigger = null;
    var submitting = false;
    var triedSubmit = false;
    var idempotencyKey = newKey();

    if (provinceSelect && Array.isArray(data.provinces)) {
        data.provinces.forEach(function (name) {
            var opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            provinceSelect.appendChild(opt);
        });
    }

    if (qtyInput) qtyInput.max = product.maxQuantity || 5;
    setText('[data-max-qty]', product.maxQuantity || 5);
    setText('[data-product-edition]', product.edition || '');
    setText('[data-shipping-policy]', shipping.policy || '');

    function setText(selector, value) {
        dialog.querySelectorAll(selector).forEach(function (el) { el.textContent = value; });
    }

    function newKey() {
        if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
        return 'cb-' + Date.now() + '-' + Math.random().toString(16).slice(2);
    }

    /* ---------- 4. Mở / Đóng Modal Đặt Hàng ---------- */
    function openOrderModal(trigger) {
        lastTrigger = trigger || null;
        if (dialog.open) return;
        if (result && !result.hidden) resetToForm(true);

        syncVariantUI();
        updateSummary();
        dialog.showModal();
        document.body.classList.add('modal-open');
        document.documentElement.style.overflow = 'hidden';
        if (form.elements.fullName) form.elements.fullName.focus();
    }
    NGK.openOrderModal = openOrderModal;

    document.addEventListener('click', function (e) {
        var trigger = e.target.closest('[data-open-order]');
        if (!trigger) return;
        e.preventDefault();
        openOrderModal(trigger);
    });

    dialog.querySelectorAll('[data-close-order]').forEach(function (btn) {
        btn.addEventListener('click', function () { dialog.close(); });
    });

    var pressedOnBackdrop = false;
    dialog.addEventListener('mousedown', function (e) { pressedOnBackdrop = e.target === dialog; });
    dialog.addEventListener('click', function (e) {
        if (e.target === dialog && pressedOnBackdrop && !submitting) dialog.close();
        pressedOnBackdrop = false;
    });

    dialog.addEventListener('cancel', function (e) { if (submitting) e.preventDefault(); });
    dialog.addEventListener('close', function () {
        document.body.classList.remove('modal-open');
        document.documentElement.style.overflow = '';
        if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus();
    });

    /* ---------- 5. Tính toán Tổng tiền & Tiền cọc (Deposit) ---------- */
    function getQty() {
        if (!qtyInput) return 1;
        var q = parseInt(qtyInput.value, 10);
        return isNaN(q) ? 1 : q;
    }

    function shippingFee(subtotal) {
        if (typeof shipping.freeFrom === 'number' && subtotal >= shipping.freeFrom) return 0;
        return typeof shipping.fee === 'number' ? shipping.fee : 0;
    }

    function updateSummary() {
        var maxQ = product.maxQuantity || 5;
        var qty = getQty();
        var validQty = qty >= 1 && qty <= maxQ;
        var subtotal = validQty ? unitPrice * qty : null;
        var ship = subtotal === null ? null : shippingFee(subtotal);
        var total = subtotal === null ? null : subtotal + (ship || 0);
        var depositTotal = validQty ? depositUnit * qty : null;
        var remainingTotal = (total !== null && depositTotal !== null) ? Math.max(total - depositTotal, 0) : null;

        setText('[data-sum="unit"]', fmt(unitPrice));
        setText('[data-sum="qty"]', validQty ? qty : '--');
        setText('[data-sum="subtotal"]', subtotal === null ? '--' : fmt(subtotal));
        setText('[data-sum="shipping"]', ship === 0 ? 'Miễn phí giao hàng' : fmt(ship));
        setText('[data-sum="total"]', total === null ? '--' : fmt(total));
        setText('[data-sum="deposit"]', depositTotal === null ? '--' : fmt(depositTotal));
        setText('[data-sum="remaining"]', remainingTotal === null ? '--' : fmt(remainingTotal));

        var btnMinus = form.querySelector('[data-qty="-1"]');
        var btnPlus = form.querySelector('[data-qty="1"]');
        if (btnMinus) btnMinus.disabled = qty <= 1;
        if (btnPlus) btnPlus.disabled = qty >= maxQ;
    }

    form.querySelectorAll('[data-qty]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var maxQ = product.maxQuantity || 5;
            var next = getQty() + parseInt(btn.getAttribute('data-qty'), 10);
            qtyInput.value = Math.min(Math.max(next, 1), maxQ);
            updateSummary();
            if (triedSubmit) validateField('quantity');
        });
    });

    if (qtyInput) qtyInput.addEventListener('input', updateSummary);
    if (provinceSelect) provinceSelect.addEventListener('change', updateSummary);
    if (modalPaymentSelect) modalPaymentSelect.addEventListener('change', updateSummary);

    /* ---------- 6. Validation Client-side ---------- */
    function normalizePhone(raw) {
        var p = String(raw || '').replace(/[\s.\-()]/g, '');
        if (p.indexOf('+84') === 0) p = '0' + p.slice(3);
        else if (p.indexOf('84') === 0 && p.length === 11) p = '0' + p.slice(2);
        return p;
    }

    var validators = {
        fullName: function (v) {
            v = (v || '').trim();
            if (!v) return 'Vui lòng nhập họ và tên người nhận.';
            if (v.length < 2 || v.length > 100) return 'Họ tên cần từ 2 đến 100 ký tự.';
            return '';
        },
        phone: function (v) {
            if (!v || !v.trim()) return 'Vui lòng nhập số điện thoại liên hệ.';
            if (!/^0(3|5|7|8|9)\d{8}$/.test(normalizePhone(v))) return 'Số điện thoại chưa đúng chuẩn 10 số Việt Nam.';
            return '';
        },
        province: function (v) { return v ? '' : 'Vui lòng chọn Tỉnh/Thành phố.'; },
        addressLine: function (v) {
            v = (v || '').trim();
            if (!v) return 'Vui lòng nhập địa chỉ nhận hàng chi tiết.';
            if (v.length < 5) return 'Địa chỉ cần ghi rõ số nhà, tên đường, phường/xã.';
            return '';
        },
        quantity: function (v) {
            var maxQ = product.maxQuantity || 5;
            var q = Number(v);
            if (!Number.isInteger(q) || q < 1) return 'Số lượng tối thiểu là 1 phím.';
            if (q > maxQ) return 'Mỗi đơn Pre-Order đặt tối đa ' + maxQ + ' phím.';
            return '';
        }
    };

    function validateField(name) {
        var field = form.elements[name];
        if (!field) return true;
        var fn = validators[name];
        if (!fn) return true;

        var msg = fn(field.value);
        var err = document.getElementById('e-' + name);
        field.setAttribute('aria-invalid', msg ? 'true' : 'false');
        if (err) {
            err.innerHTML = msg ? '<i class="fa-solid fa-circle-exclamation mr-1" aria-hidden="true"></i>' + esc(msg) : '';
            err.classList.toggle('is-visible', !!msg);
        }
        return !msg;
    }

    Object.keys(validators).forEach(function (name) {
        var field = form.elements[name];
        if (!field) return;
        field.addEventListener('blur', function () { if (triedSubmit || field.value) validateField(name); });
        field.addEventListener('input', function () { if (triedSubmit) validateField(name); });
        field.addEventListener('change', function () { if (triedSubmit) validateField(name); });
    });

    function showStatus(type, html) {
        if (!statusEl) return;
        statusEl.className = 'form-status mt-4' + (type ? ' is-' + type : '');
        statusEl.innerHTML = html || '';
    }

    function setLoading(on) {
        submitting = on;
        if (submitBtn) submitBtn.disabled = on;
        form.setAttribute('aria-busy', on ? 'true' : 'false');
        if (submitLabel) {
            submitLabel.textContent = on ? 'Đang khởi tạo mã đơn & QR...' : 'Xác Nhận Đặt Trước & Lấy Mã QR';
        }
    }

    /* ---------- 7. Submit Đơn Hàng lên /Home/DatHang ---------- */
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (submitting) return;
        triedSubmit = true;
        showStatus('', '');

        var firstInvalid = null;
        Object.keys(validators).forEach(function (name) {
            if (!validateField(name) && !firstInvalid) firstInvalid = form.elements[name];
        });

        if (firstInvalid) {
            firstInvalid.focus();
            showStatus('error', '<i class="fa-solid fa-triangle-exclamation"></i><span>Vui lòng kiểm tra các trường thông tin được đánh dấu đỏ.</span>');
            return;
        }

        var qty = getQty();
        var gadgetId = (NGK.server && NGK.server.gadgetUid) ? NGK.server.gadgetUid : (product.uid || 1);
        var paymentVal = modalPaymentSelect && modalPaymentSelect.value ? modalPaymentSelect.value : 'CHUYEN_KHOAN';
        var fullAddress = form.elements.addressLine.value.trim() + ', ' + provinceSelect.value;
        var userNote = form.elements.note ? form.elements.note.value.trim() : '';

        /* Đóng gói cấu hình Màu vỏ + Switch + Tiền cọc vào ghiChu để tương thích Backend DTO */
        var configSummary = '[Cấu hình: ' + selectedState.colorLabel + ' | Switch: ' + selectedState.switchLabel + ' | Cọc: ' + fmt(depositUnit * qty) + ']';
        var combinedNote = (configSummary + (userNote ? ' ' + userNote : '')).slice(0, 300);

        var payload = {
            uidThietBi: parseInt(gadgetId, 10),
            soLuong: qty,
            tenKhachHang: form.elements.fullName.value.trim(),
            sdt: normalizePhone(form.elements.phone.value),
            email: form.elements.email && form.elements.email.value.trim() ? form.elements.email.value.trim() : null,
            diaChi: fullAddress,
            maHinhThucThanhToan: paymentVal,
            ghiChu: combinedNote
        };

        submitOrder(payload, qty);
    });

    /* Lấy thông báo lỗi thật từ server (ModelState / ProblemDetails / {message}) thay vì báo chung "lỗi kết nối" */
    function extractServerMessage(status, body) {
        if (body && body.message) return body.message;
        if (body && body.errors && typeof body.errors === 'object') {
            var first = Object.keys(body.errors)[0];
            var v = first ? body.errors[first] : null;
            if (v) return (Array.isArray(v) ? v[0] : String(v));
        }
        if (body && (body.detail || body.title)) return body.detail || body.title;
        if (status === 404) return 'Không tìm thấy API đặt hàng (/Home/DatHang). Vui lòng liên hệ quản trị viên.';
        if (status === 415) return 'Máy chủ không nhận định dạng dữ liệu gửi lên (415).';
        if (status === 400) return 'Máy chủ từ chối dữ liệu đơn hàng (400). Vui lòng kiểm tra lại thông tin.';
        if (status >= 500) return 'Máy chủ gặp lỗi khi lưu đơn hàng (' + status + '). Vui lòng thử lại sau.';
        return null;
    }

    function submitOrder(payload, qty) {
        var endpoint = orderCfg.apiEndpoint || '/Home/DatHang';
        setLoading(true);

        var headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Idempotency-Key': idempotencyKey
        };
        /* Gửi kèm AntiForgery token nếu trang có (tránh lỗi 400 khi server bật AutoValidateAntiforgeryToken) */
        var tokenEl = document.querySelector('input[name="__RequestVerificationToken"]');
        var tokenMeta = document.querySelector('meta[name="csrf-token"], meta[name="RequestVerificationToken"]');
        var token = (tokenEl && tokenEl.value) || (tokenMeta && tokenMeta.content);
        if (token) headers['RequestVerificationToken'] = token;

        var ctrl = ('AbortController' in window) ? new AbortController() : null;
        var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, orderCfg.timeoutMs || 15000) : null;

        fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload),
            signal: ctrl ? ctrl.signal : undefined
        })
            .then(function (res) {
                if (timer) clearTimeout(timer);
                return res.text().then(function (raw) {
                    var body = {};
                    try { body = raw ? JSON.parse(raw) : {}; } catch (e) { body = {}; }

                    if (!res.ok || body.status === 0) {
                        console.error('[DatHang] HTTP ' + res.status + ' ' + res.statusText, '\nPayload:', payload, '\nResponse:', raw.slice(0, 1000));
                        var err = new Error('HTTP ' + res.status);
                        err.userMessage = extractServerMessage(res.status, body);
                        throw err;
                    }
                    return body.data || body;
                });
            })
            .then(function (order) {
                idempotencyKey = newKey();
                showResult(order, payload, qty);
            })
            .catch(function (err) {
                if (timer) clearTimeout(timer);
                if (!err.userMessage) console.error('[DatHang] Lỗi mạng/timeout:', err);
                var msg = err.userMessage || (err.name === 'AbortError'
                    ? 'Máy chủ phản hồi quá lâu. Vui lòng thử lại sau ít phút.'
                    : 'Lỗi kết nối máy chủ đặt hàng. Vui lòng kiểm tra mạng và thử lại.');
                showStatus('error', '<i class="fa-solid fa-circle-exclamation"></i><span>' + esc(msg) + '</span>');
            })
            .then(function () {
                setLoading(false);
            });
    }

    /* ---------- 8. Hiển thị Kết Quả & Mã QR Chuyển Khoản Tự Động ---------- */
    function showResult(order, payload, qty) {
        if (!result) return;
        var orderCode = order.maDonHang || order.orderId || ('CB' + Date.now().toString().slice(-6));
        var depositTotal = depositUnit * qty;
        var totalAmount = (typeof order.tongTien === 'number' && order.tongTien > 0) ? order.tongTien : (unitPrice * qty);

        var ck = order.chuyenKhoan || order.payment || {};
        var fbBank = orderCfg.bankTransferFallback || {};
        var bankName = ck.nganHang || fbBank.bankName || 'MB Bank';
        var accNo = ck.soTaiKhoan || fbBank.accountNo || '888866669999';
        var accName = ck.tenTaiKhoan || fbBank.accountName || 'CONG TY TNHH CYBERCRAFT LABS';
        var transferNote = ck.noiDung || ('COC ' + orderCode);

        /* Tự động sinh ảnh VietQR nếu API Backend chưa trả về đường dẫn ảnh QR */
        var qrUrl = ck.anhQR || (
            'https://img.vietqr.io/image/' +
            encodeURIComponent(fbBank.bankId || 'MB') + '-' +
            encodeURIComponent(accNo) + '-compact2.png?amount=' +
            encodeURIComponent(depositTotal) + '&addInfo=' +
            encodeURIComponent(transferNote) + '&accountName=' +
            encodeURIComponent(accName)
        );

        result.innerHTML =
            '<div class="py-2 text-center">' +
            '  <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 text-xl border border-cyan-500/40">' +
            '    <i class="fa-solid fa-check" aria-hidden="true"></i>' +
            '  </div>' +
            '  <h3 class="mt-4 text-xl font-extrabold text-white">Đã Giữ Suất Pre-Order Thành Công</h3>' +
            '  <p class="mt-1 text-xs text-slate-300">Mã đơn đặt trước: <strong class="text-cyan-400 font-mono text-sm">' + esc(orderCode) + '</strong></p>' +
            '  <p class="mt-1 text-xs text-slate-300">Phiên bản: <strong class="text-white">' + esc(selectedState.colorLabel + ' · ' + selectedState.switchLabel) + ' (x' + qty + ')</strong></p>' +
            '  <div class="mt-4 rounded-2xl bg-slate-900 border border-cyan-500/35 p-4 text-left">' +
            '    <div class="flex items-center justify-between border-b border-slate-800 pb-2.5">' +
            '      <span class="text-xs font-bold uppercase tracking-wider text-cyan-400"><i class="fa-solid fa-qrcode mr-1.5"></i>Mã QR Chuyển Khoản Đặt Cọc</span>' +
            '      <span class="text-xs font-bold text-amber-400">Cọc: ' + fmt(depositTotal) + '</span>' +
            '    </div>' +
            '    <div class="mt-3 grid items-center gap-4 sm:grid-cols-[160px_1fr]">' +
            '      <img src="' + esc(qrUrl) + '" alt="Mã QR chuyển khoản đơn ' + esc(orderCode) + '" class="mx-auto w-40 h-40 rounded-xl bg-white p-2 object-contain" width="160" height="160">' +
            '      <dl class="space-y-1.5 text-xs text-slate-300">' +
            '        <div><dt class="text-slate-400">Ngân hàng thụ hưởng:</dt><dd class="font-semibold text-white">' + esc(bankName) + '</dd></div>' +
            '        <div><dt class="text-slate-400">Số tài khoản:</dt><dd class="font-mono text-sm font-bold text-cyan-400">' + esc(accNo) + '</dd></div>' +
            '        <div><dt class="text-slate-400">Chủ tài khoản:</dt><dd class="font-semibold text-white">' + esc(accName) + '</dd></div>' +
            '        <div><dt class="text-slate-400">Số tiền cọc / Tổng đơn:</dt><dd><strong class="text-amber-400">' + fmt(depositTotal) + '</strong> <span class="text-slate-400">(Tổng: ' + fmt(totalAmount) + ')</span></dd></div>' +
            '        <div><dt class="text-slate-400">Nội dung chuyển khoản:</dt><dd class="inline-block rounded bg-cyan-500/15 px-2 py-0.5 font-mono font-bold text-cyan-300 border border-cyan-500/30">' + esc(transferNote) + '</dd></div>' +
            '      </dl>' +
            '    </div>' +
            '  </div>' +
            '  <p class="mt-4 text-xs text-slate-400">Hệ thống tự động kích hoạt bảo hiểm đơn hàng ngay khi nhận lệnh chuyển khoản. ' + esc(preorder.estimatedDelivery || '') + '</p>' +
            '  <div class="mt-5 flex justify-center gap-3">' +
            '    <button type="button" class="btn btn-primary btn-sm" data-close-order>Hoàn Tất &amp; Đóng</button>' +
            '  </div>' +
            '</div>';

        var closeBtn = result.querySelector('[data-close-order]');
        if (closeBtn) closeBtn.addEventListener('click', function () { dialog.close(); });
        form.hidden = true;
        result.hidden = false;
        result.focus();
    }

    function resetToForm(clear) {
        if (clear) {
            form.reset();
            triedSubmit = false;
            Object.keys(validators).forEach(function (name) {
                var field = form.elements[name];
                if (field) field.removeAttribute('aria-invalid');
                var err = document.getElementById('e-' + name);
                if (err) { err.innerHTML = ''; err.classList.remove('is-visible'); }
            });
            showStatus('', '');
            syncVariantUI();
            updateSummary();
        }
        if (result) {
            result.hidden = true;
            result.innerHTML = '';
        }
        form.hidden = false;
    }

    syncVariantUI();
    updateSummary();

    /* ---------- 9. Sticky CTA Mobile ---------- */
    var sticky = document.getElementById('sticky-cta');
    var heroCta = document.getElementById('hero-cta');
    if (sticky && heroCta && 'IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
            var entry = entries[0];
            var show = !entry.isIntersecting && entry.boundingClientRect.top < 0;
            sticky.classList.toggle('is-visible', show);
            sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
            if (show) sticky.removeAttribute('inert');
            else sticky.setAttribute('inert', '');
        }).observe(heroCta);
    }
})();