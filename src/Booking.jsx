import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Booking = () => {
  const location = useLocation();
  const { flight, apikey } = location.state; // Extract flight and apikey from state

  const [travelerDetails, setTravelerDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const handleChange = (e) => {
    setTravelerDetails({
      ...travelerDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://test.api.amadeus.com/v1/booking/flight-orders', {
        data: {
          type: 'flight-order',
          flightOffers: [flight],
          travelers: [
            {
              id: '1',
              dateOfBirth: '1982-01-16',
              name: {
                firstName: travelerDetails.firstName,
                lastName: travelerDetails.lastName,
              },
              contact: {
                emailAddress: travelerDetails.email,
              },
              documents: [
                {
                  documentType: 'PASSPORT',
                  birthPlace: 'Madrid',
                  issuanceLocation: 'Madrid',
                  issuanceDate: '2015-04-14',
                  number: '00000000',
                  expiryDate: '2025-04-14',
                  issuanceCountry: 'ES',
                  validityCountry: 'ES',
                  nationality: 'ES',
                  holder: true,
                },
              ],
            },
          ],
        },
        headers: {
          'Authorization': `Bearer ${apikey}`,
          'Content-Type': 'application/json',
        },
      });
      alert('Booking Successful!');
    } catch (error) {
      console.error('Error booking flight', error);
      alert('Error booking flight');
    }
  };

  return (
    <div>
      <h1>Booking for Flight</h1>
      <p>Departure: {flight.itineraries[0].segments[0].departure.iataCode}</p>
      <p>Arrival: {flight.itineraries[0].segments[0].arrival.iataCode}</p>
      <p>Price: {flight.price.total} {flight.price.currency}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={travelerDetails.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={travelerDetails.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={travelerDetails.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Book</button>
      </form>
    </div>
  );
};

export default Booking;
