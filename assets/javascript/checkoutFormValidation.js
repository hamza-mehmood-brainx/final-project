export function initCheckoutFormValidation() {
  (function () {
    const form = document.getElementById("userForm");
    const submitBtn = document.getElementById("checkout-btn");

    const fields = {
      fname: document.getElementById("fname"),
      lname: document.getElementById("lname"),
      fullName: document.getElementById("fullName"),
      fullName1: document.getElementById("fullName1"),
      address1: document.querySelector("[name='first-address-name']"),
      city: document.getElementById("city"),
      state: document.getElementById("state"),
      zip: document.getElementById("zip"),
      contact: document.getElementById("contact"),
      emails: document.getElementById("emails"),
    };

    const fieldValidity = {};

    function validateEmail(email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) return false;

      const domain = email.split("@")[1];
      const domainParts = domain.split(".");

      // Check if last two parts are same (like com.com or net.net)
      const len = domainParts.length;
      if (len >= 2 && domainParts[len - 1] === domainParts[len - 2]) {
        return false;
      }

      return true;
    }

    function validateField(field, isValid, message = "") {
      if (isValid) {
        field.classList.remove("is-invalid");
        field.classList.add("is-valid");
      } else {
        field.classList.add("is-invalid");
        field.classList.remove("is-valid");
        if (message) {
          field.nextElementSibling.textContent = message;
        }
      }
    }

    function resetOrderSummary() {
      // Clear numeric values
      document.querySelector(".meals-price-sum").textContent = "$0";
      document.querySelector(".shipping-price-sum").textContent = "$0";
      document.querySelector(".tax-price-sum").textContent = "$0";
      document.querySelector(".discount-price").textContent = "$0";
      document.querySelector(".total-price-sum").textContent = "$0";

      // Clear delivery date
      document.getElementById("delivery-day-value").textContent = "";

      // Clear meals card section
      document.querySelector(".summary-meal-card").innerHTML = "";
    }

    function validateSingleField(fieldEl) {
      const id = fieldEl.id || fieldEl.name;
      const oldValidity = fieldValidity[id] || false;
      let valid = true;

      try {
        switch (id) {
          case "fname":
          case "lname":
          case "fullName":
          case "fullName1":
            valid =
              fieldEl.value.trim() !== "" &&
              /^[A-Za-z\s]+$/.test(fieldEl.value);
            validateField(
              fieldEl,
              valid,
              "This field is required and must contain only letters."
            );
            break;

          case "first-address-name":
          case "address1":
            valid = fieldEl.value.trim() !== "";
            validateField(fieldEl, valid, "Address Line 1 is required.");
            break;

          case "city":
          case "state":
            valid = fieldEl.value.trim() !== "";
            if (!valid)
              validateField(fieldEl, valid, "This field is required.");
            valid = /^[A-Za-z . ,'-]+$/.test(fieldEl.value);
            validateField(fieldEl, valid, "Enter valid name");

            break;

          case "zip":
            valid = /^[0-9]{5}$/.test(fieldEl.value.trim());
            validateField(fieldEl, valid, "ZIP must be a 5-digit number.");
            break;

          case "contact":
            valid = /^[0-9]{11}$/.test(fieldEl.value.trim());
            validateField(
              fieldEl,
              valid,
              "Contact number must be exactly 11 digits."
            );
            break;

          case "emails":
            valid = validateEmail(fieldEl.value.trim());
            validateField(
              fieldEl,
              valid,
              "Please enter a valid email address."
            );
            break;

          default:
            break;
        }
      } catch (err) {
        console.error(`Validation error in field "${id}":`, err);
      }

      fieldValidity[id] = fieldEl.classList.contains("is-valid");
      if (oldValidity !== fieldValidity[id]) {
        validateSubmitButton();
      }
    }

    function validateSubmitButton() {
      const allValid = Object.values(fields).every((field) =>
        field.classList.contains("is-valid")
      );
      submitBtn.disabled = !allValid;
    }

    function validateForm() {
      Object.values(fields).forEach((field) => validateSingleField(field));
    }

    Object.values(fields).forEach((field) => {
      field.addEventListener("input", () => validateSingleField(field));
      field.addEventListener("blur", () => validateSingleField(field));
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      validateForm();
      if (!submitBtn.disabled) {
        alert("Form submitted successfully!");
        localStorage.clear();
        resetOrderSummary();
        form.reset();
        Object.values(fields).forEach((field) => {
          field.classList.remove("is-valid", "is-invalid");
        });
        submitBtn.disabled = true;
      }
    });
  })();
}
