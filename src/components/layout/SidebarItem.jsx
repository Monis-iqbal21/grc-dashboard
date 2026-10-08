import { NavLink } from 'react-router-dom';

export default function SidebarItem({ item, onNavigate }) {
  const Icon = item.icon;
  return <NavLink to={item.path} end onClick={onNavigate} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} title={item.label}>
    <span className="nav-icon"><Icon size={17} strokeWidth={1.8} /></span><span className="nav-label">{item.label}</span>
    <span className="nav-tooltip" aria-hidden="true">{item.label}</span>
  </NavLink>;
}
