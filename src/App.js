import './App.css';
import Navbar from './components/Navbar/Navbar';
import ListProfileCard from './pages/ListProfileCard/ListProfileCard';
import { Routes, Route, useLocation } from "react-router-dom";
import ListOfTasks from './pages/ListOfTasks/ListOfTasks';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManageTaskPage from './pages/ManageTaskPage/ManageTaskPage';
import AuthPage from './pages/AuthPage/AuthPage';

function App() {
  const location = useLocation();

  const hideNavbarPaths = ["/", "/signup"];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="App">
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<AuthPage/>} />
        <Route path="/signup" element={<AuthPage/>} />
        <Route path="/ListProfileCards" element={<ListProfileCard />} />
        <Route path="/tasks" element={<ListOfTasks />} />
        <Route path="/tasks/:id" element={<ListOfTasks />} /> 
        <Route path="/Task/Create" element={<ManageTaskPage />} />
        <Route path="/Task/Edit/:id" element={<ManageTaskPage />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
