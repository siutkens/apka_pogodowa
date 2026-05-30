// TODO: Pobierz wszystkie potrzebne elementy html i przypisz je do zmiennych
const cityName = document.querySelector('p.city-name');
const input = document.querySelector('input');
const date = document.querySelector('p.date');
const temp = document.querySelector('p.temp');
const description = document.querySelector('p.description');
const feelsLike = document.querySelector('p.feels-like');
const windSpeed = document.querySelector('p.wind-speed');
const pressure = document.querySelector('p.pressure');
const humidity = document.querySelector('p.humidity');
const visibility = document.querySelector('p.visibility');
const clouds = document.querySelector('p.clouds');
const rain = document.querySelector('p.rain');
const errorMsg = document.querySelector('p.error-message');

const apiInfo = {
    link: "https://api.openweathermap.org/data/2.5/weather?q=",
    key: "",
    units: "&units=metric",
    lang: "&lang=pl"
}

function getWeather() {
    const apiCity = input.value.toLowerCase().trim();
    const URL = `${apiInfo.link}${apiCity}${apiInfo.key}${apiInfo.units}${apiInfo.lang}`;
    //consol.log(URL);

    axios.get(URL).then((response) => {
        console.log(response);
        cityName.textContent = `${response.data.name}, ${response.data.sys.country}`;
        //date.textContent = new Date(1000 * `${response.data.dt}`);
        temp.textContent = `${response.data.main.temp} °C`;
        description.textContent = `${response.data.weather[0].description}`;
        feelsLike.textContent = `${response.data.main.feels_like} °C`;
        windSpeed.textContent = `${response.data.wind.speed} km/h`;
        pressure.textContent = `${response.data.main.pressure} hPa`;
        humidity.textContent = `${response.data.main.humidity} %RHS`;
        visibility.textContent = `${response.data.visibility / 1000} km`;
        clouds.textContent = `${response.data.clouds.all} %`;
        rain.textContent = `${response.data.visibility}`;
    }).catch((error) => {
        console.log(error);

        if (error.response && error.response.data && error.response.data.message) {
            errorMsg.textContent = error.response.data.message;
        } else {
            errorMsg.textContent = 'Wystąpił błąd podczas pobierania pogody.';
        }

        [
            cityName, date, description, temp, feelsLike, windSpeed,
            pressure, humidity, visibility, clouds, rain
        ].forEach((el) => {
            el.textContent = '';
        });
    }).finally(() => {
        input.value = '';
    })
}


function getWeatherbyEnter(e) {
    if (e.key === 'Enter') {
        getWeather();
    }
}

input.addEventListener('keypress', getWeatherbyEnter);