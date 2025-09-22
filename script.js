function traduzirDescricao(desc) {
  const mapa = {
    "sunny": "Ensolarado",
    "clear": "Limpo",
    "partly cloudy": "Parcialmente nublado",
    "cloudy": "Nublado",
    "overcast": "Encoberto",
    "light rain": "Chuva leve",
    "moderate rain": "Chuva moderada",
    "heavy rain": "Chuva forte",
    "snow": "Neve",
    "thunder": "Trovoada",
    "storm": "Tempestade",
    "fog": "Nevoeiro"
  };
  let key = desc.toLowerCase();
  return mapa[key] || desc;
}

function getWeatherIcon(desc) {
  desc = desc.toLowerCase();
  if (desc.includes("sun")) return "☀️";
  if (desc.includes("clear")) return "🌞";
  if (desc.includes("cloud")) return "☁️";
  if (desc.includes("rain")) return "🌧️";
  if (desc.includes("snow")) return "❄️";
  if (desc.includes("storm") || desc.includes("thunder")) return "⛈️";
  if (desc.includes("fog")) return "🌫️";
  return "🌤️";
}

async function getWeather(lat, lon) {
  const url = `https://wttr.in/${lat},${lon}?format=j1`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function setAlert(tempC, desc) {
  const alertMessage = document.getElementById("alert-message");
  if (parseInt(tempC) >= 30) {
    alertMessage.textContent = "Tá um calorão! Toma uma água, tchê! 💧";
  } else if (desc.includes("rain")) {
    alertMessage.textContent = "Vai chover! Não esquece o guarda-chuva, guri! ☔";
  } else {
    alertMessage.textContent = "Sem alertas no momento.";
  }
}

async function showWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const data = await getWeather(lat, lon);
      
      document.getElementById("location").textContent = data.nearest_area[0].areaName[0].value;

      const current = data.current_condition[0];
      const desc = current.weatherDesc[0].value;

      document.getElementById("weather-icon").textContent = getWeatherIcon(desc);
      document.getElementById("temperature").textContent = current.temp_C + "°C";
      document.getElementById("description").textContent = traduzirDescricao(desc);
      document.getElementById("details").textContent = 
        `Vento: ${current.windspeedKmph} km/h | Umidade: ${current.humidity}%`;

      setAlert(current.temp_C, desc.toLowerCase());

      const forecastDiv = document.getElementById("forecast");
      forecastDiv.innerHTML = "";
      data.weather.forEach((day, index) => {
        const div = document.createElement("div");
        div.classList.add("forecast-day");
        const date = new Date();
        date.setDate(date.getDate() + index);
        const descDay = day.hourly[4].weatherDesc[0].value;
        div.innerHTML = `
          <h4>${date.toLocaleDateString("pt-BR", { weekday: "long" })}</h4>
          <div class="icon">${getWeatherIcon(descDay)}</div>
          <p>${day.avgtempC}°C</p>
          <p>${traduzirDescricao(descDay)}</p>
        `;
        forecastDiv.appendChild(div);
      });
    });
  } else {
    alert("Não foi possível acessar a localização.");
  }
}

showWeather();
