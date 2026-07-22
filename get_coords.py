from geopy.geocoders import Nominatim

geolocator = Nominatim(user_agent="my_app")

places = [
    "Terminal Rodoviário Montes Claros",
    "Unimontes Montes Claros",
    "Estação Ferroviária Montes Claros",
    "Parque das Mangueiras Montes Claros",
    "Praça do Maracanã Montes Claros",
    "Parque Municipal Candido Canela Montes Claros"
]

for place in places:
    location = geolocator.geocode(place)
    if location:
        print(f"{place}: {location.latitude}, {location.longitude}")
    else:
        print(f"{place}: Not found")
