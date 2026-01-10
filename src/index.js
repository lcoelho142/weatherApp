import { 
    localeConfig, 
    keysToDocIdsMap as translationKeysToDocIdsMap, 
    getCurrentConfig,
    getCurrentLocale
} from "./translation.js";

import { 
    updateWeatherInfo,
    weatherConditionMap
} from "./weather.js";


// --- Global State ---
let currentLat = null;
let currentLon = null;
export let currentCondition = "Clear"; //Default
let lastCondition = null;
let currentBlurbIndex = null;

// --- Global function ---
export function setCurrentCondition(newCondition) {
    currentCondition = newCondition;
}

// --- DOM Elements ---
const locationForm = document.getElementById('location-form');
const cityInput = document.getElementById('city-input');
const langSelect = document.getElementById("lang-select");

// --- Initialization ---

navigator.geolocation.getCurrentPosition(
    pos => {
        // Success: form stays hidden (display: none)
        currentLat = pos.coords.latitude;
        currentLon = pos.coords.longitude;

        updateWeatherInfo(currentLat, currentLon);
        // console.log(currentLat, currentLon);
    },
    error => {
        //Error: only now show form
        console.log("Geolocation failed:", error);
        document.body.classList.add('modal-open');
        locationForm.style.display = 'flex';
    },
    { timeout: 5000 } // browser gives up after 5 seconds
);


export function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// --- Render Logic ---

export function renderTranslatedInfo() {
    Object.entries(translationKeysToDocIdsMap).forEach(([key, value]) => {
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

export function renderCurrentBlurb() {
    const blurbElement = document.getElementById("weather-blurb");
    if (!blurbElement) return;

    if (currentCondition !== lastCondition) {
        currentBlurbIndex = null;
        lastCondition = currentCondition;
    }
    
    // 1. Fetch the array of blurbs based on the current weather (e.g., 'Rain')
    const blurbs = i18next.t(`weather.${currentCondition}`, { returnObjects: true });

    // 2. Safety check: Ensure we got an array and it's not empty
    if (Array.isArray(blurbs) && blurbs.length > 0) {
        // 3. If we don't have an index yet, pick a random one
        if (currentBlurbIndex === null || currentBlurbIndex >= blurbs.length) {
            currentBlurbIndex = Math.floor(Math.random() * blurbs.length);
        }
        // 4. Set the text
        blurbElement.textContent = blurbs[currentBlurbIndex];
    } else {
        blurbElement.textContent = ""; // Clear if no blurbs found
    }
}

function renderCurrentWeekDay() {
    const locale = getCurrentLocale();
    const today = new Date();
    const dayName = today.toLocaleDateString(locale, { weekday: "long" });
    document.getElementById("day").textContent = capitalize(dayName);
}

function renderCurrentCalendarDate() {
    const locale = getCurrentLocale();
    const today = new Date();

    const dateString = today.toLocaleDateString(locale, { 
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    document.getElementById("date").textContent = dateString.toUpperCase();    
}

// --- Event Listeners ---

// 1. Unified Form Submit Handler
locationForm.addEventListener('submit', async e => {
    e.preventDefault();
    const city = cityInput.value;
    if(!city) return;

    try {
        const res = await fetch(`/api/geocode?address=${encodeURIComponent(city)}`);
        const data = await res.json();

        if (!data.results.length) {
            alert("Location not found!");
            return;
        }

        const { lat, lng } = data.results[0].geometry.location;

        // CRITICAL FIX: Update the global variables!
        currentLat = lat;
        currentLon = lng;

        // Close modal
        document.body.classList.remove('modal-open');
        locationForm.style.display = 'none';

        // Update App
        updateWeatherInfo(lat, lng);

    } catch (error) {
        console.error("Geocoding error:", error);
    }
});

// 2. Language Change Handler 
langSelect.addEventListener("change", async e => {
    const lang = e.target.value;
    
    // Await the language change in i18next
    await i18next.changeLanguage(lang);
    
    // Update simple text elements
    renderTranslatedInfo();
    renderCurrentWeekDay();
    renderCurrentCalendarDate();
    renderCurrentBlurb();
    
    // Update weather data (re-fetches API with new units/lang)
    // Checks if currentLat exists (handling the case where user changes lang before location is set)
    if (currentLat && currentLon) {
        updateWeatherInfo(currentLat, currentLon);
    }
});

// Initial Render
renderCurrentWeekDay();
renderCurrentCalendarDate();
renderCurrentBlurb();