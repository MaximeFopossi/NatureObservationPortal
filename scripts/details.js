console.log("details.js loaded");
(function () {
    const root = document.querySelector("#details");
    if (!root) return;

    // The demo data from utils.js
    if (!window.NOP_DATA) {
        console.error("details.js: NOP_DATA not found (utils.js missing?)");
        return;
    }

    // Grab DOM elements
    const breadcrumbEl = root.querySelector(".breadcrumb");
    const titleEl = root.querySelector("h2");
    const imgEl = root.querySelector(".details-figure img");
    const figcapEl = root.querySelector(".details-figure figcaption");
    const dlEl = root.querySelector(".details-meta dl");
    const tbodyEl = root.querySelector(".details-table tbody");
    const addBtn = root.querySelector("#addWishlistBtn");
    const backLink = root.querySelector("#backLink");

    // Read ?id=... from the URL 
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id || !NOP_DATA[id]) {
        // Fallback if id is missing or unknown
        breadcrumbEl.innerHTML =
            `<a href="../index.html">Home</a> &raquo; Observations &raquo; Details`;
        titleEl.textContent = "Observation not found";
        figcapEl.textContent = `No data for "${id || "unknown"}".`;
        return;
    }

    const data = NOP_DATA[id];

    // Fills in  basic info  (text / image)
    breadcrumbEl.innerHTML =
        `<a href="../index.html">Home</a> &raquo; 
         <a href="../index.html#observations">Observations</a> &raquo; Details`;

    const title = data.title || "Observation";
    const caption = data.caption || data.summary || "";

    titleEl.textContent = title;
    imgEl.src = data.img;
    imgEl.alt = title;
    figcapEl.textContent = caption;

    // Builds the definition list (Observation Info)
    dlEl.innerHTML = "";

    const info = data.info || {};
    const rows = [
        ["Species", info.species || ""],
        ["Date", info.date || ""],
        ["Location", info.location || ""],
        ["Observer", info.observer || ""],
        ["Tags", info.tags || ""]
    ];

    rows.forEach(([dtText, ddText]) => {
        const dtEl = document.createElement("dt");
        dtEl.textContent = dtText;

        const ddEl = document.createElement("dd");

        if (dtText === "Date" && ddText) {
            const t = document.createElement("time");
            // ISO style (YYYY-MM-DD )
            t.dateTime = ddText.slice(0, 10);
            t.textContent = ddText;
            ddEl.appendChild(t);
        } else {
            ddEl.textContent = ddText;
        }

        dlEl.append(dtEl, ddEl);
    });

    // Builds the summary table
    tbodyEl.innerHTML = "";
    const summaryRows = Array.isArray(data.summary) ? data.summary : [];
    summaryRows.forEach(([prop, val]) => {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        td1.textContent = prop;
        td2.textContent = val;
        tr.append(td1, td2);
        tbodyEl.appendChild(tr);
    });

    // Wishlist button (uses window.Wishlist) ---
    if (window.Wishlist && addBtn) {
        const syncBtn = () => {
            const saved = Wishlist.has(id);
            addBtn.textContent = saved ? "✓ In Wishlist" : "Add to Wishlist";
            addBtn.setAttribute("aria-pressed", String(saved));
        };
        syncBtn();
        addBtn.addEventListener("click", () => {
            Wishlist.toggle(id);
            syncBtn();
        });
    }

    //  jQuery
    if (window.jQuery) {
        const $ = window.jQuery;

        // Fade in the info + description area
        $(".details-content").hide().fadeIn(250);

        // Small pulse animation on the wishlist button
        if (addBtn) {
            const $btn = $(addBtn);
            $btn.on("click", function () {
                // quick pulse
                $btn
                    .stop(true, true)
                    .animate({ opacity: 0.7 }, 100)
                    .animate({ opacity: 1 }, 100);
            });
        }

        // Hover effect on "Highlight on Map" (stronger shadow)
        $("#highlightBtn").hover(
            function () { $(this).addClass("shadow-sm"); },
            function () { $(this).removeClass("shadow-sm"); }
        );
    }
})();