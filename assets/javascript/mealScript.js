export function initMealScript() {
  let mealCart = [];
  let price = 0;
  let numOfSpecialMeals = 0;
  let specialMealPrice = 0;
  let subtotal = 0;

  // Fetch meals from json file
  async function fetchMeals() {
    try {
      const response = await fetch("assets/json/meals.json");
      if (!response.ok) {
        throw Error("Failed to fetch meals");
      }
      const data = await response.json();

      return data;
    } catch (e) {
      console.error("API Request fail", e);
    }
  }

  async function renderMeals() {
    const meals = await fetchMeals();

    const container = document.getElementById("meal-cards-container");
    const template = document.getElementById("meal-card-template");

    meals.forEach((meal) => {
      const card = template.content.cloneNode(true);

      // Populate meal details into card elements
      const mealImgPath = card.querySelector(".meal-image");
      const mealImgAltName = card.querySelector(".meal-image");
      const mealName = card.querySelector(".meal-name");
      const mealSpeciality = card.querySelector(".meal-speciality");
      const mealGluten = card.querySelector(".meal-gluten");
      const mealCalories = card.querySelector(".meal-calories");
      const mealCarbs = card.querySelector(".meal-carbs");
      const mealProtein = card.querySelector(".meal-protein");

      mealImgPath.src = meal.imagePath;
      mealImgAltName.alt = meal.name;
      mealName.textContent = meal.name;
      mealSpeciality.textContent = meal.speciality;
      mealGluten.textContent = meal.gluten;
      mealCalories.textContent = ` ${meal.calories}`;
      mealCarbs.textContent = ` ${meal.carbs}`;
      mealProtein.textContent = ` ${meal.protein}`;

      // Check if the meal is special and add special tag if necessary
      if (meal.specialMeal) {
        card.querySelector(".meal-info").classList.add("special-meal-div");
        const root = document.querySelector(":root");
        root.style.setProperty(
          "--special-div-background",
          `${meal?.specialColor}`
        );
        card.querySelector(".meal-info").style.backgroundColor =
          meal.specialColor;
        const specialTag = document
          .getElementById("special-tag-template")
          .content.cloneNode(true).firstElementChild;
        specialTag.classList.add("special-tag");
        specialTag.textContent = `+$${meal.extraPrice}`;
        const mealSpecialImgParent = mealImgPath.parentElement;
        mealSpecialImgParent.style.position = "relative";
        mealSpecialImgParent.appendChild(specialTag);
      }
      // Add meal to cart when 'Add to Cart' button is clicked
      card
        .querySelector(".add-btn")
        .addEventListener("click", () => addToCart(meal));

      // Append the newly created card to the container
      container.appendChild(card);
    });
  }

  renderMeals();

  // Fetch the meal count limit from local storage
  function getMealCountFromStorage() {
    const selectedMealCount = localStorage.getItem("selectedMealCount");
    if (selectedMealCount) {
      const match = selectedMealCount.match(/(\d+)\s*Meals/);
      if (match) {
        return parseInt(match[1], 10);
      }
    }
    return 0;
  }

  // Toggle visibility of order summary and shipping section based on the cart state
  function toggleOrderSummaryVisibilty() {
    const orderSummaryCart = document.querySelector(".order-summary-cart");
    const cartShipping = document.querySelector(".cart-shipping");
    if (mealCart.length > 0) {
      orderSummaryCart.classList.remove("hidden");
      cartShipping.classList.remove("hidden");
    } else {
      orderSummaryCart.classList.add("hidden");
      cartShipping.classList.add("hidden");
    }
  }

  //Helper function to disable/enable the meal add button
  function toggleDisableAddButton() {
    const mealCountLimit = getMealCountFromStorage();
    const addButtons = document.querySelectorAll(".add-btn");
    addButtons.forEach((button) => {
      if (mealCart.length === mealCountLimit) {
        button.setAttribute("disabled", "true");
        button.setAttribute("title", "Your cart is full");
      } else {
        button.removeAttribute("disabled");
        button.removeAttribute("title");
      }
    });
  }
  // Add meal to cart
  function updateCart(meal) {
    const mealCountLimit = getMealCountFromStorage();

    if (mealCart.length < mealCountLimit) {
      mealCart.push(meal);
      toggleOrderSummaryVisibilty();
      renderCart();
      calculatePrice();
    }

    const nextButton = document.querySelector(".next-btn-cart");
    const readyText = document.querySelector(".enter-msg-cart");

    if (mealCart.length === mealCountLimit) {
      nextButton.classList.remove("disabled");
      nextButton.removeAttribute("disabled");
      readyText.innerHTML = '<span id="meals-count-cart">Ready to go!</span>';
    } else {
      nextButton.classList.add("disabled");
      nextButton.setAttribute("disabled", "true");
      readyText.innerHTML =
        'Please add <span id="meals-count-cart">' +
        (mealCountLimit - mealCart.length) +
        " more" +
        "</span> meals.";
    }
    toggleDisableAddButton();
  }
  // Add to cart function
  function addToCart(meal) {
    updateCart(meal);
  }

  // Render cart meals
  function renderCart() {
    const cartContainer = document.querySelector(".meal-cards-added-cart");
    cartContainer.innerHTML = "";
    mealCart.forEach((meal, index) => {
      const clone = createMealCard(meal, index);
      cartContainer.appendChild(clone);
    });
    const countSpan = document.querySelector(".cart-item-count");
    countSpan.textContent = mealCart.length;
    updateOrderSummary();
  }

  // Remove meals from cart
  function removeFromCart(index) {
    const mealCountLimit = getMealCountFromStorage();
    mealCart.splice(index, 1);
    toggleOrderSummaryVisibilty();
    renderCart();
    calculatePrice();

    const nextButton = document.querySelector(".next-btn-cart");
    const readyText = document.querySelector(".enter-msg-cart");

    nextButton.classList.toggle("disabled", mealCart.length !== mealCountLimit);
    if (mealCart.length === mealCountLimit) {
      nextButton.removeAttribute("disabled");
    } else {
      nextButton.setAttribute("disabled", "true");
    }

    toggleDisableAddButton();

    readyText.innerHTML =
      'Please add <span id="meals-count-cart">' +
      (mealCountLimit - mealCart.length) +
      " more" +
      "</span> meals.";
  }

  function createMealCard(meal, index) {
    const template = document.getElementById("selected-meal-template");
    const card = template.content.cloneNode(true).firstElementChild;

    card.querySelector(".cart-meal-img").src = meal.imagePath;
    card.querySelector(".cart-meal-img").alt = meal.name;
    card.querySelector(".cart-meal-name").textContent = meal.name;

    card.querySelector(".meal-minus").dataset.index = index;
    card.querySelector(".meal-plus").dataset.index = index;

    card
      .querySelector(".meal-minus")
      .addEventListener("click", () => removeFromCart(index));
    card
      .querySelector(".meal-plus")
      .addEventListener("click", () => updateCart(meal, true));

    if (meal.specialMeal) {
      const specialTag = document
        .getElementById("special-tag-template")
        .content.cloneNode(true).firstElementChild;
      specialTag.classList.add("special-tag-cart");
      specialTag.textContent = `+$${meal.extraPrice}`;

      const mealImgParent = card.querySelector(".cart-meal-img").parentElement;
      mealImgParent.style.position = "relative";
      mealImgParent.appendChild(specialTag);

      card.querySelector(".cart-meal-card").classList.add("special-bacground");
    }

    return card;
  }

  // Update order summary based on selected meals
  function updateOrderSummary() {
    const mealCount = getMealCountFromStorage();

    document.querySelector(
      ".order-cart-meal-count"
    ).textContent = `${mealCart.length} Meals`;

    const mealsCountCart = document.getElementById("meals-count-cart");
    if (mealsCountCart) {
      mealsCountCart.textContent = `${mealCount} items`;
    }
  }

  // Calculate total price of meals in the cart
  function calculatePrice() {
    price = 0;
    numOfSpecialMeals = 0;
    specialMealPrice = 0;
    mealCart.forEach((meal) => {
      price += meal.price;
      if (meal.specialMeal) {
        numOfSpecialMeals++;
        specialMealPrice += meal?.extraPrice;
      }
    });
    subtotal = (price + specialMealPrice).toFixed(2);

    document.getElementById(
      "subtotal-order-price"
    ).textContent = `$${subtotal}`;
    if (numOfSpecialMeals > 0) {
      document.getElementById(
        "meals-sum-price"
      ).textContent = `$${price} + $${specialMealPrice.toFixed(2)}`;
    } else {
      document.getElementById("meals-sum-price").textContent = `$${price}`;
    }
    document.getElementById("subtotal-cart-price").textContent = `$${subtotal}`;
  }

  // ------------------------------ Cart and Checkout Actions ------------------------------
  // Clear all items in the cart
  function clearCart() {
    mealCart = [];
    document.querySelector(".meal-cards-added-cart").innerHTML = "";
    const countSpan = document.querySelector(".cart-item-count");
    countSpan.textContent = mealCart.length;
    const nextButton = document.querySelector(".next-btn-cart");
    const readyText = document.querySelector(".enter-msg-cart");

    const mealCountLimit = getMealCountFromStorage();

    if (mealCart.length === mealCountLimit) {
      nextButton.classList.remove("disabled");
      nextButton.removeAttribute("disabled");
      readyText.innerHTML = '<span id="meals-count-cart">Ready to go!</span>';
    } else {
      nextButton.classList.add("disabled");
      nextButton.setAttribute("disabled", "true");

      readyText.innerHTML =
        'Please add <span id="meals-count-cart">' +
        (mealCountLimit - mealCart.length) +
        "" +
        "</span> meals to continue.";
    }
    toggleDisableAddButton();
    calculatePrice();
    toggleOrderSummaryVisibilty();
  }

  // ------------------------------ Event Listener ------------------------------
  document
    .querySelector(".clear-all")
    .addEventListener("click", () => clearCart());

  // Function to display the cart and expand the cart section
  function showCart() {
    const cartItemsContainer = document.querySelector(".cart-items-container");
    const addToCartContainer = document.querySelector(".add-to-cart-container");

    if (cartItemsContainer.classList.contains("hide")) {
      cartItemsContainer.classList.remove("hide");
      cartItemsContainer.classList.add("show");
      addToCartContainer.classList.add("expanded");
      addToCartContainer.classList.remove("collapsed");
    }
  }

  // Function to hide the cart and collapse the cart section
  function hideCart() {
    const cartItemsContainer = document.querySelector(".cart-items-container");
    const addToCartContainer = document.querySelector(".add-to-cart-container");

    if (cartItemsContainer.classList.contains("show")) {
      cartItemsContainer.classList.remove("show");
      cartItemsContainer.classList.add("hide");
      addToCartContainer.classList.add("collapsed");
      addToCartContainer.classList.remove("expanded");
    }
  }

  // Function to toggle cart visibility on cart icon click
  function toggleCart() {
    const cartItemsContainer = document.querySelector(".cart-items-container");

    if (cartItemsContainer.classList.contains("show")) {
      hideCart();
    } else {
      showCart();
    }
  }

  // Add click event listener to the cart icon to toggle cart visibility
  const cartIcon = document.querySelector(".cart-icon-container");
  cartIcon.addEventListener("click", toggleCart);

  // Add click event listener to the cart down arrow to hide the cart when clicked in mobile screen
  const cartDownArrow = document.querySelector(".cart-down-arrow");
  cartDownArrow.addEventListener("click", hideCart);

  // Add click event listener to the "Next" button for delivery and update cart message
  document
    .querySelector(".next-button-delivery")
    .addEventListener("click", () => cartMessage());

  // Function to display the cart message with the number of meals in the cart
  function cartMessage() {
    let message = getMealCountFromStorage() + " items";
    const readyText = document.querySelector(".enter-msg-cart");
    readyText.innerHTML =
      'Please add total <span id="meals-count-cart">' +
      message +
      "" +
      "</span> to continue.";
  }
}
