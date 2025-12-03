console.log("utils.js loaded");
const OBSERVATIONS = [
    {
        id: "robin",
        title: "European Robin",
        species: "Erithacus rubecula",
        date: "2025-04-15",
        location: "Lake Garden",
        img: "assets/images/bird.jpg",                                      
        summary: "Small bird with a bright orange chest.",
        tags: ["bird", "garden", "spring"],
        lat: 52.515,
        lng: 13.405
    },
    {
        id: "oak",
        title: "Oak Tree",
        species: "Quercus robur",
        date: "2025-04-12",
        location: "Central Forest",
        img: "assets/images/tree.jpg",
        summary: "Large oak with a wide canopy in the central forest.",
        tags: ["tree", "forest"],
        lat: 52.52,
        lng: 13.39
    },
    {
        id: "fox",
        title: "Red Fox",
        species: "Vulpes vulpes",
        date: "2025-04-15",
        location: "Forest edge (North Trail)",
        img: "assets/images/fox.jpg",
        summary: "Spotted at the forest edge during sunset.",
        tags: ["mammal", "forest", "evening"],
        lat: 52.51,
        lng: 13.42
    },
    {
        id: "turtle",
        title: "Sea Turtle",
        species: "Chelonia mydas",
        date: "2025-04-20",
        location: "Caribbean Sea",
        img: "assets/images/turtle.jpg",
        summary: "A green sea turtle swimming gracefully in clear waters.",
        tags: ["marine", "turtle", "ocean"],
        lat: 15.48,     
        lng: -61.35
    },
    {
        id: "lion",
        title: "African Lion",
        species: "Panthera leo",
        date: "2025-03-29",
        location: "Serengeti National Park",
        img: "assets/images/lion.jpg",
        summary: "A powerful male lion watching attentively.",
        tags: ["mammal", "savannah", "predator"],
        lat: -2.33,
        lng: 34.83
    },
    {
        id: "polarbears",
        title: "Polar Bears",
        species: "Ursus maritimus",
        date: "2025-02-14",
        location: "Arctic Circle",
        img: "assets/images/bear.jpg",
        summary: "Two polar bears interacting playfully in the snow.",
        tags: ["bear", "arctic", "winter"],
        lat: 78.22,
        lng: 15.65
    },
    {
        id: "flamingo",
        title: "Pink Flamingo",
        species: "Phoenicopterus roseus",
        date: "2025-04-07",
        location: "Lake Nakuru, Kenya",
        img: "assets/images/flamingo.jpg",
        summary: "A flamingo standing gracefully in shallow water.",
        tags: ["bird", "lake", "africa"],
        lat: -0.37,
        lng: 36.09
    },
    {
        id: "kangaroo",
        title: "Eastern Grey Kangaroo",
        species: "Macropus giganteus",
        date: "2025-03-19",
        location: "Grampians National Park, Australia",
        img: "assets/images/kangoroos.jpg",
        summary: "A kangaroo with its young foraging in a grassy clearing.",
        tags: ["mammal", "kangaroo", "australia"],
        lat: -37.2333,
        lng: 142.4333
    },
    {
        id: "panda",
        title: "Giant Panda Eating Bamboo",
        species: "Ailuropoda melanoleuca",
        date: "2025-01-14",
        location: "Wolong National Nature Reserve, China",
        img: "assets/images/panda.jpg",
        summary: "A giant panda relaxing and eating bamboo shoots.",
        tags: ["bear", "panda", "china"],
        lat: 31.033,
        lng: 103.083
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
    },
    turtle: {
        id: "turtle",
        title: "Sea Turtle",
        img: "../assets/images/turtle.jpg",
        caption: "Seen swimming calmly near a reef.",
        info: {
            species: "Chelonia mydas (Green Sea Turtle)",
            date: "2025-04-20",
            location: "Caribbean Sea",
            observer: "M. Explorer",
            tags: "marine, turtle, ocean"
        },
        summary: [
            ["Water Temp", "27°C"],
            ["Depth", "6 meters"],
            ["Behavior", "Calm swimming"],
            ["Source", "Underwater camera"]
        ],
        description: "This sea turtle was observed gliding effortlessly through warm Caribbean waters."
    },

    lion: {
        id: "lion",
        title: "African Lion",
        img: "../assets/images/lion.jpg",
        caption: "A dominant male lion observing his surroundings.",
        info: {
            species: "Panthera leo",
            date: "2025-03-29",
            location: "Serengeti National Park",
            observer: "S. Wildlife",
            tags: "mammal, savannah, predator"
        },
        summary: [
            ["Weather", "Sunny, 31°C"],
            ["Habitat", "Grassland"],
            ["Confidence", "High"],
            ["Source", "Field notes"]
        ],
        description: "A majestic lion standing alert in open savannah grassland."
    },

    polarbears: {
        id: "polarbears",
        title: "Polar Bears",
        img: "../assets/images/bears.jpg",
        caption: "Two polar bears interacting in snowy conditions.",
        info: {
            species: "Ursus maritimus",
            date: "2025-02-14",
            location: "Arctic Circle",
            observer: "A. North",
            tags: "bear, arctic, winter"
        },
        summary: [
            ["Temperature", "-15°C"],
            ["Habitat", "Sea ice"],
            ["Behavior", "Social"],
            ["Source", "Photographic record"]
        ],
        description: "Two polar bears appeared to be communicating or playing."
    },

    flamingo: {
        id: "flamingo",
        title: "Pink Flamingo",
        img: "../assets/images/flamingo.jpg",
        caption: "A flamingo wading in shallow water.",
        info: {
            species: "Phoenicopterus roseus",
            date: "2025-04-07",
            location: "Lake Nakuru, Kenya",
            observer: "J. Safari",
            tags: "bird, lake, africa"
        },
        summary: [
            ["Weather", "Warm, 25°C"],
            ["Habitat", "Shallow alkaline lake"],
            ["Group Size", "Single observed"],
            ["Source", "Digital photograph"]
        ],
        description: "Pink flamingo stepping through shallow lake water, feeding calmly."
    },

    kangaroo: {
        id: "kangaroo",
        title: "Eastern Grey Kangaroo",
        img: "../assets/images/kangoroos.jpg",
        caption: "An Eastern Grey Kangaroo grazing with a younger kangaroo nearby.",
        info: {
            species: "Macropus giganteus (Eastern Grey Kangaroo)",
            date: "2025-03-19",
            location: "Grampians National Park, Australia",
            observer: "S. Thompson",
            tags: "mammal, kangaroo, australia"
        },
        summary: [
            ["Group Size", "Two individuals"],
            ["Behavior", "Grazing and alert watching"],
            ["Habitat", "Open woodland and grassland"],
            ["Source", "Field notes"]
        ],
        description:
            "A mature Eastern Grey Kangaroo was observed grazing in a grassy clearing, \
             accompanied by a younger kangaroo. The adult remained alert, frequently raising its head \
             to scan the surroundings. Both individuals appeared healthy, and their movements were \
             slow and relaxed. Leaf litter and early autumn colors were visible around the observation area."
    },

    panda: {
        id: "panda",
        title: "Giant Panda Eating Bamboo",
        img: "../assets/images/panda.jpg",
        caption: "A giant panda relaxing while eating bamboo shoots.",
        info: {
            species: "Ailuropoda melanoleuca (Giant Panda)",
            date: "2025-01-14",
            location: "Wolong National Nature Reserve, China",
            observer: "L. Zhang",
            tags: "bear, bamboo, china"
        },
        summary: [
            ["Diet", "Bamboo shoots and leaves"],
            ["Behavior", "Calm, feeding while sitting"],
            ["Conservation Status", "Vulnerable"],
            ["Source", "Field observation"]
        ],
        description:
            "The panda was observed resting against a rock wall, calmly eating bamboo shoots. \
             Its behavior was relaxed, showing no signs of distress. The thick fur was clean and well-kept, \
             and the panda displayed the typical slow chewing motion associated with feeding. \
             Occasional vocalizations were noted as soft bleats."
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

