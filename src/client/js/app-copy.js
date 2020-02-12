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
    getCityCoordinates(geonamesEP,cityName, userName)
	.then(function(data) {
		console.log(data);
		//Add data to POST request
		postData('http://localhost:8081/addCity', {date:d, longitude:data.geonames[0].lng, latitude:data.geonames[0].lat, country:data.geonames[0].countryName, content:feelings})
	})
	.then(updateUI());
};

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


/* Function to POST data */

const postData = async ( url = '', data = {})=>{
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

/* Function to GET Project Data */

const updateUI = async () => {
  const request = await fetch('http://localhost:8081/all');
  try{
    const allData = await request.json();
    document.getElementById('date').innerHTML = `Date: ${allData[0].date}`;
    document.getElementById('longitude').innerHTML = `longitude: ${allData[0].longitude}`;
    document.getElementById('latitude').innerHTML = `latitude: ${allData[0].latitude}`;
    document.getElementById('country').innerHTML = `country: ${allData[0].country}`;
    document.getElementById('content').innerHTML = `I feel: ${allData[0].content}`;
    tripData.longitude = allData[0].longitude;
    tripData.latitude = allData[0].latitude;
  }catch(error){
    console.log("error", error);
  }
}


// End point & Username for Dark Sky API

let darkSkyEP = 'https://api.darksky.net/forecast/';
let secretKey = '29b4b5410e21b7c6d24fe212bb233451/';

/* Function to GET Geonames API Data*/
const getForecast = async (darkSkyEP, secretKey, lng, lat)=>{

    const res = await fetch(darkSkyEP+secretKey+lng+lat,
     //   {mode: 'cors'}
     // {credentials: 'same-origin'}
     )
    try {
        const data = await res.json();
        return data;
        console.log(data);
    }catch(error) {
        console.log("error", error);
        // appropriately handle the error
    }
}

module.exports = {performAction, getCityCoordinates, postData, updateUI, getForecast };
