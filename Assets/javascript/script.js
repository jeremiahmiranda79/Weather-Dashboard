var baseUrl = 'https://api.openweathermap.org';
var apiKey = 'eac1bc1bdb6ad96b0d8513d26c3bb330'; 
var units = 'imperial';
var lattitudeHome = 33.177294;
var longitudeHome = -111.5468301;
var input;
var favoritesArray = [];
var searchButtonElement = document.querySelector('#search-button');
var clearHistoryButtonElement = document.querySelector('#clear-history-button');
var cityInputElement = document.querySelector('#city-input');

searchButtonElement.addEventListener('click', function() {
    input = cityInputElement.value;
    cityInputElement.value = '';
    getGeocodingCoords(input);
});

clearHistoryButtonElement.addEventListener('click', function() {
    localStorage.clear();
    location.reload();
})

start(lattitudeHome, longitudeHome);

function start(lattitude, longitude) {
    favoritesArray = JSON.parse(localStorage.getItem('addToFavorites'));

    if (favoritesArray !== null ) {
        for (var i = 0; i < favoritesArray.length; i++) {
            var newButton = document.createElement('a');
            newButton.setAttribute('class', 'w-100 btn bg-secondary');
            newButton.text = favoritesArray[i].name;
            newButton.addEventListener('click', selectCity);
            document.getElementById('favorite-buttons').appendChild(newButton);
        }
    }

    getCurrentWeather(lattitude, longitude);
    getWeatherFiveDayForecast(lattitude, longitude);
}

function selectCity() {
    input = this.textContent;
    getGeocodingCoords(input);
}

function getCurrentDateAndTime() {
    var currentDate = dayjs().format(' (M/D/YYYY) ').tz('America/Toronto');
    var currentTime = dayjs().format(' h:mm:ss a');
    var date = document.querySelector('#main-dash-date');
    var time = document.querySelector('#main-dash-time')
    date.innerHTML = currentDate;
    time.innerHTML = currentTime;
}

function getGeocodingCoords(city) {
    var url = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + apiKey;

    fetch(url).then(function (response) {
            response.json().then(function (data) {

                var cityObject = {
                    lattitude: data[0].lat,
                    longitude: data[0].lon,
                    name: data[0].name
                }

                var storedFavorites = JSON.parse(localStorage.getItem('addToFavorites'));

                if (storedFavorites === null) {
                    favoritesArray = [];
                    favoritesArray.push(cityObject);
                    localStorage.setItem('addToFavorites', JSON.stringify(favoritesArray));
                }
                else {
                    for (var i = 0; i < storedFavorites.length; i++) {
                        if (storedFavorites[i].name === cityObject.name) {
                            getCurrentWeather(cityObject.lattitude, cityObject.longitude);
                            getWeatherFiveDayForecast(cityObject.lattitude, cityObject.longitude);
                            return;
                        }
                    }

                    var currentStoredFavorites = JSON.parse(localStorage.getItem('addToFavorites'));
                    currentStoredFavorites.push(cityObject);
                    localStorage.setItem('addToFavorites', JSON.stringify(currentStoredFavorites));
                }

                var newButton = document.createElement('a');
                newButton.setAttribute('class', 'w-100 btn bg-secondary');
                newButton.text = cityObject.name;
                newButton.addEventListener('click', selectCity);
                document.getElementById('favorite-buttons').appendChild(newButton);
                getCurrentWeather(cityObject.lattitude, cityObject.longitude);
                getWeatherFiveDayForecast(cityObject.lattitude, cityObject.longitude);
            })
        }) 
}

function getCurrentWeather(latt, long) {
    var url = baseUrl + '/data/2.5/weather?lat=' + latt + '&lon=' + long + '&appid=' + apiKey + '&units=' + units;

    fetch(url).then(function (response) {
        response.json().then(function (data) {
            displayWeatherCardMain(data.name, data.dt, data._timeZone, data.weather[0].icon, data.main.temp, data.wind.speed, data.main.humidity);
        })
    })
}

function getWeatherFiveDayForecast(latt, long) {
    var url = baseUrl + '/data/2.5/forecast?lat=' + latt + '&lon=' + long + '&appid=' + apiKey + '&units=' + units;
    
    fetch(url).then(function (response) {
            response.json().then(function (data) {
                displayWeatherCard1(data.list[3].dt_txt, data.list[3].weather[0].icon, data.list[3].main.temp, data.list[3].wind.speed, data.list[3].main.humidity);
                displayWeatherCard2(data.list[11].dt_txt, data.list[11].weather[0].icon, data.list[11].main.temp, data.list[11].wind.speed, data.list[11].main.humidity);
                displayWeatherCard3(data.list[19].dt_txt, data.list[19].weather[0].icon, data.list[19].main.temp, data.list[19].wind.speed, data.list[19].main.humidity);
                displayWeatherCard4(data.list[27].dt_txt, data.list[27].weather[0].icon, data.list[27].main.temp, data.list[27].wind.speed, data.list[27].main.humidity);
                displayWeatherCard5(data.list[35].dt_txt, data.list[35].weather[0].icon, data.list[35].main.temp, data.list[35].wind.speed, data.list[35].main.humidity);
            })
        })
}

