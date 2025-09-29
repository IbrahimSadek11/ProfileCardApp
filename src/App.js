import './App.css';
import Navbar from './components/Navbar/Navbar';
import ListProfileCard from './pages/ListProfileCard/ListProfileCard';
import { Routes, Route, useLocation } from "react-router-dom";
import ListOfTasks from './pages/ListOfTasks/ListOfTasks';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManageTaskPage from './pages/ManageTaskPage/ManageTaskPage';
import AuthPage from './pages/AuthPage/AuthPage';
import NotFound from './pages/NotFound/NotFound';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  const location = useLocation();

  const hideNavbarPaths = ["/", "/signup"];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="App">
      <ScrollToTop />
      {shouldShowNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/listProfileCards"
          element={
            <ProtectedRoute>
              <ListProfileCard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <ListOfTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/:id"
          element={
            <ProtectedRoute>
              <ListOfTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/Create"
          element={
            <ProtectedRoute>
              <ManageTaskPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/Edit/:id"
          element={
            <ProtectedRoute>
              <ManageTaskPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="*" 
          element={
            <ProtectedRoute>
              <NotFound />
            </ProtectedRoute>
          } 
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
