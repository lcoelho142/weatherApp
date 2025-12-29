
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
    console.log(country);

    document.getElementById('city').textContent = city;
    document.getElementById('region').textContent = `${state}, ${country}`;

};

const updateWeatherInfo = async (latitude, longitude) => {
    const weatherApiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=35b058347c0103ccb9299fc20d824cae`;

    const res = await fetch(weatherApiUrl);
    const data = await res.json();
    const currentTempKelvin = data.current.temp;
    console.log('temperature: ', currentTempKelvin);
    const currentHumidityPercent = data.current.humidity;
    console.log('humidity:', currentHumidityPercent);

}

// getLocationInfo(latitude, longitude);



// Get OpenWeather Conditions Below

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