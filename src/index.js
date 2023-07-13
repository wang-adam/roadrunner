import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {GOOGLE_MAPS_API_KEY} from './config.js';

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      isLoading: true,
    };
  }

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

  onSubmit = async (event) => {
    event.preventDefault();
    console.log(event.target.origin.value);
    console.log(event.target.destination.value);
    console.log(event.target.early_bound.value);
    console.log(event.target.late_bound.value);
  }

  render() {
    const date = new Date();
    date.getHours();
    date.getMinutes();
    return (
      <div id="form_content">
        <form onSubmit={this.onSubmit}>
          <input type="text" name="origin" placeholder="Origin" />
          <br></br>
          <input type="text" name="destination" placeholder="Destination" />
          <br></br>
          <label for="early_bound">Earliest time to depart by </label>
          <input type="time" name="early_bound"/>
          <br></br>
          <label for="late_bound">Latest time to arrive at destination </label>
          <input type="time" name="late_bound" />
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
