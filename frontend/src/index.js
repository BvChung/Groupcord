import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import { store, persistor } from "./reduxStore/store";
import { injectStore } from "./api/axios";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
injectStore(store);

root.render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</PersistGate>
	</Provider>
);
