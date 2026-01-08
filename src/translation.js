
export const localeConfig = {
    en: { ui: "en-US", weather: "en", units: "imperial" },
    pt: { ui: "pt-PT", weather: "pt", units: "metric" }
};

// --- i18next Setup --- English to Portuguese Translation
i18next.init({
lng: "en",
resources: {
    en: { 
        translation: {
            english: "English",
            portuguese: "Portuguese",
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
            english: "Inglês",
            portuguese: "Português",
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
export const keysToDocIdsMap = {
    english: "english",
    portuguese: "portuguese",
    localConditions: "local-conditions",
    uvi: "uv-index",
    humidity: "humidity",
    windSpeed: "wind-speed",
    forecast: "3-day-forecast",
    today: "today",
    high: ["high-today", "high-next-day", "high-day-after-next"],
    low: ["low-today", "low-next-day", "low-day-after-next"],
};

// --- Helper Functions ---
export function getCurrentConfig() {
    return localeConfig[i18next.language] || localeConfig.en;
}

export function getCurrentLocale() {
    return getCurrentConfig().ui;
}