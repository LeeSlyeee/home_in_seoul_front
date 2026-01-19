import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ListingPage from "./pages/ListingPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/listing" element={<ListingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
