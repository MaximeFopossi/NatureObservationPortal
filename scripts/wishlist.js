(function () {
    const listBox = document.getElementById("wishlist-list");                       // <div id="wishlist-list"></div>
    const emptyBox = document.getElementById("wishlist-empty");                     // <div id="wishlist-empty">…</div>

    if (!listBox || !emptyBox) {
        console.error("wishlist.js: Missing #wishlist-list or #wishlist-empty in HTML.");
        return;
    }
    if (!window.Wishlist || !window.NOP_DATA) {
        console.error("wishlist.js: utils.js not loaded (Wishlist / NOP_DATA missing).");
        return;
    }

    // Normalizing image path for pages/*.html
    function normalizeImgPath(p) {
        if (!p) return "";
        if (/^(?:\.\.\/|\/|https?:\/\/)/i.test(p)) return p;
        return "../" + p.replace(/^\.?\/*/, "");
    }

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

    function render() {
        const savedIds = window.Wishlist.getAll();
        if (!savedIds.length) {
            listBox.innerHTML = "";
            emptyBox.style.display = "block";
            return;
        }
        emptyBox.style.display = "none";
        const html = savedIds
            .map((id) => window.NOP_DATA[id])
            .filter(Boolean)
            .map(cardHtml)
            .join("");

        listBox.innerHTML = html;

        // Remove buttons
        listBox.querySelectorAll(".removeBtn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const article = btn.closest("article");
                const id = article.dataset.id;

                // If jQuery is available, animate removal
                if (window.jQuery) {
                    const $ = window.jQuery;
                    $(article).fadeOut(200, function () {
                        window.Wishlist.remove(id);
                        render();
                    });
                } else {
                    // Fallback: no animation
                    window.Wishlist.remove(id);
                    render();
                }
            });
        });

        // jQuery: fade-in effect for cards + hover shadow
        if (window.jQuery) {
            const $ = window.jQuery;

            const $cards = $("#wishlist-list .wishlist-card");
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

    render();
})();