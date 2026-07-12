/* =========================================================
   TEMPFLOW SCRIPT
   Simple, beginner-friendly vanilla JavaScript.
   No classes, no modules — just plain functions and variables.
   ========================================================= */

/* ----- Grab the elements we need from the page ----- */
var tempInput = document.getElementById("tempInput");
var errorMessage = document.getElementById("errorMessage");

var fromUnitButtons = document.querySelectorAll("#fromUnitButtons .unit-btn");
var toUnitButtons = document.querySelectorAll("#toUnitButtons .unit-btn");

var resultPanel = document.getElementById("resultPanel");
var resultValue = document.getElementById("resultValue");
var resultSource = document.getElementById("resultSource");

var tempOrb = document.getElementById("tempOrb");
var orbValue = document.getElementById("orbValue");
var orbMood = document.getElementById("orbMood");

var convertBtn = document.getElementById("convertBtn");
var resetBtn = document.getElementById("resetBtn");
var swapBtn = document.getElementById("swapBtn");

var quickChips = document.querySelectorAll(".quick-chip");

/* ----- Simple state variables (kept easy to read) ----- */
var currentFromUnit = "C";
var currentToUnit = "F";
var hasValidResult = false; // true after a successful conversion, used for live recalculation

/* =========================================================
   HELPER FUNCTIONS
   ========================================================= */

/* Returns the correct symbol text for a given unit letter */
function getUnitSymbol(unit) {
  if (unit === "C") return "°C";
  if (unit === "F") return "°F";
  return "K";
}

/* Converts any unit value into Celsius first (makes conversion logic simple) */
function toCelsius(value, unit) {
  if (unit === "C") {
    return value;
  } else if (unit === "F") {
    return (value - 32) * (5 / 9);
  } else {
    // Kelvin
    return value - 273.15;
  }
}

/* Converts a Celsius value into the target unit */
function fromCelsius(celsiusValue, unit) {
  if (unit === "C") {
    return celsiusValue;
  } else if (unit === "F") {
    return (celsiusValue * 9 / 5) + 32;
  } else {
    // Kelvin
    return celsiusValue + 273.15;
  }
}

/* Main conversion function: converts a value from one unit to another */
function convertTemperature(value, fromUnit, toUnit) {
  var celsiusValue = toCelsius(value, fromUnit);
  return fromCelsius(celsiusValue, toUnit);
}

/* Rounds a number to a maximum of 2 decimal places and removes trailing zeros */
function roundResult(num) {
  var rounded = Math.round(num * 100) / 100;
  return rounded;
}

/* Checks the entered value for problems. Returns an error message string,
   or an empty string "" if everything is valid. */
function validateInput(rawValue, unit) {
  if (rawValue.trim() === "") {
    return "Please enter a temperature value.";
  }

  var value = Number(rawValue);

  if (isNaN(value)) {
    return "Please enter a valid number.";
  }

  if (unit === "K" && value < 0) {
    return "Kelvin cannot be below 0 K.";
  }

  if (unit === "C" && value < -273.15) {
    return "Temperature cannot be below absolute zero.";
  }

  if (unit === "F" && value < -459.67) {
    return "Temperature cannot be below absolute zero.";
  }

  return "";
}

/* Works out a simple "mood" label based on the Celsius equivalent,
   so the mood stays consistent no matter which unit is shown. */
function getMood(celsiusValue) {
  if (celsiusValue < 0) {
    return "Freezing";
  } else if (celsiusValue < 15) {
    return "Chilly";
  } else if (celsiusValue < 25) {
    return "Comfortable";
  } else if (celsiusValue < 35) {
    return "Warm";
  } else {
    return "Hot";
  }
}

/* Works out which CSS class name to use for the orb / result colors */
function getMoodClass(celsiusValue) {
  if (celsiusValue < 10) {
    return "mood-cold";
  } else if (celsiusValue < 25) {
    return "mood-moderate";
  } else if (celsiusValue < 35) {
    return "mood-warm";
  } else {
    return "mood-hot";
  }
}

/* ----- Error message helpers ----- */
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add("has-error");
}

function clearError() {
  errorMessage.textContent = "";
  errorMessage.classList.remove("has-error");
}

/* ----- Updates the active state of a group of unit buttons ----- */
function setActiveUnitButton(buttonList, unit) {
  for (var i = 0; i < buttonList.length; i++) {
    if (buttonList[i].getAttribute("data-unit") === unit) {
      buttonList[i].classList.add("active");
    } else {
      buttonList[i].classList.remove("active");
    }
  }
}

/* Removes all mood classes from an element */
function clearMoodClasses(element) {
  element.classList.remove("mood-cold", "mood-moderate", "mood-warm", "mood-hot");
}

