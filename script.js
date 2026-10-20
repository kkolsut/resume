// Shared by the English (index.html) and Polish (pl/index.html) pages;
// language-specific strings come from T, picked by <html lang>.
(function () {
    var root = document.documentElement;
    var T = {
        en: {
            mon: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            present: 'Present',
            yrs: function (y) { return y + (y === 1 ? ' yr' : ' yrs'); },
            mo: ' mo',
            expandAll: 'Expand all',
            collapseAll: 'Collapse all',
            openMenu: 'Open menu',
            closeMenu: 'Close menu',
            copy: 'Copy email address',
            copied: 'Copied!'
        },
        pl: {
            mon: ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'],
            present: 'obecnie',
            // 1 rok, 2–4 lata (but 12–14 lat), otherwise lat
            yrs: function (y) {
                if (y === 1) return '1 rok';
                var few = y % 10 >= 2 && y % 10 <= 4 && (y % 100 < 12 || y % 100 > 14);
                return y + (few ? ' lata' : ' lat');
            },
            mo: ' mies.',
            expandAll: 'Rozwiń wszystko',
            collapseAll: 'Zwiń wszystko',
            openMenu: 'Otwórz menu',
            closeMenu: 'Zamknij menu',
            copy: 'Skopiuj adres e-mail',
            copied: 'Skopiowano!'
        }
    };
    var t = T[root.lang] || T.en;
    var MON = t.mon;
    var now = new Date();
    var cur = [now.getFullYear(), now.getMonth() + 1];

    // ---- Theme: light / dark / system ----
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var themeButtons = document.querySelectorAll('[data-theme-option]');

    function applyTheme(pref) {
        var dark = pref === 'dark' || (pref === 'system' && mq.matches);
        root.setAttribute('data-theme', pref);
        root.setAttribute('data-scheme', dark ? 'dark' : 'light');
        themeButtons.forEach(function (b) {
            b.setAttribute('aria-pressed', b.dataset.themeOption === pref ? 'true' : 'false');
        });
    }

    themeButtons.forEach(function (b) {
        b.addEventListener('click', function () {
            var pref = b.dataset.themeOption;
            try { localStorage.setItem('theme', pref); } catch (e) {}
            applyTheme(pref);
        });
    });
    mq.addEventListener('change', function () {
        if (root.getAttribute('data-theme') === 'system') applyTheme('system');
    });
    applyTheme(root.getAttribute('data-theme') || 'system');

    // ---- Dates & durations ----
    function parse(s) {
        if (!s) return null;
        var p = s.split('-');
        return [+p[0], +p[1]];
    }
    function months(a, b) { return (b[0] - a[0]) * 12 + (b[1] - a[1]) + 1; }
    function fmt(d) { return d ? MON[d[1] - 1] + ' ' + d[0] : t.present; }
    function dur(m) {
        var y = Math.floor(m / 12), r = m % 12;
        return [y ? t.yrs(y) : '', r ? r + t.mo : ''].filter(Boolean).join(' ');
    }
    function spanLabel(from, to) { return fmt(from) + ' – ' + fmt(to) + ' · ' + dur(months(from, to || cur)); }

    var allRoles = document.querySelectorAll('.role');
    allRoles.forEach(function (role) {
        var from = parse(role.dataset.from), to = parse(role.dataset.to);
        role.querySelector('[data-span]').textContent = spanLabel(from, to);
    });
    document.querySelectorAll('.company').forEach(function (co) {
        var roles = co.querySelectorAll('.role');
        var first = parse(roles[roles.length - 1].dataset.from);
        var last = parse(roles[0].dataset.to);
        co.querySelector('.company-head [data-span]').textContent = spanLabel(first, last);
    });

    document.getElementById('stat-years').textContent = Math.floor(months([2006, 2], cur) / 12) + '+';
    document.getElementById('year').textContent = now.getFullYear();
    document.getElementById('printed-on').textContent = now.getDate() + ' ' + MON[now.getMonth()] + ' ' + now.getFullYear();

    // ---- Expand / collapse roles ----
    var toggles = document.querySelectorAll('.role-toggle');
    var toggleAll = document.getElementById('toggle-all');

    function setOpen(btn, open) {
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.nextElementSibling.hidden = !open;
    }
    function allOpen() {
        return Array.prototype.every.call(toggles, function (b) { return b.getAttribute('aria-expanded') === 'true'; });
    }
    function syncToggleAll() {
        toggleAll.textContent = allOpen() ? t.collapseAll : t.expandAll;
    }

    toggles.forEach(function (btn) {
        btn.addEventListener('click', function () {
            setOpen(btn, btn.getAttribute('aria-expanded') !== 'true');
            syncToggleAll();
        });
    });
    toggleAll.addEventListener('click', function () {
        var open = !allOpen();
        toggles.forEach(function (b) { setOpen(b, open); });
        syncToggleAll();
    });
    syncToggleAll();

    // ---- Mobile menu ----
    var header = document.querySelector('.site-header');
    var menuBtn = header.querySelector('.menu-btn');
    var desktop = window.matchMedia('(min-width: 1080px)');

    function setMenu(open) {
        header.classList.toggle('open', open);
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        menuBtn.setAttribute('aria-label', open ? t.closeMenu : t.openMenu);
    }

    menuBtn.addEventListener('click', function () {
        setMenu(!header.classList.contains('open'));
    });
    header.querySelectorAll('.topnav a').forEach(function (a) {
        a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && header.classList.contains('open')) {
            setMenu(false);
            menuBtn.focus();
        }
    });
    desktop.addEventListener('change', function () {
        if (desktop.matches) setMenu(false);
    });

    // ---- More actions menu (desktop dropdown; inline in the mobile menu) ----
    var more = header.querySelector('.more');
    var moreBtn = more.querySelector('.more-btn');

    function setMore(open) {
        more.classList.toggle('open', open);
        moreBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    moreBtn.addEventListener('click', function () {
        setMore(!more.classList.contains('open'));
    });
    document.addEventListener('click', function (e) {
        if (!more.contains(e.target)) setMore(false);
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && more.classList.contains('open')) {
            setMore(false);
            moreBtn.focus();
        }
    });

    // ---- Print ----
    document.querySelectorAll('[data-print]').forEach(function (b) {
        b.addEventListener('click', function () {
            setMore(false);
            setMenu(false);
            window.print();
        });
    });

    // ---- Language switch: carry the theme and scroll position over ----
    // Passed in the URL because file:// pages don't share storage. The
    // inline script in <head> applies ?theme=; ?y= is applied here, then
    // both are removed from the address bar.
    var params = new URLSearchParams(location.search);
    if (params.has('y')) window.scrollTo({ top: +params.get('y') || 0, behavior: 'instant' });
    if (params.has('theme') || params.has('y')) {
        history.replaceState(null, '', location.pathname + location.hash);
    }
    document.querySelectorAll('.lang-switch a:not([aria-current])').forEach(function (a) {
        a.addEventListener('click', function () {
            var url = new URL(a.getAttribute('href'), location.href);
            url.search = '?theme=' + (root.getAttribute('data-theme') || 'system') + '&y=' + Math.round(window.scrollY);
            a.href = url.href;
        });
    });

    // ---- Copy email ----
    var copyBtn = document.getElementById('copy-email');
    var copyLabel = copyBtn.querySelector('.copy-label');
    var copyTimer;
    copyBtn.addEventListener('click', function () {
        try { navigator.clipboard.writeText('krzysztof.kolsut@gmail.com'); } catch (e) {}
        copyBtn.classList.add('copied');
        copyLabel.textContent = t.copied;
        clearTimeout(copyTimer);
        copyTimer = setTimeout(function () {
            copyBtn.classList.remove('copied');
            copyLabel.textContent = t.copy;
        }, 1800);
    });

    // ---- Save contact (vCard) ----
    document.getElementById('save-contact').addEventListener('click', function () {
        var v = ['BEGIN:VCARD', 'VERSION:3.0', 'N:Kołsut;Krzysztof;;;', 'FN:Krzysztof Kołsut', 'TITLE:Head of Quality Assurance', 'ORG:Visuality', 'EMAIL;TYPE=INTERNET:krzysztof.kolsut@gmail.com', 'TEL;TYPE=CELL:+48502040315', 'URL:https://kolsut.net', 'END:VCARD'].join('\r\n');
        var u = URL.createObjectURL(new Blob([v], { type: 'text/vcard' }));
        var a = document.createElement('a');
        a.href = u;
        a.download = 'krzysztof-kolsut.vcf';
        a.click();
        setTimeout(function () { URL.revokeObjectURL(u); }, 1000);
    });
})();
