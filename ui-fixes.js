const normalizeRuntimeMetrics=()=>{document.querySelectorAll('.metrics .metric strong').forEach((el,i)=>{if(i!==2)return;const value=Number.parseFloat(el.textContent);if(Number.isFinite(value))el.textContent=value.toFixed(1)})};
new MutationObserver(normalizeRuntimeMetrics).observe(document.documentElement,{subtree:true,childList:true});
normalizeRuntimeMetrics();