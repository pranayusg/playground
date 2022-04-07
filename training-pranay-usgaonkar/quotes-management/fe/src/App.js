import "antd/dist/antd.css";
import "./App.css";
import { Home } from "./components/home/home";
import { Routes, Route, Link } from "react-router-dom";
import { Quotes } from "./components/quotes/quotes";
import { Authors } from "./components/author/author";
import { SearchBox } from "./components/searchBox/searchBox";

function App() {
  return (
    <div className="App">
      <Home />
      <Routes>
        <Route path="/" element={<Authors />} />
        <Route path="/quotes" element={<SearchBox />} />
      </Routes>
    </div>
  );
}

export default App;
