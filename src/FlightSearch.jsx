// src/App.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const FlightSearch = () => {
    const navigate = useNavigate();
  const [apikey, setApiKey] = useState('');
  const [airports, setAirports] = useState([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //const apiKey = import.meta.env.VITE_AMADEUS_API_KEY;
  const fetchAirports = async (key) => {
    try {
      const response = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations', {
        headers: {
          'Authorization': `Bearer ${key}`
        },
        params: {
          subType: 'AIRPORT',
          keyword: 'A',  // To get a broader list, you might need to make multiple requests or handle pagination
          'page[limit]': 100  // Increase limit if needed
        }
      });
      setApiKey(key);
      //alert('here comes the key => '+apikey);
      setAirports(response.data.data);
    } catch (error) {
      console.error('Error fetching airport data', error);
    }
  };
  // Fetch the list of airports on component mount
  useEffect(() => {
    const generateApi = async () => {
      const KEY = import.meta.env.VITE_AMADEUS_KEY;
      const SECRET = import.meta.env.VITE_AMADEUS_SECRET ;
      
      const data = new URLSearchParams();
      data.append('grant_type', 'client_credentials');
      data.append('client_id', KEY);
      data.append('client_secret', SECRET);
      try {
        const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token',data,{
          headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }})
        //alert(response.data.access_token) ;
        fetchAirports(response.data.access_token);
        //setApiKey(response.data.access_token);
      } catch (error) {
        console.error('Error fetching airport data', error);
      }
    }
    generateApi() ;
  }, []);

  const searchFlights = async (key) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
        headers: {
          'Authorization': `Bearer ${key}`
        },
        params: {
          originLocationCode: origin,
          destinationLocationCode: destination,
          departureDate: departureDate,
          returnDate: returnDate,
          adults: 1,
        }
      });
      setFlights(response.data.data);
    } catch (error) {
      setError('Error fetching flight data');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Flight Search</h1>
      <form onSubmit={(e) => { e.preventDefault(); searchFlights(apikey); }}>
        <div>
          <label>Origin:</label>
          <select value={origin} onChange={(e) => setOrigin(e.target.value)} required>
            <option value="">Select origin</option>
            {airports.map(airport => (
              <option key={airport.iataCode} value={airport.iataCode}>
                {airport.iataCode} - {airport.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Destination:</label>
          <select value={destination} onChange={(e) => setDestination(e.target.value)} required>
            <option value="">Select destination</option>
            {airports.map(airport => (
              <option key={airport.iataCode} value={airport.iataCode}>
                {airport.iataCode} - {airport.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Departure Date:</label>
          <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} required />
        </div>
        <div>
          <label>Return Date:</label>
          <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
        </div>
        <button type="submit">Search Flights</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      
      {flights.length > 0 && (
        <div>
          <h2>Flight Results</h2>
          <ul>
            {flights.map(flight => (
              <li key={flight.id}>
                <div>
                  <p>Departure: {flight.itineraries[0].segments[0].departure.iataCode}</p>
                  <p>Arrival: {flight.itineraries[0].segments[0].arrival.iataCode}</p>
                  <p>Price: {flight.price.total} {flight.price.currency}</p>
                  <button onClick={()=>navigate(`/booking`, { state: { flight, apikey } })}>Book</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
    </div>
  );
};

export default FlightSearch;
