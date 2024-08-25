import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import WeatherApp from "./WeatherApp";

function App() {
  return <WeatherApp />;
}

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
