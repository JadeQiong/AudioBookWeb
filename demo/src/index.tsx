import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactGA from 'react-ga';
import { UserProvider } from './providers/UserProvider';

// Initialize GA with the Measurement ID from the environment variable
const gaMeasurementId = process.env.REACT_APP_GA_MEASUREMENT_ID;
if (gaMeasurementId) {
  ReactGA.initialize(gaMeasurementId);
} else {
  console.error('GA Measurement ID is not defined');
}
console.log('GA Measurement ID:', process.env.REACT_APP_GA_MEASUREMENT_ID);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <UserProvider>
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/test/*" element={<App isDebug={true} />} />
          <Route path="/*" element={<App isDebug={false} />} />
        </Routes>
      </Router>
    </React.StrictMode>
  </UserProvider>
);

reportWebVitals();
