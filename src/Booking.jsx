import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Booking = () => {
  const location = useLocation();
  const { flight, apikey } = location.state; // Extract flight and apikey from state

  const [travelers, setTravelers] = useState([
    {
      id: '1',
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: '',
      gender: '',
      phone: '',
      document: {
        documentType: '',
        birthPlace: '',
        issuanceLocation: '',
        issuanceDate: '',
        number: '',
        expiryDate: '',
        issuanceCountry: '',
        validityCountry: '',
        nationality: '',
        holder: true
      }
    },
  ]);

  const handleTravelerChange = (index, e) => {
    const { name, value } = e.target;
    const newTravelers = [...travelers];
    if (name.startsWith('document.')) {
      const documentField = name.split('.')[1];
      newTravelers[index].document[documentField] = value;
    } else {
      newTravelers[index][name] = value;
    }
    setTravelers(newTravelers);
  };

  const addTraveler = () => {
    setTravelers([
      ...travelers,
      {
        id: (travelers.length + 1).toString(),
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        gender: '',
        phone: '',
        document: {
          documentType: '',
          birthPlace: '',
          issuanceLocation: '',
          issuanceDate: '',
          number: '',
          expiryDate: '',
          issuanceCountry: '',
          validityCountry: '',
          nationality: '',
          holder: true
        }
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedTravelers = travelers.map((traveler, index) => ({
        id: (index + 1).toString(),
        dateOfBirth: traveler.dateOfBirth,
        gender: traveler.gender,
        name: {
          firstName: traveler.firstName,
          lastName: traveler.lastName,
        },
        contact: {
          emailAddress: traveler.email,
          phones: [
            {
              deviceType: 'MOBILE',
              countryCallingCode: '34', // Assuming the country code is 34 for this example
              number: traveler.phone,
            },
          ],
        },
        documents: [
          {
            documentType: traveler.document.documentType,
            birthPlace: traveler.document.birthPlace,
            issuanceLocation: traveler.document.issuanceLocation,
            issuanceDate: traveler.document.issuanceDate,
            number: traveler.document.number,
            expiryDate: traveler.document.expiryDate,
            issuanceCountry: traveler.document.issuanceCountry,
            validityCountry: traveler.document.validityCountry,
            nationality: traveler.document.nationality,
            holder: traveler.document.holder,
          },
        ],
      }));

      await axios.post(
        'https://test.api.amadeus.com/v1/booking/flight-orders',
        {
          data: {
            type: 'flight-order',
            flightOffers: [flight],
            travelers: formattedTravelers,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${apikey}`,
            'Content-Type': 'application/json',
          },
        }
      );
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
        {travelers.map((traveler, index) => (
          <div key={index}>
            <h3>Traveler {index + 1}</h3>
            <div>
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={traveler.firstName}
                onChange={(e) => handleTravelerChange(index, e)}
                required
              />
            </div>
            <div>
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={traveler.lastName}
                onChange={(e) => handleTravelerChange(index, e)}
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={traveler.email}
                onChange={(e) => handleTravelerChange(index, e)}
                required
              />
            </div>
            <div>
              <label>Date of Birth:</label>
              <input
                type="date"
                name="dateOfBirth"
                value={traveler.dateOfBirth}
                onChange={(e) => handleTravelerChange(index, e)}
                required
              />
            </div>
            <div>
              <label>Gender:</label>
              <select
                name="gender"
                value={traveler.gender}
                onChange={(e) => handleTravelerChange(index, e)}
                required
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            <div>
              <label>Phone:</label>
              <input
                type="tel"
                name="phone"
                value={traveler.phone}
                onChange={(e) => handleTravelerChange(index, e)}
                required
              />
            </div>
            <h4>Document Details</h4>
            <div>
              <label>Document Type:</label>
              <input
                type="text"
                name="document.documentType"
                value={traveler.document.documentType}
                onChange={(e) => handleTravelerChange(index, e)}
                required
              />
            </div>
            <div>
              <label>Birth Place:</label>
              <input
                type="text"
                name="document.birthPlace"
                value={traveler.document.birthPlace}
                onChange={(e) => handleTravelerChange(index, e)}
                required
              />
            </div>
            <div>
              <label>Issuance Location:</label>
              <input
                type="text"
                name="document.issuanceLocation"
                value={traveler.document.issuanceLocation}
                onChange={(e) => handleTravelerChange(index, e)}
                required
              />
            </div>
            <div>
              <label>Issuance Date:</label>
              <input
                type="date"
                name="document.issuanceDate"
                value={traveler.document.issuanceDate}
                onChange={(e) => handleTravelerChange(index, e)}
                required
              />
            </div>
            <div>
              <label>Document Number:</label>
              <input
                type="text"
                name="document.number"
                value={traveler.document.number}
                onChange={(e) => handleTravelerChange(index, e)}
                required
              />
            </div>
            <div>
              <label>Expiry Date:</label>
              <input
                type="date"
                name="document.expiryDate"
                value={traveler.document.expiryDate}
                onChange={(e) => handleTravelerChange(index, e)}
                required
              />
            </div>
            <div>
              <label>Issuance Country:</label>
              <input
                type="text"
                name="document.issuanceCountry"
                value={traveler.document.issuanceCountry}
                onChange={(e) => handleTravelerChange(index, e)}
                required
              />
            </div>
            <div>
              <label>Validity Country:</label>
              <input
                type="text"
                name="document.validityCountry"
                value={traveler.document.validityCountry}
                onChange={(e) => handleTravelerChange(index, e)}
                required
              />
            </div>
            <div>
              <label>Nationality:</label>
              <input
                type="text"
                name="document.nationality"
                value={traveler.document.nationality}
                onChange={(e) => handleTravelerChange(index, e)}
                required
              />
            </div>
            <div>
              <label>Holder:</label>
              <input
                type="checkbox"
                name="document.holder"
                checked={traveler.document.holder}
                onChange={(e) => handleTravelerChange(index, e)}
              />
            </div>
          </div>
        ))}
        <button type="button" onClick={addTraveler}>Add Traveler</button>
        <button type="submit">Book</button>
      </form>
    </div>
  );
};

export default Booking;
