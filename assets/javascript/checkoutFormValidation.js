export function initCheckoutFormValidation() {
  (function () {
    const form = document.getElementById("userForm");
    const submitBtn = document.getElementById("submitBtn");
    const fields = {
      fname: document.getElementById("fname"),
      lname: document.getElementById("lname"),
      age: document.getElementById("age"),
      emails: document.getElementById("emails"),
      pwd: document.getElementById("pwd"),
      cpwd: document.getElementById("cpwd"),
      contact: document.getElementById("contact"),
    };
    const fieldValidity = {};

    // Email Validation
    function validateEmailList(emailStr) {
      const emails = emailStr.split(",").map((e) => e.trim());
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emails.every((email) => emailRegex.test(email));
    }
    // Password Validation
    function validatePassword(pwd) {
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return regex.test(pwd);
    }
    // Validate field
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
    // Validating single field
    function validateSingleField(fieldEl) {
      const id = fieldEl.id;
      const oldValidity = fieldValidity[id] || false;
      let valid = true;
      try {
        switch (id) {
          case "fname":
          case "lname":
            valid = fieldEl.value.trim() !== "";
            if (!valid) {
              validateField(fieldEl, valid);
              break;
            }
            const regex = /^[A-Za-z]+$/;
            if (valid) {
              valid = regex.test(fieldEl.value);
            }
            validateField(fieldEl, valid, "Name must contain only letters.");
            break;

          case "age":
            const age = parseInt(fieldEl.value, 10);
            valid = age >= 18 && age <= 151;
            validateField(fieldEl, valid, "Age must be between 18 and 151.");
            break;

          case "emails":
            valid =
              fieldEl.value.trim() !== "" && validateEmailList(fieldEl.value);
            validateField(
              fieldEl,
              valid,
              "Please enter valid comma-separated email addresses."
            );
            break;

          case "pwd":
            valid = validatePassword(fieldEl.value);
            validateField(
              fieldEl,
              valid,
              "Password must be at least 8 characters, contain an uppercase, lowercase, a number and a special character."
            );
            validateSingleField(fields.cpwd);
            break;

          case "cpwd":
            valid = fieldEl.value === fields.pwd.value && fieldEl.value !== "";
            validateField(fieldEl, valid, "Passwords do not match.");
            break;

          case "contact":
            valid = fieldEl.value.trim() >= 0;
            if (!valid) {
              validateField(
                fieldEl,
                valid,
                "Contact number cannot be negative."
              );
              break;
            }
            valid = /^[0-9]{11}$/.test(fieldEl.value.trim());
            validateField(
              fieldEl,
              valid,
              "Contact number must be exactly 11 digits."
            );
            break;
        }
      } catch (err) {
        console.error(`Validation error in field "${id}":`, err);
      }

      // Setting current field validity
      fieldValidity[id] = fieldEl.classList.contains("is-valid");
      if (oldValidity !== fieldValidity[id]) {
        // Only Validate button if field validity changes
        validateSubmitButton();
      }
    }
    // Submit Button Validation
    function validateSubmitButton() {
      const allValid = Object.values(fields).every((field) =>
        field.classList.contains("is-valid")
      );
      submitBtn.disabled = !allValid;
    }

    // Validate Whole Form
    function validateForm() {
      Object.values(fields).forEach((field) => validateSingleField(field));
    }
    // Adding EventListener to all fields
    Object.values(fields).forEach((field) => {
      field.addEventListener("input", () => validateSingleField(field));
      field.addEventListener("blur", () => validateSingleField(field));
    });

    // Form submission
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      validateForm();
      if (!submitBtn.disabled) {
        alert("Form submitted successfully!");
        form.reset();
      }
    });
  })();
}
