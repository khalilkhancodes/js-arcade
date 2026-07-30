document.addEventListener("DOMContentLoaded", () => {
    const cityName = document.querySelector('.city-name')
    const countryName = document.querySelector('.country-name')
    const temperature = document.querySelector('.temp')
    const celciusButton = document.querySelector('.celcius')
    const fahrenheitButton = document.querySelector('.fahrenheit')
    const condition = document.getElementById('weather-conditions')
    const heroIcon = document.querySelector('.main-icon-container');
    const sunrise = document.getElementById('sunrise-time')
    const sunset = document.getElementById('sunset-time')
    const searchInput = document.querySelector('.search-input')

    const humidityValue = document.getElementById('humidity-value');
    const windValue = document.getElementById('wind-value');
    const pressureValue = document.getElementById('pressure-value');
    const minTemperature = document.getElementById('min-temperature-value');
    const maxTemperature = document.getElementById('max-temperature-value');
    const forecastSlider = document.querySelector('.slider-container');

    const API_KEY = "abb21da3ed6d0f86958611351e4d89e9";
    const DEFAULT_CITY = 'San Francisco';

    console.log(searchInput.value)

    async function getWeatherData(cityName) {
        try {
            const city = cityName;
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('City not found');
            const data = await response.json();

            console.log(data);
            updateUI(data)
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    }

    async function getHourlyData(cityName) {
        try {
            const city = cityName;
            const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('City not found');
            const data = await response.json();

            console.log(data);
            updateHourlyUI(data);
        } catch (error) {
            console.error("Error fetching hourly forecast:", error);
        }
    }


    function updateHourlyUI(data) {
        forecastSlider.innerHTML = ""; // Clear existing content
        const timezoneOffset = data.city.timezone;

        const dailyData = {};
        data.list.forEach(item => {
            const date = new Date((item.dt + timezoneOffset) * 1000);
            const day = date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
            if (!dailyData[day]) dailyData[day] = [];
            dailyData[day].push(item);

            forecastSlider.innerHTML += `<div class="forecast-card glass active">
                <span class="day">${day}</span>
                <div style="font-size: 10px; color: #fff;">${formatTime(item.dt, timezoneOffset)}</div>
                <i data-lucide="${getLucideIcon(item.weather[0].icon)}" style="width: 32px; height: 32px;"></i>
                <div class="temps">
                    
                <span class="high">${Math.round(item.main.temp_max - 273.15)}°</span>
                <span class="low">${Math.round(item.main.temp_min - 273.15)}°</span>
                </div>
                </div>`
            lucide.createIcons();
        });
    }

    // --- HELPER FUNCTIONS ---
    function formatTime(unixTime, timezoneOffset) {
        const date = new Date((unixTime + timezoneOffset) * 1000);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC'
        });
    }

    // Map OpenWeather API icon codes to Lucide icons
    function getLucideIcon(weatherCode) {
        const iconMap = {
            '01d': 'sun',
            '01n': 'moon',
            '02d': 'cloud-sun',
            '02n': 'cloud-moon',
            '03d': 'cloud',
            '03n': 'cloud',
            '04d': 'cloudy',
            '04n': 'cloudy',
            '09d': 'cloud-drizzle',
            '09n': 'cloud-drizzle',
            '10d': 'cloud-rain',
            '10n': 'cloud-rain',
            '11d': 'cloud-lightning',
            '11n': 'cloud-lightning',
            '13d': 'snowflake',
            '13n': 'snowflake',
            '50d': 'align-justify', // closest to mist/fog
            '50n': 'align-justify'
        };
        return iconMap[weatherCode] || 'sun';
    }

    // Helper function to update temperature display based on current unit
    function updateTemperatureDisplay() {
        if (currentWeatherData) {
            if (tempInCelsius) {
                const tempC = Math.round(currentWeatherData.main.temp - 273.15);
                temperature.textContent = `${tempC}°`;
            } else {
                const tempF = Math.round((currentWeatherData.main.temp - 273.15) * 9 / 5 + 32);
                temperature.textContent = `${tempF}°`;
            }
        }
    }


    function updateUI(data) {
        currentWeatherData = data; // Store data for temperature unit conversion
        cityName.textContent = data.name;
        countryName.textContent = data.sys.country;

        updateTemperatureDisplay(); // Use helper function instead of duplicating logic

        const feelsLikeC = Math.round(data.main.feels_like - 273.15);
        condition.textContent = `Feels like ${feelsLikeC}° • ${data.weather[0].description}`;
        sunrise.textContent = formatTime(data.sys.sunrise, data.timezone);
        sunset.textContent = formatTime(data.sys.sunset, data.timezone);

        heroIcon.innerHTML = `<i data-lucide="${getLucideIcon(data.weather[0].icon)}" style="width: 120px; height: 120px;" stroke-width="1.5"></i>`;
        // Re-render Lucide icons after DOM update
        lucide.createIcons();

        humidityValue.textContent = `${data.main.humidity}%`;
        windValue.textContent = `${data.wind.speed} km/h`;
        pressureValue.textContent = `${data.main.pressure} hPa`;
        minTemperature.textContent = `${Math.round(data.main.temp_min - 273.15)}°C`;
        maxTemperature.textContent = `${Math.round(data.main.temp_max - 273.15)}°C`;

    }

    let tempInCelsius = true; // Track current temperature unit
    let currentWeatherData = null; // Store current weather data for unit conversion

    celciusButton.addEventListener('click', () => {
        celciusButton.classList.add('active');
        fahrenheitButton.classList.remove('active');
        tempInCelsius = true;
        updateTemperatureDisplay(); // Use helper function
    });

    fahrenheitButton.addEventListener('click', () => {
        fahrenheitButton.classList.add('active');
        celciusButton.classList.remove('active');
        tempInCelsius = false;
        updateTemperatureDisplay(); // Use helper function
    });

    // --- EVENT LISTENERS ---
    searchInput.addEventListener('keypress', (e) => {
        if (e.key == 'Enter') {
            if (searchInput.value == "") {
                getWeatherData("San Francisco")
                getHourlyData("San Francisco")
            } else {
                getHourlyData(searchInput.value);
                getWeatherData(searchInput.value);
            }
        }
        console.log(searchInput.value);
    })

    // Initialize the app
    getWeatherData(DEFAULT_CITY);
    getHourlyData(DEFAULT_CITY)
})
