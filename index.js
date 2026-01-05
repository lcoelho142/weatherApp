let currentLat;
let currentLong;
let currentCondition = "Clear"; //Default
let activeBlurbIndex = null; // Stores current Blurb

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
            english: "english",
            portuguese: "portuguese",
            conditionSum: "...",
            localConditions: "Local Conditions",
            uvi: "UV Index",
            humidity: "Humidity",
            windSpeed: "Wind Speed",
            forecast: "3-Day Forecast",
            today: "Today",
            high: "High",
            low: "Low",

            weather: {
                Clear: ["100% chance of my skin glistening!", "I'm melting. Someone get me a leaf!", "The sun is way too loud right now."],
                Clouds: ["The sky is officially boring.", "Just pick a mood, clouds, seriously.", '50 shades of "meh."'],
                Rain: ["Finally, proper hydration!", "Feeling quite moist at the moment.", "The clouds are sobbing!"],
                Snow: ["My toes are literally popsicles.", "I can't feel my legs. Everything is fine.", "Who invited the freezer to the party?"],
                Thunderstorm: ["The clouds are fighting. Again.", "Who keeps taking photos with the flash on?", "Okay, we get it, you're angry."],
                Drizzle: ["The sky is crying again!", "Just enough rain to be annoying.", "Not even enough water for a bath."],
                Mist: ["Mysterious? No, just very damp.", "Hello? Is anyone out there?", "I can't see!"],
                Smoke: ["Smells like a campfire, minus the food.", "Who burned the flies? Oh, it's the air.", "My lungs totally love the smolder."],
                Haze: ["It's like the sky forgot its glasses!", "The air is thick today. Cool.", "Is it sunny? Is it cloudy? Who Knows!"],
                Dust: ["The air is crusty and dusty.", "I'm 50% frog, 50% dirt now.", "Nature needs a vacuum cleaner!"],
                Fog: ["Walking into trees is my new hobby.", "The world has vanished. Good luck!", "I've lost my lily pad. Fantastic."],
                Sand: ["Please, I just want one drop of water!", "The desert called, it wants its air back.", "Looking for an Oasis right now."],
                Ash: ["This grey snow tastes like rocks.", "The mountain is throwing a tantrum!", "I am now a statue of a frog."],
                Squall: ["Make up your mind, sky!", "A sudden storm? How original.", "And just like that, I am soaking wet."],
                Tornado: ["Why am I flying? I don't have wings.", "The wind is being very aggressive!", "See you in the next pond over!"]
            }
        }
    },
    pt: { 
        translation: { 
            english: "inglês",
            portuguese: "português",
            conditionSum: "...",
            localConditions: "Condições Locais",
            uvi: "Índice UV",
            humidity: "Humidade",
            windSpeed: "Velocidade do Vento",
            forecast: "Previsão de 3 Dias",
            today: "Hoje",
            high: "Máxima",
            low: "Mínima",
            
            weather: {
                Clear: ["100% de probabilidade de a minha pele ficar brilhante!", "Estou a derreter. Alguém me traga uma folha!", "O sol está muito forte agora."],
                Clouds: ["O céu está oficialmente aborrecido.", "Escolham um humor, nuvens, a sério.", '50 tons de “meh”.'],
                Rain: ["Finalmente, hidratação adequada!", "Sinto-me bastante hidratado neste momento.", "As nuvens estão a chorar!"],
                Snow: ["Os meus dedos dos pés estão literalmente congelados.", "Não sinto as minhas pernas. Está tudo bem.", "Quem convidou o congelador para a festa?"],
                Thunderstorm: ["As nuvens estão a lutar. Outra vez.", "Quem é que continua a tirar fotos com o flash ligado?", "Está bem, já percebemos, estás zangado."],
                Drizzle: ["O céu está a chorar outra vez!", "Chove o suficiente para ser irritante.", "Não há água suficiente nem para tomar banho"],
                Mist: ["Misterioso? Não, apenas muito húmido.", "Olá? Está alguém aí?", "Não consigo ver!"],
                Smoke: ["Cheira a fogueira, sem a comida.", "Quem queimou as moscas? Ah, é o ar.", "Os meus pulmões adoram o cheiro a fumo."],
                Haze: ["É como se o céu tivesse esquecido os óculos!", "O ar está pesado hoje. Fresco.", "Está ensolarado? Está nublado? Quem sabe!"],
                Dust: ["O ar está seco e empoeirado.", "Agora sou 50% sapo, 50% sujidade.", "A natureza precisa de um aspirador!"],
                Fog: ["Esbarrar em árvores é o meu novo passatempo.", "O mundo desapareceu. Boa sorte!", "Perdi o meu nenúfar. Fantástico."],
                Sand: ["Por favor, só quero uma gota de água!", "O deserto ligou, quer o seu ar de volta", "À procura de um oásis agora mesmo."],
                Ash: ["Esta neve cinzenta tem gosto de pedras.", "A montanha está a fazer birra!", "Agora sou uma estátua de sapo."],
                Squall: ["Decida-se, céu!", "Uma tempestade repentina? Que original.", "E assim, sem mais nem menos, estou completamente encharcado."],
                Tornado: ["Porque estou a voar? Não tenho asas.", "O vento está muito forte!", "Vemo-nos no próximo lago!"]
            }
        } 
    }
}
});

