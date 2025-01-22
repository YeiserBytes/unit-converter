// index.ts
function $(selector) {
  const element = document.querySelector(selector);
  if (!element) {
    throw new Error(`Element not found for selector: ${selector}`);
  }
  return element;
}
var Options = [
  {
    length: {
      millimeter: 0.001,
      centimeter: 0.01,
      meter: 1,
      kilometer: 1000,
      inch: 0.0254,
      foot: 0.3048,
      yard: 0.9144,
      mile: 1609.34
    }
  },
  {
    weight: {
      milligram: 0.001,
      gram: 1,
      kilogram: 1000,
      ton: 1e6,
      pound: 453.592,
      ounce: 28.3495
    }
  },
  {
    temperature: {
      celsius: {
        fahrenheit: (celsius) => celsius * 9 / 5 + 32,
        kelvin: (celsius) => celsius + 273.15
      },
      fahrenheit: {
        celsius: (fahrenheit) => (fahrenheit - 32) * 5 / 9,
        kelvin: (fahrenheit) => (fahrenheit + 459.67) * 5 / 9
      },
      kelvin: {
        celsius: (kelvin) => kelvin - 273.15,
        fahrenheit: (kelvin) => kelvin * 9 / 5 - 459.67
      }
    }
  }
];
var optionsAbbreviations = {
  length: {
    millimeter: "mm",
    centimeter: "cm",
    meter: "m",
    kilometer: "km",
    inch: "in",
    foot: "ft",
    yard: "yd",
    mile: "mi"
  },
  weight: {
    milligram: "mg",
    gram: "g",
    kilogram: "kg",
    ton: "t",
    pound: "lb",
    ounce: "oz"
  },
  temperature: {
    celsius: "°C",
    fahrenheit: "°F",
    kelvin: "K"
  }
};
var form = $("#converterForm");
var result = $("#result");
window.addEventListener("DOMContentLoaded", () => {
  const attribute = window.location.search.split("=")[1] || "length";
  const from = $("#from");
  const to = $("#to");
  if (attribute === "length") {
    const optionsKeys = Object.keys(Options[0].length);
    for (const key of optionsKeys) {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = key;
      from.appendChild(option.cloneNode(true));
      to.appendChild(option);
    }
  } else if (attribute === "weight") {
    const optionsKeys = Object.keys(Options[1].weight);
    for (const key of optionsKeys) {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = key;
      from.appendChild(option.cloneNode(true));
      to.appendChild(option);
    }
  } else if (attribute === "temperature") {
    const optionsKeys = Object.keys(Options[2].temperature);
    for (const key of optionsKeys) {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = key;
      from.appendChild(option.cloneNode(true));
      to.appendChild(option);
    }
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const value = data.get("value");
    const numericValue = Number(value);
    if (from.value === to.value) {
      result.textContent = value;
      return;
    }
    if (attribute === "length") {
      const toUnit = to.value;
      const convertedValue = Options[0].length[from.value] * numericValue / Options[0].length[to.value];
      result.textContent = `${convertedValue.toPrecision(10)} ${optionsAbbreviations.length[toUnit]}`;
    } else if (attribute === "weight") {
      const fromUnit = from.value;
      const toUnit = to.value;
      const convertedValue = Options[1].weight[from.value] * numericValue / Options[1].weight[to.value];
      result.textContent = `${convertedValue.toPrecision(10)} ${optionsAbbreviations.weight[toUnit]}`;
    } else if (attribute === "temperature") {
      const fromUnit = from.value;
      const toUnit = to.value;
      const convertedValue = Options[2].temperature[fromUnit][toUnit](numericValue);
      result.textContent = `${convertedValue.toPrecision(5)} ${optionsAbbreviations.temperature[toUnit]}`;
    }
  });
});
