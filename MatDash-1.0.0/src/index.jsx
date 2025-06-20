// Librarys 
import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';

// Imports 
import App from './App';
import Spinner from './views/spinner/Spinner';

import './css/globals.css';

createRoot(document.getElementById('root')).render(
  <Suspense fallback={<Spinner />}>
    <App />
  </Suspense>
);