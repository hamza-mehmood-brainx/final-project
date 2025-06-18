(function () {
  // function to find next monday
  function findUpcomingMonday(startDate) {
    const date = new Date(startDate);
    const currentDay = date.getDay();
    const offset = (8 - currentDay) % 7;
    date.setDate(date.getDate() + offset);
    return date;
  }

  // function to render 10 date options
  function renderDateOptions() {
    const dateWrapper = document.querySelector(".date-container");
    const deliveryDisplay = document.querySelector(".first-delivery-date");
    const templateElement = document.getElementById("date-template");

    let baseDate = new Date();
    let deliveryDate = findUpcomingMonday(baseDate);

    setInitialDeliveryDate(deliveryDisplay, deliveryDate);

    for (let count = 0; count < 10; count++) {
      const dateElement = buildDateBlock(
        templateElement,
        deliveryDate,
        count === 0
      );
      dateElement.addEventListener("click", () =>
        handleSelection(dateElement, deliveryDisplay)
      );
      dateWrapper.appendChild(dateElement);
      deliveryDate.setDate(deliveryDate.getDate() + 1);
    }
  }

  //  Update delivery date
  function setInitialDeliveryDate(targetSpan, date) {
    targetSpan.innerHTML = formatReadableDate(date);
  }

  // Creates a new date element based on the template
  function buildDateBlock(template, date, highlight) {
    const clone = template.content.cloneNode(true).firstElementChild;
    const dateLabel = clone.querySelector(".date-text-item");
    const popularTag = clone.querySelector(".popular-text");

    dateLabel.innerHTML = formatReadableDate(date);

    if (!highlight) {
      // popularTag.style.display = "none";
    } else {
      clone.classList.add("selected");
    }

    return clone;
  }

  // Handles the user clicking on a date block
  function handleSelection(selectedBlock, deliverySpan) {
    const allBlocks = document.querySelectorAll(".date-container .date-item");
    allBlocks.forEach((block) => {
      block.classList.remove("selected");
    });
    selectedBlock.classList.add("selected");

    const selectedText = selectedBlock.querySelector("span").innerHTML;
    deliverySpan.innerHTML = selectedText;
  }

  // Formats a date into a custom string format
  function formatReadableDate(date) {
    const options = { weekday: "long", day: "numeric", month: "short" };
    const formatted = new Intl.DateTimeFormat("en-US", options).format(date);
    const [weekday, day, month] = formatted.split(" ");
    return `<strong>${weekday}</strong> ${day} ${month}`;
  }

  // Start the date render
  renderDateOptions();
})();