/* ----- Updates the result panel and the temperature orb ----- */
function updateResult(fromValue, fromUnit, toUnit) {
  var converted = convertTemperature(fromValue, fromUnit, toUnit);
  var roundedResult = roundResult(converted);
  var celsiusEquivalent = toCelsius(converted, toUnit);

  var mood = getMood(celsiusEquivalent);
  var moodClass = getMoodClass(celsiusEquivalent);

  /* Update the big result number */
  resultValue.textContent = roundedResult + " " + getUnitSymbol(toUnit);
  resultSource.textContent = "Converted from " + fromValue + " " + getUnitSymbol(fromUnit);

  /* Update the temperature orb */
  orbValue.textContent = roundedResult + " " + getUnitSymbol(toUnit);
  orbMood.textContent = mood;

  /* Update the dynamic mood colors on the result panel and orb */
  clearMoodClasses(resultPanel);
  clearMoodClasses(tempOrb.parentElement);
  resultPanel.classList.add(moodClass);

  hasValidResult = true;
}

/* Resets the result area back to its empty/default look */
function clearResultDisplay() {
  resultValue.textContent = "--";
  resultSource.textContent = "";
  orbValue.textContent = "--";
  orbMood.textContent = "Enter a value";
  clearMoodClasses(resultPanel);
  clearMoodClasses(tempOrb.parentElement);
  hasValidResult = false;
}

/* =========================================================
   MAIN CONVERSION FLOW
   ========================================================= */

/* Reads the input, validates it, and if valid, updates the result */
function performConversion() {
  var rawValue = tempInput.value;
  var errorText = validateInput(rawValue, currentFromUnit);

  if (errorText !== "") {
    showError(errorText);
    clearResultDisplay();
    return;
  }

  clearError();
  var value = Number(rawValue);
  updateResult(value, currentFromUnit, currentToUnit);
}

/* Only recalculates if the user already has a valid result on screen.
   This powers the "live conversion" behavior when units are changed. */
function recalculateIfValid() {
  var rawValue = tempInput.value;

  if (rawValue.trim() === "") {
    return;
  }

  var errorText = validateInput(rawValue, currentFromUnit);

  if (errorText !== "") {
    showError(errorText);
    clearResultDisplay();
    return;
  }

  clearError();
  var value = Number(rawValue);
  updateResult(value, currentFromUnit, currentToUnit);
}

/* Swaps the FROM and TO units, keeping the entered value */
function swapUnits() {
  var tempUnit = currentFromUnit;
  currentFromUnit = currentToUnit;
  currentToUnit = tempUnit;

  setActiveUnitButton(fromUnitButtons, currentFromUnit);
  setActiveUnitButton(toUnitButtons, currentToUnit);

  recalculateIfValid();
}

/* Resets the whole converter back to its starting state */
function resetConverter() {
  tempInput.value = "";
  clearError();
  clearResultDisplay();

  currentFromUnit = "C";
  currentToUnit = "F";
  setActiveUnitButton(fromUnitButtons, currentFromUnit);
  setActiveUnitButton(toUnitButtons, currentToUnit);
}

/* Fills the input from a quick-value chip and converts right away */
function useQuickChip(value, unit) {
  tempInput.value = value;
  currentFromUnit = unit;
  setActiveUnitButton(fromUnitButtons, currentFromUnit);
  performConversion();
}

/* =========================================================
   EVENT LISTENERS
   ========================================================= */

/* FROM unit buttons */
for (var i = 0; i < fromUnitButtons.length; i++) {
  fromUnitButtons[i].addEventListener("click", function () {
    currentFromUnit = this.getAttribute("data-unit");
    setActiveUnitButton(fromUnitButtons, currentFromUnit);
    recalculateIfValid();
  });
}

/* TO unit buttons */
for (var j = 0; j < toUnitButtons.length; j++) {
  toUnitButtons[j].addEventListener("click", function () {
    currentToUnit = this.getAttribute("data-unit");
    setActiveUnitButton(toUnitButtons, currentToUnit);
    recalculateIfValid();
  });
}

/* Convert button */
convertBtn.addEventListener("click", performConversion);

/* Reset button */
resetBtn.addEventListener("click", resetConverter);

/* Swap button */
swapBtn.addEventListener("click", swapUnits);

/* Quick conversion chips */
for (var k = 0; k < quickChips.length; k++) {
  quickChips[k].addEventListener("click", function () {
    var chipValue = this.getAttribute("data-value");
    var chipUnit = this.getAttribute("data-unit");
    useQuickChip(chipValue, chipUnit);
  });
}

/* Allow pressing Enter inside the input to trigger a conversion */
tempInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    performConversion();
  }
});

/* Set the initial default state when the page loads */
clearResultDisplay();
