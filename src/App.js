import './App.css';
import Navbar from './components/Navbar/Navbar';
import ListProfileCard from './pages/ListProfileCard/ListProfileCard';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListOfTasks from './pages/ListOfTasks/ListOfTasks';
import CreateTaskPage from './pages/CreateTaskPage/CreateTaskPage';
import EditTaskPage from './pages/EditTaskPage/EditTaskPage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<ListProfileCard />} />
          <Route path="/tasks" element={<ListOfTasks />} />
          <Route path="/Task/Create" element={<CreateTaskPage />} />
          <Route path="/Task/Edit/:id" element={<EditTaskPage />} /> {/* ← add :id */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
