// --- Grab elements ---
const form = document.querySelector('#register form');
const previewBtn = document.getElementById('previewBtn');
const submitBtn = document.getElementById('submitBtn');
const fullNameInput = document.getElementById('fullname');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('mobilenumber');
const dobInput = document.getElementById('dateofbirth');
const urlInput = document.getElementById('homepageurl');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm-password');

const previewContainer = document.getElementById('previewContainer');

// Defensive check
if (!form) {
    console.error('register.js: #register form not found.');
}

// --- Bootstrap-style helpers ---

function getInvalidFeedback(input) {
    // look in the same .mb-3 block
    const parent = input.closest('.mb-3') || input.parentElement;
    if (!parent) return null;
    return parent.querySelector('.invalid-feedback');
}

function resetFeedback(input) {
    input.classList.remove('is-valid', 'is-invalid');
    const feedback = getInvalidFeedback(input);
    if (feedback) feedback.textContent = '';
}

function setError(input, message) {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    const feedback = getInvalidFeedback(input);
    if (feedback) feedback.textContent = message;
}

function setSuccess(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    const feedback = getInvalidFeedback(input);
    if (feedback) feedback.textContent = ''; 
}

// --- Field validators (return true/false) ---

function validateFullName() {
    const v = fullNameInput.value.trim();
    // Expect "Lastname, Firstname"
    const re = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+,\s*[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;
    if (!v) {
        setError(fullNameInput, 'Full name is required (e.g., "Muster, Max").');
        return false;
    }
    if (!re.test(v)) {
        setError(fullNameInput, 'Use format: "Lastname, Firstname".');
        return false;
    }
    setSuccess(fullNameInput);
    return true;
}

function validateEmail() {
    const v = emailInput.value.trim();
    const re = /^[a-zA-Z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}$/;
    if (!v) {
        setError(emailInput, 'Email is required.');
        return false;
    }
    if (!re.test(v)) {
        setError(emailInput, 'Enter a valid email like name@example.com.');
        return false;
    }
    setSuccess(emailInput);
    return true;
}

function validatePhone() {
    const v = phoneInput.value.trim();
    // Example formats: +49 1526 123456  or +49-1526-123456
    const re = /^\+\d{1,3}([ -]?\d{2,5}){2,}$/;
    if (!v) {
        setError(phoneInput, 'Telephone number is required.');
        return false;
    }
    if (!re.test(v)) {
        setError(phoneInput, 'Use intl. format, e.g. "+49 1526 123456".');
        return false;
    }
    setSuccess(phoneInput);
    return true;
}

function validateDob() {
    const v = dobInput.value; // type="date" => "YYYY-MM-DD"
    if (!v) {
        setError(dobInput, 'Date of birth is required.');
        return false;
    }
    const dob = new Date(v + 'T00:00:00');
    if (isNaN(dob.getTime())) {
        setError(dobInput, 'Please pick a valid date.');
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
        setError(dobInput, 'You must be at least 18 years old.');
        return false;
    }
    setSuccess(dobInput);
    return true;
}

function validateUrl() {
    const v = urlInput.value.trim();
    const re = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
    if (!v) {
        setError(urlInput, 'Homepage URL is required.');
        return false;
    }
    if (!re.test(v)) {
        setError(urlInput, 'Use a full URL like "https://example.com".');
        return false;
    }
    setSuccess(urlInput);
    return true;
}

function validateUsername() {
    const v = usernameInput.value.trim();

    // no username = valid & neutral (no green check)
    if (!v) {
        resetFeedback(usernameInput);
        return true;
    }

    const re = /^[A-Za-z0-9_]{3,20}$/;
    if (!re.test(v)) {
        setError(usernameInput, 'Optional. If used, 3–20 letters, numbers, or underscore.');
        return false;
    }

    setSuccess(usernameInput);
    return true;
}

function validatePassword() {
    const v = passwordInput.value;
    if (!v) {
        setError(passwordInput, 'Password is required.');
        return false;
    }
    if (v.length < 8) {
        setError(passwordInput, 'Use at least 8 characters.');
        return false;
    }
    setSuccess(passwordInput);
    return true;
}

function validateConfirm() {
    const v = confirmInput.value;
    if (!v) {
        setError(confirmInput, 'Please confirm your password.');
        return false;
    }
    if (v !== passwordInput.value) {
        setError(confirmInput, 'Passwords do not match.');
        return false;
    }
    setSuccess(confirmInput);
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

    if (previewBtn) previewBtn.disabled = !allValid;
    if (submitBtn) submitBtn.disabled = !allValid;

    return allValid;
}

// --- live validation ---

[
    [fullNameInput, validateFullName],
    [emailInput, validateEmail],
    [phoneInput, validatePhone],
    [dobInput, validateDob],
    [urlInput, validateUrl],
    [usernameInput, validateUsername],
    [passwordInput, validatePassword],
    [confirmInput, validateConfirm],
].forEach(([input, fn]) => {
    if (!input) return;
    input.addEventListener('input', () => {
        fn();
        validateForm();
    });
    input.addEventListener('blur', () => {
        fn();
        validateForm();
    });
});

// --- submit guard ---

form.addEventListener('submit', (e) => {
    if (!validateForm()) {
        e.preventDefault();
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) {
            firstInvalid.focus();
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    } else {
        // If user submits directly (without preview), still store displayName
        const displayName = usernameInput.value.trim() || fullNameInput.value.trim();
        localStorage.setItem("displayName", displayName);
    }
});

console.log('Bootstrap validation ready');

// PREVIEW MODE HANDLER

function getFormChildrenExceptPreview() {
    return Array.from(form.children).filter(el => el !== previewContainer);
}

function showPreview() {
    if (!validateForm()) {
        alert("Please fix the errors before previewing.");
        return;
    }

    const html = `
      <h3>Preview Your Details</h3>
      <ul class="list-group text-start mb-3">
        <li class="list-group-item"><strong>Full Name:</strong> ${fullNameInput.value}</li>
        <li class="list-group-item"><strong>Email:</strong> ${emailInput.value}</li>
        <li class="list-group-item"><strong>Telephone Number:</strong> ${phoneInput.value}</li>
        <li class="list-group-item"><strong>Date of Birth:</strong> ${dobInput.value}</li>
        <li class="list-group-item">
          <strong>Homepage URL:</strong>
          <a href="${urlInput.value}" target="_blank" rel="noopener">
            ${urlInput.value}
          </a>
        </li>
        <li class="list-group-item"><strong>Username:</strong> ${usernameInput.value || '(none)'}</li>
      </ul>

      <div class="d-flex justify-content-between">
        <button type="button" id="editBtn" class="btn btn-secondary">Edit</button>
        <button type="submit" id="confirmBtn" class="btn btn-primary">Confirm & Submit</button>
      </div>
    `;

    previewContainer.innerHTML = html;

    // Hide form fields (but not preview container)
    getFormChildrenExceptPreview().forEach(el => {
        el.style.display = "none";
    });

    previewContainer.style.display = "block";

    document.getElementById('editBtn').addEventListener('click', showEditMode);

    document.getElementById('confirmBtn').addEventListener('click', () => {
        const displayName = usernameInput.value.trim() || fullNameInput.value.trim();
        localStorage.setItem("displayName", displayName);
        form.submit();
    });
}

function showEditMode() {
    previewContainer.style.display = "none";
    getFormChildrenExceptPreview().forEach(el => {
        el.style.display = "";
    });
}

if (previewBtn) {
    previewBtn.addEventListener('click', showPreview);
}