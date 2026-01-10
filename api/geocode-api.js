export default async function handler(req, res) {
    const { lat, lon } = req.query;

    const url =
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json(data);
}