// For linking translation to id name
const translationMap = {
    english: "english",
    portuguese: "portuguese",
    conditionSum: "condition-summary",
    localConditions: "local-conditions",
    uvi: "uv-index",
    humidity: "humidity",
    windSpeed: "wind-speed",
    forecast: "3-day-forecast",
    today: "today",
    high: ["high-today", "high-next-day", "high-day-after-next"],
    low: ["low-today", "low-next-day", "low-day-after-next"],
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

function updateBlurb() {
    const blurbElement = document.getElementById("weather-blurb");
    // Fetch translated array from i18next
    const blurbs = i18next.t(`weather.${currentCondition}`, { returnObjects: true });
    // Pick a random index
    if (Array.isArray(blurbs) && blurbElement) {
        // Pick random blurb
        blurbElement.textContent = blurbs[activeBlurbIndex];
    }
    // console.log(blurbs);
}

function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getCurrentLocale() {
    return getCurrentConfig().ui;
}

async function changeLanguage(lang, lat, long) {
    await i18next.changeLanguage(lang, () => {
        render();
        renderDay();
        renderDate();
        updateBlurb()
        renderAll(lat, long);
    });
    render();
    updateBlurb();
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
    document.getElementById("day").textContent = capitalize(dayName);
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
    document.getElementById("date").textContent = dateString.toUpperCase();
        
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
    const { units, weather: langCode } = getCurrentConfig();

    // Define uinits based on current setting
    const isMetric = units === "metric";
    const tempSymbol = isMetric ? "°C" : "°F";
    const speedSymbol = isMetric ? "km/h" : "mph";

    const weatherApiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&units=${units}&lang=${langCode}&appid=35b058347c0103ccb9299fc20d824cae`;
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
    currentCondition = data.current.weather[0].main;
    // console.log("Current weather is now:", currentCondition);
    const blurbs = i18next.t(`weather.${currentCondition}`, { returnObjects: true });
    if (Array.isArray(blurbs)) {
        if (activeBlurbIndex === null) {
            activeBlurbIndex = Math.floor(Math.random() * blurbs.length)
        };
    }
    const currentConditionSummary = data.current.weather[0].description;
    render();
    updateBlurb();
    

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
            icon: 'fa-sun'
        },
        Clouds: {
            src: "./weather-imgs/cloudy.svg",
            icon: 'fa-cloud'
        },
        Rain: {
            src: "./weather-imgs/rain-shower.svg",
            icon: 'fa-cloud-showers-heavy'
        },
        Snow: {
            src: "./weather-imgs/snowy.svg",
            icon: 'fa-snowflake'
        },
        Thunderstorm: {
            src: "./weather-imgs/thunderstorm.svg",
            icon: 'fa-cloud-bolt'
        },
        Drizzle: {
            src: "./weather-imgs/drizzle.svg",
            icon: 'fa-cloud-rain'
        },
        Mist: {
            src: "./weather-imgs/smog.svg",
            icon: 'fa-smog'
        },
        Smoke: {
            src: "./weather-imgs/smog.svg",
            icon: 'fa-smog'
        },
        Haze: {
            src: "./weather-imgs/smog.svg",
            icon: 'fa-smog'
        },
        Dust: {
            src: "./weather-imgs/smog.svg",
            icon: 'fa-smog'
        },
        Fog: {
            src: "./weather-imgs/smog.svg",
            icon: 'fa-smog'
        },
        Sand: {
            src: "./weather-imgs/smog.svg",
            icon: 'fa-smog'
        },
        Ash: {
            src: "./weather-imgs/volcanic-ash.svg",
            icon: 'fa-volcano'
        },
        Squall: {
            src: "./weather-imgs/squall.svg",
            icon: 'fa-wind'
        },
        Tornado: {
            src: "./weather-imgs/tornado.svg",
            icon: 'fa-tornado'
        }
    }

    // console.log(weatherConditionMap);

    //Today Condition
    const todayCondition = data.current.weather[0].main;
    const todayConfig = weatherConditionMap[todayCondition];
    document.getElementById('today-weather-icon').className = 
        `fa-solid ${todayConfig.icon}`;
    document.getElementById('frog-img').src = todayConfig.src;
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
    document.getElementById('condition-summary').textContent = currentConditionSummary;
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
    updateWeatherInfo(lat, long);
}

renderDay();
renderDate();