 document.addEventListener("DOMContentLoaded", function () {
  const stateSelect = document.getElementById("State");
  if (!stateSelect) return;

  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL",
    "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME",
    "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH",
    "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI",
    "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI",
    "WY", "PR"
  ];

  // Clear existing options and add NULL initial value
  stateSelect.innerHTML = '<option value="">Select State</option>';

  states.forEach(code => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = code;
    stateSelect.appendChild(option);
  });
});
