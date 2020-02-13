/* Global Variables */
tripData= {};
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

// End point & Username for GeoNames API

let geonamesEP = 'http://api.geonames.org/searchJSON?formatted=true&q=';
let userName = '&username=michaelfawzy';

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', performAction);

// Function called by event listener
function performAction(e){
    console.log('clicked')
    const cityName =  document.getElementById('city').value;
    const feelings =  document.getElementById('feelings').value;


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
		postCityData('http://localhost:8081/addCity', {date:d, city:data.geonames[0].name, country:data.geonames[0].countryName, longitude:data.geonames[0].lng, latitude:data.geonames[0].lat, content:feelings});
        getForecast(tripData);

	})
	.then(updateUI())


        /*
        .then(function(weatherData) {
            console.log(weatherData);
            console.log(darkSkyEP);

            //Add data to POST request
            //postPhotoData('http://localhost:8081/addPhoto', {photoUrl:photoData.hits[0].largeImageURL})
        })
        */
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

// End point & Secret Key for Dark Sky API

let darkSkyEP = 'https://api.darksky.net/forecast/';


// Function to GET Dark Sky API Data
const getForecast = async (tripData)=>{
    let secretKey = '29b4b5410e21b7c6d24fe212bb233451';
    let lat = tripData.latitude;
    let lng = tripData.longitude;

    const res = await fetch(`https://api.darksky.net/forecast/${secretKey}/${lat},${lng}`,
    {mode: 'no-cors'}
     // {credentials: 'same-origin'}
     )
    try {
        const weatherData = await res.json();
        return weatherData;
        console.log(weatherData);
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



/* Function to POST Photo data to Server*/

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


/* Function to GET Geonames API Data*/
const getCityCoordinates = async (geonamesEP, city, key)=>{

	const res = await fetch(geonamesEP+city+key)
	try {
        // Transform into JSON
		const data = await res.json();
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

/* Function to GET Project Data from server */

const updateUI = async () => {
  const request = await fetch('http://localhost:8081/all');
  try{
    const allData = await request.json();
    document.getElementById('date').innerHTML = `Date: ${allData.date}`;
    document.getElementById('longitude').innerHTML = `longitude: ${allData.longitude}`;
    document.getElementById('latitude').innerHTML = `latitude: ${allData.latitude}`;
    document.getElementById('country').innerHTML = `country: ${allData.country}`;
    document.getElementById('content').innerHTML = `I feel: ${allData.content} <br> Photo URL: ${allData.photoUrl}`;
    tripData.longitude = allData.longitude;
    tripData.latitude = allData.latitude;
  }catch(error){
    console.log("error", error);
  }
}



module.exports = {performAction, getCityCoordinates, postCityData, updateUI, getForecast };
