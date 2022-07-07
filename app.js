console.log('This is a weather app');

// This is the API key of my free account on openweathermap.org
const apiKey = 'a39e510433962c881582475bc0333e5a';

// Builds request url to obtain coordinates
function buildRequestCoordsUrl(cityName, apiKey) {
    return `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${apiKey}`;
}

// Builds request url to obtain weather forecast
function buildRequestForecastUrl(coordinates, units) {
    return `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,alerts&units=${units}&appid=20f7632ffc2c022654e4093c6947b4f4`;
}

// Returns coordinates, city name and country for a specified city name.
async function getCoord(url) {
    const response = await fetch(url);
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
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    // data is a promise
    return data;
}

// main function that uses getForecast (and getCoord)
async function getWeather() {
    
    // Building url to get coord for the initial city(Rome in this case)
    let requestCoordUrl = buildRequestCoordsUrl('Milan', apiKey);
    console.log(`url: ${requestCoordUrl}`);

    // Is needed to wait until this promise is resolved, otherwise we will have 
    // undefined coordinates
    let coord = await getCoord(requestCoordUrl);

    // Building url to get forecast, passing the premise coord of the give city
    let requestForecastUrl = buildRequestForecastUrl(coord); 
    console.log(`forecst url: ${requestForecastUrl}`);
    let forecastData = await getForecast(requestForecastUrl);

    // passing the forecast data to the function that will select and display 
    // the data, interacting with the DOM
    displayData(forecastData)

}

// function to call on the loading of the page, and when is requested the 
// forecast for a new city
getWeather();