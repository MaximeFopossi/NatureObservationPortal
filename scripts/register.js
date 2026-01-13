// GRAB FORM ELEMENTS
// select the form and all input elements to validate.
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
const previewContainer = document.getElementById('previewContainer');                   // Container used for preview mode
if (!form) {                                                                            // Ensure the form exists on this page
    console.error('register.js: #register form not found.');
}

// BOOTSTRAP VALIDATION HELPERS
// // Finds the .invalid-feedback element associated with an input.
// Bootstrap usually places this inside the same .mb-3 wrapper.
function getInvalidFeedback(input) {
    const parent = input.closest('.mb-3') || input.parentElement;                       
    if (!parent) return null;
    return parent.querySelector('.invalid-feedback');
}

// Resets validation state: removes green/red borders and messages
function resetFeedback(input) {
    input.classList.remove('is-valid', 'is-invalid');
    const feedback = getInvalidFeedback(input);
    if (feedback) feedback.textContent = '';
}

// Marks an input as invalid and shows an error message
function setError(input, message) {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    const feedback = getInvalidFeedback(input);
    if (feedback) feedback.textContent = message;
}

// Marks an input as valid (green border) and clears errors
function setSuccess(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    const feedback = getInvalidFeedback(input);
    if (feedback) feedback.textContent = ''; 
}

// FIELD VALIDATORS
// Each function validates one field and returns true/false
function validateFullName() {
    const v = fullNameInput.value.trim();
    const re = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+,\s*[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;                          // Full name must follow "Lastname, Firstname"
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

// Standard email validation using regex
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
    const re = /^\+\d{1,3}([ -]?\d{2,5}){2,}$/;                         // International phone number validation,  Example formats: +49 1526 123456 
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
    const v = dobInput.value;                                       // Date of birth validation + age check (type="date" => "YYYY-MM-DD" ) 
    if (!v) {
        setError(dobInput, 'Date of birth is required.');
        return false;
    }
    const dob = new Date(v + 'T00:00:00');
    if (isNaN(dob.getTime())) {
        setError(dobInput, 'Please pick a valid date.');
        return false;
    }
    // User must be at least 18 years old
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
    const re = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;                         // Homepage URL must be a valid http/https URL
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

function validateUsername() {                                              // Username is optional, but must match rules if provided
    const v = usernameInput.value.trim();
    // Optional field: empty is allowed
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

// Password must be at least 8 characters
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

// Confirmation password must match the original password
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

// VALIDATE ENTIRE FORM
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
    // Enable/disable preview and submit buttons based on overall validity
    if (previewBtn) previewBtn.disabled = !allValid;
    if (submitBtn) submitBtn.disabled = !allValid;
    return allValid;
}

// LIVE VALIDATION EVENTS
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
    // Validate on input (live typing)
    input.addEventListener('input', () => {
        fn();
        validateForm();
    });
    // Validate again on blur (leaving field)
    input.addEventListener('blur', () => {
        fn();
        validateForm();
    });
});

// FORM SUBMISSION GUARD
form.addEventListener('submit', (e) => {
    if (!validateForm()) {
        // Prevent submission if form is invalid
        e.preventDefault();
        // Focus and scroll to the first invalid field
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) {
            firstInvalid.focus();
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    } else {
        // If user submits directly (without preview), still store displayName
        // Store display name in localStorage for later use
        const displayName = usernameInput.value.trim() || fullNameInput.value.trim();
        localStorage.setItem("displayName", displayName);
    }
});

console.log('Bootstrap validation ready');
// PREVIEW MODE HANDLER
// Returns all form children except the preview container
function getFormChildrenExceptPreview() {
    return Array.from(form.children).filter(el => el !== previewContainer);
}

// Show preview of entered data
// Shows a preview of the entered data before final submission
function showPreview() {
    if (!validateForm()) {
        alert("Please fix the errors before previewing.");
        return;
    }
    // Build preview HTML dynamically
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

    // Hide all other form elements
    // Show only the preview container
    getFormChildrenExceptPreview().forEach(el => {
        el.style.display = "none";
    });
    previewContainer.style.display = "block";
    // Attach event listeners to Edit and Confirm buttons
    // Switch back to edit mode
    document.getElementById('editBtn').addEventListener('click', showEditMode);
    document.getElementById('confirmBtn').addEventListener('click', () => {                     // On confirm, submit the form
        const displayName = usernameInput.value.trim() || fullNameInput.value.trim();
        localStorage.setItem("displayName", displayName);
        form.submit();
    });
}

// Switch back to edit mode from preview
function showEditMode() {
    previewContainer.style.display = "none";
    getFormChildrenExceptPreview().forEach(el => {
        el.style.display = "";
    });
}

if (previewBtn) {
    previewBtn.addEventListener('click', showPreview);
}