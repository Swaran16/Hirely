import { useEffect, useState } from "react";
import { useUserStore } from "../stores/userStore";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { Dashboard } from "./pages/Dashboard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { User, Home, LogOut } from "lucide-react";
import "./style.css";

type Page = 'dashboard' | 'profile';

function IndexPopup() {
  const { isAuthenticated, loadProfile, loading, logout } = useUserStore();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-[400px] h-[300px] bg-white">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onSuccess={() => setCurrentPage('profile')} />;
  }

  return (
    <div className="min-w-[500px] bg-white">
      {/* Navigation */}
      <div className="flex border-b bg-white sticky top-0 z-10 shadow-sm">
        <button
          onClick={() => setCurrentPage('dashboard')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 font-medium transition-all ${
            currentPage === 'dashboard'
              ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Home size={18} />
          Dashboard
        </button>
        <button
          onClick={() => setCurrentPage('profile')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 font-medium transition-all ${
            currentPage === 'profile'
              ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <User size={18} />
          Profile
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* Content */}
      {currentPage === 'dashboard' ? <Dashboard /> : <Profile />}
    </div>
  );
}

export default IndexPopup;