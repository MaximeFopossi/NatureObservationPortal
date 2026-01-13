document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("addForm");
    const status = document.getElementById("status");
    const loading = document.getElementById("loading"); // ✅ get it here

    if (!form) return;

    function setStatus(html, type = "info") {
        if (!status) return;

        const cls =
            type === "ok"
                ? "alert alert-success mt-2"
                : type === "err"
                    ? "alert alert-danger mt-2"
                    : "alert alert-info mt-2";

        status.className = cls;
        status.innerHTML = html;
    }

    function setLoading(isLoading) {
        if (!loading) return;
        loading.classList.toggle("d-none", !isLoading); // show if true, hide if false
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Read values
        const title = document.getElementById("title").value.trim();
        const latinName = document.getElementById("latinName").value.trim();
        const location = document.getElementById("location").value.trim();
        const date = document.getElementById("date").value;

        const latRaw = document.getElementById("lat").value.trim();
        const lngRaw = document.getElementById("lng").value.trim();

        const lat = latRaw === "" ? null : Number(latRaw);
        const lng = lngRaw === "" ? null : Number(lngRaw);

        // Required fields
        if (!title || !latinName || !location || !date) {
            setStatus("Please fill in all required fields (*).", "err");
            return;
        }

        // Optional number validation
        if ((latRaw && Number.isNaN(lat)) || (lngRaw && Number.isNaN(lng))) {
            setStatus("Latitude/Longitude must be valid numbers or empty.", "err");
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        setStatus("Saving observation…", "info");
        setLoading(true); // ✅ show spinner right before fetch

        try {
            const res = await fetch("http://localhost:3000/observation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, latinName, location, date, lat, lng }),
            });

            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                setStatus(`Save failed: ${json.error || "Unknown error"}`, "err");
                return;
            }

            setStatus("✅ Observation saved. Redirecting…", "ok");

            // Make sure homepage loads local backend
            localStorage.setItem("nop_dataSource", "local");

            // Redirect back
            setTimeout(() => {
                window.location.href = "../index.html";
            }, 800);

        } catch (err) {
            console.error(err);
            setStatus("❌ Could not reach backend. Is the Node server running?", "err");
        } finally {
            setLoading(false); // ✅ always hide spinner
            if (submitBtn) submitBtn.disabled = false; // ✅ re-enable if error happens
        }
    });
});