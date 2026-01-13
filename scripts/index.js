// Waits until the HTML document is fully loaded and parsed.
document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("observations-row");  // Container where  the observation cards are dynamically inserted.
    if (!container) return;                                         // If the element doesn't exist (wrong page), stop the script.
    // Data source toggle (demo vs backend)
    // const dataSourceSelect = document.getElementById("dataSource");
    // Data source toggle (demo vs backend)
    const dataSourceSelect = document.getElementById("dataSource");
    const loadMoreBtn = document.getElementById("loadMoreBtn");

    // Remember selected source across reloads
    const savedSource = localStorage.getItem("nop_dataSource");
    if (dataSourceSelect && savedSource) {
        dataSourceSelect.value = savedSource;
    }
    const PER_PAGE = 6;
    let page = 1;         // iNaturalist page
    let localOffset = 0;  // local paging offset
    let currentData = []; // stores what is currently displayed (for the map)

    async function loadFromINat(pageNum) {
        const url =
            `https://api.inaturalist.org/v1/observations?` +
            `page=${pageNum}&per_page=${PER_PAGE}&order=desc&order_by=created_at`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to load iNaturalist observations");

        const json = await res.json();
        const results = Array.isArray(json.results) ? json.results : [];

        return results.map(o => {
            const latin = o?.taxon?.name || "";
            const date = o?.observed_on || "";
            const title = o?.taxon?.preferred_common_name || latin || "Observation";
            const location = o?.place_guess || "";

            // image: replace square -> large
            let img = o?.photos?.[0]?.url || "";
            if (img) img = img.replace("square", "large");

            const lat = typeof o?.geojson?.coordinates?.[1] === "number" ? o.geojson.coordinates[1] : null;
            const lng = typeof o?.geojson?.coordinates?.[0] === "number" ? o.geojson.coordinates[0] : null;

            return {
                id: String(o.id),
                title,
                species: latin,
                date,
                location,
                summary: `${latin}${date ? " • " + date : ""}`,
                img: img || "assets/images/fox.jpg",
                lat,
                lng
            };
        });
    }

    async function loadFromLocal(offset) {
        const res = await fetch("http://localhost:3000/observations");
        if (!res.ok) throw new Error("Failed to load local observations");
        const all = await res.json();

        const slice = all.slice(offset, offset + PER_PAGE);

        return slice.map(o => ({
            id: o.id,
            title: o.title,
            species: o.latinName,
            date: o.date,
            location: o.location,
            summary: `${o.latinName}${o.date ? " • " + o.date : ""}`,
            // Placeholder image for local data
            // Improve: could allow user to upload images in add.js and store/display them here
            // images are not stored yet in the local backend
            img: "assets/images/fox.jpg", // fallback
            lat: o.lat,
            lng: o.lng
        }));
    }

    async function loadNextBatch() {
        const source = dataSourceSelect?.value || "local";

        if (source === "api") {
            const batch = await loadFromINat(page);
            page += 1;
            return batch;
        } else {
            const batch = await loadFromLocal(localOffset);
            localOffset += PER_PAGE;
            return batch;
        }
    }

    // Reload page when data source changes
    // Reload page when data source changes (and remember choice)
    if (dataSourceSelect) {
        dataSourceSelect.addEventListener("change", () => {
            localStorage.setItem("nop_dataSource", dataSourceSelect.value);

            // reset counters
            page = 1;
            localOffset = 0;

            // clear UI
            container.innerHTML = "";

            // load first batch again
            initFirstBatch();
        });
    }

    //const data = getAllObservations();                               // load the observation data (array of objects) and the current wishlist state.
    const wl = loadWishlist();
    container.innerHTML = "";

    // Render ONE observation card (so we can append later)
    function renderOneCard(obs) {
        const col = document.createElement("div");
        col.className = "col-sm-6 col-md-4";

        // data-* attributes for export
        col.dataset.id = obs.id;
        col.dataset.title = obs.title;
        col.dataset.species = obs.species || "";
        col.dataset.date = obs.date || "";
        col.dataset.location = obs.location || "";

        const isSaved = wl.has(obs.id);
        const checkboxId = `wish-${obs.id}`;

        col.innerHTML = `
        <div class="card h-100 shadow-sm">
            <img src="${obs.img}" class="card-img-top" alt="${obs.title}">
            <div class="card-body">
                <h5 class="card-title">${obs.title}</h5>

                <!-- show latin name + date (Übung requirement) -->
                <p class="card-text">
                    <small class="text-muted">${obs.species || ""}${obs.date ? " • " + obs.date : ""}</small>
                </p>

                <p class="card-text">
                    <small class="text-muted">${obs.location || ""}</small>
                </p>
            </div>

            <div class="card-footer d-flex justify-content-between align-items-center">
                <a href="pages/details.html?id=${encodeURIComponent(obs.id)}"
                   class="btn btn-sm btn-success">
                    View details
                </a>

                <div class="form-check mb-0">
                    <input class="form-check-input wish-toggle"
                           type="checkbox"
                           id="${checkboxId}"
                           data-id="${obs.id}"
                           ${isSaved ? "checked" : ""}>
                    <label class="form-check-label" for="${checkboxId}">
                        Save
                    </label>
                </div>
            </div>
        </div>
    `;

        container.appendChild(col);
    }

    // load first batch
    async function initFirstBatch() {
        container.innerHTML = "";

        try {
            const first = await loadNextBatch();

            // ✅ store what we display (for the map)
            currentData = first;

            // render the cards
            first.forEach(renderOneCard);
            renderMap();

        } catch (err) {
            console.error(err);

            // fallback to demo if both sources fail
            const fallback = getAllObservations().slice(0, 6);

            // ✅ store fallback too
            currentData = fallback;

            fallback.forEach(renderOneCard);
            renderMap();
        }
    }


    // load more button 
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", async () => {
            try {
                const next = await loadNextBatch();

                // ✅ add new items to currentData (for the map)
                currentData = currentData.concat(next);

                // render the new cards
                next.forEach(renderOneCard);
                renderMap();

            } catch (err) {
                console.error(err);
                alert("Could not load more observations.");
            }
        });
    }


    // start
    initFirstBatch();

    // Wishlist toggle handler
    container.addEventListener("change", (e) => {                           //  Adding ONE listener is attached to the container and use event delegation.
        if (!e.target.classList.contains("wish-toggle")) return;            //only react if the event comes from a wishlist checkbox.
        toggleWishlist(e.target.getAttribute("data-id"));                   // read the observation id from the checkbox attribute and toggle it in storage.
    });

    // Leaflet map initialization
    // I only initialize the map if:
    // - the placeholder div exists
    // - Leaflet is loaded (L is defined)
    const mapDiv = document.getElementById("map-placeholder");
    let map = null;
    let markerLayer = null;

    function renderMap() {
        if (!mapDiv || typeof L === "undefined") return;

        const withCoords = currentData.filter(o => typeof o.lat === "number" && typeof o.lng === "number");
        const first = withCoords[0] || {};
        const startLat = first.lat ?? 52.52;
        const startLng = first.lng ?? 13.40;

        // Create map only once
        if (!map) {
            map = L.map(mapDiv).setView([startLat, startLng], 12);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 18,
                attribution: "&copy; OpenStreetMap contributors"
            }).addTo(map);

            markerLayer = L.layerGroup().addTo(map);
        }

        // Clear markers and re-add based on currentData
        markerLayer.clearLayers();

        withCoords.forEach(obs => {
            const marker = L.marker([obs.lat, obs.lng]);
            marker.bindPopup(`<strong>${obs.title}</strong><br>${obs.location || ""}`);
            marker.addTo(markerLayer);
        });
    }

    // jQuery
    if (window.jQuery) {
        const $ = window.jQuery;

        // Fade-in animation
        $("#observations-row .card")
            .hide()
            .each(function (i) {
                $(this).delay(i * 150).fadeIn(250);                                 
            });
        $("#observations-row").on("mouseenter", ".card", function () {        // Hover shadow effect, adds/removes shadow when hovering over a card.
            $(this).addClass("shadow-lg");
        }).on("mouseleave", ".card", function () {
            $(this).removeClass("shadow-lg");
        });

        // Search + smooth scroll
        const $searchInput = $("#searchInput");             // references to the search input and button.
        const $searchBtn = $("#searchBtn");

        function applyFilter() {
            const q = $searchInput.val().trim().toLowerCase();

            //  loop through each card column and show/hide it depending on the match.
            $("#observations-row > div").each(function () {
                const text = $(this).text().toLowerCase();
                $(this).toggle(text.includes(q));
            });

            // Smooth scroll to results
            const $section = $("#observations");
            if ($section.length) {
                $("html, body").animate(
                    { scrollTop: $section.offset().top - 80 },
                    400
                );
            }
        }
        $searchBtn.on("click", applyFilter);                    // Apply filter when the search button is clicked.
        $searchInput.on("keyup", function (e) {
            if (e.key === "Enter") applyFilter();
        });
    }

    // EXPORT VISIBLE TILES TO NODE SERVER (JSON)
    const exportBtn = document.getElementById("exportBtn");
    const exportStatus = document.getElementById("exportStatus");

    if (exportBtn) {
        exportBtn.addEventListener("click", async () => {
            const visible = [...document.querySelectorAll("#observations-row > div")]           // I select all observation tile columns and keep only those that are visible.
                .filter(tile => tile.offsetParent !== null)                                   // tile.offsetParent !== null is a common trick: it returns null if element is hidden.
                .map(tile => ({                                                 // extract relevant data from data-* attributes
                    id: tile.dataset.id,
                    title: tile.dataset.title,
                    species: tile.dataset.species,
                    date: tile.dataset.date,
                    location: tile.dataset.location
                }));

            if (!visible.length) {                                                      // if no visible tiles, show message and abort.
                if (exportStatus) exportStatus.textContent = "Nothing to export (no visible tiles).";
                return;
            }

            if (exportStatus) exportStatus.textContent = "Exporting...";               

            try {
                const blob = new Blob(
                    [JSON.stringify(visible, null, 2)],
                    { type: "application/json" }
                );

                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `export-${Date.now()}.json`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);

                if (exportStatus) {
                    exportStatus.textContent = "✅ Exported (download started)";
                }
            } catch (err) {
                console.error(err);
                if (exportStatus) {
                    exportStatus.textContent = "❌ Export failed";
                }
            }

        });
    }

   
});