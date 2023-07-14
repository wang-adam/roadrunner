import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {GOOGLE_MAPS_API_KEY} from './config.js';
import {Heap} from './heap.js';

const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('X-Goog-Api-Key', GOOGLE_MAPS_API_KEY);
headers.append('X-Goog-FieldMask', 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline');


async function getResults(params) {
  const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: headers
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}, ${response.statusText}`);
  } else {
    const data = await response.json();
    // console.log(data);
    return data;
  }
}

function calculateTimeIntervals(start, end) {
  let time_intervals = [];
  let early_bound = new Date(start);
  let late_bound = new Date(end);
  if (early_bound < Date.now()) {
    alert("Start time must not be in the past.");
    early_bound = new Date(Date.now());
  }
  if (early_bound > late_bound) {
    alert("End time must be after start time.");
    console.log("End time must be after start time.");
    return;
  }
  let next_time = new Date(early_bound.getTime()+1800000);
  time_intervals.push(early_bound.toISOString());
  while (next_time < late_bound) {
    time_intervals.push(next_time.toISOString());
    next_time = new Date(next_time.getTime()+1800000);
  }
  time_intervals.push(late_bound.toISOString());
  console.log(time_intervals);
  return time_intervals;
}    

async function onSubmit(event) {
  event.preventDefault();
  const origin = event.target.origin.value;
  const destination = event.target.destination.value;
  const start = event.target.early_bound.value;
  const end = event.target.late_bound.value;
  console.log(origin);
  console.log(destination);
  const time_intervals = calculateTimeIntervals(start, end);
  const params = {
    "origin": {
      "address": origin
    },
    "destination": {
      "address": destination
    },
    "travelMode": "DRIVE",
    "routingPreference": "TRAFFIC_AWARE",
    "computeAlternativeRoutes": true,
    "routeModifiers": {
      "avoidTolls": true,
      "avoidHighways": false,
      "avoidFerries": false
    },
    "languageCode": "en-US",
    "units": "IMPERIAL",
  };
  let all_routes = new Heap();
  for (const time of time_intervals) {
    params.departureTime = time;
    getResults(params)
    .then(data => {
      console.log(time + "\n" +data);
    })
    .catch(error => {
      console.error(error);
    });
  }
}

function validTime(event){
  // Checks if the input time is in the past, if so then it sets the input time to the current time
  let inputeDateTime = new Date(event.target.value);
  const timeZoneOffset = inputeDateTime.getTimezoneOffset();
  const inputTimeMins = Math.floor(inputeDateTime.getTime() / 100000);
  const currDateTime = new Date(Date.now());
  const currTimeMins = Math.floor(Date.now() / 100000);
  if (inputTimeMins +1 < currTimeMins) {
    console.log(new Date(currDateTime.getTime()-timeZoneOffset*60000).toISOString().slice(0,16));
    console.log("Start time must not be in the past.");
    event.target.value = new Date(currDateTime.getTime()-timeZoneOffset*60000).toISOString().slice(0,16);
  }
  // Checks if the start time is after the end time, if so then it sets the input time to the end time
  const startDateTime = new Date(startInput.value);
  const startTimeMins = Math.floor(startDateTime.getTime() / 100000);
  const endDateTime = new Date(endInput.value);
  const endTimeMins = Math.floor(endDateTime.getTime() / 100000);
  if (startTimeMins > endTimeMins) {
    console.log("Start time must be before end time.");
    endInput.value = new Date(startDateTime.getTime()-timeZoneOffset*60000).toISOString().slice(0,16);
  }
}

const form = document.getElementById('my_form');
const originInput = document.getElementById('origin');
const destinationInput = document.getElementById('destination');
const startInput = document.getElementById('early_bound');
const endInput = document.getElementById('late_bound');

form.addEventListener('submit', onSubmit);
// startInput.addEventListener('change', validTime);
endInput.addEventListener('change', validTime);
startInput.addEventListener('change', validTime);
// destinationInput.addEventListener('change', onSubmit);


// ReactDOM.render(
//   <React.StrictMode>
//     <Results />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
