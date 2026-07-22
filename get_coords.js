async function getCoords() {
    const places = [
        "Terminal Rodoviário Montes Claros",
        "Universidade Estadual de Montes Claros",
        "Estação Ferroviária Montes Claros",
        "Parque das Mangueiras Montes Claros",
        "Praça do Maracanã Montes Claros",
        "Parque Municipal Candido Canela Montes Claros",
        "Bar e Restaurante Do Djalma Montes Claros",
        "Churrascaria Montes Claros"
    ];

    for (const place of places) {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`;
        try {
            const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }});
            const data = await res.json();
            if (data.length > 0) {
                console.log(`${place}: ${data[0].lat}, ${data[0].lon}`);
            } else {
                console.log(`${place}: Not found`);
            }
        } catch (e) {
            console.log(`Error for ${place}: ${e}`);
        }
        await new Promise(r => setTimeout(r, 1000));
    }
}
getCoords();
