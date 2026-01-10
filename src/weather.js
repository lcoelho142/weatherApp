import { getCurrentConfig, getCurrentLocale } from "./translation.js";
import { setCurrentCondition, capitalize, renderTranslatedInfo, renderCurrentBlurb, currentCondition } from "./index.js";

// ALL Functions (Define these before you call them)
export const updateWeatherInfo = async (lat, lon) => {
    // 1. Get Config & Units
    const { units, weather: langCode } = getCurrentConfig();
    const isMetric = units === "metric";
    const tempSymbol = isMetric ? "°C" : "°F";
    const speedSymbol = isMetric ? "km/h" : "mph";

    const weatherUrl = 
    `https://https://weather-app-mauve-three-68.vercel.app/api/weather?lat=${lat}&lon=${lon}&units=${units}&lang=${langCode}`;
    
    const geoUrl = 
        `https://https://weather-app-mauve-three-68.vercel.app/api/geocode?lat=${lat}&lon=${lon}`;

    

    try {

        const googleRes = await fetch(geoUrl);
        const googleData = await googleRes.json();
        const comps = googleData.results[0].address_components;
        let city = "";
        let state = "";
        let country = "";

        comps.forEach(component => {
            const types = component.types;
            if (types.includes("locality")) {
                city = component.long_name;
            } else if (types.includes("administrative_area_level_1")) {
                state = component.short_name; // e.g., "CT"
            } else if (types.includes("country")) {
                country = component.short_name; // e.g., "US"
            }
        });

        if (!city) {
            const fallback = comps.find(c => c.types.includes("sublocality") || c.types.includes("postal_town"));
            city = fallback ? fallback.long_name : "";
        }

        document.getElementById('city').textContent = city;
        document.getElementById('region').textContent = `${state}, ${country}`;

        const res = await fetch(weatherUrl);
        const data = await res.json();

        // --- 1. CURRENT WEATHER (The "Right Now" Data) ---
        const currentTemp = Math.round(data.current.temp);
        const newCondition = data.current.weather[0].main;
        setCurrentCondition(newCondition);
        const currentConditionSummary = data.current.weather[0].description;
        const currentConfig = weatherConditionMap[currentCondition] || weatherConditionMap.Clouds;

        // Update Big Main Display
        document.getElementById('current-temp-value').textContent = `${currentTemp}${tempSymbol}`;
        document.getElementById('condition-summary').textContent = capitalize(currentConditionSummary);
        document.getElementById('frog-img').src = currentConfig.src;

        // Update "Today" in Forecast Row
        document.getElementById('today').textContent = i18next.t('today').toUpperCase();
        document.getElementById('today-weather-icon').className = `fa-solid ${currentConfig.icon}`;
    
        // High/Low for Today (Still from daily[0])
        document.getElementById('today-high-temp').textContent = `${Math.round(data.daily[0].temp.max)}${tempSymbol}`;
        document.getElementById('today-low-temp').textContent = `${Math.round(data.daily[0].temp.min)}${tempSymbol}`;

        // --- 2. FUTURE FORECAST (Starting from Tomorrow) ---
        const locale = getCurrentLocale();
    
        // We map indices 1 and 2 to the HTML elements
        const forecastDays = [null, document.getElementById('next-day'), document.getElementById('day-after-next')];
        const forecastHighs = [null, "next-day-high-temp", "day-after-next-high-temp"];
        const forecastLows = [null, "next-day-low-temp", "day-after-next-low-temp"];
        const forecastIcons = [null, "next-day-weather-icon", "day-after-next-weather-icon"];

        for (let i = 1; i < 3; i++) {
            const dayData = data.daily[i];
            const dayCondition = dayData.weather[0].main;
            const dayConfig = weatherConditionMap[dayCondition] || weatherConditionMap.Clouds;

            // Update Day Name
            forecastDays[i].textContent = new Date(dayData.dt * 1000)
            .toLocaleDateString(locale, { weekday: 'short' }).toUpperCase();

            // Update Temps
            document.getElementById(forecastHighs[i]).textContent = `${Math.round(dayData.temp.max)}${tempSymbol}`;
            document.getElementById(forecastLows[i]).textContent = `${Math.round(dayData.temp.min)}${tempSymbol}`;

            // Update Icon
            document.getElementById(forecastIcons[i]).className = `fa-solid ${dayConfig.icon}`;
        }

        // Update remaining UI (UV, Humidity, Wind, Blurbs)
        document.getElementById('uv-index-value').textContent = Math.round(data.current.uvi);
        document.getElementById('humidity-value').textContent = `${Math.round(data.current.humidity)}%`;
        document.getElementById('frog-img').src = currentConfig.src;


        let speed = data.current.wind_speed;
        if (isMetric) speed = speed * 3.6; 
        document.getElementById('wind-speed-value').textContent = `${Math.round(speed)} ${speedSymbol}`;

        renderTranslatedInfo(); 
        renderCurrentBlurb();

    } catch (error) {
    console.error("Error fetching weather:", error);
    }

}

// Update Icons & Frog
export const weatherConditionMap = {
    Clear: { src: "./weather-imgs/sunny.svg", icon: 'fa-sun' },
    Clouds: { src: "./weather-imgs/cloudy.svg", icon: 'fa-cloud' },
    Rain: { src: "./weather-imgs/rain-shower.svg", icon: 'fa-cloud-showers-heavy' },
    Snow: { src: "./weather-imgs/snowy.svg", icon: 'fa-snowflake' },
    Thunderstorm: { src: "./weather-imgs/thunderstorm.svg", icon: 'fa-cloud-bolt' },
    Drizzle: { src: "./weather-imgs/drizzle.svg", icon: 'fa-cloud-rain' },
    Mist: { src: "./weather-imgs/smog.svg", icon: 'fa-smog' },
    Smoke: { src: "./weather-imgs/smog.svg", icon: 'fa-smog' },
    Haze: { src: "./weather-imgs/smog.svg", icon: 'fa-smog' },
    Dust: { src: "./weather-imgs/smog.svg", icon: 'fa-smog' },
    Fog: { src: "./weather-imgs/smog.svg", icon: 'fa-smog' },
    Sand: { src: "./weather-imgs/smog.svg", icon: 'fa-smog' },
    Ash: { src: "./weather-imgs/volcanic-ash.svg", icon: 'fa-volcano' },
    Squall: { src: "./weather-imgs/squall.svg", icon: 'fa-wind' },
    Tornado: { src: "./weather-imgs/tornado.svg", icon: 'fa-tornado' },
    // Fallback 
    Default: { src: "./weather-imgs/cloudy.svg", icon: 'fa-cloud' }
};