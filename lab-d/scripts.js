
const API_KEY = '550c7d6f0058a38aaf8d431763566765';

// Elementy DOM
const cityInput = document.getElementById('cityInput');
const weatherButton = document.getElementById('weatherButton');
const currentWeatherData = document.getElementById('currentWeatherData');
const forecastData = document.getElementById('forecastData');

function getWeatherData(city) {

  if (!city) {
    alert('Proszę wprowadzić nazwę miasta');
    return;
  }

  currentWeatherData.innerHTML = '<div class="current-card"><p class="loading-text">Ładowanie danych...</p></div>';
  forecastData.innerHTML = '<div class="forecast-container-box"><p class="loading-text" style="width:100%">Pobieranie prognozy...</p></div>';

  getCurrentWeather(city);

  getWeatherForecast(city);
}

function getCurrentWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pl`;

  const xhr = new XMLHttpRequest();

  xhr.open('GET', url, true);

  xhr.onload = function() {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);

      console.log("Odpowiedź z Current Weather API:", data);

      renderCurrent(data);
    } else {
      currentWeatherData.innerHTML = '<div class="error">Nie udało się pobrać danych pogodowych. Sprawdź nazwę miasta.</div>';
    }
  };

  xhr.onerror = function() {
    currentWeatherData.innerHTML = '<div class="error">Wystąpił błąd podczas pobierania danych.</div>';
  };

  xhr.send();
}

function getWeatherForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=pl`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Nie udało się pobrać prognozy');
      }
      return response.json();
    })
    .then(data => {
      console.log("Odpowiedź z 5-day Forecast API:", data);
      renderForecast(data);
    })
    .catch(error => {
      console.error('Błąd:', error);
      forecastData.innerHTML = '<div class="error">Nie udało się pobrać prognozy pogody.</div>';
    });
}

function renderCurrent(data) {
  currentWeatherData.innerHTML = `
        <div class="current-card">
            <h3 style="margin:0">${data.name}</h3>
            <div class="temp-large">${Math.round(data.main.temp)}°C</div>
            <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
            <p style="text-transform: capitalize; margin: 5px 0;">${data.weather[0].description}</p>
            <p style="color: #999; font-size: 0.9rem;">Wilgotność: ${data.main.humidity}%</p>
        </div>
    `;
}

function renderForecast(data) {
  const daily = data.list.filter((_, index) => index % 8 === 0).slice(0, 5);
  let html = '<div class="forecast-container-box">';

  daily.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString('pl-PL', { weekday: 'short' });
    html += `
            <div class="forecast-item">
                <p class="day-name">${date}</p>
                <div class="temp-small">${Math.round(item.main.temp)}°C</div>
                <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png">
                <p class="desc-small">${item.weather[0].description}</p>
            </div>
        `;
  });

  html += '</div>';
  forecastData.innerHTML = html;
}

  weatherButton.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    getCurrentWeather(city);
    getWeatherData(city);
  }
});



