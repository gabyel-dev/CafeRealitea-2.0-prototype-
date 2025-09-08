// App.js
import MainLayout from './Main/MainLayout';
import LoginPage from './routes/login/Login';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import MemberProfileWrapper from './pages/profile/MemberProfileWrapper';
import UsersManagement from './pages/members/members';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path='/' element={<LoginPage />} />

        {/* Protected dashboard with nested routes */}
        <Route path='/dashboard' element={<MainLayout />}>
          <Route index element={<UsersManagement />} /> {/* Default dashboard page */}
          <Route path="users" element={<UsersManagement />} />
          <Route path="users/:id" element={<MemberProfileWrapper />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;