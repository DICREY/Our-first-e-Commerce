import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './css/globals.css';
import App from './App';
import Spinner from './views/spinner/Spinner';

createRoot(document.getElementById('root')).render(
  <Suspense fallback={<Spinner />}>
    <App />
  </Suspense>
);