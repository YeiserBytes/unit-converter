function $(selector: string) {
  const element = document.querySelector(selector);

  if (!element) {
    throw new Error(`Element not found for selector: ${selector}`);
  }

  return element;
}

type LengthOptions = {
  millimeter: number;
  centimeter: number;
  meter: number;
  kilometer: number;
  inch: number;
  foot: number;
  yard: number;
  mile: number;
};

type WeightOptions = {
  milligram: number;
  gram: number;
  kilogram: number;
  ton: number;
  pound: number;
  ounce: number;
};

type TemperatureOptions = {
  celsius: {
    fahrenheit: (celsius: number) => number;
    kelvin: (celsius: number) => number;
  };
  fahrenheit: {
    celsius: (fahrenheit: number) => number;
    kelvin: (fahrenheit: number) => number;
  };
  kelvin: {
    celsius: (kelvin: number) => number;
    fahrenheit: (kelvin: number) => number;
  };
}

type OptionsTypes = [
  {
    length: LengthOptions;
  },
  {
    weight: WeightOptions;
  },
  {
    temperature: TemperatureOptions;
  }
]

const Options: OptionsTypes = [
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
      ton: 1000000,
      pound: 453.592,
      ounce: 28.3495
    }
  },
  {
    temperature: {
      celsius: {
        fahrenheit: (celsius: number) => celsius * 9 / 5 + 32,
        kelvin: (celsius: number) => celsius + 273.15
      },
      fahrenheit: {
        celsius: (fahrenheit: number) => (fahrenheit - 32) * 5 / 9,
        kelvin: (fahrenheit: number) => (fahrenheit + 459.67) * 5 / 9
      },
      kelvin: {
        celsius: (kelvin: number) => kelvin - 273.15,
        fahrenheit: (kelvin: number) => kelvin * 9 / 5 - 459.67
      }
    }
  }
]

const optionsAbbreviations: Record<string, Record<string, string>> = {
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
}

const form = $('#converterForm') as HTMLFormElement;
const result = $('#result') as HTMLDivElement;

window.addEventListener("DOMContentLoaded", () => {
  const attribute = window.location.search.split('=')[1] || "length";
  const from = $('#from') as HTMLSelectElement;
  const to = $('#to') as HTMLSelectElement;

  if (attribute === "length") {
    const optionsKeys = Object.keys(Options[0].length);

    for (const key of optionsKeys) {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = key;
      from.appendChild(option.cloneNode(true));
      to.appendChild(option);
    }
  } else if (attribute === "weight") {
    const optionsKeys = Object.keys(Options[1].weight);

    for (const key of optionsKeys) {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = key;
      from.appendChild(option.cloneNode(true));
      to.appendChild(option);
    }
  } else if (attribute === "temperature") {
    const optionsKeys = Object.keys(Options[2].temperature);

    for (const key of optionsKeys) {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = key;
      from.appendChild(option.cloneNode(true));
      to.appendChild(option);
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const value = data.get('value') as string;
    const numericValue = Number(value);

    if (from.value === to.value) {
      result.textContent = value;
      return;
    }

    if (attribute === "length") {
      const toUnit = to.value as keyof LengthOptions;
      const convertedValue = Options[0].length[from.value as keyof LengthOptions] * numericValue / Options[0].length[to.value as keyof LengthOptions];
      result.textContent = `${convertedValue.toPrecision(10)} ${optionsAbbreviations.length[toUnit]}`;
    } else if (attribute === "weight") {
      const fromUnit = from.value as keyof TemperatureOptions;
      const toUnit = to.value as keyof TemperatureOptions[typeof fromUnit]
      const convertedValue = Options[1].weight[from.value as keyof WeightOptions] * numericValue / Options[1].weight[to.value as keyof WeightOptions];
      result.textContent = `${convertedValue.toPrecision(10)} ${optionsAbbreviations.weight[toUnit]}`;
    } else if (attribute === "temperature") {
      const fromUnit = from.value as keyof TemperatureOptions;
      const toUnit = to.value as keyof TemperatureOptions[typeof fromUnit];
      const convertedValue = (Options[2].temperature[fromUnit][toUnit] as (value: number) => number)(numericValue);
      result.textContent = `${convertedValue.toPrecision(5)} ${optionsAbbreviations.temperature[toUnit]}`;
    }
  })
})
