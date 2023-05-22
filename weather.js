let weather = document.querySelector("#weather");
let locationTimezone = document.querySelector(".location-timezone");
let setIcon = document.querySelector(".icon");
let temperatureDescription = document.querySelector(".temperature-description");
let temperatureDegree = document.querySelector(".temperature-degree");
let maxTemperature = document.querySelector(".maxTemp");
let minTemperature = document.querySelector(".minTemp");
let windSpeed = document.querySelector(".windSpeed")
let long = "";
let lat = "";
weather.addEventListener('click', expandTab);

function expandTab() {
    if (!weather.classList.contains('expand')) {
        weather.classList.add('expand');

        setTimeout(() => {
            weather.classList.remove('expand');
        }, 3000);
    } else {
        weather.classList.remove('expand');
    }
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async position => {
        long += position.coords.longitude;
        lat += position.coords.latitude;
        const data = await getWeatherData(lat, long);
        // To Draw a India map using leaflet
        // 
        var map = L.map('map').setView([20.9716, 80.5946], 5);
        L.tileLayer('https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=MyNHkqB4pCO7ELnZhaGK', {
            attribution: `<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>`
        }).addTo(map);

        // To show a marker on the india map with the name of the place
        var marker = L.marker([lat, long]).addTo(map);
        marker.bindPopup(data.name).openPopup();

        map.on('click', async function (e) {

            console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)

            // Calling the weather api with new lat long
            const data = await getWeatherData(e.latlng.lat, e.latlng.lng);

            // Showing the marker at the clicked position with the city name(position name)
            marker.setLatLng([e.latlng.lat, e.latlng.lng]);
            marker.bindPopup(data.name).openPopup();
        });
    })
}


async function getWeatherData(lat, long) {
    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=1284186ccfb3e1eb21ae5516b77ce205`
    let response = await fetch(api);
    let data = await response.json();
    weatherDataHandler(data);
    return data;
}

function weatherDataHandler(data) {
    const {
        temp,
        temp_max,
        temp_min
    } = data.main;
    const {
        description,
        icon
    } = data.weather[0];
    const {
        speed
    } = data.wind;

    temperatureDegree.innerHTML = temp + '\xB0' + ' C';
    maxTemperature.innerHTML = 'max: '+ temp_max + '\xB0' + ' C';
    minTemperature.innerHTML = 'min: ' + temp_min + '\xB0' + ' C';
    temperatureDescription.innerHTML=description
    windSpeed.innerHTML = 'Wind Speed: ' + speed + ' m/s';
    locationTimezone.innerHTML = data.name;
    setIcon.style["background-image"] = `url(${setIconFunction(icon)})`;
}

function setIconFunction(icon) {
    const icons = {
        "01d": "./animated/day.svg",
        "02d": "./animated/cloudy-day-1.svg",
        "03d": "./animated/cloudy-day-2.svg",
        "04d": "./animated/cloudy-day-3.svg",
        "09d": "./animated/rainy-1.svg",
        "10d": "./animated/rainy-2.svg",
        "11d": "./animated/rainy-3.svg",
        "13d": "./animated/snowy-6.svg",
        "50d": "./animated/mist.svg",
        "01n": "./animated/night.svg",
        "02n": "./animated/cloudy-night-1.svg",
        "03n": "./animated/cloudy-night-2.svg",
        "04n": "./animated/cloudy-night-3.svg",
        "09n": "./animated/rainy-1.svg",
        "10n": "./animated/rainy-2.svg",
        "11n": "./animated/rainy-3.svg",
        "13n": "./animated/snowy-6.svg",
        "50n": "./animated/mist.svg"
    };
    return icons[icon]
}