function displayWeatherCardMain(_name, _dt, _timeZone, _icon, _temp, _wind, _humidity) {
    var mainDashBoardCityName = document.querySelector('#main-dash-board-city-name');
    var tempDashBoard = document.querySelector('#temp-dash-board');
    var windDashBoard = document.querySelector('#wind-dash-board');    
    var humidityDashBoard = document.querySelector('#humidity-dash-board');
    var iconurl = 'https://openweathermap.org/img/wn/' + _icon + '@2x.png';
    mainDashBoardCityName.innerHTML = _name;
    var mydate = new Date(_dt * 1000);
    var date = document.querySelector('#main-dash-date');
    // var time = document.querySelector('#main-dash-time')
    date.innerHTML = mydate.toDateString();
    document.getElementById('card-main-icon').src= iconurl;
    tempDashBoard.innerHTML = 'Temp: ' + _temp + ' &deg;F'; 
    windDashBoard.innerHTML = 'Wind: ' + _wind + ' MPH';
    humidityDashBoard.innerHTML = 'Humidity: ' + _humidity + ' %';
}

function displayWeatherCard1(_date, _icon, _temp, _wind, _humidity) {
    var cardDate = document.querySelector('#card1-date');
    var cardTemp = document.querySelector('#card1-temp');
    var cardWind = document.querySelector('#card1-wind');
    var cardHumidity = document.querySelector('#card1-humidity');
    var date = new Date(_date);
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var iconurl = 'https://openweathermap.org/img/wn/' + _icon + '@2x.png';
    cardDate.innerHTML = month + '/' + day + '/' + year;
    document.getElementById('card1-icon').src= iconurl;
    cardTemp.innerHTML = 'Temp: ' + _temp + ' &deg;F';
    cardWind.innerHTML = 'Wind: ' + _wind + ' MPH';
    cardHumidity.innerHTML = 'Humidity: ' + _humidity + ' %';
}

function displayWeatherCard2(_date, _icon, _temp, _wind, _humidity) {
    var cardDate = document.querySelector('#card2-date');
    var cardTemp = document.querySelector('#card2-temp');
    var cardWind = document.querySelector('#card2-wind');
    var cardHumidity = document.querySelector('#card2-humidity');
    var date = new Date(_date);
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var iconurl = 'https://openweathermap.org/img/wn/' + _icon + '@2x.png';
    cardDate.innerHTML = month + '/' + day + '/' + year;
    document.getElementById('card2-icon').src= iconurl;
    cardTemp.innerHTML = 'Temp: ' + _temp + ' &deg;F';
    cardWind.innerHTML = 'Wind: ' + _wind + ' MPH';
    cardHumidity.innerHTML = 'Humidity: ' + _humidity + ' %';
}

function displayWeatherCard3(_date, _icon, _temp, _wind, _humidity) {
    var cardDate = document.querySelector('#card3-date');
    var cardTemp = document.querySelector('#card3-temp');
    var cardWind = document.querySelector('#card3-wind');
    var cardHumidity = document.querySelector('#card3-humidity');
    var date = new Date(_date);
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var iconurl = 'https://openweathermap.org/img/wn/' + _icon + '@2x.png';
    cardDate.innerHTML = month + '/' + day + '/' + year;
    document.getElementById('card3-icon').src= iconurl;
    cardTemp.innerHTML = 'Temp: ' + _temp + ' &deg;F';
    cardWind.innerHTML = 'Wind: ' + _wind + ' MPH';
    cardHumidity.innerHTML = 'Humidity: ' + _humidity + ' %';
}

function displayWeatherCard4(_date, _icon, _temp, _wind, _humidity) {
    var cardDate = document.querySelector('#card4-date');
    var cardTemp = document.querySelector('#card4-temp');
    var cardWind = document.querySelector('#card4-wind');
    var cardHumidity = document.querySelector('#card4-humidity');
    var date = new Date(_date);
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var iconurl = 'https://openweathermap.org/img/wn/' + _icon + '@2x.png';
    cardDate.innerHTML = month + '/' + day + '/' + year;
    document.getElementById('card4-icon').src= iconurl;
    cardTemp.innerHTML = 'Temp: ' + _temp + ' &deg;F';
    cardWind.innerHTML = 'Wind: ' + _wind + ' MPH';
    cardHumidity.innerHTML = 'Humidity: ' + _humidity + ' %';
}

function displayWeatherCard5(_date, _icon, _temp, _wind, _humidity) {
    var cardDate = document.querySelector('#card5-date');
    var cardTemp = document.querySelector('#card5-temp');
    var cardWind = document.querySelector('#card5-wind');
    var cardHumidity = document.querySelector('#card5-humidity');
    var date = new Date(_date);
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var iconurl = 'https://openweathermap.org/img/wn/' + _icon + '@2x.png';
    cardDate.innerHTML = month + '/' + day + '/' + year;
    document.getElementById('card5-icon').src= iconurl;
    cardTemp.innerHTML = 'Temp: ' + _temp + ' &deg;F';
    cardWind.innerHTML = 'Wind: ' + _wind + ' MPH';
    cardHumidity.innerHTML = 'Humidity: ' + _humidity + ' %';
}