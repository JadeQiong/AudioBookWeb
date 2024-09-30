import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Router>
      <ClerkProvider
        publishableKey={
          'pk_test_cHJvcGVyLXRldHJhLTkxLmNsZXJrLmFjY291bnRzLmRldiQ'
        }
        afterSignOutUrl="/"
      >
             <Routes>
          <Route path="/test/*" element={<App isDebug={true}/>} /> 
          <Route path="/*" element={<App isDebug={false}/>} />
        </Routes>
        {/* <App /> */}
        
      </ClerkProvider>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
