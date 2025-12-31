let currentLat;
let currentLong;

const localeConfig = {
    en: {
    ui: "en-US",
    weather: "en",
    units: "imperial"
    },
    pt: {
    ui: "pt-PT",
    weather: "pt",
    units: "metric"
    }
};

function getCurrentConfig() {
    return localeConfig[i18next.language] || localeConfig.en;
}

// English to Portuguese Translation
i18next.init({
lng: "en",
resources: {
    en: { 
        translation: {
            english: "English",
            portuguese: "Portuguese",
            currentTemp: "Current Temp",
            localConditions: "Local Conditions",
            uvi: "UV Index",
            humidity: "Humidity",
            windSpeed: "Wind Speed",
            forecast: "3-Day Forecast",
            today: "Today",
            high: "High",
            low: "Low"
        } 
    },
    pt: { 
        translation: { 
            english: "Inglês",
            portuguese: "Português",
            currentTemp: "Temperatura Atual",
            localConditions: "Condições Locais",
            uvi: "Índice UV",
            humidity: "Humidade",
            windSpeed: "Velocidade do Vento",
            forecast: "Previsão de 3 Dias",
            today: "Hoje",
            high: "Alto",
            low: "Baixo"
        } 
    }
}
});

// For linking translation to id name
const translationMap = {
    english: "english",
    portuguese: "portuguese",
    currentTemp: "current-temp",
    localConditions: "local-conditions",
    uvi: "uv-index",
    humidity: "humidity",
    windSpeed: "wind-speed",
    forecast: "3-day-forecast",
    today: "today",
    high: ["high-today", "high-next-day", "high-day-after-next"],
    low: ["low-today", "low-next-day", "low-day-after-next"]
}



// Assign Code Keys
function render() {
    Object.entries(translationMap).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.textContent = i18next.t(key);
                }
            });
        } else {
            const el = document.getElementById(value);
            if (el) {
                el.textContent = i18next.t(key);
            }
        }
    });
}

function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getCurrentLocale() {
    return getCurrentConfig().ui;
}

function changeLanguage(lang, lat, long) {
    i18next.changeLanguage(lang, () => {
        renderDay();
        renderDate();
        renderAll(lat, long);
    });
}

// Language Toggle Button on Click
const langSelect = document.getElementById("lang-select");
langSelect.addEventListener("change", e => {
    changeLanguage(e.target.value, currentLat, currentLong);
});


// Get Day of the Week
function renderDay() {
    const locale = getCurrentLocale();
    const today = new Date();
    const dayName = today.toLocaleDateString(locale, { weekday: "long" });
    document.getElementById("day").textContent = dayName.toUpperCase();
}

