(function () {
    const listBox = document.getElementById("wishlist-list");   // <div id="wishlist-list"></div>
    const emptyBox = document.getElementById("wishlist-empty");  // <div id="wishlist-empty">…</div>

    if (!listBox || !emptyBox) {
        console.error('wishlist.js: Missing #wishlist-list or #wishlist-empty in HTML.');
        return;
    }
    if (!window.Wishlist || !window.NOP_DATA) {
        console.error('wishlist.js: utils.js not loaded (Wishlist / NOP_DATA missing).');
        return;
    }

    // Normalize image path for pages/*.html 
    function normalizeImgPath(p) {
        if (!p) return "";
        if (/^(?:\.\.\/|\/|https?:\/\/)/i.test(p)) return p;
        return "../" + p.replace(/^\.?\/*/, "");
    }

    function cardHtml(item) {
        return `
      <article class="wishlist-card" data-id="${item.id}">
        <img src="${normalizeImgPath(item.img)}" alt="${item.title}"
             style="width:100%; height:180px; object-fit:cover; border-radius:10px;">
        <h3 style="margin:10px 0;">${item.title}</h3>
        <p style="margin:0 0 10px;">${item.caption ?? item.summary ?? ""}</p>
        <div class="card-actions">
          <a href="details.html?id=${item.id}" class="btn" >View details</a>
          &nbsp;•&nbsp;
          <button type="button" class="removeBtn">Remove</button>
        </div>
      </article>
    `;
    }

    function render() {
        const savedIds = window.Wishlist.getAll();                          // changed from NOP.getWishlist()
        if (!savedIds.length) {
            listBox.innerHTML = "";
            emptyBox.style.display = "block";
            return;
        }

        emptyBox.style.display = "none";

        const html = savedIds
            .map((id) => window.NOP_DATA[id])                               // read from  shared data
            .filter(Boolean)
            .map(cardHtml)
            .join("");

        listBox.innerHTML = html;

        // Hook "Remove" buttons
        listBox.querySelectorAll(".removeBtn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const id = btn.closest("article").dataset.id;
                window.Wishlist.remove(id);                                 // changed from NOP.remove
                render();
            });
        });
    }

    render();
})();