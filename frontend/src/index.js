import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import { store } from "./reduxStore/store";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));

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
