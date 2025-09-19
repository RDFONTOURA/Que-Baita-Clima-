async function getWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const current = data.current_weather;
    const city = await getCityName(lat, lon);

    document.getElementById("currentWeather").innerHTML = `
      <h2 class="text-2xl font-bold mb-2">${city}</h2>
      <p class="text-5xl font-bold">${Math.round(current.temperature)}°C</p>
      <p class="text-lg">💨 Vento: ${Math.round(current.windspeed)} km/h</p>
      <p class="text-lg">💧 Umidade: ${data.hourly.relative_humidity_2m[0]}%</p>
    `;

    const hourlyHTML = data.hourly.time.slice(0, 6).map((hora, i) => `
      <div class="bg-white bg-opacity-20 p-3 rounded-xl text-center">
        <p class="font-semibold">${new Date(hora).getHours()}h</p>
        <p>${Math.round(data.hourly.temperature_2m[i])}°C</p>
        <p class="text-sm">💧 ${data.hourly.relative_humidity_2m[i]}%</p>
      </div>
    `).join("");
    document.getElementById("hourlyForecast").innerHTML = hourlyHTML;

    const dailyHTML = data.daily.time.slice(0, 5).map((dia, i) => `
      <div class="bg-white bg-opacity-20 p-3 rounded-xl text-center">
        <p class="font-semibold">${new Date(dia).toLocaleDateString("pt-BR", { weekday: "short" })}</p>
        <p>🌡️ Max: ${Math.round(data.daily.temperature_2m_max[i])}°C</p>
        <p>❄️ Min: ${Math.round(data.daily.temperature_2m_min[i])}°C</p>
      </div>
    `).join("");
    document.getElementById("dailyForecast").innerHTML = dailyHTML;

  } catch (err) {
    console.error("Erro ao buscar clima:", err);
    document.getElementById("currentWeather").innerHTML = `<p>Erro ao buscar clima.</p>`;
  }
}

async function getCityName(lat, lon) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
    const data = await res.json();
    return data.address.city || data.address.town || data.address.village || "Localização";
  } catch (err) {
    console.error("Erro ao buscar cidade:", err);
    return "Localização";
  }
}

function getByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      getWeather(position.coords.latitude, position.coords.longitude);
    }, error => {
      console.error("Erro de localização:", error);
      document.getElementById("currentWeather").innerHTML = `<p>Não foi possível acessar sua localização.</p>`;
    });
  } else {
    document.getElementById("currentWeather").innerHTML = `<p>Seu navegador não suporta geolocalização.</p>`;
  }
}

window.onload = () => getByLocation();
