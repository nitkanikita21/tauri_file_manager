/* @refresh reload */
import { render } from "solid-js/web";

import "./styles.css";
import App from "./App";
import { Router, Route, Routes } from "@solidjs/router";

let HMRdata: { [key: string]: any } = {};
if (import.meta.hot) HMRdata = import.meta.hot.data;
if (HMRdata["appDisposer"]) HMRdata["appDisposer"]();

HMRdata["appDisposer"] = render(
    () => (
        <Router>
            <Routes>
                <Route path="/" component={App} />
            </Routes>
        </Router>
    ),
    document.getElementById("root") as HTMLElement,
);
