// --- Demo data  ---
console.log("utils.js loaded");
const OBSERVATIONS = [
    {
        id: "robin",
        title: "European Robin",
        species: "Erithacus rubecula",
        date: "2025-04-15",
        location: "Lake Garden",
        img: "assets/images/bird.jpg",                                      // paths are relative to index.html
        summary: "Small bird with a bright orange chest.",
        tags: ["bird", "garden", "spring"]
    },
    {
        id: "oak",
        title: "Oak Tree",
        species: "Quercus robur",
        date: "2025-04-12",
        location: "Central Forest",
        img: "assets/images/tree.jpg",
        summary: "Large oak with a wide canopy in the central forest.",
        tags: ["tree", "forest"]
    },
    {
        id: "fox",
        title: "Red Fox",
        species: "Vulpes vulpes",
        date: "2025-04-15",
        location: "Forest edge (North Trail)",
        img: "assets/images/fox.jpg",
        summary: "Spotted at the forest edge during sunset.",
        tags: ["mammal", "forest", "evening"]
    }
];

// --- Read-only data accessors ---
function getAllObservations() {
    return OBSERVATIONS;
}

function getObservationById(id) {
    return OBSERVATIONS.find(o => o.id === id) || null;
}

// --- Wishlist helpers (localStorage) ---
const WL_KEY = "nop_wishlist";

/** Load wishlist as a Set<string> of ids */
function loadWishlist() {
    try {
        const raw = localStorage.getItem(WL_KEY);
        if (!raw) return new Set();
        const arr = JSON.parse(raw);
        return new Set(Array.isArray(arr) ? arr : []);
    } catch {
        return new Set();
    }
}

/** Save Set<string> back to localStorage */
function saveWishlist(set) {
    localStorage.setItem(WL_KEY, JSON.stringify([...set]));
}

/** Toggle presence of id; returns new Set */
function toggleWishlist(id) {
    const set = loadWishlist();
    if (set.has(id)) set.delete(id);
    else set.add(id);
    saveWishlist(set);
    return set;
}

/** Bool: is id saved? */
function isInWishlist(id) {
    return loadWishlist().has(id);
}

// Demo data used across pages
window.NOP_DATA = {
    fox: {
        id: "fox",
        title: "Red Fox",
        img: "../assets/images/fox.jpg",        
        caption: "Spotted near the forest edge at sunset.",
        info: {
            species: "Vulpes vulpes (Red Fox)",
            date: "2025-04-15",
            location: "Central Forest, North Trail",
            observer: "M. Mustermann",
            tags: "mammal, forest, evening"
        },
        summary: [
            ["Weather", "Clear, 15°C"],
            ["Habitat", "Forest edge"],
            ["Confidence", "High"],
            ["Source", "Field notes"]
        ],
        description:
            "The fox was observed at dusk, moving cautiously along the forest edge. It paused several times to listen and scan the area. No vocalizations were recorded."
    },
    robin: {
        id: "robin",
        title: "European Robin",
        img: "../assets/images/bird.jpg",
        caption: "Perched on a low branch near the stream.",
        info: {
            species: "Erithacus rubecula (European Robin)",
            date: "2025-04-12",
            location: "South Meadows",
            observer: "A. Example",
            tags: "bird, stream, morning"
        },
        summary: [
            ["Weather", "Sunny, 18°C"],
            ["Habitat", "Riparian"],
            ["Confidence", "Medium"],
            ["Source", "Photo"]
        ],
        description:
            "Short, repetitive song. Foraged close to ground cover. No aggressive behavior noted."
    },
    oak: {
        id: "oak",
        title: "Old Oak",
        img: "../assets/images/tree.jpg",
        caption: "Large oak dominating the clearing.",
        info: {
            species: "Quercus robur (English Oak)",
            date: "2025-04-10",
            location: "Old Clearing",
            observer: "A. Example",
            tags: "tree, clearing, landmark"
        },
        summary: [
            ["Height", "≈ 22 m"],
            ["Age", "Estimated 120+ years"],
            ["Health", "Good"],
            ["Source", "Field notes"]
        ],
        description:
            "Broad crown with healthy foliage. Signs of cavity nesting by small birds."
    }
};

// Wishlist helpers (public API over localStorage helpers)
window.Wishlist = {
    /** Array of saved IDs */
    getAll() {
        return [...loadWishlist()];
    },

    /** Is this ID saved? */
    has(id) {
        return isInWishlist(id);
    },

    /** Add explicitly */
    add(id) {
        const set = loadWishlist();
        set.add(id);
        saveWishlist(set);
    },

    /** Remove explicitly */
    remove(id) {
        const set = loadWishlist();
        set.delete(id);
        saveWishlist(set);
    },

    /** Toggle on/off; returns true if now saved */
    toggle(id) {
        const had = isInWishlist(id);
        toggleWishlist(id);
        return !had;
    }
};

