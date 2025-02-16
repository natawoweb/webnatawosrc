
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Events from './pages/Events';
import Writers from './pages/Writers';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import AdminDashboard from './pages/AdminDashboard';
import EventDetails from './pages/EventDetails';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import UserProfile from './pages/UserProfile';
import Dashboard from './pages/Dashboard';
import WriterDashboard from './pages/WriterDashboard';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:eventId" element={<EventDetails />} />
          <Route path="/writers" element={<Writers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/user-profile" element={<UserProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/writer/dashboard" element={<WriterDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
