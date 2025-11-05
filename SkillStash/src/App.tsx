import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import CourseCategory from './pages/CourseCategory'; // Import the new component
import CourseDetails from './pages/CourseDetails';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Add the new route for the Course Category page */}
        <Route path="/courses" element={<CourseCategory />} />

        <Route path="/about" element={<About />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="*" element={<h1 className="text-center mt-8 text-2xl">404 - Page Not Found</h1>} />
      </Routes>
    </div>
  );
}

export default App;