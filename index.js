
// Get Day of the Week
const days = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
document.getElementById("day").textContent = days[new Date().getDay()];

// Get Calendar Date
const date = new Date();
document.getElementById("date").textContent =
date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// Get Geolocation
navigator.geolocation.getCurrentPosition(async pos => {
    const { latitude, longitude } = pos.coords;
    updateLocationInfo(latitude, longitude);
    updateWeatherInfo(latitude, longitude);
});

const updateLocationInfo = async (latitude, longitude) => {
    const googleURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDP0wNN63Wz91zAldMps6RfoHs5zgnO-pE`;

    const res = await fetch(googleURL);
    const data = await res.json();
    const comps = data.results[0].address_components
    const city = comps[2].long_name
    const state = comps[4].short_name;
    const country = comps[5].short_name;
    // console.log(country);

    document.getElementById('city').textContent = city;
    document.getElementById('region').textContent = `${state}, ${country}`;

};

// convert Kelvin to Fahrenheit function
function convertKelvinToFahrenheit (tempKelvin) {
    return Math.round(1.8 * (tempKelvin - 273) + 32);
}

const updateWeatherInfo = async (latitude, longitude) => {
    const weatherApiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=35b058347c0103ccb9299fc20d824cae`;

    const res = await fetch(weatherApiUrl);
    const data = await res.json();
    let currentTempKelvin = convertKelvinToFahrenheit(data.current.temp);
    // console.log('temperature: ', currentTempKelvin);
    const currentUvIndex = Math.round(data.current.uvi);
    // console.log('UV Index:', currentUvIndex);
    const currentHumidityPercent = Math.round(data.current.humidity);
    // console.log('humidity:', currentHumidityPercent);
    const currentWindSpeedMph = Math.round(data.current.wind_speed);
    // console.log('wind speed:', currentWindSpeedMph);

//Forecast Today
    const today = data.daily[0];
    // console.log(today);
    const todayHighTempF = convertKelvinToFahrenheit(today.temp.max);
    // console.log(todayHighTempF);
    const todayLowTempF = convertKelvinToFahrenheit(today.temp.min);
    // console.log(todayLowTempF);
    const todayName = 'today';
    console.log(todayName);
    const todayIconCode = today.weather[0].icon;
    console.log(todayIconCode);
    const todayIconUrl = `https://openweathermap.org/img/wn/${todayIconCode}@2x.png`;
    console.log(todayIconUrl);

//Forecast Next Day
    const nextDay = data.daily[1];
    // console.log(nextDay);
    const nextDayHighTempF = convertKelvinToFahrenheit(nextDay.temp.max);
    // console.log(nextDayHighTempF);
    const nextDayLowTempF = convertKelvinToFahrenheit(nextDay.temp.min);
    // console.log(nextDayLowTempF);

// Determine Day of Week for Next Day
    const nextDayName = new Date(nextDay.dt * 1000).toLocaleDateString('en-US', { weekday: 'short'});
    // console.log(nextDayName);

// Forecast Day-After-Next
    const dayAfterNext = data.daily[2];
    // console.log(dayAfterNext);
    const dayAfterNextHighTempF = convertKelvinToFahrenheit(dayAfterNext.temp.max);
    // console.log(dayAfterNextHighTempF);
    const dayAfterNextLowTempF = convertKelvinToFahrenheit(dayAfterNext.temp.min);
    // console.log(dayAfterNextLowTempF);

// Determine Day of Week for Day After Next Day
    const dayAfterNextDayName = new Date(dayAfterNext.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
    // console.log(dayAfterNextDayName);

// OpenWeather to Font Awesome Icon Converter
    const fontAwesomeMap = {
        Clear: 'fa-sun',
        Clouds: 'fa-cloud',
        Rain: 'fa-cloud-showers-heavy',
        Snow: 'fa-snowflake',
        Thunderstorm: 'fa-cloud-bolt',
        Drizzle: 'fa-cloud-rain',
        Mist: 'fa-smog',
        Smoke: 'fa-smog',
        Haze: 'fa-smog',
        Dust: 'fa-smog',
        Fog: 'fa-smog',
        Sand: 'fa-smog',
        Ash: 'fa-volcano',
        Squall: 'fa-wind',
        Tornado: 'fa-tornado',
    };

    //Today Condition
    const todayCondition = today.weather[0].main;
    document.getElementById('today-weather-icon').className = 
        `fa-solid ${fontAwesomeMap[todayCondition] || 'fa-cloud'}`;

    //Next Day Condition
    const nextDayCondition = data.daily[1].main;
    document.getElementById('next-day-weather-icon').className = 
        `fa-solid ${fontAwesomeMap[nextDayCondition] || 'fa-cloud'}`;

    //Day After Next Condition
    const dayAfterNextCondition = data.daily[2].main;
    document.getElementById('day-after-next-weather-icon').className = 
        `fa-solid ${fontAwesomeMap[dayAfterNextCondition] || 'fa-cloud'}`;

// Get Elements By ID & update content below
//Current Condition Info
    document.getElementById('current-temp-value').textContent = `${currentTempKelvin}°F`;
    document.getElementById('uv-index-value').textContent = currentUvIndex;
    document.getElementById('humidity-value').textContent = `${currentHumidityPercent}%`;
    document.getElementById('wind-speed-value').textContent = `${currentWindSpeedMph} mph`;

//Forecast Info
    //Today
    document.getElementById('today').textContent = todayName.toUpperCase();
    document.getElementById('today-high-temp').textContent = `${todayHighTempF}°F`;
    document.getElementById('today-low-temp').textContent = `${todayLowTempF}°F`;
    document.getElementById('today-weather-icon').src = todayIconUrl;
    //Next Day
    document.getElementById('next-day').textContent = nextDayName.toUpperCase();
    document.getElementById('next-day-high-temp').textContent = `${nextDayHighTempF}°F`;
    document.getElementById('next-day-low-temp').textContent = `${nextDayLowTempF}°F`;
    //Day After Next Day
    document.getElementById('day-after-next').textContent = dayAfterNextDayName.toUpperCase();
    document.getElementById('day-after-next-high-temp').textContent = `${dayAfterNextHighTempF}°F`;
    document.getElementById('day-after-next-low-temp').textContent = `${dayAfterNextLowTempF}°F`;
} 



// English to Portuguese Translation
i18next.init({
lng: "en",
resources: {
    en: { 
        translation: {
            english: "English",
            portuguese: "Portuguese",
            forecast: "3-Day Forecast",
        } 
    },
    pt: { 
        translation: { 
            english: "Inglês",
            portuguese: "Português",
            forecast: "Previsão de 3 Dias" 
        } 
    }
}
});

// Assign Code Keys
function render() {
document.getElementById("english").textContent = i18next.t("english");
document.getElementById("portuguese").textContent = i18next.t("portuguese");
document.getElementById("3-day-forecast").textContent = i18next.t("forecast");

}
// Loop thru keys above

render();

// Language Toggle Button on Click
const langSelect = document.getElementById("lang-select");
langSelect.addEventListener("change", e => {
    i18next.changeLanguage(e.target.value, render);
});