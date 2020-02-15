// Setup empty JS object to act as an endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express= require('express');

// Start up an instance of app
const app = express();

/* Dependencies */
const bodyParser = require('body-parser');

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors= require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('src/client/views'));

// Setup Server
const port = 8081;

// Spin up the server
const server = app.listen(port,listening);

// Callback to debug
function listening() {
  console.log(`Server running on localhost: ${port}`);
}


// Post Route for City Coordinates

app.post('/addCity', addCityData);

function addCityData (req, res) {
	console.log(req.body);
	projectData.date= req.body.date;
	projectData.city= req.body.city;
    projectData.country= req.body.country;
	projectData.longitude= req.body.longitude;
	projectData.latitude= req.body.latitude;
	projectData.content= req.body.content;
}

app.post('/addWeather', addWeatherData);

function addWeatherData (req, res) {
	console.log(req.body);
	projectData.weather= req.body.weather;
}

app.post('/addPhoto', addPhotoUrl);

function addPhotoUrl (req, res) {
	console.log(req.body);
	projectData.photoUrl= req.body.photoUrl;
}

// Initialize "all" route with a callback function to send all project data to UI
app.get('/all',sendData);

// Callback function to complete GET '/all'
function sendData(req,res) {
  res.send(projectData);
  projectData = {};

}