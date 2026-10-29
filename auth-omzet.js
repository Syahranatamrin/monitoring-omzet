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
    + '#mo-login{position:fixed;inset:0;align-items:center;justify-content:center;background:#f5f1ea;z-index:9999;padding:16px}'
    + '#mo-login form{background:#fff;border:1px solid #e6d9c8;border-radius:14px;padding:22px 20px;width:100%;max-width:340px;box-shadow:0 6px 24px #7a3e1226;display:flex;flex-direction:column;gap:10px;font-family:system-ui,Segoe UI,Roboto,sans-serif}'
    + '#mo-login h2{margin:0;font-size:18px;color:#7a3e12}#mo-login p{margin:0;font-size:12.5px;color:#8a7a6a}'
    + '#mo-login input{padding:10px;border:1px solid #d8c8b2;border-radius:8px;font-size:15px}'
    + '#mo-login button{padding:10px;border:0;border-radius:8px;background:#c8691c;color:#fff;font-size:15px;font-weight:600;cursor:pointer}#mo-login button:disabled{opacity:.6}'
    + '#mo-err{color:#c62828;font-size:12.5px;min-height:16px}'
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
    w.innerHTML = batas
      ? '<form><h2>Akses khusus C-Level</h2><p>Akun ' + a.nama + ' tidak bisa membuka halaman ini.</p><button type="button" id="mo-back">Kembali ke dashboard</button><button type="button" id="mo-x" style="background:#7a3e12">Keluar</button></form>'
      : '<form id="mo-f"><h2>📈 Monitoring Omzet</h2><p>Pizza Nyantuy · silakan masuk</p><input id="mo-u" placeholder="Username" autocomplete="username" autocapitalize="off"><input id="mo-p" type="password" placeholder="Password" autocomplete="current-password"><div id="mo-err"></div><button type="submit">Masuk</button></form>';
    document.body.appendChild(w);
    if (batas) { document.getElementById('mo-back').onclick = () => { location.href = 'monitoring-omzet.html'; }; document.getElementById('mo-x').onclick = keluar; return; }
    document.getElementById('mo-f').onsubmit = async e => {
      e.preventDefault(); const bt = e.target.querySelector('button'), er = document.getElementById('mo-err'); bt.disabled = true; er.textContent = '';
      const u = document.getElementById('mo-u').value.trim().toLowerCase(), p = document.getElementById('mo-p').value;
      let k = ''; try { k = await sha('mo-nyantuy:' + u + ':' + p); } catch (x) { er.textContent = 'Browser tidak mendukung login (butuh https).'; bt.disabled = false; return; }
      await new Promise(r => setTimeout(r, 600));
      if (AKUN[k]) { try { sessionStorage.setItem(KEY, k); } catch (x) {} location.reload(); }
      else { er.textContent = 'Username atau password salah.'; bt.disabled = false; document.getElementById('mo-p').value = ''; }
    };
  });
})();
