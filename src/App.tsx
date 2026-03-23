import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { GameDetailPage } from './pages/GameDetailPage';
import { MyGamesPage } from './pages/MyGamesPage';
import { ProfilePage } from './pages/ProfilePage';
import { CreateGamePage } from './pages/admin/CreateGamePage';
import { AdminGameDetailPage } from './pages/admin/AdminGameDetailPage';
import { PoliciesPage } from './pages/PoliciesPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AppShell />}>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/games/:id" element={<GameDetailPage />} />
            <Route path="/policies" element={<PoliciesPage />} />

            {/* Protected routes — require login */}
            <Route element={<ProtectedRoute />}>
              <Route path="/my-games" element={<MyGamesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/host/new" element={<CreateGamePage />} />
              <Route path="/host/:id" element={<AdminGameDetailPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
