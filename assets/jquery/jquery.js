jQuery(function () {
  const STEP_KEYS = {
    PLAN: "plan-step",
    DAY: "day-step",
    MEALS: "meals-step",
    CHECKOUT: "checkout-step",
  };
  const stepOrder = [
    STEP_KEYS.PLAN,
    STEP_KEYS.DAY,
    STEP_KEYS.MEALS,
    STEP_KEYS.CHECKOUT,
  ];
  const $sections = $("section");
  const $headerLists = $(".header-list");

  //   Local storage function
  const storage = {
    set: (key, value) => localStorage.setItem(key, value),
    get: (key) => localStorage.getItem(key),
  };

  /**
   * Navigates to a specific step by updating UI and header state.
   * @param {string} stepKey - The step identifier to navigate to.
   */
  function navigateToStep(stepKey) {
    $sections.removeClass("active");
    $sections.filter(`[data-step="${stepKey}"]`).addClass("active");

    $headerLists.removeClass("active");
    $headerLists.filter(`[data-step-target="${stepKey}"]`).addClass("active");

    const activeIndex = stepOrder.indexOf(stepKey);
    stepOrder.forEach((step, index) => {
      if (index <= activeIndex) {
        $headerLists
          .filter(`[data-step-target="${step}"]`)
          .addClass("previous");
      }
    });
  }

  /**
   * Initializes meal plan selection and stores selected count in localStorage.
   */
  function initPlanSelection() {
    $(".plan-meals-card").on("click", function () {
      const mealCount = $(this).find(".meal-count").text().trim();
      if (!mealCount) {
        alert("Please select a meal plan.");
        return;
      }
      try {
        storage.set("selectedMealCount", mealCount);
        storage.set("currentStep", STEP_KEYS.DAY);
      } catch (e) {
        console.log("Error in localStorage APi", e);
      }

      navigateToStep("day-step");
    });
  }

  /**
   * Handles date selection and navigation to the next step.
   */
  function initDateSelection() {
    $(".next-button-delivery").on("click", function () {
      const selectedDate = $(".date-container .selected")
        .find("span")
        .first()
        .text()
        .trim();
      if (!selectedDate) {
        alert("Please select a delivery date.");
        return;
      }
      try {
        storage.set("selectedDay", selectedDate);
        storage.set("currentStep", STEP_KEYS.MEALS);
      } catch (e) {
        console.log("Error in localStorage APi", e);
      }

      navigateToStep("meals-step");
    });
  }

  /**
   * Enables backward navigation through the header steps based on current progress.
   */
  function enableStepHeaderNavigation() {
    $(".header-list").on("click", function () {
      const target = $(this).data("step-target");
      try {
        const current = storage.get("currentStep") || STEP_KEYS.PLAN;
      } catch (e) {
        console.log("Error in localStorage APi", e);
      }
      console.log("Navigate");
      if (stepOrder.indexOf(target) <= stepOrder.indexOf(current)) {
        navigateToStep(target);
      }
    });
  }

  /**
   * Initializes the form by setting up the first step and event handlers.
   */
  function initializeFlow() {
    const initialStep = STEP_KEYS.PLAN;
    try {
      storage.set("currentStep", initialStep);
    } catch (e) {
      console.log("Error in localStorage APi", e);
    }
    navigateToStep(initialStep);

    initPlanSelection();
    enableStepHeaderNavigation();
  }

  initializeFlow();
  initDateSelection();
});
