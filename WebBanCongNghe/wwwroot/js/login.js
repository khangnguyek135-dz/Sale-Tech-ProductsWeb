/* =========================================================
   NHÀ GIẢ KIM – Trang đăng nhập
   Validate form, hiện/ẩn mật khẩu, cảnh báo Caps Lock, gửi API.
   File độc lập, không dùng chung module với landing page.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Cấu hình ---------- */
  const CONFIG = {
    // TODO: điền endpoint thật khi có backend, VD: '/api/auth/login'.
    // Để trống => form không gửi đi và báo chưa kết nối máy chủ (không giả lập đăng nhập thành công).
    endpoint: '',
    redirectTo: 'admin.html',
    timeoutMs: 15000,
    passwordMin: 6
  };

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  // Di động Việt Nam: 0 hoặc +84, theo sau đầu số 3/5/7/8/9 và 8 chữ số
  const PHONE_RE = /^(?:\+?84|0)(?:3|5|7|8|9)\d{8}$/;

  const form = document.getElementById('login-form');
  if (!form) return;

  const fields = {
    identifier: form.elements.identifier,
    password: form.elements.password
  };
  const statusBox = document.getElementById('login-status');
  const submitBtn = form.querySelector('[data-submit]');
  const submitLabel = form.querySelector('[data-submit-label]');
  const submitIcon = submitBtn.querySelector('i');
  const capsHint = document.getElementById('h-capslock');

  /* ---------- Năm hiện tại ở footer ---------- */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Hiện / ẩn mật khẩu ---------- */
  const pwToggle = form.querySelector('[data-pw-toggle]');
  pwToggle.addEventListener('click', () => {
    const show = fields.password.type === 'password';
    fields.password.type = show ? 'text' : 'password';
    pwToggle.setAttribute('aria-pressed', String(show));
    pwToggle.setAttribute('aria-label', show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
    pwToggle.querySelector('i').className = show ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
    fields.password.focus();
  });

  /* ---------- Cảnh báo Caps Lock ---------- */
  const checkCaps = (e) => {
    if (typeof e.getModifierState !== 'function') return;
    capsHint.hidden = !e.getModifierState('CapsLock');
  };
  fields.password.addEventListener('keydown', checkCaps);
  fields.password.addEventListener('keyup', checkCaps);
  fields.password.addEventListener('blur', () => { capsHint.hidden = true; });

  /* ---------- Validation ---------- */
  function normalizeIdentifier(raw) {
    const value = raw.trim();
    if (value.includes('@')) return { type: 'email', value: value.toLowerCase() };
    return { type: 'phone', value: value.replace(/[\s.\-()]/g, '') };
  }

  const validators = {
    identifier(raw) {
      if (!raw.trim()) return 'Vui lòng nhập email hoặc số điện thoại.';
      const id = normalizeIdentifier(raw);
      if (id.type === 'email' && !EMAIL_RE.test(id.value)) return 'Email chưa đúng định dạng.';
      if (id.type === 'phone' && !PHONE_RE.test(id.value)) return 'Số điện thoại chưa đúng (VD: 0912 345 678).';
      return '';
    },
    password(raw) {
      if (!raw) return 'Vui lòng nhập mật khẩu.';
      if (raw.length < CONFIG.passwordMin) return `Mật khẩu tối thiểu ${CONFIG.passwordMin} ký tự.`;
      return '';
    }
  };

  function setFieldError(name, message) {
    const input = fields[name];
    const errorEl = document.getElementById('e-' + name);
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      errorEl.innerHTML = '<i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>';
      errorEl.append(document.createTextNode(' ' + message));
      errorEl.classList.add('is-visible');
    } else {
      input.removeAttribute('aria-invalid');
      errorEl.textContent = '';
      errorEl.classList.remove('is-visible');
    }
  }

  function validateField(name) {
    const message = validators[name](fields[name].value);
    setFieldError(name, message);
    return !message;
  }

  // Chỉ báo lỗi sau khi người dùng rời ô lần đầu; sau đó kiểm tra lại khi gõ
  Object.keys(fields).forEach((name) => {
    const input = fields[name];
    input.addEventListener('blur', () => {
      if (input.value) { input.dataset.touched = '1'; validateField(name); }
    });
    input.addEventListener('input', () => {
      if (input.dataset.touched || input.getAttribute('aria-invalid')) validateField(name);
      clearStatus();
    });
  });

  /* ---------- Trạng thái ---------- */
  const STATUS_ICON = {
    error: 'fa-circle-exclamation',
    info: 'fa-circle-info',
    success: 'fa-circle-check'
  };

  function showStatus(type, message) {
    statusBox.className = 'form-status is-' + type;
    statusBox.innerHTML = '<i class="fa-solid ' + STATUS_ICON[type] + '" aria-hidden="true"></i>';
    const span = document.createElement('span');
    span.textContent = message;
    statusBox.append(span);
  }

  function clearStatus() {
    statusBox.className = 'form-status';
    statusBox.textContent = '';
  }

  function setLoading(loading) {
    submitBtn.disabled = loading;
    submitBtn.setAttribute('aria-busy', String(loading));
    submitLabel.textContent = loading ? 'Đang đăng nhập…' : 'Đăng nhập';
    if (loading) {
      submitIcon.className = 'spinner';
    } else {
      submitIcon.className = 'fa-solid fa-arrow-right';
    }
  }

  /* ---------- Submit ---------- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearStatus();

    const results = Object.keys(fields).map((name) => {
      fields[name].dataset.touched = '1';
      return validateField(name);
    });
    if (results.includes(false)) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    if (!CONFIG.endpoint) {
      showStatus('info', 'Chức năng đăng nhập chưa được kết nối máy chủ. Vui lòng quay lại sau hoặc đặt mua sách trực tiếp tại trang chủ.');
      return;
    }

    const id = normalizeIdentifier(fields.identifier.value);
    const payload = {
      identifier: id.value,
      identifierType: id.type,
      password: fields.password.value,
      remember: form.elements.remember.checked
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CONFIG.timeoutMs);
    let redirecting = false;
    setLoading(true);

    try {
      const res = await fetch(CONFIG.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'include', // backend đặt cookie phiên (HttpOnly) – không lưu token ở localStorage
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        redirecting = true;
        showStatus('success', 'Đăng nhập thành công. Đang chuyển trang…');
        window.location.assign(data.redirectTo || CONFIG.redirectTo);
        return;
      }

      fields.password.value = '';
      if (res.status === 400 || res.status === 401) {
        showStatus('error', data.message || 'Email/số điện thoại hoặc mật khẩu không đúng.');
        fields.password.focus();
      } else if (res.status === 429) {
        showStatus('error', 'Bạn đã thử quá nhiều lần. Vui lòng đợi vài phút rồi thử lại.');
      } else {
        showStatus('error', 'Máy chủ đang gặp sự cố. Vui lòng thử lại sau.');
      }
    } catch (err) {
      showStatus('error', err.name === 'AbortError'
        ? 'Kết nối quá lâu. Vui lòng kiểm tra mạng và thử lại.'
        : 'Không thể kết nối máy chủ. Vui lòng kiểm tra mạng và thử lại.');
    } finally {
      clearTimeout(timer);
      if (!redirecting) setLoading(false);
    }
  });
})();
