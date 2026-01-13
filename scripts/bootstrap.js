document.addEventListener('DOMContentLoaded', () => {                                               // Enable Bootstrap tooltips for all elements with the attribute: data-bs-toggle="tooltip"
    const tooltipEls = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));      // The selector matches any element with the data-bs-toggle="tooltip" attribute.
    tooltipEls.forEach(el => new bootstrap.Tooltip(el));                                            // Initialize a Bootstrap Tooltip for each selected element.
});
