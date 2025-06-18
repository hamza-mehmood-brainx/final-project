jQuery(function () {
  const stepOrder = ["plan-step", "day-step", "meals-step", "checkout-step"];

  //   Local storage function
  const storage = {
    set: (key, value) => localStorage.setItem(key, value),
    get: (key) => localStorage.getItem(key),
  };

  // Toggle section and header visibility based on current step
  function navigateToStep(stepKey) {
    $("section").removeClass("active");
    $(`section[data-step="${stepKey}"]`).addClass("active");

    $(".header-list").removeClass("active");
    $(`.header-list[data-step-target="${stepKey}"]`).addClass("active");

    const activeIndex = stepOrder.indexOf(stepKey);
    stepOrder.forEach((step, index) => {
      if (index <= activeIndex) {
        $(`.header-list[data-step-target="${step}"]`).addClass("previous");
      }
    });
  }

  //  Plan Selection
  function initPlanSelection() {
    $(".plan-meals-card").on("click", function () {
      const mealCount = $(this).find(".meal-count").text().trim();

      storage.set("selectedMealCount", mealCount);
      storage.set("currentStep", "day-step");

      navigateToStep("day-step");
    });
  }

  //Delievry Day Selection
  function initDateSelection() {
    $(".next-button-delivery").on("click", function () {
      const selectedDate = $(".date-container .selected")
        .find("span")
        .first()
        .text()
        .trim();
      console.log("Selected Date:", selectedDate);
      storage.set("selectedDay", selectedDate);
      storage.set("currentStep", "meals-step");
      navigateToStep("meals-step");
    });
  }

  // Allow backward step navigation from header
  function enableStepHeaderNavigation() {
    $(".header-list").on("click", function () {
      const target = $(this).data("step-target");
      const current = storage.get("currentStep") || "plan-step";
      console.log("Navigate");
      if (stepOrder.indexOf(target) <= stepOrder.indexOf(current)) {
        navigateToStep(target);
      }
    });
  }

  // Initialization
  function initializeFlow() {
    const initialStep = "plan-step";
    storage.set("currentStep", initialStep);
    navigateToStep(initialStep);

    initPlanSelection();
    enableStepHeaderNavigation();
  }

  initializeFlow();
  initDateSelection();
});
