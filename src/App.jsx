import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import AppShell from './components/layout/AppShell.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import CisoDashboard from './pages/CisoDashboard/CisoDashboard.jsx';
import Policies from './pages/Policies/Policies.jsx';
import PolicyLibrary from './pages/PolicyLibrary/PolicyLibrary.jsx';
import Procedures from './pages/Procedures/Procedures.jsx';
import Tasks from './pages/Tasks/Tasks.jsx';
import Reports from './pages/Reports/Reports.jsx';
import AuditTrail from './pages/AuditTrail/AuditTrail.jsx';
import Teams from './pages/Teams/Teams.jsx';
import Users from './pages/Users/Users.jsx';
import RolesPermissions from './pages/RolesPermissions/RolesPermissions.jsx';
import PlaceholderPage from './pages/PlaceholderPage.jsx';
import { allNavigationItems } from './data/navigation.js';

function PageRoutes() {
  const location = useLocation();
  useEffect(() => {
    const page = allNavigationItems.find((item) => item.path === location.pathname || location.pathname.startsWith(`${item.path}/`));
    const pageLabel = page?.label || (location.pathname.startsWith('/procedures') ? 'Procedures' : location.pathname === '/audit' ? 'Audit Trail' : location.pathname === '/admin/teams' ? 'Teams' : 'Dashboard');
    document.title = `${pageLabel} | NVector`;
  }, [location.pathname]);
  return <Routes><Route element={<AppShell />}>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    {allNavigationItems.map((item) => <Route key={item.path} path={item.path} element={item.path === '/dashboard' ? <Dashboard /> : item.path === '/ciso' ? <CisoDashboard /> : item.path === '/policies' ? <Policies /> : item.path === '/policy-library' ? <PolicyLibrary /> : item.path === '/tasks' ? <Tasks /> : item.path === '/reports' ? <Reports /> : item.path === '/audit-trail' ? <AuditTrail /> : item.path === '/teams' ? <Teams /> : item.path === '/users' ? <Users /> : item.path === '/roles-permissions' ? <RolesPermissions /> : <PlaceholderPage title={item.label} />} />)}
    <Route path="/audit" element={<AuditTrail />} />
    <Route path="/admin/teams" element={<Navigate to="/teams" replace />} />
    <Route path="/admin/roles" element={<Navigate to="/roles-permissions" replace />} />
    <Route path="/procedures/*" element={<Procedures />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Route></Routes>;
}

export default function App() { return <PageRoutes />; }
