// --- helpers ---
const form = document.querySelector('#register form');
const previewBtn = document.getElementById('previewBtn');
const submitBtn = document.getElementById('submitBtn');

// inputs
const fullNameInput = document.getElementById('fullname');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('mobilenumber');
const dobInput = document.getElementById('dateofbirth');
const urlInput = document.getElementById('homepageurl');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm-password');

// error spans
const err = {
    fullname: document.getElementById('fullname-error'),
    email: document.getElementById('email-error'),
    mobilenumber: document.getElementById('mobilenumber-error'),
    dateofbirth: document.getElementById('dateofbirth-error'),
    homepageurl: document.getElementById('homepageurl-error'),
    username: document.getElementById('username-error'),
    password: document.getElementById('password-error'),
    'confirm-password': document.getElementById('confirm-password-error'),
};

// --- generic UI helpers ---
function setError(inputEl, errEl, message) {
    errEl.textContent = message;
    inputEl.classList.add('is-invalid');
    inputEl.setAttribute('aria-invalid', 'true');
    // Ensure linkage for screen readers
    if (!inputEl.getAttribute('aria-describedby')) {
        inputEl.setAttribute('aria-describedby', errEl.id);
    }
}

function clearError(inputEl, errEl) {
    errEl.textContent = '';
    inputEl.classList.remove('is-invalid');
    inputEl.removeAttribute('aria-invalid');
}

