
// Get Day of the Week
const days = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
document.getElementById("day").textContent = days[new Date().getDay()];

  // Get Calendar Date
const date = new Date();
document.getElementById("date").textContent =
  date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  // Get Geolocation
//   const successCallback = position => {
//     console.log(position);
//   };

//   const errorCallback = error => {
//     console.error(error);
//   };

// navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

navigator.geolocation.getCurrentPosition(async pos => {
  const { latitude, longitude } = pos.coords;
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDP0wNN63Wz91zAldMps6RfoHs5zgnO-pE`
  );
  const data = await res.json();
  const comps = data.results[0].address_components;
  const city = comps.find(c => c.types.includes("locality"))?.long_name;
  const state = comps.find(c => c.types.includes("administrative_area_level_1"))?.short_name;
  const country = comps.find(c => c.types.includes("country"))?.short_name;

  const apiURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDP0wNN63Wz91zAldMps6RfoHs5zgnO-pE`;
  console.log(apiURL);

  document.getElementById("city").textContent = city;
  document.getElementById("region").textContent = `${state}, ${country}`;
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