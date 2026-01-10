export default async function handler(req, res) {
    const { lat, lon, units, lang } = req.query;

    const url =
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=${units}&lang=${lang}&appid=${process.env.OPENWEATHER_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json(data);
}