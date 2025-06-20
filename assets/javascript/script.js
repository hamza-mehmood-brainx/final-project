import { initMealScript } from "./mealScript.js";
import { initCheckoutFormValidation } from "./checkoutFormValidation.js";
import { initDateScript } from "./dateScript.js";

(function () {
  // Date Page Script
  initDateScript();
  // Meal Page Script
  initMealScript();
  //Checkout Form validation
  initCheckoutFormValidation();
})();
