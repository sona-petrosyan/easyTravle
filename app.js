// easy dream travel — app.js (English, fancier)
(function(){
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const form = $('#trip-form');
  const grid = $('#result-grid');
  const empty = $('#empty-state');
  const resultsSection = $('#results');
  const yearEl = $('#year');
  const toast = $('#toast');
  yearEl.textContent = new Date().getFullYear();

  // Mock catalog of destinations and sample flight options
  const catalog = {
    europe: [
      { city: 'Paris', code: 'PAR', country: 'France' },
      { city: 'Rome', code: 'ROM', country: 'Italy' },
      { city: 'Barcelona', code: 'BCN', country: 'Spain' },
      { city: 'Prague', code: 'PRG', country: 'Czechia' },
      { city: 'Vienna', code: 'VIE', country: 'Austria' },
    ],
    warm: [
      { city: 'Dubai', code: 'DXB', country: 'UAE' },
      { city: 'Sharm El Sheikh', code: 'SSH', country: 'Egypt' },
      { city: 'Malé', code: 'MLE', country: 'Maldives' },
      { city: 'Phuket', code: 'HKT', country: 'Thailand' },
      { city: 'Tenerife', code: 'TFS', country: 'Spain' },
    ],
    newyear: [
      { city: 'Vienna', code: 'VIE', country: 'Austria' },
      { city: 'Tallinn', code: 'TLL', country: 'Estonia' },
      { city: 'Lapland', code: 'RVN', country: 'Finland' },
      { city: 'Dubai', code: 'DXB', country: 'UAE' },
      { city: 'London', code: 'LON', country: 'UK' },
    ]
  };

  const airlines = ['Air France', 'Lufthansa', 'Austrian', 'Qatar Airways', 'Emirates', 'Turkish Airlines', 'LOT'];
  function rand(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min; }
  function pick(arr, n){
    const copy = [...arr]; const out = [];
    n = Math.min(n, copy.length);
    for(let i=0;i<n;i++){ out.push(copy.splice(rand(0, copy.length-1),1)[0]); }
    return out;
  }
  function fmtMoney(n){ return new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', maximumFractionDigits:0 }).format(n); }
  function nextDate(offsetDays){
    const d = new Date(); d.setDate(d.getDate() + offsetDays); return d;
  }
  function fmtDate(d){
    return new Intl.DateTimeFormat('en-GB', { year:'numeric', month:'short', day:'numeric' }).format(d);
  }

  function synthesizeFlights(origin, mood){
    const pool = catalog[mood] || [];
    const picks = pick(pool, 6);
    return picks.map(dest => {
      const base = mood === 'warm' ? 250 : 200;
      const price = base + rand(80, 450);
      const depart = nextDate(rand(10, 60));
      const returnD = nextDate(rand(65, 120));
      const airline = airlines[rand(0, airlines.length-1)];
      return {
        title: `${origin} → ${dest.city}`,
        destCity: dest.city,
        code: dest.code,
        country: dest.country,
        airline,
        depart: fmtDate(depart),
        return: fmtDate(returnD),
        price
      };
    });
  }

  const airlineIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M2 13l8-2 4-3 5-.2 3 3 2 0-2 1-3 3-5-.2-4-3-8-1.6z"/></svg>`;

  function cardTemplate(f){
    return `
      <article class="card" role="article">
        <span class="badge">${airlineIcon} ${f.airline}</span>
        <h3>${f.title}</h3>
        <div class="meta">${f.country} • ${f.destCity} (${f.code})</div>
        <div class="meta">Depart: ${f.depart} • Return: ${f.return}</div>
        <div class="price">${fmtMoney(f.price)}</div>
        <div class="cta">
          <button class="btn-primary book-btn" type="button" data-city="${f.destCity}" aria-label="Book ${f.destCity} flight">Book now</button>
        </div>
      </article>
    `;
  }

  function showLoading(isLoading){
    resultsSection.setAttribute('aria-busy', String(isLoading));
  }

  function render(flights){
    grid.innerHTML = flights.map(cardTemplate).join('');
    empty.style.display = flights.length ? 'none' : 'block';
    $$('.book-btn', grid).forEach(btn => {
      btn.addEventListener('click', () => {
        toastMessage(`Great choice! We'll hold a seat to ${btn.dataset.city}.`);
      });
    });
  }

  function toastMessage(text){
    toast.textContent = text;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => (toast.hidden = true), 250);
    }, 2000);
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const originVal = $('#origin').value.trim();
    const origin = originVal || 'Your city';
    const mood = $('#mood').value;
    if(!mood){
      alert('Please select your trip vibe.');
      return;
    }
    showLoading(true);
    empty.style.display = 'none';
    grid.innerHTML = '';

    // Simulated fetch delay
    setTimeout(() => {
      const flights = synthesizeFlights(origin, mood);
      render(flights);
      showLoading(false);
      location.hash = '#results';
    }, 600);
  });

  form?.addEventListener('reset', () => {
    grid.innerHTML = '';
    empty.style.display = 'block';
  });

  // Insert decorative elements (plane + family) already present in DOM

})();