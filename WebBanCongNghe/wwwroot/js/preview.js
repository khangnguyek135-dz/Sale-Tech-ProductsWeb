/* =========================================================
   TECH SHOWCASE, SOUND TEST LAB, EXPLODED GALLERY & FAQ
   (preview.js)
   ---------------------------------------------------------
   - Khung Youtube Review kèm Fallback Thumbnail sắc nét.
   - Sound Test Player (File Audio + Web Audio API Synthesizer).
   - Interactive Exploded Gallery 4 Tab + Zoom Lightbox.
   - Tech Reviewer Cards & FAQ Accordion.
   ========================================================= */
(function () {
    'use strict';

    var NGK = window.NGK || {};
    var data = NGK.data || {};
    var esc = NGK.escapeHTML;

    /* =========================================================
       1. YOUTUBE REVIEW EMBED (CÓ FALLBACK THUMBNAIL SẮC NÉT)
       ========================================================= */
    function initFeaturedVideo() {
        var frame = document.getElementById('featured-video');
        if (!frame) return;

        var mediaCfg = (data.media && data.media.featured) || {};
        var ytId = (NGK.server && NGK.server.youtubeId) ? NGK.server.youtubeId : (mediaCfg.youtubeId || 'SpYfZOEOyG4');
        var title = mediaCfg.title || 'Review & Sound Test Bàn Phím Cơ Custom CyberBoard Ultra';
        var source = mediaCfg.source || 'TechReview Studio';
        var fallbackThumb = mediaCfg.thumbnail || 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=85';

        var titleEl = document.getElementById('featured-video-title');
        var sourceEl = document.getElementById('featured-video-source');
        if (titleEl) titleEl.textContent = title;
        if (sourceEl) sourceEl.textContent = source;

        var ytThumbUrl = 'https://i.ytimg.com/vi/' + encodeURIComponent(ytId) + '/maxresdefault.jpg';

        frame.innerHTML =
            '<img src="' + esc(ytThumbUrl) + '" alt="' + esc(title) + '" loading="lazy" ' +
            '     onerror="this.onerror=null;this.src=\'' + esc(fallbackThumb) + '\';">' +
            '<div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent"></div>' +
            '<button type="button" class="video-play" aria-label="Phát video ' + esc(title) + '">' +
            '  <i class="fa-solid fa-play ml-1" aria-hidden="true"></i>' +
            '</button>';

        var playBtn = frame.querySelector('.video-play');
        if (playBtn) {
            playBtn.addEventListener('click', function () {
                var embedSrc = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(ytId) + '?autoplay=1&rel=0&modestbranding=1';
                frame.innerHTML =
                    '<iframe src="' + esc(embedSrc) + '" title="' + esc(title) + '" ' +
                    'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
            });
        }
    }
    initFeaturedVideo();

    /* =========================================================
       2. TRÌNH NGHE THỬ ÂM THANH SWITCH (SOUND TEST PLAYER)
       ========================================================= */
    function initSoundTestPlayer() {
        var listEl = document.getElementById('sound-switch-list');
        var barsEl = document.getElementById('sound-bars');
        var statusBadge = document.getElementById('sound-status-badge');
        var currentNameEl = document.getElementById('sound-current-name');
        var freqInfoEl = document.getElementById('sound-freq-info');
        var btnLoop = document.getElementById('btn-play-sound-loop');
        var btnSingleTap = document.getElementById('btn-single-key-tap');

        var soundTests = (data.media && data.media.soundTests) || [];
        if (!listEl || !soundTests.length) return;

        var activeSwitch = soundTests[0];
        var isPlayingLoop = false;
        var loopTimers = [];
        var audioCtx = null;
        var htmlAudio = null;

        function renderSwitchList() {
            listEl.innerHTML = soundTests.map(function (sw, idx) {
                var activeCls = idx === 0 ? ' is-active' : '';
                return (
                    '<button type="button" class="sound-switch-btn' + activeCls + '" data-sound-id="' + esc(sw.id) + '" role="radio" aria-checked="' + (idx === 0 ? 'true' : 'false') + '">' +
                    '  <div>' +
                    '    <div class="flex items-center gap-2">' +
                    '      <span class="font-bold text-sm text-white">' + esc(sw.name) + '</span>' +
                    '      <span class="rounded bg-cyan-500/15 px-2 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-500/30">' + esc(sw.id.toUpperCase()) + '</span>' +
                    '    </div>' +
                    '    <p class="mt-0.5 text-xs text-slate-400">' + esc(sw.specs) + '</p>' +
                    '    <p class="mt-1 text-xs text-slate-300">' + esc(sw.description) + '</p>' +
                    '  </div>' +
                    '  <span class="icon-btn flex-none"><i class="fa-solid fa-volume-high text-xs"></i></span>' +
                    '</button>'
                );
            }).join('');
        }
        renderSwitchList();

        function ensureAudioContext() {
            var AudioContextCls = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextCls) return null;
            if (!audioCtx) audioCtx = new AudioContextCls();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            return audioCtx;
        }

        /* Bộ tổng hợp âm học cơ khí bằng Web Audio API (mô phỏng âm chạm đáy Thock + Stem Clack + Click bar) */
        function synthesizeKeystroke(sw, velocityVariation) {
            var ctx = ensureAudioContext();
            if (!ctx) return;

            var now = ctx.currentTime;
            var p = sw.synthParams || { baseFreq: 180, thockDecay: 0.08, clackFreq: 1200, clickiness: 0.2 };
            var pitchShift = 1 + ((velocityVariation || 0) * 0.08);

            // 1. Âm trầm khung nhôm chạm đáy (Bottom-out Thock)
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(p.baseFreq * pitchShift, now);
            osc.frequency.exponentialRampToValueAtTime(48, now + p.thockDecay);

            gain.gain.setValueAtTime(0.45, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + p.thockDecay);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + p.thockDecay + 0.01);

            // 2. Âm va chạm vỏ Switch (Housing Clack / Noise Burst)
            var bufferSize = Math.floor(ctx.sampleRate * 0.025);
            var noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            var output = noiseBuffer.getChannelData(0);
            for (var i = 0; i < bufferSize; i++) {
                output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
            }
            var whiteNoise = ctx.createBufferSource();
            whiteNoise.buffer = noiseBuffer;

            var filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(p.clackFreq * pitchShift, now);
            filter.Q.setValueAtTime(2.2, now);

            var noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.32, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.024);

            whiteNoise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(ctx.destination);
            whiteNoise.start(now);

            // 3. Âm khấc Tactile hoặc thanh Clicky (Click Jacket Transient)
            if (p.clickiness > 0.15) {
                var clickOsc = ctx.createOscillator();
                var clickGain = ctx.createGain();
                clickOsc.type = 'sine';
                clickOsc.frequency.setValueAtTime(p.clackFreq * 1.35, now + 0.004);
                clickOsc.frequency.exponentialRampToValueAtTime(600, now + 0.018);

                clickGain.gain.setValueAtTime(p.clickiness * 0.35, now + 0.004);
                clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.019);

                clickOsc.connect(clickGain);
                clickGain.connect(ctx.destination);
                clickOsc.start(now + 0.004);
                clickOsc.stop(now + 0.02);
            }
        }

        function stopSoundLoop() {
            isPlayingLoop = false;
            loopTimers.forEach(function (t) { clearTimeout(t); });
            loopTimers = [];
            if (htmlAudio) {
                htmlAudio.pause();
                htmlAudio.currentTime = 0;
            }
            if (barsEl) barsEl.classList.remove('is-playing');
            if (statusBadge) {
                statusBadge.textContent = 'READY';
                statusBadge.className = 'rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-mono text-slate-300 border border-slate-700';
            }
            if (btnLoop) {
                btnLoop.innerHTML = '<i class="fa-solid fa-play" aria-hidden="true"></i><span>Phát Chuỗi Gõ Thử (Typing Test)</span>';
            }
        }

        function startSoundLoop() {
            stopSoundLoop();
            isPlayingLoop = true;
            if (barsEl) barsEl.classList.add('is-playing');
            if (statusBadge) {
                statusBadge.textContent = 'PLAYING: ' + activeSwitch.id.toUpperCase();
                statusBadge.className = 'rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[11px] font-mono text-cyan-300 border border-cyan-500/40';
            }
            if (btnLoop) {
                btnLoop.innerHTML = '<i class="fa-solid fa-stop" aria-hidden="true"></i><span>Dừng Phát Sound Test</span>';
            }

            if (activeSwitch.audioUrl) {
                htmlAudio = new Audio(activeSwitch.audioUrl);
                htmlAudio.onended = stopSoundLoop;
                htmlAudio.onerror = function () { runSynthesizedTypingSequence(); };
                htmlAudio.play().catch(function () { runSynthesizedTypingSequence(); });
            } else {
                runSynthesizedTypingSequence();
            }
        }

        function runSynthesizedTypingSequence() {
            // Nhịp gõ bàn phím thực tế (18 nhịp trong ~2.6 giây)
            var rhythmOffsets = [0, 130, 250, 390, 500, 680, 810, 920, 1060, 1240, 1370, 1490, 1630, 1820, 1950, 2080, 2220, 2400];
            rhythmOffsets.forEach(function (ms, idx) {
                var t = setTimeout(function () {
                    if (!isPlayingLoop) return;
                    var variation = (idx % 5 === 0) ? -0.6 : (Math.random() - 0.5);
                    synthesizeKeystroke(activeSwitch, variation);
                }, ms);
                loopTimers.push(t);
            });

            var endTimer = setTimeout(function () {
                stopSoundLoop();
            }, 2650);
            loopTimers.push(endTimer);
        }

        listEl.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-sound-id]');
            if (!btn) return;
            var id = btn.getAttribute('data-sound-id');
            var found = soundTests.find(function (s) { return s.id === id; });
            if (!found) return;

            activeSwitch = found;
            listEl.querySelectorAll('[data-sound-id]').forEach(function (b) {
                var isMatch = b.getAttribute('data-sound-id') === id;
                b.classList.toggle('is-active', isMatch);
                b.setAttribute('aria-checked', isMatch ? 'true' : 'false');
            });

            if (currentNameEl) currentNameEl.textContent = activeSwitch.name;
            if (freqInfoEl) freqInfoEl.textContent = activeSwitch.freqProfile;
            startSoundLoop();
        });

        if (btnLoop) {
            btnLoop.addEventListener('click', function () {
                if (isPlayingLoop) stopSoundLoop();
                else startSoundLoop();
            });
        }

        if (btnSingleTap) {
            btnSingleTap.addEventListener('click', function () {
                synthesizeKeystroke(activeSwitch, (Math.random() - 0.5) * 0.4);
                if (barsEl) {
                    barsEl.classList.add('is-playing');
                    setTimeout(function () {
                        if (!isPlayingLoop) barsEl.classList.remove('is-playing');
                    }, 180);
                }
            });
        }
    }
    initSoundTestPlayer();

    /* =========================================================
       3. INTERACTIVE EXPLODED GALLERY (4 TAB + ZOOM LIGHTBOX)
       ========================================================= */
    function initExplodedGallery() {
        var tabsContainer = document.getElementById('gallery-tabs');
        var galleryRoot = document.getElementById('exploded-gallery');
        var tabs = data.explodedTabs || [];
        if (!tabsContainer || !galleryRoot || !tabs.length) return;

        var currentIdx = 0;
        var mainImg = document.getElementById('gallery-main-img');
        var badgeEl = document.getElementById('gallery-badge');
        var subLabelEl = document.getElementById('gallery-sub-label');
        var headingEl = document.getElementById('gallery-heading');
        var bodyEl = document.getElementById('gallery-body');
        var highlightsEl = document.getElementById('gallery-highlights');
        var indicatorEl = document.getElementById('gallery-indicator');
        var btnPrev = galleryRoot.querySelector('[data-gallery-prev]');
        var btnNext = galleryRoot.querySelector('[data-gallery-next]');

        var lightbox = document.getElementById('gallery-lightbox');
        var lightboxImg = document.getElementById('lightbox-img');
        var lightboxCap = document.getElementById('lightbox-caption');
        var btnOpenLb = document.getElementById('btn-open-lightbox');
        var btnCloseLb = document.getElementById('btn-close-lightbox');

        tabsContainer.innerHTML = tabs.map(function (t, i) {
            return (
                '<button type="button" class="gallery-tab-btn' + (i === 0 ? ' is-active' : '') + '" ' +
                'role="tab" aria-selected="' + (i === 0 ? 'true' : 'false') + '" data-tab-index="' + i + '">' +
                '  <i class="fa-solid ' + esc(t.icon || 'fa-cube') + '" aria-hidden="true"></i>' +
                '  <span>' + esc(t.tabLabel) + '</span>' +
                '</button>'
            );
        }).join('');

        function renderActiveTab(index) {
            currentIdx = (index + tabs.length) % tabs.length;
            var item = tabs[currentIdx];

            tabsContainer.querySelectorAll('[data-tab-index]').forEach(function (btn, i) {
                var active = i === currentIdx;
                btn.classList.toggle('is-active', active);
                btn.setAttribute('aria-selected', active ? 'true' : 'false');
            });

            if (mainImg) {
                mainImg.src = item.image;
                mainImg.alt = item.heading;
            }
            if (badgeEl) badgeEl.textContent = item.badge;
            if (subLabelEl) subLabelEl.textContent = item.subLabel;
            if (headingEl) headingEl.textContent = item.heading;
            if (bodyEl) {
                bodyEl.innerHTML = (item.body || []).map(function (p) {
                    return '<p>' + esc(p) + '</p>';
                }).join('');
            }
            if (highlightsEl) {
                highlightsEl.innerHTML = (item.highlights || []).map(function (h) {
                    return '<li class="flex items-start gap-2"><i class="fa-solid fa-circle-check text-cyan-400 mt-1"></i><span>' + esc(h) + '</span></li>';
                }).join('');
            }
            if (indicatorEl) indicatorEl.textContent = (currentIdx + 1) + ' / ' + tabs.length;
        }

        tabsContainer.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-tab-index]');
            if (!btn) return;
            renderActiveTab(parseInt(btn.getAttribute('data-tab-index'), 10));
        });

        if (btnPrev) btnPrev.addEventListener('click', function () { renderActiveTab(currentIdx - 1); });
        if (btnNext) btnNext.addEventListener('click', function () { renderActiveTab(currentIdx + 1); });

        galleryRoot.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') { e.preventDefault(); renderActiveTab(currentIdx - 1); }
            if (e.key === 'ArrowRight') { e.preventDefault(); renderActiveTab(currentIdx + 1); }
        });

        function openLightbox() {
            if (!lightbox || !lightboxImg) return;
            var item = tabs[currentIdx];
            lightboxImg.src = item.image;
            lightboxImg.alt = item.heading;
            if (lightboxCap) lightboxCap.textContent = item.badge + ' - ' + item.heading;
            lightbox.showModal();
        }

        if (btnOpenLb) btnOpenLb.addEventListener('click', openLightbox);
        if (mainImg) {
            mainImg.style.cursor = 'zoom-in';
            mainImg.addEventListener('click', openLightbox);
        }
        if (btnCloseLb && lightbox) {
            btnCloseLb.addEventListener('click', function () { lightbox.close(); });
            lightbox.addEventListener('click', function (e) {
                if (e.target === lightbox) lightbox.close();
            });
        }

        renderActiveTab(0);
    }
    initExplodedGallery();

    /* =========================================================
       4. TECH REVIEWER CARDS & FAQ ACCORDION
       ========================================================= */
    function initReviewsAndFaq() {
        var summaryEl = document.getElementById('rating-summary');
        var reviewListEl = document.getElementById('review-list');
        var faqEl = document.getElementById('faq-accordion');

        var serverReviews = (NGK.server && Array.isArray(NGK.server.reviews) && NGK.server.reviews.length)
            ? NGK.server.reviews
            : null;
        var reviews = serverReviews || ((data.reviews && data.reviews.items) || []);

        if (summaryEl && reviews.length) {
            var avg = (reviews.reduce(function (acc, r) { return acc + (Number(r.rating) || 5); }, 0) / reviews.length).toFixed(1);
            summaryEl.innerHTML =
                '<div class="flex flex-col items-center justify-between gap-6 md:flex-row">' +
                '  <div class="flex items-center gap-5">' +
                '    <div class="text-5xl font-black text-cyan-400">' + avg + '</div>' +
                '    <div>' +
                '      <div class="stars text-lg" aria-label="Đánh giá ' + avg + ' trên 5 sao">' +
                '        <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>' +
                '      </div>' +
                '      <p class="mt-1 text-xs text-slate-300">Tổng hợp từ <strong>' + reviews.length + '</strong> Tech Reviewer &amp; Chủ sở hữu Batch Early-Bird</p>' +
                '    </div>' +
                '  </div>' +
                '  <div class="flex flex-wrap gap-2 text-xs">' +
                '    <span class="badge-cyber"><i class="fa-solid fa-circle-check text-emerald-400"></i>100% Phản hồi hài lòng chất âm</span>' +
                '    <span class="badge-cyber"><i class="fa-solid fa-shield-halved text-cyan-400"></i>QC 14 bước trước khi giao</span>' +
                '  </div>' +
                '</div>';
        }

        if (reviewListEl && reviews.length) {
            reviewListEl.innerHTML = reviews.map(function (r) {
                var initials = String(r.name || 'U').trim().charAt(0).toUpperCase();
                var starsHtml = '';
                var rate = Math.min(Math.max(Number(r.rating) || 5, 1), 5);
                for (var s = 0; s < rate; s++) starsHtml += '<i class="fa-solid fa-star"></i>';

                return (
                    '<article class="review-card">' +
                    '  <div>' +
                    '    <div class="flex items-center justify-between gap-3">' +
                    '      <div class="flex items-center gap-3">' +
                    '        <div class="review-avatar">' +
                    (r.avatar ? '<img src="' + esc(r.avatar) + '" alt="' + esc(r.name) + '">' : esc(initials)) +
                    '        </div>' +
                    '        <div>' +
                    '          <h3 class="text-sm font-bold text-white">' + esc(r.name) + '</h3>' +
                    '          <p class="text-[11px] text-cyan-400">' + esc(r.role || 'Verified Owner') + '</p>' +
                    '        </div>' +
                    '      </div>' +
                    '      <span class="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/30">' +
                    '        <i class="fa-solid fa-circle-check mr-1"></i>Verified' +
                    '      </span>' +
                    '    </div>' +
                    '    <div class="mt-3 flex items-center justify-between">' +
                    '      <div class="stars text-xs">' + starsHtml + '</div>' +
                    '      <span class="text-[11px] font-mono text-slate-400">' + esc(r.variant || 'CyberBoard Ultra 75%') + '</span>' +
                    '    </div>' +
                    '    <p class="mt-3 text-sm leading-relaxed text-slate-200">' + esc(r.content) + '</p>' +
                    '  </div>' +
                    '</article>'
                );
            }).join('');
        }

        var faqs = data.faqs || [];
        if (faqEl && faqs.length) {
            faqEl.innerHTML = faqs.map(function (item, idx) {
                var isOpen = idx === 0;
                return (
                    '<div class="faq-item' + (isOpen ? ' is-open' : '') + '">' +
                    '  <button type="button" class="faq-trigger" aria-expanded="' + (isOpen ? 'true' : 'false') + '">' +
                    '    <span>' + esc(item.question) + '</span>' +
                    '    <i class="fa-solid fa-chevron-down text-xs" aria-hidden="true"></i>' +
                    '  </button>' +
                    '  <div class="faq-answer"' + (isOpen ? '' : ' hidden') + '>' +
                    '    <p>' + esc(item.answer) + '</p>' +
                    '  </div>' +
                    '</div>'
                );
            }).join('');

            faqEl.addEventListener('click', function (e) {
                var trigger = e.target.closest('.faq-trigger');
                if (!trigger) return;
                var parent = trigger.closest('.faq-item');
                var answer = parent ? parent.querySelector('.faq-answer') : null;
                if (!parent || !answer) return;

                var expanded = trigger.getAttribute('aria-expanded') === 'true';
                trigger.setAttribute('aria-expanded', expanded ? 'false' : 'true');
                parent.classList.toggle('is-open', !expanded);
                answer.hidden = expanded;
            });
        }
    }
    initReviewsAndFaq();
})();