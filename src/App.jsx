import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import AppShell from './components/layout/AppShell.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import PlaceholderPage from './pages/PlaceholderPage.jsx';
import { allNavigationItems } from './data/navigation.js';

function PageRoutes() {
  const location = useLocation();
  useEffect(() => {
    const page = allNavigationItems.find((item) => item.path === location.pathname);
    document.title = `${page?.label || 'Dashboard'} | NVector`;
  }, [location.pathname]);
  return <Routes><Route element={<AppShell />}>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    {allNavigationItems.map((item) => <Route key={item.path} path={item.path} element={item.path === '/dashboard' ? <Dashboard /> : <PlaceholderPage title={item.label} />} />)}
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Route></Routes>;
}

export default function App() { return <PageRoutes />; }
