import './App.css';
import Navbar from './components/Navbar/Navbar';
import ListProfileCard from './pages/ListProfileCard/ListProfileCard';
import Page1 from './pages/Page/Page1';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<ListProfileCard />} />
            <Route path="/page1" element={<Page1 />} />
          </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
