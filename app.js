console.log('This is a weather app');

// This is the API key of my free account on openweathermap.org
const apiKey = 'a39e510433962c881582475bc0333e5a';

// Builds request url to obtain coordinates
function buildCoordsUrl(cityName, apiKey) {
    return `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${apiKey}`;
}

// Builds request url to obtain weather forecast
function buildForecastUrl(coordinates, units) {
    return `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=daily,hourly,minutely,alerts&units=${units}&appid=20f7632ffc2c022654e4093c6947b4f4`;
}

// Returns coordinates, city name and country for a specified city name.
async function getCoord(url) {
    const response = await fetch(url, { mode: 'cors' });
    const data = await response.json();
    console.log(data);
    //console.log(data.name);
    //console.log(data.sys.country);
    //console.log(data.coord.lat);
    //console.log(data.coord.lon);
    const coord = {};
    coord.name = data.name;
    coord.country = data.sys.country;
    coord.lat = data.coord.lat;
    coord.lon = data.coord.lon;
    console.log(coord);

    // coord is a promise
    return coord;
}

async function getForecast(url) {
    const response = await fetch(url, { mode: 'cors' });
    const data = await response.json();
    console.log(data);

    // data is a promise
    return data;
}

// main function that uses getForecast (and getCoord)
async function getWeather(userLocation = "Milan") {

    // Building url to get coord for the initial city(Rome in this case)
    let coordUrl = buildCoordsUrl(userLocation, apiKey);
    console.log(`url: ${coordUrl}`);

    // Is needed to wait until this promise is resolved, otherwise we will have 
    // undefined coordinates
    let coord = await getCoord(coordUrl);

    // Building url to get forecast, passing the premise coord of the give city
    let forecastUrl = buildForecastUrl(coord, 'metric');
    console.log(`forecast url: ${forecastUrl}`);
    let forecastData = await getForecast(forecastUrl);

    // process the forecst data to extract only the data the app uses
    let processedData = processData(coord, forecastData);

    // passing the processed data to the function that will select and display 
    // the data, interacting with the DOM
    displayData(processedData);

}

function processData(coord, weatherData) {
    // grab all the data to display on the page
    const myData = {
        weatherDescription: weatherData.current.weather[0].description,
        feelsLike: Math.round(weatherData.current.feels_like),
        temperature: Math.round(weatherData.current.temp),
        windSpeed: Math.round(weatherData.current.wind_speed),
        humidity: weatherData.current.humidity,
        location: coord.name,
        country: coord.country,
    };

    console.log(myData);

    return myData;
}

function displayData(newData) {
    
    document.querySelector('#location').textContent = newData.location;
    document.querySelector('#weather-description').textContent = newData.weatherDescription;
    document.querySelector('#temperature').textContent = 'Current temperature: ' + newData.temperature + ' °C';
    document.querySelector('#feels-like').textContent = 'Feels like: '+newData.feelsLike + ' °C';
    document.querySelector('#wind-speed').textContent = 'Wind speed: '+ newData.windSpeed + ' meter/sec';
    document.querySelector('#humidity').textContent = 'Humidity: '+ newData.humidity + ' %';
    /*
    
    ).textContent = `HUMIDITY: ${newData.humidity}`;
    */

}


// get location from user
function fetchWeather() {
    const input = document.querySelector('#search-input');
    const userLocation = input.value;
    getWeather(userLocation);
}

function handleSubmit(e) {
    e.preventDefault();
    fetchWeather();
}


const searchForm = document.querySelector('#search-form');
const searchButton = document.querySelector('#search-button');
//const error = document.querySelector('.error-msg');

searchForm.addEventListener('submit', handleSubmit);
searchButton.addEventListener('click', handleSubmit);

// function to call on the loading of the page, and when is requested the 
// forecast for a new city
getWeather();

