import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import "./index.css"
import {StrictMode} from "react";
import {Provider} from "react-redux";
import store from "./redux/store.tsx";


if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker
            .register("/Competition_platform-frontend/serviceWorker.js")
            .then(res => console.log("service worker registered", res))
            .catch(err => console.log("service worker not registered", err))
    })
}
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>
)