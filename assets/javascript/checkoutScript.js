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

  // --- Hardcoded promo code and discount amount
  const PROMO_CODE = "SAVE10";
  const DISCOUNT_AMOUNT = 10.0;

  promoCodeLink.addEventListener("click", function (event) {
    event.preventDefault();

    const promoInput = document.createElement("input");
    promoInput.type = "text";
    promoInput.className = "promo-code-input form-control";
    promoInput.placeholder = "Enter Promo Code (Try SAVE10)";

    this.parentNode.replaceChild(promoInput, this);
    promoInput.focus();

    promoInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        const enteredCode = promoInput.value.trim();

        if (enteredCode === PROMO_CODE) {
          // Apply discount
          document.querySelector(
            ".discount-price"
          ).textContent = `-$${DISCOUNT_AMOUNT.toFixed(2)}`;

          const newTotal =
            parseFloat(subtotal) + 8.99 + 10.99 - DISCOUNT_AMOUNT;
          document.querySelector(
            ".total-price-sum"
          ).textContent = `$${newTotal.toFixed(2)}`;

          promoInput.disabled = true;
        } else {
          // Invalid code feedback
          promoInput.classList.add("is-invalid");
          promoInput.value = "";
          promoInput.placeholder = "Invalid Code";
        }
      }
    });
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
