export function initMealScript() {
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
        const specialTag = document.createElement("div");
        specialTag.classList.add("special-tag");
        specialTag.textContent = "+ $11.49";
        const mealSpecialImgParent = mealImgPath.parentElement;
        mealSpecialImgParent.style.position = "relative";
        mealSpecialImgParent.appendChild(specialTag);
      }

      // Append the newly created card to the container
      container.appendChild(card);
    });
  }

  renderMeals();
}
