import {BrowserRouter, Routes ,Route} from "react-router-dom" ;
import FlightSearch from "./FlightSearch";
import Booking from "./Booking";

function App() {

  return (
    <>
      <BrowserRouter>
        
        <Routes>
           <Route path="/booking" element={<Booking />}/>
           <Route path="/" element={<FlightSearch />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App