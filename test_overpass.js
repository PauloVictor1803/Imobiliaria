import fetch from 'node-fetch';
async function run() {
  const query = `
    [out:json][timeout:25];
    nwr["shop"="supermarket"](-16.78,-43.9,-16.68,-43.8);
    out center;
  `;
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: "data=" + encodeURIComponent(query)
  });
  const data = await res.json();
  console.log("Supermarkets found:", data.elements.length);
  const saoJudas = data.elements.find(e => e.tags && e.tags.name && e.tags.name.includes("Judas"));
  console.log("Found São Judas?", saoJudas);
}
run();
