document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("observations-row");
    if (!container) return;

    // Get data + current wishlist
    const data = getAllObservations();
    const wl = loadWishlist();

    // Clear list
    container.innerHTML = "";

    // Render cards
    data.forEach(obs => {
        const col = document.createElement("div");
        col.className = "col-sm-6 col-md-4";

        const isSaved = wl.has(obs.id);
        const checkboxId = `wish-${obs.id}`;

        col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${obs.img}"
                     class="card-img-top"
                     alt="${obs.title}">
                <div class="card-body">
                    <h5 class="card-title">${obs.title}</h5>
                    <p class="card-text">${obs.summary}</p>
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
                        <input
                            class="form-check-input wish-toggle"
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
    });

    // Wishlist toggle handler
    container.addEventListener("change", (e) => {
        if (!e.target.classList.contains("wish-toggle")) return;
        toggleWishlist(e.target.getAttribute("data-id"));
    });

    // Leaflet map initialization
    const mapDiv = document.getElementById("map-placeholder");

    if (mapDiv && typeof L !== "undefined") {
        const withCoords = data.filter(o => typeof o.lat === "number" && typeof o.lng === "number");

        const first = withCoords[0] || {};
        const startLat = first.lat ?? 52.52;
        const startLng = first.lng ?? 13.40;

        const map = L.map(mapDiv).setView([startLat, startLng], 12);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 18,
            attribution: "&copy; OpenStreetMap contributors"
        }).addTo(map);

        withCoords.forEach(obs => {
            const marker = L.marker([obs.lat, obs.lng]).addTo(map);
            marker.bindPopup(`<strong>${obs.title}</strong><br>${obs.location || ""}`);
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

        // Hover shadow effect
        $("#observations-row").on("mouseenter", ".card", function () {
            $(this).addClass("shadow-lg");
        }).on("mouseleave", ".card", function () {
            $(this).removeClass("shadow-lg");
        });

        // Search + smooth scroll
        const $searchInput = $("#searchInput");
        const $searchBtn = $("#searchBtn");

        function applyFilter() {
            const q = $searchInput.val().trim().toLowerCase();

            $("#observations-row > div").each(function () {
                const text = $(this).text().toLowerCase();
                $(this).toggle(text.includes(q));
            });

            const $section = $("#observations");
            if ($section.length) {
                $("html, body").animate(
                    { scrollTop: $section.offset().top - 80 },
                    400
                );
            }
        }
        $searchBtn.on("click", applyFilter);
        $searchInput.on("keyup", function (e) {
            if (e.key === "Enter") applyFilter();
        });
    }
});