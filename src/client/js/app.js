/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

// Personal API Key for OpenWeatherMap API

let baseURL = 'http://api.geonames.org/searchJSON?formatted=true&q=';
let apiKey = '&username=michaelfawzy';



// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', performAction);


/* Function called by event listener */
function performAction(e){
    console.log('clicked')
const newZip =  document.getElementById('zip').value;
const feelings =  document.getElementById('feelings').value;
getCity(baseURL,newZip, apiKey)

	.then(function(data) {
		console.log(data);
		//Add data to POST request
		postData('/add', {date:d, longitude:data.geonames[0].lng, content:feelings})
	})
	.then(updateUI());
};

/* Function to GET Web API Data*/
const getCity = async (baseURL, zip, key)=>{

	const res = await fetch(baseURL+zip+key)
	try {
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
    	const newData = await response.json();
    	console.log(newData);
    	return newData;
    }catch(error) {
    	console.log("error", error);
    	}
}

/* Function to GET Project Data */

const updateUI = async () => {
  const request = await fetch('/all');
  try{
    const allData = await request.json();
    document.getElementById('date').innerHTML = `Date: ${allData[0].date}`;
    document.getElementById('longitude').innerHTML = `Temperatuer: ${allData[0].longitude}`;
    document.getElementById('content').innerHTML = `I feel: ${allData[0].content}`;

  }catch(error){
    console.log("error", error);
  }
}

module.exports = {performAction, getCity, postData,updateUI };
