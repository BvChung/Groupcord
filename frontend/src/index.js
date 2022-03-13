import App from "./App";
import React from "react";
import ReactDOM from "react-dom";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			{/* <BrowserRouter></BrowserRouter> */}
			<App />
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
);
