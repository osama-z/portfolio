export function networkArt() {
  const columns = [{x:55,ys:[38,85,132,179]}, {x:140,ys:[24,62,100,138,176,214]}, {x:225,ys:[48,100,152,204]}, {x:310,ys:[78,148]}];
  let edges = '', nodes = '';
  columns.forEach((c, i) => {
    c.ys.forEach((y, j) => {
      if(i < columns.length - 1) columns[i+1].ys.forEach((endY,k) => { edges += `<path d="M${c.x} ${y}L${columns[i+1].x} ${endY}" class="network-edge" style="--delay:${(j+k)*.15}s"/>`; });
      nodes += `<circle cx="${c.x}" cy="${y}" r="${i===3?12:8}" fill="${i===3?'#f5f16c':i===1?'#f2a4d5':'#f8f4e9'}" stroke="#25232a" stroke-width="1.8"/>`;
    });
  });
  return `<svg viewBox="0 0 365 240" fill="none" aria-hidden="true">${edges}${nodes}</svg>`;
}
export function chipArt() {
  let pins = '';
  for (let i = 0; i < 8; i++) {
    const x = 111 + i * 19;
    pins += `<path d="M${x} 69V92M${x} 254v23M69 ${x}H92M254 ${x}h23" stroke="#f7f1c2" stroke-width="8"/>`;
  }
  return `<svg viewBox="0 0 346 346" fill="none" aria-hidden="true"><g stroke="#95d6ae" stroke-width="2" opacity=".5"><path d="M0 75h49l33 33v40h40M346 55h-40l-40 40v30h-40M20 346v-43l85-85M346 294h-49l-55-55M0 202h70M184 0v75M346 188h-71M171 346v-73"/><circle cx="49" cy="75" r="5"/><circle cx="306" cy="55" r="5"/><circle cx="20" cy="303" r="5"/><circle cx="297" cy="294" r="5"/></g>${pins}<rect x="89" y="89" width="171" height="171" rx="14" fill="#152d27" stroke="#f7f1c2" stroke-width="2"/><rect x="101" y="101" width="147" height="147" rx="7" stroke="#71a485"/><circle cx="116" cy="116" r="3" fill="#f7f1c2"/><text x="174" y="167" text-anchor="middle" fill="#f7f1c2" font-family="monospace" font-size="28">CORTEX</text><text x="174" y="199" text-anchor="middle" fill="#f7f1c2" font-family="monospace" font-size="30">M4</text><text x="174" y="226" text-anchor="middle" fill="#95d6ae" font-family="monospace" font-size="10">INT8 · 32 BIT · ARM</text></svg>`;
}
