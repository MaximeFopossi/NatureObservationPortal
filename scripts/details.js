console.log("details.js loaded");
(function () {    
    const root = document.querySelector("#details");                            //  Target the main details container 
    if (!root) return;                                                          // If document doesn't exist, stop

    // The demo data from utils.js
    if (!window.NOP_DATA) {
        console.error("details.js: NOP_DATA not found (utils.js missing?)");
        return;
    }

    // Grab DOM elements
    // store references to all elements that need to be fill with data.
    const breadcrumbEl = root.querySelector(".breadcrumb");
    const titleEl = root.querySelector("h2");
    const imgEl = root.querySelector(".details-figure img");
    const figcapEl = root.querySelector(".details-figure figcaption");
    const dlEl = root.querySelector(".details-meta dl");
    const tbodyEl = root.querySelector(".details-table tbody");
    const addBtn = root.querySelector("#addWishlistBtn");
    const backLink = root.querySelector("#backLink");

    // Read id from the URL
    // window.location.search returns the query string, like "?id=fox"
    // URLSearchParams makes it easy to read specific parameters.
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    // If the id is missing OR the id doesn't exist in NOP_DATA, show a fallback message ("Observation not found") and stop.
    if (!id || !NOP_DATA[id]) {
        breadcrumbEl.innerHTML =
            `<a href="../index.html">Home</a> &raquo; Observations &raquo; Details`;
        titleEl.textContent = "Observation not found";
        figcapEl.textContent = `No data for "${id || "unknown"}".`;                         
        return;
    }

    const data = NOP_DATA[id];                                                  //  a valid observation object

    // FILL BASIC PAGE CONTENT (text / image)
    breadcrumbEl.innerHTML =
        `<a href="../index.html">Home</a> &raquo; 
         <a href="../index.html#observations">Observations</a> &raquo; Details`;

    const title = data.title || "Observation";
    const caption = data.caption || data.summary || "";                         // set fallback values in case some data is missing.
    titleEl.textContent = title;                                                // Update the page title
    imgEl.src = data.img;
    imgEl.alt = title;                                                          // Update image source + alt text
    figcapEl.textContent = caption;                                             // Update caption under the image

    // BUILD THE META INFO LIST (<dl>) (Observation Info)
    dlEl.innerHTML = "";                                                        // clear old content before inserting new one.
    const info = data.info || {};
    const rows = [                                                              //define label/value pairs for the meta section.
        ["Species", info.species || ""],
        ["Date", info.date || ""],
        ["Location", info.location || ""],
        ["Observer", info.observer || ""],
        ["Tags", info.tags || ""]
    ];

    rows.forEach(([dtText, ddText]) => {                                        // For each meta row,<dt> (label) is created  and <dd> (value).
        const dtEl = document.createElement("dt");
        dtEl.textContent = dtText;
        const ddEl = document.createElement("dd");
        if (dtText === "Date" && ddText) {                                      // handling for date: <time> element for semantic HTML.
            const t = document.createElement("time");
            // ISO style (YYYY-MM-DD )
            t.dateTime = ddText.slice(0, 10);
            t.textContent = ddText;                                              // human-readable date
            ddEl.appendChild(t);
        } else {
            ddEl.textContent = ddText;
        }

        dlEl.append(dtEl, ddEl);                                                // Append both <dt> and <dd> to the <dl> ...Append dt and dd as a pair into the definition list.
    });

    // Builds the summary table
    tbodyEl.innerHTML = "";                                                     // clear old content
    const summaryRows = Array.isArray(data.summary) ? data.summary : [];        // ensure summary is an array or empty list.
    summaryRows.forEach(([prop, val]) => {                                      // For each summary row, create a table row with two cells.
        const tr = document.createElement("tr");                
        const td1 = document.createElement("td");               
        const td2 = document.createElement("td");
        td1.textContent = prop;
        td2.textContent = val;
        tr.append(td1, td2);
        tbodyEl.appendChild(tr);
    });

    // WISHLIST BUTTON LOGIC
    // uses the global Wishlist API from utils.js.
    if (window.Wishlist && addBtn) {
        const syncBtn = () => {                                      // Function to update the button state based on whether the item is in the wishlist.
            const saved = Wishlist.has(id);
            addBtn.textContent = saved ? "✓ In Wishlist" : "Add to Wishlist";
            addBtn.setAttribute("aria-pressed", String(saved));         // Update aria-pressed for accessibility, indicating toggle state.
        };
        syncBtn();                                                          // Sync once on page load
        addBtn.addEventListener("click", () => {                            // On button click, toggle wishlist state and sync button.
            Wishlist.toggle(id);
            syncBtn();
        });
    }

    //  jQuery
    if (window.jQuery) {
        const $ = window.jQuery;
        $(".details-content").hide().fadeIn(250);                          // Smooth fade-in effect for details content
        if (addBtn) {                                                      // Pulse animation on wishlist button click
            const $btn = $(addBtn);
            $btn.on("click", function () {
                // quick pulse
                $btn
                    .stop(true, true)
                    .animate({ opacity: 0.7 }, 100)
                    .animate({ opacity: 1 }, 100);
            });
        }

        // Hover effect on "Highlight on Map" 
        $("#highlightBtn").hover(
            function () { $(this).addClass("shadow-sm"); },
            function () { $(this).removeClass("shadow-sm"); }
        );
    }
})();