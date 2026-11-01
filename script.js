
const temperatureText = document.getElementById("temperature");
const conditionText = document.getElementById("condition");
const updatedText = document.getElementById("updated");
const sceneStatusText = document.getElementById("scene-status");
const errorText = document.getElementById("error");
const windowScene = document.getElementById("window");
const sceneIcon = document.getElementById("scene");
const sceneSelect = document.getElementById("scene-select");
const celsiusRadio = document.getElementById("celsius");
const fahrenheitRadio = document.getElementById("fahrenheit");
const refreshButton = document.getElementById("refresh-button");

let currentCelsius = null;
let currentWeather = { text: "Loading weather", type: "cloudy", icon: "☁️" };

function describeWeather(code) {
  if (code === 0) return { text: "Clear sky", type: "sunny", icon: "☀️" };
  if (code <= 3) return { text: "Cloudy", type: "cloudy", icon: "☁️" };
  if (code === 45 || code === 48) return { text: "Foggy", type: "cloudy", icon: "🌫️" };
  if (code <= 67 || (code >= 80 && code <= 82)) return { text: "Rainy", type: "rainy", icon: "🌧️" };
  if (code <= 77 || (code >= 85 && code <= 86)) return { text: "Snowy", type: "snowy", icon: "❄️" };
  if (code >= 95) return { text: "Stormy", type: "stormy", icon: "⛈️" };
  return { text: "Weather changing", type: "cloudy", icon: "🌤️" };
}

function updateScene() {
  let scene = currentWeather;
  if (sceneSelect.value !== "current") {
    scene = {
      sunny: { text: "Sunny", type: "sunny", icon: "☀️" },
      cloudy: { text: "Cloudy", type: "cloudy", icon: "☁️" },
      rainy: { text: "Rainy", type: "rainy", icon: "🌧️" },
      snowy: { text: "Snowy", type: "snowy", icon: "❄️" },
      stormy: { text: "Stormy", type: "stormy", icon: "⛈️" }
    }[sceneSelect.value];
    sceneStatusText.textContent = "Preview: " + scene.text + ". Select Live weather to return.";
  } else {
    sceneStatusText.textContent = "Showing live weather.";
  }
  sceneIcon.textContent = scene.icon;
  windowScene.className = "window " + scene.type;
}

function showTemperature() {
  if (currentCelsius === null) return;
  let temperature = currentCelsius;
  let unit = "°C";
  if (fahrenheitRadio.checked) {
    temperature = currentCelsius * 9 / 5 + 32;
    unit = "°F";
  }
  temperatureText.textContent = Math.round(temperature) + unit;
}

async function getWeather() {
  errorText.textContent = "";
  conditionText.textContent = "Loading weather…";
  try {
    const address = "https://api.open-meteo.com/v1/forecast?latitude=51.0447&longitude=-114.0719&current=temperature_2m,weather_code&timezone=America%2FEdmonton";
    const response = await fetch(address);
    if (!response.ok) throw new Error("Weather request failed");
    const data = await response.json();
    currentCelsius = data.current.temperature_2m;
    currentWeather = describeWeather(data.current.weather_code);
    updatedText.textContent = data.current.time.split("T")[1].slice(0, 5);
    showTemperature();
    updateScene();
    conditionText.textContent = currentWeather.text;
  } catch (error) {
    conditionText.textContent = "Weather is unavailable.";
    errorText.textContent = "Please check your internet connection and try again.";
  }
}

refreshButton.addEventListener("click", getWeather);
sceneSelect.addEventListener("change", updateScene);
celsiusRadio.addEventListener("change", showTemperature);
fahrenheitRadio.addEventListener("change", showTemperature);
getWeather();