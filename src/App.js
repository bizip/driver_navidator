import { useEffect, useState } from 'react';
import './App.css';
import Map from './components/Map';
import NavBAr from './components/NavBAr';

function App() {
  const [driverLocation, setDriverLocation] = useState(null);

  const updateDriverLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setDriverLocation({ latitude, longitude });
    });
  };

  useEffect(() => {
    updateDriverLocation();
    const intervalId = setInterval(updateDriverLocation, 50000);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className="App">
      <NavBAr />
      {driverLocation && <Map driverLocation={driverLocation} />}
    </div>
  );
}

export default App;
