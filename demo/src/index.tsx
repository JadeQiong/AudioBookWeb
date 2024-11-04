import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactGA from 'react-ga';

// Initialize GA with the Measurement ID from the environment variable
ReactGA.initialize(process.env.REACT_APP_GA_MEASUREMENT_ID);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/test/*" element={<App isDebug={true} />} />
        <Route path="/*" element={<App isDebug={false} />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
