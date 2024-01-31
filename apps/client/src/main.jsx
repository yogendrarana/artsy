import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import store from './redux/store/store.js';
import { loadStripe } from '@stripe/stripe-js';
import { BrowserRouter } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';


// import components
import App from './app.jsx';


(async () => {
    const res = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/stripe-publishable-key`);
    const data = await res.json()
    const stripePromise = loadStripe(data.stripePK)

    const root = ReactDOM.createRoot(document.getElementById('root'));

    root.render(
        <React.StrictMode>
            <ReduxProvider store={store}>
                <HelmetProvider>
                    <BrowserRouter>
                        <Elements stripe={stripePromise}>
                            <App />
                            <Toaster toastOptions={{ style: { padding: '10px', fontSize: '12.5px', borderRadius: '5px' }}} />
                        </Elements>
                    </BrowserRouter>
                </HelmetProvider>
            </ReduxProvider>
        </React.StrictMode>
    );
})();