// Get Calendar Date
function renderDate() {
    const locale = getCurrentLocale();
    const today = new Date();

    const dateString = today.toLocaleDateString(locale, { 
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    document.getElementById("date").textContent = capitalize(dateString);
        
}

// Get Geolocation
navigator.geolocation.getCurrentPosition(async pos => {
    currentLat = pos.coords.latitude;
    currentLong = pos.coords.longitude;
    
    updateLocationInfo(currentLat, currentLong);
    updateWeatherInfo(currentLat, currentLong);
});

const updateLocationInfo = async (lat, long) => {
    const googleURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyDP0wNN63Wz91zAldMps6RfoHs5zgnO-pE`;

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

const updateWeatherInfo = async (lat, long) => {
    const { units } = getCurrentConfig();

    // Define uinits based on current setting
    const isMetric = units === "metric";
    const tempSymbol = isMetric ? "°C" : "°F";
    const speedSymbol = isMetric ? "km/h" : "mph";

    const weatherApiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&units=${units}&appid=35b058347c0103ccb9299fc20d824cae`;
    console.log(weatherApiUrl);

    const res = await fetch(weatherApiUrl);
    const data = await res.json();
    // let currentTempKelvin = convertKelvinToFahrenheit(data.current.temp);
    let currentTemp = Math.round(data.current.temp);
    // console.log('temperature: ', currentTempKelvin);
    const currentUvIndex = Math.round(data.current.uvi);
    // console.log('UV Index:', currentUvIndex);
    const currentHumidityPercent = Math.round(data.current.humidity);
    // console.log('humidity:', currentHumidityPercent);
    let rawWindSpeed = data.current.wind_speed;
    if (isMetric) {
        rawWindSpeed = rawWindSpeed * 3.6;
    }
    const currentWindSpeedMph = Math.round(rawWindSpeed);
    // console.log('wind speed:', currentWindSpeedMph);

//Forecast Today
    const today = data.daily[0];
    // console.log(today);
    const todayHighTempF = Math.round(today.temp.max);
    // console.log(todayHighTempF);
    const todayLowTempF = Math.round(today.temp.min);
    // console.log(todayLowTempF);
    const todayName = i18next.t('today').toUpperCase();
    // console.log(todayName);

//Forecast Next Day
    const nextDay = data.daily[1];
    // console.log(nextDay);
    const nextDayHighTempF = Math.round(nextDay.temp.max);
    // console.log(nextDayHighTempF);
    const nextDayLowTempF = Math.round(nextDay.temp.min);
    // console.log(nextDayLowTempF);

// Determine Day of Week for Next Day
    const locale = getCurrentLocale();
    const nextDayName = new Date(nextDay.dt * 1000).toLocaleDateString(locale, { weekday: 'short'}).toUpperCase();
    // console.log(nextDayName);

// Forecast Day-After-Next
    const dayAfterNext = data.daily[2];
    // console.log(dayAfterNext);
    const dayAfterNextHighTempF = Math.round(dayAfterNext.temp.max);
    // console.log(dayAfterNextHighTempF);
    const dayAfterNextLowTempF = Math.round(dayAfterNext.temp.min);
    // console.log(dayAfterNextLowTempF);

// Determine Day of Week for Day After Next Day
    const dayAfterNextDayName = new Date(dayAfterNext.dt * 1000).toLocaleDateString(locale, { weekday: 'short' }).toUpperCase();
    // console.log(dayAfterNextDayName);

const weatherConditionMap = {
        Clear: {
            src: "./weather-imgs/sunny.svg",
            icon: 'fa-sun',
            blurb: ['The sun is up, but are you? (no shade, but maybe you should find some...)']
        },
        Clouds: {
            src: "./weather-imgs/cloudy.svg",
            icon: 'fa-cloud',
            blurb: ['It do be cloudy!']
        },
        Rain: {
            src: "./weather-imgs/rain-shower.svg",
            icon: 'fa-cloud-showers-heavy',
            blurb: ['When it rains, it pours!']
        },
        Snow: {
            src: "./weather-imgs/snowy.svg",
            icon: 'fa-snowflake',
            blurb: ['The weather outside be frightful!']
        },
        Thunderstorm: {
            src: "./weather-imgs/thunderstorm.svg",
            icon: 'fa-cloud-bolt',
            blurb: ['Ben Franklin be experiementing with electricity outside, be warned!']
        },
        Drizzle: {
            src: "./weather-imgs/drizzle.svg",
            icon: 'fa-cloud-rain',
            blurb: ['It a lil wet outside!']
        },
        Mist: {
            src: "./weather-imgs/smog.svg",
            icon: 'fa-smog',
            blurb: ['Water particles are suffocating the air at the moment.']
        },
        Smoke: {
            src: "./weather-imgs/smog.svg",
            icon: 'fa-smog',
            blurb: ['Beware of second-hand smoke!']
        },
        Haze: {
            src: "./weather-imgs/smog.svg",
            icon: 'fa-smog',
            blurb: ["Are ya feelin' lazy or is it just hazy out there, today?"]
        },
        Dust: {
            src: "./weather-imgs/smog.svg",
            icon: 'fa-smog',
            blurb: ['The air be crusty and dusty.']
        },
        Fog: {
            src: "./weather-imgs/smog.svg",
            icon: 'fa-smog',
            blurb: ['Prepare to venture into the fog!']
        },
        Sand: {
            src: "./weather-imgs/smog.svg",
            icon: 'fa-smog',
            blurb: ["Hope you understand, there's gonna be sand!"]
        },
        Ash: {
            src: "./weather-imgs/volcanic-ash.svg",
            icon: 'fa-volcano',
            blurb: ['What in the Pompeii is happening!?']
        },
        Squall: {
            src: "./weather-imgs/squall.svg",
            icon: 'fa-wind',
            blurb: ['The weather and wind be intense!']
        },
        Tornado: {
            src: "./weather-imgs/tornado.svg",
            icon: 'fa-tornado',
            blurb: ['Dorothy & Toto, get ready for a Tornado!']
        }
    }

    // console.log(weatherConditionMap);

    //Today Condition
    const todayCondition = today.weather[0].main;
    const todayConfig = weatherConditionMap[todayCondition];
    document.getElementById('today-weather-icon').className = 
        `fa-solid ${todayConfig.icon}`;
    document.getElementById('frog-img').src = todayConfig.src;
    document.getElementById('blurb').textContent = todayConfig.blurb;
        // console.log(todayConfig.icon);
    
    //Next Day Condition
    const nextDayCondition = nextDay.weather[0].main;
    const nextDayConfig = weatherConditionMap[nextDayCondition];
    document.getElementById('next-day-weather-icon').className = 
        `fa-solid ${nextDayConfig.icon}`;
        
    //Day After Next Condition
    const dayAfterNextCondition = dayAfterNext.weather[0].main;
    const dayAfterNextConfig = weatherConditionMap[dayAfterNextCondition];
    document.getElementById('day-after-next-weather-icon').className = 
        `fa-solid ${dayAfterNextConfig.icon}`;
        // console.log(dayAfterNextCondition);

// Get Elements By ID & update content below
//Current Condition Info
    document.getElementById('current-temp-value').textContent = `${currentTemp}${tempSymbol}`;
    document.getElementById('uv-index-value').textContent = currentUvIndex;
    document.getElementById('humidity-value').textContent = `${currentHumidityPercent}%`;
    document.getElementById('wind-speed-value').textContent = `${currentWindSpeedMph} ${speedSymbol}`;

//Forecast Info
    //Today
    document.getElementById('today').textContent = todayName.toUpperCase();
    document.getElementById('today-high-temp').textContent = `${todayHighTempF}${tempSymbol}`;
    document.getElementById('today-low-temp').textContent = `${todayLowTempF}${tempSymbol}`;
    // document.getElementById('today-weather-icon').src = todayIconUrl;
    //Next Day
    document.getElementById('next-day').textContent = nextDayName.toUpperCase();
    document.getElementById('next-day-high-temp').textContent = `${nextDayHighTempF}${tempSymbol}`;
    document.getElementById('next-day-low-temp').textContent = `${nextDayLowTempF}${tempSymbol}`;
    //Day After Next Day
    document.getElementById('day-after-next').textContent = dayAfterNextDayName.toUpperCase();
    document.getElementById('day-after-next-high-temp').textContent = `${dayAfterNextHighTempF}${tempSymbol}`;
    document.getElementById('day-after-next-low-temp').textContent = `${dayAfterNextLowTempF}${tempSymbol}`;
} 

function renderAll(lat, long) {
    render();
    renderDay();
    renderDate();
    updateWeatherInfo(lat, long);
}

render();
renderDay();
renderDate();