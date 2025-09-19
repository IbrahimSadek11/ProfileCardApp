import './App.css';
import Navbar from './components/Navbar/Navbar';
import ListProfileCard from './pages/ListProfileCard/ListProfileCard';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListOfTasks from './pages/ListOfTasks/ListOfTasks';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManageTaskPage from './pages/ManageTaskPage/ManageTaskPage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<ListProfileCard />} />
          <Route path="/tasks" element={<ListOfTasks />} />
          <Route path="/Task/Create" element={<ManageTaskPage />} />
          <Route path="/Task/Edit/:id" element={<ManageTaskPage />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </BrowserRouter>
  );
}

export default App;
