import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/Store.js'; // Import cả persistor
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}> {/* Sử dụng persistor */}
                <App />
            </PersistGate>
        </Provider>
    </React.StrictMode>
);
