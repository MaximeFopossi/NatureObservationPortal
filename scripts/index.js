document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("observations");
    if (!container) return;

    // Render all cards
    const data = getAllObservations();
    container.innerHTML = "";                                                           // clears any static markup

    const wl = loadWishlist();

    data.forEach(obs => {
        const article = document.createElement("article");
        article.innerHTML = `
      <img src="${obs.img}" alt="${obs.title}">
      <h3>${obs.title}</h3>
      <p>${obs.summary}</p>
      <a href="pages/details.html?id=${encodeURIComponent(obs.id)}">View details</a>
      <div class="card-actions">
        <label>
          <input type="checkbox" class="wish-toggle" data-id="${obs.id}" ${wl.has(obs.id) ? "checked" : ""}>
          ☆ Save
        </label>
      </div>
    `;
        container.appendChild(article);
    });

    // Handles wishlist toggle 
    container.addEventListener("change", (e) => {
        const el = e.target;
        if (!el.classList.contains("wish-toggle")) return;
        const id = el.getAttribute("data-id");
        const newSet = toggleWishlist(id);

        if (newSet.has(id)) {
            // saved
            // console.log(Saved ${id});
        } else {
            // removed
            // console.log(Removed ${id});
        }
    });
});