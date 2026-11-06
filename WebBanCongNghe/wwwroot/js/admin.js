/* =========================================================
   NHÀ GIẢ KIM – Trang quản trị
   Sidebar (thu gọn / drawer / menu 2 cấp), menu profile,
   điều hướng theo hash (#/dashboard, #/orders/pending…),
   render Dashboard, Đơn hàng, form Cài đặt & Hồ sơ.
   File độc lập, không dùng chung module với landing page / login.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Cấu hình ---------- */
  const CONFIG = {
    // TODO: điền endpoint thật khi có backend. Để trống => dùng DEMO_DATA bên dưới
    // và các form KHÔNG lưu (báo rõ "chưa kết nối máy chủ").
    api: {
      logout: '',          // POST – hủy phiên, VD: '/api/auth/logout'
      saveSettings: '',    // PUT  – VD: '/api/admin/settings/:section'
      saveProfile: '',     // PUT  – VD: '/api/admin/profile'
      changePassword: ''   // POST – VD: '/api/admin/profile/password'
    },
    loginPage: 'login.html',
    storageKey: 'ngk-admin-sidebar',
    avatarMaxBytes: 2 * 1024 * 1024
  };

  /* ---------- Dữ liệu mẫu (chỉ minh họa giao diện) ---------- */
  const now = new Date();
  const daysAgo = (d, h = 10, m = 0) => {
    const t = new Date(now);
    t.setDate(t.getDate() - d);
    t.setHours(h, m, 0, 0);
    return t.toISOString();
  };

  const DEMO_DATA = {
    user: {
      fullName: 'Quản trị viên',
      email: 'admin@example.com',
      phone: '',
      role: 'Quản trị viên',
      avatar: 'images/admin/avatar-default.svg'
    },
    stats: [
      { icon: 'fa-receipt', label: 'Đơn hôm nay', valueFrom: 'today', note: 'Tính từ 0:00' },
      { icon: 'fa-clock', label: 'Chờ xác nhận', valueFrom: 'pending', note: 'Cần gọi xác nhận' },
      { icon: 'fa-sack-dollar', label: 'Doanh thu 30 ngày', value: 18450000, money: true, note: 'Đơn đã hoàn tất' },
      { icon: 'fa-book', label: 'Tồn kho', value: 236, note: 'cuốn' }
    ],
    // Số đơn mỗi ngày, từ 6 ngày trước đến hôm nay
    ordersPerDay: [12, 9, 15, 11, 18, 14, 7],
    orders: [
      { id: 'NGK-24117', name: 'Nguyễn Văn A', phone: '0912 345 678', province: 'TP. Hồ Chí Minh', qty: 1, total: 104000, payment: 'cod', paymentStatus: 'unpaid', status: 'pending_confirmation', createdAt: daysAgo(0, 9, 24) },
      { id: 'NGK-24116', name: 'Trần Thị B', phone: '0987 654 321', province: 'Hà Nội', qty: 2, total: 188000, payment: 'bank_transfer', paymentStatus: 'paid', status: 'pending_confirmation', createdAt: daysAgo(0, 8, 5) },
      { id: 'NGK-24115', name: 'Lê Văn C', phone: '0909 111 222', province: 'Đà Nẵng', qty: 1, total: 109000, payment: 'cod', paymentStatus: 'unpaid', status: 'shipping', createdAt: daysAgo(1, 16, 40) },
      { id: 'NGK-24114', name: 'Phạm Thị D', phone: '0938 222 333', province: 'TP. Hồ Chí Minh', qty: 3, total: 252000, payment: 'bank_transfer', paymentStatus: 'paid', status: 'shipping', createdAt: daysAgo(1, 11, 12) },
      { id: 'NGK-24113', name: 'Hoàng Văn E', phone: '0977 333 444', province: 'Cần Thơ', qty: 1, total: 109000, payment: 'cod', paymentStatus: 'paid', status: 'completed', createdAt: daysAgo(2, 14, 30) },
      { id: 'NGK-24112', name: 'Vũ Thị F', phone: '0966 444 555', province: 'Hải Phòng', qty: 1, total: 109000, payment: 'cod', paymentStatus: 'unpaid', status: 'cancelled', createdAt: daysAgo(3, 10, 2) },
      { id: 'NGK-24111', name: 'Đặng Văn G', phone: '0915 555 666', province: 'TP. Hồ Chí Minh', qty: 2, total: 168000, payment: 'bank_transfer', paymentStatus: 'paid', status: 'completed', createdAt: daysAgo(4, 19, 45) },
      { id: 'NGK-24110', name: 'Bùi Thị H', phone: '0903 666 777', province: 'Bình Dương', qty: 1, total: 104000, payment: 'cod', paymentStatus: 'paid', status: 'completed', createdAt: daysAgo(5, 9, 15) },
      { id: 'NGK-24109', name: 'Đỗ Văn I', phone: '0945 777 888', province: 'Khánh Hòa', qty: 1, total: 109000, payment: 'cod', paymentStatus: 'unpaid', status: 'pending_confirmation', createdAt: daysAgo(6, 15, 0) }
    ],
    settings: {
      'settings/store': { name: 'Nhà sách', phone: '', email: '', hours: '', address: '', about: '' },
      'settings/shipping': { inner: 20000, outer: 25000, freeFrom: '', maxQty: 10 },
      'settings/payment': { cod: true, bankTransfer: true, bankName: '', accountNumber: '', accountHolder: '' }
    }
  };

  /* ---------- Nhãn trạng thái (luôn có icon + chữ) ---------- */
  const ORDER_STATUS = {
    pending_confirmation: { label: 'Chờ xác nhận', tone: 'warn', icon: 'fa-clock', slug: 'pending' },
    shipping: { label: 'Đang giao', tone: 'info', icon: 'fa-truck-fast', slug: 'shipping' },
    completed: { label: 'Hoàn tất', tone: 'good', icon: 'fa-circle-check', slug: 'completed' },
    cancelled: { label: 'Đã hủy', tone: 'critical', icon: 'fa-circle-xmark', slug: 'cancelled' }
  };
  const PAYMENT_METHOD = { cod: 'COD', bank_transfer: 'Chuyển khoản' };
  const PAYMENT_STATUS = {
    paid: { label: 'Đã thanh toán', tone: 'good', icon: 'fa-check' },
    unpaid: { label: 'Chưa thanh toán', tone: 'muted', icon: 'fa-hourglass-half' }
  };

  /* ---------- Bảng route ---------- */
  const ROUTES = {
    'dashboard': { page: 'dashboard', title: 'Dashboard' },
    'orders': { page: 'orders', title: 'Tất cả đơn hàng', group: 'Đơn đặt hàng', filter: 'all' },
    'orders/pending': { page: 'orders', title: 'Chờ xác nhận', group: 'Đơn đặt hàng', filter: 'pending_confirmation' },
    'orders/shipping': { page: 'orders', title: 'Đang giao', group: 'Đơn đặt hàng', filter: 'shipping' },
    'orders/completed': { page: 'orders', title: 'Hoàn tất', group: 'Đơn đặt hàng', filter: 'completed' },
    'orders/cancelled': { page: 'orders', title: 'Đã hủy', group: 'Đơn đặt hàng', filter: 'cancelled' },
    'customers': { page: 'placeholder', title: 'Khách hàng' },
    'product/info': { page: 'placeholder', title: 'Thông tin sách', group: 'Sản phẩm' },
    'product/stock': { page: 'placeholder', title: 'Giá & tồn kho', group: 'Sản phẩm' },
    'content/media': { page: 'placeholder', title: 'Truyền thông & video', group: 'Nội dung trang' },
    'content/preview': { page: 'placeholder', title: 'Trang đọc thử', group: 'Nội dung trang' },
    'content/reviews': { page: 'placeholder', title: 'Đánh giá', group: 'Nội dung trang' },
    'settings/store': { page: 'settings', title: 'Thông tin nhà sách', group: 'Cài đặt' },
    'settings/shipping': { page: 'settings', title: 'Phí giao hàng', group: 'Cài đặt' },
    'settings/payment': { page: 'settings', title: 'Thanh toán', group: 'Cài đặt' },
    'profile': { page: 'profile', title: 'Chỉnh sửa hồ sơ', group: 'Hồ sơ cá nhân' },
    'profile/password': { page: 'profile', title: 'Đổi mật khẩu', group: 'Hồ sơ cá nhân' }
  };
  const ALIASES = { '': 'dashboard', 'settings': 'settings/store' };

  /* ---------- Tiện ích ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const vnd = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });
  const num = new Intl.NumberFormat('vi-VN');
  const dateFmt = new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const dayFmt = new Intl.DateTimeFormat('vi-VN', { weekday: 'short' });
  const dayFullFmt = new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' });

  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* bỏ qua */ } }
  };

  const desktopMQ = window.matchMedia('(min-width: 1024px)');
  const root = document.documentElement;
  const data = DEMO_DATA;

  const badge = (meta) =>
    `<span class="badge badge--${meta.tone}"><i class="fa-solid ${meta.icon}" aria-hidden="true"></i>${esc(meta.label)}</span>`;

  /* =========================================================
     SIDEBAR
     ========================================================= */
  const sidebar = $('#sidebar');
  const overlay = $('.sidebar-overlay');
  const collapseBtn = $('[data-sidebar-collapse]');
  const openBtn = $('[data-sidebar-open]');

  function syncCollapseBtn() {
    if (desktopMQ.matches) {
      const collapsed = root.classList.contains('sidebar-collapsed');
      collapseBtn.setAttribute('aria-expanded', String(!collapsed));
      collapseBtn.setAttribute('aria-label', collapsed ? 'Mở rộng menu' : 'Thu gọn menu');
      collapseBtn.title = collapsed ? 'Mở rộng menu' : 'Thu gọn menu';
    } else {
      collapseBtn.setAttribute('aria-expanded', 'true');
      collapseBtn.setAttribute('aria-label', 'Đóng menu');
      collapseBtn.title = 'Đóng menu';
    }
  }

  function openDrawer() {
    sidebar.classList.add('is-open');
    overlay.hidden = false;
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const first = $('.nav-link', sidebar);
    if (first) first.focus();
  }

  function closeDrawer({ restoreFocus = true } = {}) {
    if (!sidebar.classList.contains('is-open')) return;
    sidebar.classList.remove('is-open');
    overlay.hidden = true;
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (restoreFocus) openBtn.focus();
  }

  collapseBtn.addEventListener('click', () => {
    if (desktopMQ.matches) {
      const collapsed = root.classList.toggle('sidebar-collapsed');
      storage.set(CONFIG.storageKey, collapsed ? 'collapsed' : 'expanded');
      syncCollapseBtn();
    } else {
      closeDrawer();
    }
  });
  openBtn.addEventListener('click', openDrawer);
  overlay.addEventListener('click', () => closeDrawer());
  desktopMQ.addEventListener('change', () => { closeDrawer({ restoreFocus: false }); syncCollapseBtn(); });

  // Bẫy focus trong drawer khi đang mở trên mobile
  sidebar.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !sidebar.classList.contains('is-open')) return;
    const focusables = $$('a[href], button:not([disabled])', sidebar).filter((el) => el.offsetParent !== null);
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Menu cấp 2: mở/đóng
  $$('[data-sub-toggle]', sidebar).forEach((btn) => {
    btn.addEventListener('click', () => {
      // Khi thu gọn, menu con hiện dạng flyout (hover/focus) – click đi thẳng tới trang đầu tiên
      if (desktopMQ.matches && root.classList.contains('sidebar-collapsed')) {
        const firstLink = $('.subnav-link', btn.parentElement);
        if (firstLink) location.hash = firstLink.getAttribute('href');
        return;
      }
      setSubOpen(btn.parentElement, !btn.parentElement.classList.contains('is-open'));
    });
  });

  function setSubOpen(item, open) {
    item.classList.toggle('is-open', open);
    const btn = $('[data-sub-toggle]', item);
    if (btn) btn.setAttribute('aria-expanded', String(open));
  }

  /* =========================================================
     MENU PROFILE
     ========================================================= */
  const profileBtn = $('[data-profile-toggle]');
  const profileMenu = $('#profile-menu');
  const menuItems = () => $$('[role="menuitem"]', profileMenu);

  function openProfileMenu(focusFirst = false) {
    profileMenu.hidden = false;
    profileBtn.setAttribute('aria-expanded', 'true');
    if (focusFirst) menuItems()[0].focus();
  }
  function closeProfileMenu(restoreFocus = false) {
    if (profileMenu.hidden) return;
    profileMenu.hidden = true;
    profileBtn.setAttribute('aria-expanded', 'false');
    if (restoreFocus) profileBtn.focus();
  }

  profileBtn.addEventListener('click', () => {
    if (profileMenu.hidden) openProfileMenu(false); else closeProfileMenu();
  });
  profileBtn.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openProfileMenu(true);
    }
  });
  profileMenu.addEventListener('keydown', (e) => {
    const items = menuItems();
    const i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
    else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
    else if (e.key === 'Tab') { closeProfileMenu(); }
  });
  profileMenu.addEventListener('click', (e) => {
    if (e.target.closest('a[role="menuitem"]')) closeProfileMenu();
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.profile')) closeProfileMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!profileMenu.hidden) closeProfileMenu(true);
    else closeDrawer();
  });

  // Đăng xuất
  $('[data-logout]').addEventListener('click', async () => {
    if (CONFIG.api.logout) {
      try {
        await fetch(CONFIG.api.logout, { method: 'POST', credentials: 'include' });
      } catch (e) { /* vẫn chuyển về trang đăng nhập */ }
    }
    window.location.assign(CONFIG.loginPage);
  });

  /* =========================================================
     THÔNG TIN NGƯỜI DÙNG
     ========================================================= */
  function renderUser() {
    $$('[data-user-name]').forEach((el) => { el.textContent = data.user.fullName; });
    $$('[data-user-role]').forEach((el) => { el.textContent = data.user.role; });
    $$('[data-user-email]').forEach((el) => { el.textContent = data.user.email; });
    $$('[data-user-avatar]').forEach((el) => { el.src = data.user.avatar; });
    profileBtn.setAttribute('aria-label', `Tài khoản: ${data.user.fullName}`);
  }

  /* =========================================================
     DASHBOARD
     ========================================================= */
  const countBy = (status) => data.orders.filter((o) => o.status === status).length;

  function renderStats() {
    $('[data-stats]').innerHTML = data.stats.map((s) => {
      const value = s.valueFrom === 'pending' ? countBy('pending_confirmation')
        : s.valueFrom === 'today' ? data.ordersPerDay[data.ordersPerDay.length - 1]
        : s.value;
      const text = s.money ? vnd.format(value) : num.format(value);
      return `<li class="stat">
          <span class="stat-icon"><i class="fa-solid ${s.icon}" aria-hidden="true"></i></span>
          <div class="min-w-0">
            <p class="stat-label">${esc(s.label)}</p>
            <p class="stat-value">${esc(text)}</p>
            <p class="stat-note">${esc(s.note)}</p>
          </div>
        </li>`;
    }).join('');
  }

  // Thang trục y "tròn": 5, 10, 20, 25, 50…
  function niceMax(value) {
    if (value <= 0) return 5;
    const pow = Math.pow(10, Math.floor(Math.log10(value)));
    const steps = [1, 2, 2.5, 5, 10];
    for (const s of steps) if (s * pow >= value) return s * pow;
    return 10 * pow;
  }

  function renderChart() {
    const values = data.ordersPerDay;
    const max = niceMax(Math.max(...values));
    const chartH = 220;
    const days = values.map((v, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (values.length - 1 - i));
      return { value: v, date: d, today: i === values.length - 1 };
    });

    const ticks = [0, max / 2, max];
    const axis = ticks.map((t) => `<span style="bottom:${(t / max) * 100}%">${num.format(t)}</span>`).join('');
    const grid = ticks.map((t, i) =>
      `<span class="bar-chart__grid${i === 0 ? ' bar-chart__grid--base' : ''}" style="bottom:calc(${(t / max) * chartH}px + 30px)"></span>`
    ).join('');

    const cols = days.map((d) => {
      const h = Math.round((d.value / max) * chartH);
      const label = d.today ? 'Hôm nay' : dayFmt.format(d.date);
      const full = dayFullFmt.format(d.date);
      return `<div class="bar-col${d.today ? ' is-today' : ''}" tabindex="0" style="--bar-h:${h}px"
                   aria-label="${esc(full)}: ${d.value} đơn">
          <div class="bar-col__area"><span class="bar-col__bar" style="height:${h}px"></span></div>
          <span class="bar-col__label">${esc(label)}</span>
          <span class="bar-col__tip" aria-hidden="true"><strong>${d.value} đơn</strong>${esc(full)}</span>
        </div>`;
    }).join('');

    $('[data-chart]').innerHTML =
      `<div class="bar-chart__axis" aria-hidden="true">${axis}</div>
       <div class="bar-chart__plot">${grid}<div class="bar-chart__cols">${cols}</div></div>`;

    $('[data-chart-table]').innerHTML = days.map((d) =>
      `<tr><td>${esc(dayFullFmt.format(d.date))}</td><td class="num">${d.value}</td></tr>`
    ).join('');
  }

  function renderStatusList() {
    const total = data.orders.length || 1;
    $('[data-status-list]').innerHTML = Object.entries(ORDER_STATUS).map(([key, meta]) => {
      const count = countBy(key);
      const pct = Math.round((count / total) * 100);
      return `<li class="status-row">
          <div class="status-row__head">
            <a href="#/orders/${meta.slug}">${badge(meta)}</a>
            <span class="status-row__count">${count}<small>${pct}%</small></span>
          </div>
          <div class="meter st-${meta.tone}" aria-hidden="true"><span style="width:${pct}%"></span></div>
        </li>`;
    }).join('');
  }

  function sortedOrders() {
    return [...data.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  function renderRecentOrders() {
    $('[data-recent-orders]').innerHTML = sortedOrders().slice(0, 5).map((o) => `
      <tr>
        <td><span class="order-code">${esc(o.id)}</span></td>
        <td><p class="cell-main">${esc(o.name)}</p><p class="cell-sub">${esc(o.phone)}</p></td>
        <td class="num">${esc(vnd.format(o.total))}</td>
        <td>${badge(ORDER_STATUS[o.status])}</td>
        <td><span class="cell-sub">${esc(dateFmt.format(new Date(o.createdAt)))}</span></td>
      </tr>`).join('');
  }

  function renderDashboard() {
    renderStats();
    renderChart();
    renderStatusList();
    renderRecentOrders();
  }

  /* =========================================================
     ĐƠN ĐẶT HÀNG
     ========================================================= */
  const orderSearch = $('[data-order-search]');
  let currentFilter = 'all';

  function renderOrderTabs() {
    const tabs = [{ key: 'all', label: 'Tất cả', href: '#/orders', count: data.orders.length }]
      .concat(Object.entries(ORDER_STATUS).map(([key, meta]) => ({
        key, label: meta.label, href: `#/orders/${meta.slug}`, count: countBy(key)
      })));
    $('[data-order-tabs]').innerHTML = tabs.map((t) => {
      const active = t.key === currentFilter;
      return `<a class="tab${active ? ' is-active' : ''}" href="${t.href}"${active ? ' aria-current="page"' : ''}>
          ${esc(t.label)} <span class="tab__count">${t.count}</span>
        </a>`;
    }).join('');
  }

  function renderOrders() {
    const q = orderSearch.value.trim().toLowerCase();
    const qDigits = q.replace(/\D/g, '');
    const rows = sortedOrders().filter((o) => {
      if (currentFilter !== 'all' && o.status !== currentFilter) return false;
      if (!q) return true;
      return o.id.toLowerCase().includes(q)
        || o.name.toLowerCase().includes(q)
        || (qDigits && o.phone.replace(/\D/g, '').includes(qDigits));
    });

    $('[data-order-rows]').innerHTML = rows.map((o) => {
      const pay = PAYMENT_STATUS[o.paymentStatus];
      return `<tr>
          <td><span class="order-code">${esc(o.id)}</span></td>
          <td><p class="cell-main">${esc(o.name)}</p><p class="cell-sub">${esc(o.phone)}</p></td>
          <td>${esc(o.province)}</td>
          <td class="num">${o.qty}</td>
          <td class="num">${esc(vnd.format(o.total))}</td>
          <td><p class="cell-sub">${esc(PAYMENT_METHOD[o.payment])}</p>${badge(pay)}</td>
          <td>${badge(ORDER_STATUS[o.status])}</td>
          <td><span class="cell-sub">${esc(dateFmt.format(new Date(o.createdAt)))}</span></td>
        </tr>`;
    }).join('');

    const empty = rows.length === 0;
    $('[data-order-empty]').hidden = !empty;
    $('[data-order-rows]').closest('.table-wrap').hidden = empty;
    $('[data-order-count]').textContent = empty ? '' : `Hiển thị ${rows.length} / ${data.orders.length} đơn hàng`;
  }

  orderSearch.addEventListener('input', renderOrders);

  function renderPendingBadge() {
    const n = countBy('pending_confirmation');
    $$('[data-pending-count]').forEach((el) => {
      el.textContent = n > 0 ? String(n) : '';
      el.setAttribute('aria-label', `${n} đơn chờ xác nhận`);
    });
  }

  /* =========================================================
     FORM CÀI ĐẶT & HỒ SƠ
     ========================================================= */
  const STATUS_ICON = { error: 'fa-circle-exclamation', info: 'fa-circle-info', success: 'fa-circle-check' };

  function showFormStatus(form, type, message) {
    const box = $('[data-form-status]', form);
    box.className = 'form-status is-' + type;
    box.innerHTML = `<i class="fa-solid ${STATUS_ICON[type]}" aria-hidden="true"></i><span>${esc(message)}</span>`;
  }
  function clearFormStatus(form) {
    const box = $('[data-form-status]', form);
    box.className = 'form-status';
    box.textContent = '';
  }

  function fillForm(form, values) {
    Object.entries(values).forEach(([name, value]) => {
      const field = form.elements[name];
      if (!field) return;
      if (field.type === 'checkbox') {
        field.checked = Boolean(value);
        field.defaultChecked = Boolean(value);
      } else {
        field.value = value ?? '';
        field.defaultValue = value ?? '';
      }
    });
  }

  function endpointFor(form) {
    const panel = form.dataset.panel;
    if (panel === 'profile') return CONFIG.api.saveProfile;
    if (panel === 'profile/password') return CONFIG.api.changePassword;
    return CONFIG.api.saveSettings && CONFIG.api.saveSettings.replace(':section', panel.split('/')[1]);
  }

  function setInvalid(field, invalid) {
    if (invalid) field.setAttribute('aria-invalid', 'true'); else field.removeAttribute('aria-invalid');
  }

  function validateForm(form) {
    let firstInvalid = null;
    $$('input, textarea, select', form).forEach((field) => {
      if (field.type === 'file' || field.readOnly) return;
      if (field.type !== 'checkbox' && typeof field.value === 'string' && field.type !== 'password') {
        field.value = field.value.trim();
      }
      const ok = field.checkValidity();
      setInvalid(field, !ok);
      if (!ok && !firstInvalid) firstInvalid = field;
    });

    if ('passwordForm' in form.dataset && !firstInvalid) {
      const { newPassword, confirmPassword } = form.elements;
      if (newPassword.value !== confirmPassword.value) {
        confirmPassword.setAttribute('aria-invalid', 'true');
        firstInvalid = confirmPassword;
        return { field: firstInvalid, message: 'Mật khẩu nhập lại không khớp.' };
      }
    }
    if (firstInvalid) {
      const label = $(`label[for="${firstInvalid.id}"]`, form);
      const name = label ? label.textContent.replace('*', '').trim() : 'Trường này';
      return { field: firstInvalid, message: `${name}: ${firstInvalid.validationMessage}` };
    }
    return null;
  }

  $$('[data-admin-form]').forEach((form) => {
    form.addEventListener('input', (e) => {
      if (e.target.hasAttribute('aria-invalid')) setInvalid(e.target, !e.target.checkValidity());
      clearFormStatus(form);
    });
    form.addEventListener('reset', () => {
      clearFormStatus(form);
      $$('[aria-invalid]', form).forEach((el) => el.removeAttribute('aria-invalid'));
      const preview = $('[data-avatar-preview]', form);
      if (preview) preview.src = data.user.avatar;
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFormStatus(form);

      const invalid = validateForm(form);
      if (invalid) {
        showFormStatus(form, 'error', invalid.message);
        invalid.field.focus();
        return;
      }

      const endpoint = endpointFor(form);
      if (!endpoint) {
        showFormStatus(form, 'info', 'Chưa kết nối máy chủ nên thay đổi chưa được lưu. Cấu hình CONFIG.api trong js/admin.js khi có backend.');
        return;
      }

      const submitBtn = $('button[type="submit"]', form);
      submitBtn.disabled = true;
      try {
        const isPassword = 'passwordForm' in form.dataset;
        const res = await fetch(endpoint, {
          method: isPassword ? 'POST' : 'PUT',
          credentials: 'include',
          body: new FormData(form)
        });
        if (res.status === 401) { window.location.assign(CONFIG.loginPage); return; }
        if (!res.ok) throw new Error('HTTP ' + res.status);
        showFormStatus(form, 'success', isPassword ? 'Đã cập nhật mật khẩu.' : 'Đã lưu thay đổi.');
        if (isPassword) form.reset();
      } catch (err) {
        showFormStatus(form, 'error', 'Không lưu được. Vui lòng kiểm tra kết nối và thử lại.');
      } finally {
        submitBtn.disabled = false;
      }
    });
  });

  // Xem trước ảnh đại diện
  const avatarInput = $('[data-avatar-input]');
  avatarInput.addEventListener('change', () => {
    const form = avatarInput.form;
    const file = avatarInput.files[0];
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
      showFormStatus(form, 'error', 'Ảnh phải là PNG, JPG hoặc WebP.');
      avatarInput.value = '';
      return;
    }
    if (file.size > CONFIG.avatarMaxBytes) {
      showFormStatus(form, 'error', 'Ảnh vượt quá 2MB.');
      avatarInput.value = '';
      return;
    }
    clearFormStatus(form);
    $('[data-avatar-preview]', form).src = URL.createObjectURL(file);
  });

  function fillForms() {
    Object.entries(data.settings).forEach(([panel, values]) => {
      const form = $(`[data-panel="${panel}"]`);
      if (form) fillForm(form, values);
    });
    fillForm($('[data-panel="profile"]'), {
      fullName: data.user.fullName, email: data.user.email, phone: data.user.phone, role: data.user.role
    });
  }

  /* =========================================================
     ĐIỀU HƯỚNG (hash router)
     ========================================================= */
  const pages = $$('[data-page]');
  const content = $('#admin-content');
  let firstRender = true;

  function currentRoute() {
    const raw = location.hash.replace(/^#\/?/, '').replace(/\/$/, '');
    return ALIASES[raw] !== undefined ? ALIASES[raw] : raw;
  }

  function setActiveNav(route) {
    $$('[data-route]').forEach((el) => {
      const active = el.dataset.route === route;
      el.classList.toggle('is-active', active);
      if (active) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current');
    });
    $$('.nav-item.has-sub', sidebar).forEach((item) => {
      const hasActive = Boolean($('.subnav-link.is-active', item));
      item.classList.toggle('has-active', hasActive);
      if (hasActive) setSubOpen(item, true);
    });
  }

  function setBreadcrumb(route, meta) {
    const crumbs = [{ label: 'Quản trị', href: '#/dashboard' }];
    if (meta.group) crumbs.push({ label: meta.group });
    crumbs.push({ label: meta.title, current: true });
    $('[data-breadcrumb]').innerHTML = crumbs.map((c) => {
      if (c.current) return `<li aria-current="page">${esc(c.label)}</li>`;
      if (c.href) return `<li><a href="${c.href}">${esc(c.label)}</a></li>`;
      return `<li>${esc(c.label)}</li>`;
    }).join('');
    $('[data-page-heading]').textContent = meta.title;
    document.title = `${meta.title} | Quản trị Nhà Giả Kim`;
  }

  function render() {
    const route = currentRoute();
    const meta = ROUTES[route] || { page: 'not-found', title: 'Không tìm thấy trang' };

    pages.forEach((p) => { p.hidden = p.dataset.page !== meta.page; });
    const page = $(`[data-page="${meta.page}"]`);
    $$('[data-panel]', page).forEach((panel) => { panel.hidden = panel.dataset.panel !== route; });

    if (meta.page === 'dashboard') renderDashboard();
    if (meta.page === 'orders') {
      currentFilter = meta.filter;
      renderOrderTabs();
      renderOrders();
    }
    if (meta.page === 'placeholder') $('[data-placeholder-title]').textContent = meta.title;

    setActiveNav(route);
    setBreadcrumb(route, meta);
    closeProfileMenu();

    if (!firstRender) {
      closeDrawer({ restoreFocus: false });
      window.scrollTo(0, 0);
      content.focus({ preventScroll: true });
    }
    firstRender = false;
  }

  /* ---------- Khởi động ---------- */
  $$('[data-year]').forEach((el) => { el.textContent = now.getFullYear(); });
  syncCollapseBtn();
  renderUser();
  renderPendingBadge();
  fillForms();
  window.addEventListener('hashchange', render);
  render();
})();
