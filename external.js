const apiKey = "[YOUR-API-KEY]"; 
const currentUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";
const searchField = document.querySelector(".search input"); 
const searchBtn = document.querySelector(".search button"); 
const weatherIcon = document.querySelector(".img");
const defaultCity = "Bangalore";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const weatherIcons = {
    Clear: "clear.png",
    Clouds: "cloudy.png",
    Drizzle: "drizzy.png",
    Mist: "mist.png",
    Rain: "rain.png",
    Snow: "snow.png",
    Wind: "wind.png"
};

async function fetchWeatherData(url) {
    const response = await fetch(url);
    if (response.status === 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
        return null;
    }
    return await response.json();
}

function capitalizeFirstLetter(string) {
    return string.replace(/\b\w/g, match => match.toUpperCase());
}


function updateCurrentWeather(data) {
    document.querySelector(".city").innerHTML = data.name;
    
    const currentDate = new Date(data.dt * 1000);
    const currentTime = new Date();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const date = currentDate.getDate();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes().toString().padStart(2, "0");

    document.querySelector(".date").innerHTML = ` ${"Today"} ${month} ${date}`;
    document.querySelector(".time").innerHTML = `${hours}:${minutes}`;
    document.querySelector(".description").innerHTML = capitalizeFirstLetter(data.weather[0].description);
    document.querySelector(".humidity").innerHTML = `HUMIDITY ${data.main.humidity}%`;
    document.querySelector(".windSpeed").innerHTML = `WINDSPEED ${data.wind.speed} Km/h`;
    document.querySelector(".pressure").innerHTML = `PRESSURE ${data.main.pressure} hPA`;
    document.querySelector(".temperature").innerHTML = `${Math.round(data.main.temp)} °C`;
    weatherIcon.src = `./Images/${weatherIcons[data.weather[0].main] || "default.png"}`;
}



function updateForecastWeather(forecastData) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const indices = [0, 8, 16, 24, 32, 39];
    const elements = [1, 2, 3, 4, 5, 6];
   
    elements.forEach((el, i) => {
        const date = new Date(forecastData.list[indices[i]].dt * 1000);
        const dayName = days[date.getDay()];
        document.querySelector(`.fDay${el}`).innerHTML = dayName;
        document.querySelector(`.fTemp${el}`).innerHTML = `${Math.round(forecastData.list[indices[i]].main.temp)}°C`;
        document.querySelector(`.fImg${el}`).src = `./Images/${weatherIcons[forecastData.list[indices[i]].weather[0].main] || "default.png"}`;
        document.querySelector(`.fDescription${el}`).innerHTML = `${capitalizeFirstLetter(forecastData.list[indices[i]].weather[0].description)}`;
    });
}


async function checkWeather(city) {
    const currentWeatherData = await fetchWeatherData(`${currentUrl}${city}&appid=${apiKey}`);
    if (!currentWeatherData) {
        document.getElementById("error-message").style.display = "block";
        return;
    }

    document.getElementById("error-message").style.display = "none"; 
    updateCurrentWeather(currentWeatherData);

    const forecastWeatherData = await fetchWeatherData(`${forecastUrl}${city}&appid=${apiKey}`);
    if (!forecastWeatherData) return;
    updateForecastWeather(forecastWeatherData);

    console.log(currentWeatherData);
    console.log(forecastWeatherData)
}
checkWeather( defaultCity);

searchField.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchBtn.click(); 
    }
});

searchBtn.addEventListener("click", () => {
    checkWeather(searchField.value);
});