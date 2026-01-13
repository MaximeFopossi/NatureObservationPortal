(function () {
    // GET REQUIRED DOM ELEMENTS
    const listBox = document.getElementById("wishlist-list");                                 // Container where wishlist cards will be rendered
    const emptyBox = document.getElementById("wishlist-empty");                               // Placeholder shown when the wishlist is empty => <div id="wishlist-empty">…</div>
    if (!listBox || !emptyBox) {                                                              // Ensure required elements exist
        console.error("wishlist.js: Missing #wishlist-list or #wishlist-empty in HTML.");
        return;
    }
    if (!window.Wishlist || !window.NOP_DATA) {                                                 // Ensure dependencies are loaded (Wishlist.js and utils.js))
        console.error("wishlist.js: utils.js not loaded (Wishlist / NOP_DATA missing).");
        return;
    }

    // IMAGE PATH NORMALIZATION
    function normalizeImgPath(p) {
        if (!p) return "";
        if (/^(?:\.\.\/|\/|https?:\/\/)/i.test(p)) return p;                                    // Already absolute path or URL
        return "../" + p.replace(/^\.?\/*/, "");                                                // prefix "../" to correctly resolve the image path
    }

    // CARD TEMPLATE GENERATOR
    // Returns HTML string for a wishlist item card
    // This function returns the HTML markup for a single wishlist card.
    // It does not touch the DOM directly; it only generates a string.
    function cardHtml(item) {
        return `
      <article class="col-12 col-md-6 col-lg-4 wishlist-card" data-id="${item.id}">
        <div class="card shadow-sm border-0">
          <img src="${normalizeImgPath(item.img)}" 
               alt="${item.title}"
               class="card-img-top"
               style="height:180px; object-fit:cover;">
          
          <div class="card-body">
            <h3 class="card-title h5">${item.title}</h3>
            <p class="card-text">${item.caption ?? item.summary ?? ""}</p>

            <div class="d-flex justify-content-between align-items-center">
                <a href="details.html?id=${item.id}" class="btn btn-sm btn-primary">
                  View details
                </a>
                <button type="button" class="btn btn-sm btn-outline-danger removeBtn">
                  Remove
                </button>
            </div>
          </div>
        </div>
      </article>
    `;
    }

    // MAIN RENDER FUNCTION
    // This function reads the wishlist state and updates the UI accordingly.
    function render() {
        const savedIds = window.Wishlist.getAll();                                      // Get all saved wishlist item IDs
        if (!savedIds.length) {                                                         // If wishlist is empty, show placeholder
            listBox.innerHTML = "";
            emptyBox.style.display = "block";
            return;
        }
        emptyBox.style.display = "none";                                                // Hide placeholder

        // Build the wishlist cards:
        // Map each ID to its data object
        // Filter out missing data
        // Convert each item to HTML
        // Join into one string
        const html = savedIds
            .map((id) => window.NOP_DATA[id])
            .filter(Boolean)
            .map(cardHtml)
            .join("");
        listBox.innerHTML = html;                                                       // Update the DOM with the generated HTML

        // REMOVE BUTTON HANDLERS
        // Attach click event listeners to each remove buttons
        listBox.querySelectorAll(".removeBtn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const article = btn.closest("article");                                 // Find the closest article element (the card)
                const id = article.dataset.id;

                // If jQuery is available, animate removal
                if (window.jQuery) {
                    const $ = window.jQuery;
                    $(article).fadeOut(200, function () {
                        window.Wishlist.remove(id);
                        render();                                                       // Re-render the wishlist after removal
                    });
                } else {
                    // Fallback: remove immediately without animation
                    window.Wishlist.remove(id);
                    render();
                }
            });
        });

        // jQUERY UI EFFECTS
        if (window.jQuery) {
            const $ = window.jQuery;
            const $cards = $("#wishlist-list .wishlist-card");                          // Fade-in animation for wishlist cards
            $cards.hide().each(function (i) {
                $(this).delay(i * 150).fadeIn(250);
            });
            // Hover: stronger shadow on the inner .card
            $("#wishlist-list").on("mouseenter", ".card", function () {
                $(this).addClass("shadow-lg");
            }).on("mouseleave", ".card", function () {
                $(this).removeClass("shadow-lg");
            });
        }
    }
    render();                                                                           // Initial render on script load
})();