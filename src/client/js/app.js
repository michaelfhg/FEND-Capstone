/* Global Variables */
const tripData = {};
// Create a new date instance dynamically with JS

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', performAction);

// Function called by event listener
function performAction(e){

    console.log('clicked')
    const cityName =  document.getElementById('city').value;
    const sD = new Date(document.getElementById('start-date').value); //Won't work if set as a global variable
    const newSDate = sD.toString(); //converts the date to letters to be passed to server and displayed in words
    tripData.startDate = sD.getTime()/1000; // date converted to Unix time (seconds since midnight GMT on 1 Jan 1970) to be used by Darks Sky API
    const eD = new Date(document.getElementById('end-date').value);
    const newEDate = eD.toString();
    tripData.endDate = eD.getTime()/1000; // date converted to Unix time to be used by calculate trup duration
    const tripDuration = (eD.getTime() - sD.getTime()) / 8.64e7 + ' days'; // divided by 8.64e7 to change milliseconds into days
    tripData.tripDuration = tripDuration;

    console.log('trip Duration', tripDuration)

    getPhoto(pixabayEP, cityName, key)
    .then(function(photoData) {
        console.log(photoData);
        //Add data to POST request
        postPhotoData('http://localhost:8081/addPhoto', {photoUrl:photoData.hits[0].largeImageURL})
    })

    getCityCoordinates(geonamesEP, cityName, userName)

    .then(function(data) {
        console.log(data);
        //Add data to POST request
        postCityData('http://localhost:8081/addCity', {startDate:newSDate, endDate: newEDate, city:data.geonames[0].name, country:data.geonames[0].countryName, longitude:data.geonames[0].lng, latitude:data.geonames[0].lat});
        getForecast(tripData)
        .then(function(weatherData) {
            console.log(weatherData);
            postWeatherData('http://localhost:8081/addWeather', {weather:weatherData.currently.summary}) //some cities don't have summary if trip start is more than 2 weeks
            updateUI();
        })
    })


};


// End point & Key for Pixabay API

let pixabayEP = 'https://pixabay.com/api/?image_type=photo&pretty=true&q=';
let key = '&pretty=true&key=15070531-14d6aafc4bd2c1dcb4d4e0b9f';


//Function to GET City Photo
const getPhoto = async (pixabayEP, city, key)=> {
    const res = await fetch(pixabayEP+city+key)
    try {
        // Transform into JSON
        const photoData = await res.json();
        return photoData;
    }catch(error) {
        console.log("error", error);
        // appropriately handle the error
    }

}

// Function to GET Dark Sky API Data
const getForecast = async (tripData)=>{
    console.log(tripData)
    let secretKey = '29b4b5410e21b7c6d24fe212bb233451';
    const lat = tripData.latitude;
    const lng = tripData.longitude;
    const date = tripData.startDate;

    const res = await fetch(`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${secretKey}/${lat},${lng},${date}`)
    try {
        const weatherData = await res.json();
        console.log(weatherData);
        return weatherData;
    }catch(error) {
        console.log("error", error);
        // appropriately handle the error
    }
}


/* Function to POST weather data to Server*/

const postWeatherData = async ( url = '', weatherData = {})=>{
    console.log(weatherData);
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
    // Body data type must match "Content-Type" header
        body: JSON.stringify(weatherData),
    });

    try {
        const newData = await response.json();  // parses JSON response into native JavaScript objects
        console.log(newData);
        return newData;
    }catch(error) {
        console.log("error", error);
        }
}



/* Function to POST Photo data to Local Server*/

const postPhotoData = async ( url = '', photoData = {})=>{
    console.log(photoData);
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
    // Body data type must match "Content-Type" header
        body: JSON.stringify(photoData),
    });

    try {
        const newData = await response.json();  // parses JSON response into native JavaScript objects
        console.log(newData);
        return newData;
    }catch(error) {
        console.log("error", error);
        }
}

// End point & Username for GeoNames API

let geonamesEP = 'http://api.geonames.org/searchJSON?formatted=true&q=';
let userName = '&username=michaelfawzy';


/* Function to GET Geonames API Data*/
const getCityCoordinates = async (geonamesEP, city, key)=>{

	const res = await fetch(geonamesEP+city+key)
	try {
        // Transform into JSON
        const data = await res.json();
        tripData.latitude = data.geonames[0].lat;
        tripData.longitude = data.geonames[0].lng;
        console.log('city coor data', data)
        console.log('tripdata', tripData)
		return data;
	}catch(error) {
    	console.log("error", error);
    	// appropriately handle the error
	}
}


/* Function to POST City data */

const postCityData = async ( url = '', data = {})=>{
	console.log(data);
	const response = await fetch(url, {
    	method: 'POST',
    	credentials: 'same-origin',
    	headers: {
        	'Content-Type': 'application/json',
    	},
    // Body data type must match "Content-Type" header
    	body: JSON.stringify(data),
    });

    try {
    	const newData = await response.json();  // parses JSON response into native JavaScript objects
    	console.log(newData);
    	return newData;
    }catch(error) {
    	console.log("error", error);
    	}
}

/* Function to GET All Project Data from server */

const updateUI = async () => {
    const request = await fetch('http://localhost:8081/all');
    try{
        const allData = await request.json();
        document.getElementById('date').innerHTML = `<i><b>Start Date:</b></i> ${allData.startDate} <br> <i><b>End Date:</b></i>: ${allData.endDate} <br> <i><b>Trip Duration:</b></i> ${tripData.tripDuration}`;
        document.getElementById('weather-summary').innerHTML = `<i><b>Weather Summary (If avaialable):</b></i> ${allData.weather}`;
        document.getElementById('image').innerHTML = `<i><b>Destination Photo:</b></i> <br> <br> <img src="${allData.photoUrl}" style="width:400px;margin-left: 200px;">`;
        document.getElementById('country').innerHTML = `<i><b>City:</b></i> ${allData.city} <br> <i><b>Country:</b></i> ${allData.country}`;
      }catch(error){
        console.log("error", error);
      }
}


module.exports = {performAction, getPhoto, postPhotoData, getCityCoordinates, postCityData, getForecast, postWeatherData, updateUI};
