console.log("details.js loaded");
(function () {
    // utils.js to be loaded first
    if (!window.NOP_DATA && typeof getObservationById !== 'function') {
        console.error('utils.js did not load.');
        return;
    }

    // Grab DOM targets that  HTML provides
    const root = document.querySelector('#details');
    const breadcrumbEl = root.querySelector('.breadcrumb');
    const titleEl = root.querySelector('h2');
    const imgEl = root.querySelector('.details-figure img');
    const figcapEl = root.querySelector('.details-figure figcaption');
    const dlEl = root.querySelector('.details-meta dl');
    const tbodyEl = root.querySelector('.details-table tbody');
    const addBtn = root.querySelector('#addWishlistBtn');
    const backLink = root.querySelector('#backLink');                                           // capital L

    // Read ?id=...
    const id = new URLSearchParams(location.search).get('id');
    if (!id) {
        breadcrumbEl.textContent = 'Missing observation id.';
        titleEl.textContent = 'Observation not found';
        return;
    }

    // Pull data from either NOP_DATA or OBSERVATIONS helpers
    const data =
        (window.NOP_DATA && window.NOP_DATA[id]) ||
        (typeof getObservationById === 'function' ? getObservationById(id) : null);

    if (!data) {
        breadcrumbEl.innerHTML = `<a href="../index.html">Home</a> & raquo; Observations & raquo; Details`;
        titleEl.textContent = 'Observation not found';
        figcapEl.textContent = `No data for "${id}"`;
    return;
    }

    // Normalize fields regardless of source shape
    const title = data.title || 'Observation';
    const img = data.img || data.image || '';
    const caption = data.caption || data.summary || '';

    const info = data.info || {
        species: data.species || '',
        date: data.date || '',
        location: data.location || '',
        observer: data.observer || '',
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || '')
    };

    const summaryRows = Array.isArray(data.summary)
        ? data.summary
        : [];                                                                               // ? ok if empty

    // Image path 
    const imgPath = /^(?:\.\.\/|https?:\/\/|\/)/i.test(img) ? img : ('../' + img.replace(/^\.?\/*/, ''));

    // Fills the UI
    breadcrumbEl.innerHTML = `<a href="../index.html">Home</a> & raquo; <a href="../index.html#observations">Observations</a> & raquo; Details`;
    titleEl.textContent = title;
    imgEl.src = imgPath;
    imgEl.alt = title;
    figcapEl.textContent = caption || '';

    // Builds the dl 
    dlEl.innerHTML = '';
    const rows = [
        ['Species', info.species],
        ['Date', info.date],
        ['Location', info.location],
        ['Observer', info.observer],
        ['Tags', info.tags],
    ];
    rows.forEach(([dt, dd]) => {
        const dtEl = document.createElement('dt'); dtEl.textContent = dt;
        const ddEl = document.createElement('dd');
        if (dt === 'Date' && info.date) {
            const t = document.createElement('time');
            t.dateTime = info.date.slice(0, 10);
            t.textContent = info.date;
            ddEl.appendChild(t);
        } else {
            ddEl.textContent = dd || '';
        }
        dlEl.append(dtEl, ddEl);
    });

    // Builds the summary table
    tbodyEl.innerHTML = '';
    summaryRows.forEach(([k, v]) => {
        const tr = document.createElement('tr');
        const tdK = document.createElement('td'); tdK.textContent = k;
        const tdV = document.createElement('td'); tdV.textContent = v;
        tr.append(tdK, tdV);
        tbodyEl.appendChild(tr);
    });

    // Wishlist button (uses utils.js -> window.Wishlist)
    if (window.Wishlist && addBtn) {
        const syncBtn = () => {
            const saved = Wishlist.has(id);
            addBtn.textContent = saved ? '✓ In Wishlist' : 'Add to Wishlist';
            addBtn.setAttribute('aria-pressed', String(saved));
        };
        syncBtn();
        addBtn.addEventListener('click', () => {
            Wishlist.toggle(id);
            syncBtn();
        });
    }

})();