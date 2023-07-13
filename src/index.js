import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {GOOGLE_MAPS_API_KEY} from './config.js';
import {Heap} from './heap.js';

class Results extends React.Component {
  async getResults(params) {
    const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {"Content-Type": "application/json", "X-Goog-Api-Key":GOOGLE_MAPS_API_KEY,"X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline"}
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const data = await response.json();
      console.log(data);
      return data;
    }
  }

  calculateTimeIntervals(start, end) {
    let time_intervals = [];
    let early_bound = new Date(start);
    let late_bound = new Date(end);
    if (early_bound > late_bound) {
      alert("End time must be after start time.");
      console.log("End time must be after start time.");
      return;
    }
    let next_time = new Date(early_bound.getTime()+1800000);
    console.log("start time " + early_bound.toISOString());
    time_intervals.push(early_bound.toISOString());
    while (next_time < late_bound) {
      console.log(next_time.toISOString());
      time_intervals.push(next_time.toISOString());
      next_time = new Date(next_time.getTime()+1800000);
    }
    console.log("end time " + late_bound.toISOString());
    time_intervals.push(late_bound.toISOString());
    console.log(time_intervals);
    return time_intervals;
  } 

  onSubmit = async (event) => {
    event.preventDefault();
    const origin = event.target.origin.value;
    const destination = event.target.destination.value;
    const start = event.target.early_bound.value;
    const end = event.target.late_bound.value;
    console.log(origin);
    console.log(destination);
    const time_intervals = this.calculateTimeIntervals(start, end);
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
    for (const time of time_intervals) {
      params.departureTime = time;
      let results = this.getResults(params+ "departureTime="+time);
      console.log(results);
    }

    // const results = await this.getResults(params);
    let all_routes = new Heap();
  }

  render() {
    return (
      <div id="form_content">
        <form onSubmit={this.onSubmit}>
          <input type="text" name="origin" placeholder="Origin" />
          <br></br>
          <input type="text" name="destination" placeholder="Destination" />
          <br></br>
          <label for="early_bound">Earliest time to depart by </label>
          <input type="datetime-local" name="early_bound"/>
          <br></br>
          <label for="late_bound">Latest time to arrive at destination </label>
          <input type="datetime-local" name="late_bound" />
          <br></br>
          <button type="submit"> Search </button>
        </form>
      </div>
    );
  }
}



ReactDOM.render(
  <React.StrictMode>
    <Results />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