// --- specific validators (return true/false) ---
function validateFullName() {
    const v = fullNameInput.value.trim();
    // Expect "Lastname, Firstname"
    const re = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+,\s*[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;
    if (!v) {
        setError(fullNameInput, err.fullname, 'Full name is required (e.g., "Muster, Max").');
        return false;
    }
    if (!re.test(v)) {
        setError(fullNameInput, err.fullname, 'Use format: "Lastname, Firstname".');
        return false;
    }
    clearError(fullNameInput, err.fullname);
    return true;
}

function validateEmail() {
    const v = emailInput.value.trim();
    const re = /^[a-zA-Z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}$/;
    if (!v) {
        setError(emailInput, err.email, 'Email is required.');
        return false;
    }
    if (!re.test(v)) {
        setError(emailInput, err.email, 'Enter a valid email like name@example.com.');
        return false;
    }
    clearError(emailInput, err.email);
    return true;
}

function validatePhone() {
    const v = phoneInput.value.trim();
    // Formats: +49 1526 123456  or +49-1526-123456
    const re = /^\+\d{1,3}([ -]?\d{2,5}){2,}$/;
    if (!v) {
        setError(phoneInput, err.mobilenumber, 'Telephone number is required.');
        return false;
    }
    if (!re.test(v)) {
        setError(phoneInput, err.mobilenumber, 'Use intl. format, e.g. "+49 1526 123456".');
        return false;
    }
    clearError(phoneInput, err.mobilenumber);
    return true;
}

function validateDob() {
    const v = dobInput.value;                                                   // type="date" => "YYYY-MM-DD"
    if (!v) {
        setError(dobInput, err.dateofbirth, 'Date of birth is required.');
        return false;
    }
    const dob = new Date(v + 'T00:00:00');
    if (isNaN(dob.getTime())) {
        setError(dobInput, err.dateofbirth, 'Please pick a valid date.');
        return false;
    }
    // must be >= 18 years old
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    if (age < 18) {
        setError(dobInput, err.dateofbirth, 'You must be at least 18 years old.');
        return false;
    }
    clearError(dobInput, err.dateofbirth);
    return true;
}

function validateUrl() {
    const v = urlInput.value.trim();
    // Accept http(s)://... 
    const re = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
    if (!v) {
        setError(urlInput, err.homepageurl, 'Homepage URL is required.');
        return false;
    }
    if (!re.test(v)) {
        setError(urlInput, err.homepageurl, 'Use a full URL like "https://example.com".');
        return false;
    }
    clearError(urlInput, err.homepageurl);
    return true;
}

function validateUsername() {
    const v = usernameInput.value.trim();

    // Optional field (Username) — no value = valid, skip validation
    if (!v) {
        clearError(usernameInput, err.username);
        return true;
    }

    // If user entered a username, validate pattern: 3+ letters/numbers/underscore
    const re = /^[A-Za-z0-9_]{3,20}$/;
    if (!re.test(v)) {
        setError(usernameInput, err.username, 'Optional. If used, 3–20 letters, numbers, or underscore.');
        return false;
    }

    // Otherwise, valid username
    clearError(usernameInput, err.username);
    return true;
}

function validatePassword() {
    const v = passwordInput.value;
    if (!v) {
        setError(passwordInput, err.password, 'Password is required.');
        return false;
    }
    if (v.length < 8) {
        setError(passwordInput, err.password, 'Use at least 8 characters.');
        return false;
    }
    clearError(passwordInput, err.password);
    return true;
}

function validateConfirm() {
    const v = confirmInput.value;
    if (!v) {
        setError(confirmInput, err['confirm-password'], 'Please confirm your password.');
        return false;
    }
    if (v !== passwordInput.value) {
        setError(confirmInput, err['confirm-password'], 'Passwords do not match.');
        return false;
    }
    clearError(confirmInput, err['confirm-password']);
    return true;
}

// --- validate all + toggle buttons ---
function validateForm() {
    const a = validateFullName();
    const b = validateEmail();
    const c = validatePhone();
    const d = validateDob();
    const e = validateUrl();
    const f = validateUsername();
    const g = validatePassword();
    const h = validateConfirm();

    const allValid = a && b && c && d && e && f && g && h;

    // Enable preview only when everything is valid
    previewBtn.disabled = !allValid;

    // Disable submit if you want to force only valid posts
    submitBtn.disabled = !allValid;

    return allValid;
}

// --- live validation: on input/blur ---
[
    [fullNameInput, validateFullName, err.fullname],
    [emailInput, validateEmail, err.email],
    [phoneInput, validatePhone, err.mobilenumber],
    [dobInput, validateDob, err.dateofbirth],
    [urlInput, validateUrl, err.homepageurl],
    [usernameInput, validateUsername, err.username],
    [passwordInput, validatePassword, err.password],
    [confirmInput, validateConfirm, err['confirm-password']],
].forEach(([input, fn]) => {
    input.addEventListener('input', () => {
        fn();
        // Re-check overall validity to toggle buttons as user types
        validateForm();
    });
    input.addEventListener('blur', () => {
        fn();
        validateForm();
    });
});

form.addEventListener('submit', (e) => {
    if (!validateForm()) {
        e.preventDefault();
        // focus first invalid field
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) {
            firstInvalid.focus();
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

//testing if validation is ready (Everything works )
console.log(' Validation ready');


// PREVIEW MODE HANDLER

// Find the preview container
const previewContainer = document.getElementById('previewContainer');

// Build HTML preview
function showPreview() {
    // Double-check that everything is valid before preview
    if (!validateForm()) {
        alert("Please fix the errors before previewing.");
        return;
    }

    // Build a clean HTML summary
    const html = `
    <h3>Preview Your Details</h3>
    <ul>
      <li><strong>Full Name:</strong> ${fullNameInput.value}</li>
      <li><strong>Email:</strong> ${emailInput.value}</li>
      <li><strong>Telephone Number:</strong> ${phoneInput.value}</li>
      <li><strong>Date of Birth:</strong> ${dobInput.value}</li>
      <li><strong>Homepage URL:</strong> <a href="${urlInput.value}" target="_blank">${urlInput.value}</a></li>
      <li><strong>Username:</strong> ${usernameInput.value}</li>
    </ul>
    <button type="button" id="editBtn">Edit</button>
    <button type="submit" id="confirmBtn">Confirm & Submit</button>
    
  `;
    // Insert preview HTML
    previewContainer.innerHTML = html;

    // Hide the form elements (but keep preview visible)
    form.querySelectorAll("input, label, .form-buttons").forEach(el => {
        el.style.display = "none";
    });

    // Show the preview box
    previewContainer.style.display = "block";

    // Attach Edit button handler
    document.getElementById('editBtn').addEventListener('click', showEditMode);
    document.getElementById('confirmBtn').addEventListener('click', () => {
        // Choose username if provided, otherwise full name
        const displayName = usernameInput.value.trim() || fullNameInput.value.trim();
        // Save it for success page
        localStorage.setItem("displayName", displayName);
        // Submit the form normally (will navigate to register-success.html)
        form.submit();
    });
}

// Back to edit mode
function showEditMode() {
    // Hide preview
    previewContainer.style.display = "none";

    // Show the form elements again
    form.querySelectorAll("input, label, .form-buttons").forEach(el => {
        el.style.display = "";
    });
}

// Attach event listener to the Preview button
previewBtn.addEventListener('click', showPreview);
