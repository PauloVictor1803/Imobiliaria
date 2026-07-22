const fetch = require('node-fetch');
async function getCoords() {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent("Vila Antônio Canela Montes Claros")}&format=json&limit=1`;
    try {
        const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }});
        const data = await res.json();
        console.log(data);
    } catch (e) {}
}
getCoords();
