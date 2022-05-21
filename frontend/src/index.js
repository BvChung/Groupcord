import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import { store } from "./reduxStore/store";
import { injectStore } from "./api/axios";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
injectStore(store);

// root.render(
// 	<Provider store={store}>
// 		<App />
// 	</Provider>
// );
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>
);
