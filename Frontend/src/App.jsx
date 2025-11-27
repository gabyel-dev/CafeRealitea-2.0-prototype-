// App.js
import MainLayout from "./Main/MainLayout";
import LoginPage from "./routes/login/Login";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import MemberProfileWrapper from "./pages/profile/MemberProfileWrapper";
import UsersManagement from "./pages/members/members";
import Temporary from "./components/UI/inputs/TemporaryInput";
import { NotificationProvider } from "./Main/NotificationContext";

function App() {
  return (
    <Router>
      <NotificationProvider>
        <Routes>
          {/* Public route */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/temporary/orders" element={<Temporary />} />

          {/* Protected dashboard with nested routes */}
          <Route path="/dashboard" element={<MainLayout />}>
            <Route index element={<UsersManagement />} />{" "}
            {/* Default dashboard page */}
            <Route path="users" element={<UsersManagement />} />
            <Route path="users/:id" element={<MemberProfileWrapper />} />
          </Route>
        </Routes>
      </NotificationProvider>
    </Router>
  );
}

export default App;
