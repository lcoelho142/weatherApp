
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

    const weatherApiUrl = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=35b058347c0103ccb9299fc20d824cae`);
    console.log(weatherApiUrl);

    const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDP0wNN63Wz91zAldMps6RfoHs5zgnO-pE`
    );

    const data = await res.json();
    const comps = data.results[0].address_components;
    const city = comps.find(c => c.types.includes("locality"))?.long_name;
    const state = comps.find(c => c.types.includes("administrative_area_level_1"))?.short_name;
    const country = comps.find(c => c.types.includes("country"))?.short_name;

    document.getElementById("city").textContent = city;
    document.getElementById("region").textContent = `${state}, ${country}`;
});

// Get OpenWeather Conditions Below
const weatherRes = await fetch(weatherApiUrl);
const weather = await weatherRes.json();

document.getElementById("currentTemp").textContent = Math.round(weather.current.temp * 9/5 - 459.67); // K → °F
document.getElementById("humidity").textContent = `${weather.current.humidity}%`;
document.getElementById("wind").textContent = `${weather.current.wind_speed} mph`;

weather.daily.slice(0, 3).forEach((day, i) => {
    document.getElementById(`day${i}High`).textContent = Math.round(day.temp.max * 9/5 - 459.67);
    document.getElementById(`day${i}Low`).textContent = Math.round(day.temp.min * 9/5 - 459.67);
});

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