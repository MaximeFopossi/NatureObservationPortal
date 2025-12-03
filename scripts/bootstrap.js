// Enable tooltips  (data-bs-toggle="tooltip") on elements.
document.addEventListener('DOMContentLoaded', () => {
    const tooltipEls = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipEls.forEach(el => new bootstrap.Tooltip(el));
});
