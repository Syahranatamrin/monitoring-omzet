/* Login Dashboard Omzet. Kredensial disimpan sebagai hash SHA-256 (bukan teks biasa).
   Peran: 'clevel' = semua tampilan; 'kapten' = hanya tab Per Outlet.
   Catatan: ini pembatas tampilan di browser, bukan pengaman data (webhook n8n tetap perlu dilindungi sendiri). */
(function () {
  const AKUN = {'93ddbe40976626e82506ea3ff71f9a17afc1873f22fed6825cb003a27e94cb47': {role: 'kapten', nama: 'Kapten'}, 'b1c64a123d3ae4c5e9822b931bc8bafc843a94450057ea76f3fa42a4cda8d653': {role: 'clevel', nama: 'C-Level'}};
  const KEY = 'mo_auth', de = document.documentElement;
  const sc = document.currentScript, ALLOW = ((sc && sc.dataset.allow) || 'kapten,clevel').split(',');
  const sha = async s => { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); };
  const sesi = () => { let k = null; try { k = sessionStorage.getItem(KEY); } catch (e) {} return k && AKUN[k] ? AKUN[k] : null; };
  const keluar = () => { try { sessionStorage.removeItem(KEY); } catch (e) {} location.reload(); };
  const a = sesi();
  window.MO_ROLE = a ? a.role : null;
  const ok = a && ALLOW.includes(a.role);
  const css = document.createElement('style');
  css.textContent = 'html.locked body>*:not(#mo-login){display:none!important}#mo-login{display:none}html.locked #mo-login{display:flex}'
    + '#mo-login{position:fixed;inset:0;flex-direction:column;align-items:center;justify-content:center;background:#f8fafc;z-index:9999;padding:16px;font-family:system-ui,Segoe UI,Roboto,sans-serif;overflow:auto}'
    + '#mo-login .lg-ic{width:64px;height:64px;border-radius:18px;background:linear-gradient(135deg,#f59e0b,#ea580c);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 20px #ea580c40;margin-bottom:26px}'
    + '#mo-login h2{margin:0;font-size:24px;letter-spacing:.3px;color:#0f172a;text-transform:uppercase;text-align:center}'
    + '#mo-login .lg-sub{margin:12px 0 26px;font-size:15px;color:#64748b;text-align:center}'
    + '#mo-login form{background:#fff;border-radius:16px;padding:24px 24px 26px;width:100%;max-width:445px;box-shadow:0 4px 24px #0f172a14;display:flex;flex-direction:column;gap:8px}'
    + '#mo-login label{display:flex;align-items:center;gap:7px;font-size:14px;font-weight:600;color:#1e293b;margin-top:6px}'
    + '#mo-login .fld{position:relative}'
    + '#mo-login input{width:100%;padding:14px 14px;border:1.5px solid #fcd9a0;background:#fff3de;border-radius:10px;font-size:16px;color:#0f172a;outline:none;font-family:inherit}'
    + '#mo-login input::placeholder{color:#94a3b8}#mo-login input:focus{border-color:#fdba74;box-shadow:0 0 0 3px #fed7aa80}'
    + '#mo-login #mo-p{padding-right:46px}'
    + '#mo-login .eye{position:absolute;right:6px;top:50%;transform:translateY(-50%);width:36px;height:36px;display:flex;align-items:center;justify-content:center;background:transparent;border:0;cursor:pointer;color:#64748b;padding:0;border-radius:8px}#mo-login .eye:hover{background:#0000000d}'
    + '#mo-login .go{margin-top:14px;padding:16px;border:0;border-radius:12px;background:linear-gradient(90deg,#f97316,#c2410c);color:#fff;font-size:16px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:9px;box-shadow:0 8px 18px #c2410c40;font-family:inherit}#mo-login .go:disabled{opacity:.65;cursor:default}'
    + '#mo-login .go.alt{background:#7a3e12;box-shadow:none;margin-top:6px}'
    + '#mo-login .info{margin:0;font-size:14px;color:#64748b;text-align:center}'
    + '#mo-err{color:#dc2626;font-size:13px;min-height:18px;text-align:center}'
    + '#mo-out{border:0;background:#ffffff26;color:#fff;border-radius:999px;padding:3px 10px;font-size:12px;cursor:pointer}#mo-out:hover{background:#ffffff40}'
    + 'html.r-kapten .vw{display:none!important}html.r-kapten #tbl tfoot{display:none!important}';
  document.head.appendChild(css);
  if (a) de.classList.add('r-' + a.role);
  if (!ok) de.classList.add('locked');
  document.addEventListener('DOMContentLoaded', () => {
    const hd = document.querySelector('header .hr') || document.querySelector('header');
    if (a && hd) { const b = document.createElement('button'); b.id = 'mo-out'; b.type = 'button'; b.title = 'Masuk sebagai ' + a.nama; b.textContent = a.nama + ' · Keluar'; b.onclick = keluar; hd.appendChild(b); }
    if (ok) return;
    const w = document.createElement('div'); w.id = 'mo-login';
    const batas = a && !ok;   // sudah login tapi bukan peran yang boleh membuka halaman ini
    const ikon = '<div class="lg-ic"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></div>';
    w.innerHTML = batas
      ? ikon + '<h2>Akses khusus C-Level</h2><p class="lg-sub">Akun ' + a.nama + ' tidak bisa membuka halaman ini.</p><form><button type="button" class="go" id="mo-back">Kembali ke dashboard</button><button type="button" class="go alt" id="mo-x">Keluar</button></form>'
      : ikon + '<h2>Monitoring Omzet</h2><p class="lg-sub">Pizza Nyantuy · silakan masuk</p><form id="mo-f"><label for="mo-u"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>Username</label><div class="fld"><input id="mo-u" placeholder="Username" autocomplete="username" autocapitalize="off"></div><label for="mo-p"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>Password</label><div class="fld"><input id="mo-p" type="password" placeholder="Password" autocomplete="current-password"><button type="button" class="eye" id="mo-eye" aria-label="Tampilkan password"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg></button></div><div id="mo-err"></div><button type="submit" class="go"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M14 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5"/></svg>Masuk</button></form>';
    document.body.appendChild(w);
    if (batas) { document.getElementById('mo-back').onclick = () => { location.href = 'monitoring-omzet.html'; }; document.getElementById('mo-x').onclick = keluar; return; }
    document.getElementById('mo-eye').onclick = () => { const i = document.getElementById('mo-p'); i.type = i.type === 'password' ? 'text' : 'password'; };
    document.getElementById('mo-f').onsubmit = async e => {
      e.preventDefault(); const bt = e.target.querySelector('button[type=submit]'), er = document.getElementById('mo-err'); bt.disabled = true; er.textContent = '';
      const u = document.getElementById('mo-u').value.trim().toLowerCase(), p = document.getElementById('mo-p').value;
      let k = ''; try { k = await sha('mo-nyantuy:' + u + ':' + p); } catch (x) { er.textContent = 'Browser tidak mendukung login (butuh https).'; bt.disabled = false; return; }
      await new Promise(r => setTimeout(r, 600));
      if (AKUN[k]) { try { sessionStorage.setItem(KEY, k); } catch (x) {} location.reload(); }
      else { er.textContent = 'Username atau password salah.'; bt.disabled = false; document.getElementById('mo-p').value = ''; }
    };
  });
})();
