export function initCheckoutScript(subtotal, mealCart) {
  // Proceed to checkout and calculate final price
  function checkoutMealPrice(subtotal) {
    const mealSum = document.querySelector(".meals-price-sum");
    mealSum.innerHTML = "$" + subtotal;

    const totalCheckoutCost = document.querySelector(".total-price-sum");
    const cost = parseFloat(subtotal) + 8.99 + 10.99;
    console.log("Coset is", cost);
    totalCheckoutCost.innerHTML = "$" + cost.toFixed(2);
  }

  checkoutMealPrice(subtotal);

  // Add event listener to the promo code
  const promoCodeLink = document.querySelector(".promo-code-link");
  const promoCodeContainer = document.querySelector(".promo-code-container");
  const promoTemplate = document.getElementById("promo-code-template");
  const discountContainer = document.getElementById("discount-container");
  const discountPrice = document.querySelector(".discount-price");
  const totalPrice = document.querySelector(".total-price-sum");

  discountContainer.classList.add("d-none");

  // --- Hardcoded promo code and discount amount
  const PROMO_CODE = "SAVE10";
  const DISCOUNT_AMOUNT = 10.0;

  promoCodeLink.addEventListener("click", function (e) {
    e.preventDefault();

    // Clone and insert the template
    const promoNode = promoTemplate.content.cloneNode(true);
    promoCodeContainer.innerHTML = ""; // Clear "+ Add Promo Code" link
    promoCodeContainer.appendChild(promoNode);

    // Attach events to new elements
    const promoInput = promoCodeContainer.querySelector(".promo-code-input");
    const applyBtn = promoCodeContainer.querySelector(".apply-promo-btn");
    const clearBtn = promoCodeContainer.querySelector(".clear-promo-btn");

    applyBtn.addEventListener("click", function () {
      const enteredCode = promoInput.value.trim();

      if (enteredCode === PROMO_CODE) {
        discountPrice.textContent = `-$${DISCOUNT_AMOUNT.toFixed(2)}`;
        discountContainer.classList.remove("d-none");

        updateTotal(subtotal, DISCOUNT_AMOUNT);
        promoInput.disabled = true;
        applyBtn.disabled = true;
        clearBtn.classList.remove("d-none");
      } else {
        promoInput.classList.add("is-invalid");
        promoInput.value = "";
        promoInput.placeholder = "Invalid Code";
      }
    });

    clearBtn.addEventListener("click", function () {
      // Reset state
      promoInput.disabled = false;
      applyBtn.disabled = false;
      promoInput.value = "";
      promoInput.placeholder = "Enter Promo Code";
      promoInput.classList.remove("is-invalid");
      clearBtn.classList.add("d-none");

      discountPrice.textContent = `-$0.00`;
      discountContainer.classList.add("d-none");

      updateTotal(subtotal);
    });
  });

  function updateTotal(subtotal, discount = 0) {
    console.log(discount);
    const total = parseFloat(subtotal) + 8.99 + 10.99 - discount;
    totalPrice.textContent = `$${total.toFixed(2)}`;
  }

  document.getElementById("change-zip").addEventListener("click", function (e) {
    e.preventDefault();

    const zipInput = document.getElementById("zip");
    zipInput.value = "";
    zipInput.focus();
  });

  function renderMealSummary(mealCart) {
    const summaryMealCardContainer =
      document.querySelector(".summary-meal-card");
    summaryMealCardContainer.innerHTML = "";

    const template = document.getElementById(
      "order-summary-meal-template"
    ).content;
    const mealSummary = {};

    mealCart.forEach((meal) => {
      if (mealSummary[meal.name]) {
        mealSummary[meal.name].count += 1;
      } else {
        mealSummary[meal.name] = { ...meal, count: 1 };
      }
    });

    Object.values(mealSummary).forEach((meal) => {
      const mealCard = template.cloneNode(true);

      mealCard.querySelector(".count-same-meal-added").textContent = meal.count;
      mealCard.querySelector(".order-meal-summary-img").src = meal.imagePath;
      mealCard.querySelector(".order-summary-meal-name").textContent =
        meal.name;
      mealCard.querySelector(".summary-order-speciality").textContent =
        meal.speciality;

      if (meal.specialMeal) {
        mealCard.querySelector(
          ".order-summary-meal-card"
        ).style.backgroundColor = meal.specialColor;
        mealCard.querySelector(".order-summary-meal-card").style.color =
          "#FFFFFF";
        const specialTag = document.createElement("div");
        specialTag.classList.add("special-summary-tag");
        specialTag.textContent = `+$${meal.extraPrice}`;

        const mealImgParent = mealCard.querySelector(
          ".order-meal-summary-img"
        ).parentElement;
        mealImgParent.style.position = "relative";
        mealImgParent.appendChild(specialTag);

        mealCard
          .querySelector(".order-summary-meal-card")
          .classList.add("special-meal");
      }

      summaryMealCardContainer.appendChild(mealCard);
    });
  }

  renderMealSummary(mealCart);
}
