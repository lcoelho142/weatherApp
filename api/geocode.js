export default async function handler(req, res) {
    const { lat, lon, address } = req.query;
    let url = "";

    if (address) {
        // If the user typed a city name
        url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    } else {
        // If we are using coordinates (auto-location)
        url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
}