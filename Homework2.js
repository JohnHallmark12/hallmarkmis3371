// Patient Intake Form Logic
// -------------------------
// This script handles:
// 1. Dynamic date range for DOB
// 2. Lowercasing and validation for User ID
// 3. Password validation (length, complexity, match, exclusions)
// 4. ZIP+4 truncation
// 5. Review display of all form values

document.addEventListener("DOMContentLoaded", function () {
  // Set DOB range: between 120 years ago and today
  const today = new Date();
  const maxDOB = today.toISOString().split('T')[0];
  const minDOB = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate()).toISOString().split('T')[0];

  const dobInput = document.getElementById('DOB');
  if (dobInput) {
    dobInput.setAttribute('min', minDOB);
    dobInput.setAttribute('max', maxDOB);
  }

  // Display today's date
  const dateTarget = document.getElementById('date-today');
  if (dateTarget) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateTarget.textContent = today.toLocaleDateString('en-US', options);
  }

  // Lowercase User ID on change
  const userID = document.getElementById('userID');
  if (userID) {
    userID.addEventListener('change', function () {
      this.value = this.value.toLowerCase();
    });
  }

  // Live field validation
  const fields = [
    { id: "fname", label: "First Name", pattern: /^[A-Za-z'-]{1,30}$/, required: true },
    { id: "minitial", label: "Middle Initial", pattern: /^[A-Za-z]?$/, required: false },
    { id: "lname", label: "Last Name", pattern: /^[A-Za-z'2-5-]{1,30}$/, required: true },
    { id: "DOB", label: "Date of Birth", pattern: /^\d{4}-\d{2}-\d{2}$/, required: true },
    { id: "ssn", label: "SSN", pattern: /^\d{3}-\d{2}-\d{4}$/, required: true },
    { id: "AddressLine1", label: "Address Line 1", pattern: /^.{2,30}$/, required: true },
    { id: "AddressLine2", label: "Address Line 2", pattern: /^.{2,30}$/, required: false },
    { id: "City", label: "City", pattern: /^.{2,30}$/, required: true },
    { id: "State", label: "State", pattern: /^.{2,}$/, required: true },
    { id: "ZipCode", label: "Zip Code", pattern: /^\d{5}(-\d{4})?$/, required: true },
    { id: "EmailAddress", label: "Email", pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, required: true },
    { id: "phone", label: "Phone", pattern: /^\d{3}-\d{3}-\d{4}$/, required: true },
    { id: "textbox", label: "Reason for Visit", pattern: /^.{0,500}$/, required: false },
    { id: "PainScale", label: "Pain Scale", pattern: /^[1-9]|10$/, required: false },
    { id: "userID", label: "User ID", pattern: /^[A-Za-z][A-Za-z0-9_-]{4,29}$/, required: true },
    { id: "password", label: "Password", pattern: /^.{8,30}$/, required: true },
    { id: "confirmPassword", label: "Re-enter Password", pattern: /^.{8,30}$/, required: true }
  ];

  fields.forEach(field => {
    const input = document.getElementById(field.id);
    const errorSpan = document.getElementById(`error-${field.id}`);
    if (input && errorSpan) {
      input.addEventListener("input", () => validateField(input, errorSpan, field));
      input.addEventListener("blur", () => validateField(input, errorSpan, field));
    }
  });

  // Review button
  const reviewBtn = document.getElementById('reviewBtn');
  if (reviewBtn) {
    reviewBtn.addEventListener('click', function () {
      let allValid = true;
      fields.forEach(field => {
        const input = document.getElementById(field.id);
        const errorSpan = document.getElementById(`error-${field.id}`);
        if (input && errorSpan) {
          validateField(input, errorSpan, field);
          if (errorSpan.textContent !== "") allValid = false;
        }
      });
      if (allValid && validatePasswords()) {
        reviewForm();
      }
    });
  }
});

// Field-level validation
function validateField(input, errorSpan, field) {
  const value = input.value.trim();

  if (field.required && value === "") {
    errorSpan.textContent = `${field.label} is required.`;
    return;
  }

  if (field.pattern && !field.pattern.test(value)) {
    errorSpan.textContent = `Invalid ${field.label} format.`;
    return;
  }

  if (field.id === "DOB") {
    const enteredDate = new Date(value);
    const today = new Date();
    if (enteredDate > today) {
      errorSpan.textContent = "Date cannot be in the future.";
      return;
    }
  }

  if (field.id === "confirmPassword") {
    const pw = document.getElementById("password").value;
    if (value !== pw) {
      errorSpan.textContent = "Passwords do not match.";
      return;
    }
  }

  errorSpan.textContent = "";
}

// Password validation logic
function validatePasswords() {
  const pw = document.getElementById('password').value;
  const confirm = document.getElementById('confirmPassword').value;
  const userID = document.getElementById('userID').value.toLowerCase();
  const fname = document.getElementById('fname').value.toLowerCase();
  const lname = document.getElementById('lname').value.toLowerCase();

  const errors = [];

  if (pw !== confirm) errors.push("Passwords do not match.");
  if (pw.length < 8 || pw.length > 30) errors.push("Password must be between 8 and 30 characters.");
  if (!/[A-Z]/.test(pw)) errors.push("Password must contain at least one uppercase letter.");
  if (!/[a-z]/.test(pw)) errors.push("Password must contain at least one lowercase letter.");
  if (!/\d/.test(pw)) errors.push("Password must contain at least one digit.");
  if (!/[!@#%^&*()\-_=+\\/><.,`~]/.test(pw)) errors.push("Password must contain at least one special character.");
  if (/["]/.test(pw)) errors.push("Password cannot contain double quotes.");
  if (pw.includes(userID) || pw.includes(fname) || pw.includes(lname)) {
    errors.push("Password cannot contain your user ID or name.");
  }

  if (errors.length > 0) {
    alert(errors.join("\n"));
    return false;
  }

  return true;
}

function updatePain(val) {
  document.getElementById("painDisplay").textContent = val;
} 

// Review display logic
function reviewForm() {
  const fields = [
    { id: "fname", label: "First Name" },
    { id: "minitial", label: "Middle Initial" },
    { id: "lname", label: "Last Name" },
    { id: "DOB", label: "Date of Birth" },
    { id: "ssn", label: "SSN" },
    { id: "AddressLine1", label: "Address Line 1" },
    { id: "AddressLine2", label: "Address Line 2" },
    { id: "City", label: "City" },
    { id: "State", label: "State" },
    { id: "EmailAddress", label: "Email" },
    { id: "phone", label: "Phone" },
    { id: "textbox", label: "Reason for Visit" },
    { id: "PainScale", label: "Pain Scale" },
    { id: "userID", label: "User ID" },
    { id: "password", label: "Password" }
  ];

  let reviewHTML = "<ul>";

  fields.forEach(field => {
    const el = document.getElementById(field.id);
    if (el && el.value) {
      let value = el.value;
      if (field.id === "ZipCode") {
        value = value.includes("-") ? value.split("-")[0] : value;
      }
      reviewHTML += `<li><strong>${field.label}:</strong> ${value}</li>`;
    }
  
  });



  // Gender radio buttons
  const gender = document.querySelector('input[name="Gender"]:checked');
  if (gender) {
    reviewHTML += `<li><strong>Gender:</strong> ${gender.value}</li>`;
  }

  // Other questions
  ["vaccinated", "insurance", "fluinfo"].forEach(name => {
    const val = document.querySelector(`input[name="${name}"]:checked`);
    if (val) {
      const label = name.charAt(0).toUpperCase() + name.slice(1);
      reviewHTML += `<li><strong>${label}:</strong> ${val.value}</li>`;
    }
  });

  // Medical history checkboxes
  const conditions = [];
  ["Mumps", "Asthma", "WhoopingCough", "Diabetes", "Shingles", "HBP"].forEach(id => {
    const box = document.getElementById(id);
    if (box && box.checked) conditions.push(box.value);
  });
  reviewHTML += `<li><strong>Medical History:</strong> ${conditions.join(", ") || "None"}</li>`;

  // ZIP truncation
  const zipInput = document.getElementById("ZipCode");
  if (zipInput && zipInput.value) {
    const zip = zipInput.value.trim();
    const truncatedZip = zip.includes("-") ? zip.split("-")[0] : zip;
    reviewHTML += `<li><strong>Zip Code:</strong> ${truncatedZip}</li>`;
  }
  document.getElementById("reviewContent").innerHTML = reviewHTML + "</ul>";

  
}

function validateField(input, errorSpan, field) {
  const value = input.value.trim();

  if (field.required && value === "") {
    errorSpan.textContent = `${field.label} is required.`;
    return;
  }

  if (field.pattern && !field.pattern.test(value)) {
    errorSpan.textContent = `Invalid ${field.label} format.`;
    return;
  }

  // Special case: Date of Birth cannot be in the future
  if (field.id === "DOB") {
    const enteredDate = new Date(value);
    const today = new Date();
    if (enteredDate > today) {
      errorSpan.textContent = "Date cannot be in the future.";
      return;
    }
  }

  // Special case: password match
  if (field.id === "confirmPassword") {
    const pw = document.getElementById("password").value;
    if (value !== pw) {
      errorSpan.textContent = "Passwords do not match.";
      return;
    }
  }

  errorSpan.textContent = "";
}

