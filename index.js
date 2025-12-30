// English to Portuguese Translation
i18next.init({
lng: "en",
resources: {
    en: { 
        translation: {
            english: "English",
            portuguese: "Portuguese",
            currentTemp: "Current Temperature",
            localConditions: "Local Conditions",
            uvi: "UV Index",
            humidity: "Humidity",
            windSpeed: "Wind Speed",
            forecast: "3-Day Forecast",
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

function getCurrentLocale() {
    return i18next.language === "pt" ? "pt-PT" : "en-US";
}

function renderAll() {
    render();
    renderDay();
    renderDate();
}
renderAll();

// Language Toggle Button on Click
const langSelect = document.getElementById("lang-select");
langSelect.addEventListener("change", e => {
    i18next.changeLanguage(e.target.value, render);
});


// Get Day of the Week
function renderDay() {
    const locale = getCurrentLocale();
    const today = new Date();

    document.getElementById("day").textContent =
        today.toLocaleDateString(locale, { weekday: "long" });
}
// const days = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
// document.getElementById("day").textContent = days[new Date().getDay()];

// Get Calendar Date
function renderDate() {
    const locale = getCurrentLocale();
    const today = new Date();

    document.getElementById("date").textContent =
        today.toLocaleDateString(locale, { 
            month: "short",
            day: "numeric",
            year: "numeric"
        });
}
// const date = new Date();
// document.getElementById("date").textContent =
// date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

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
    // console.log(todayName);
    // const todayIconCode = today.weather[0].icon;
    // // console.log(todayIconCode);
    // const todayIconUrl = `https://openweathermap.org/img/wn/${todayIconCode}@2x.png`;
    // // console.log(todayIconUrl);

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
    document.getElementById('current-temp-value').textContent = `${currentTempKelvin}°F`;
    document.getElementById('uv-index-value').textContent = currentUvIndex;
    document.getElementById('humidity-value').textContent = `${currentHumidityPercent}%`;
    document.getElementById('wind-speed-value').textContent = `${currentWindSpeedMph} mph`;

//Forecast Info
    //Today
    document.getElementById('today').textContent = todayName.toUpperCase();
    document.getElementById('today-high-temp').textContent = `${todayHighTempF}°F`;
    document.getElementById('today-low-temp').textContent = `${todayLowTempF}°F`;
    // document.getElementById('today-weather-icon').src = todayIconUrl;
    //Next Day
    document.getElementById('next-day').textContent = nextDayName.toUpperCase();
    document.getElementById('next-day-high-temp').textContent = `${nextDayHighTempF}°F`;
    document.getElementById('next-day-low-temp').textContent = `${nextDayLowTempF}°F`;
    //Day After Next Day
    document.getElementById('day-after-next').textContent = dayAfterNextDayName.toUpperCase();
    document.getElementById('day-after-next-high-temp').textContent = `${dayAfterNextHighTempF}°F`;
    document.getElementById('day-after-next-low-temp').textContent = `${dayAfterNextLowTempF}°F`;
} 