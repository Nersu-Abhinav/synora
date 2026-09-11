// SYNORA runtime bootstrap
// app-v2.js is intentionally loaded as source here so its existing module-scoped
// application entry point can be invoked without changing the large UI bundle.
(async()=>{
  try {
    const response=await fetch('/app-v2.js',{cache:'no-store'});
    if(!response.ok) throw new Error(`UI bundle failed to load (${response.status})`);
    const source=await response.text();
    new Function(`${source}\n//# sourceURL=/app-v2.js\napp();`)();
  } catch(error) {
    console.error('SYNORA failed to boot:',error);
    const root=document.querySelector('#app');
    if(root) root.innerHTML=`<div style="min-height:100vh;display:grid;place-items:center;padding:32px;background:#030811;color:#dcecff;font-family:Inter,system-ui,sans-serif"><div style="max-width:720px;border:1px solid #24354d;border-radius:20px;padding:32px;background:#07111f;box-shadow:0 20px 80px rgba(0,0,0,.45)"><div style="font:700 13px/1.2 monospace;letter-spacing:.16em;color:#62d9ff">SYNORA / BOOT ERROR</div><h1 style="font-size:32px;margin:14px 0 10px">The interface could not start.</h1><p style="color:#9fb1c8;line-height:1.7">Refresh once to retry. If the problem persists, open the browser console and check the SYNORA runtime error.</p><pre style="white-space:pre-wrap;color:#ffb4b4;background:#030811;border-radius:12px;padding:16px;overflow:auto">${String(error?.stack||error).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</pre></div></div>`;
  }
})();
