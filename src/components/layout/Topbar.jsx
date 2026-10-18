import { Bell, Menu, Search, Settings2, RefreshCw } from 'lucide-react';
import { allNavigationItems } from '../../data/navigation.js';

export default function Topbar({ title, mode, overlayOpen, onMenu }) {
  const page = allNavigationItems.find((item) => item.label === title);
  return <header className="topbar">
    <div className="topbar-title">{mode === 'mobile' && <button className="icon-button menu-button" aria-label="Open navigation" aria-expanded={overlayOpen} aria-controls="primary-sidebar" onClick={onMenu}><Menu size={19} /></button>}<div><h1>{page?.label || title}</h1></div></div>
    <div className="topbar-search"><Search size={15} /><span>Search anything</span><kbd>⌘ K</kbd></div>
    <div className="topbar-actions"><button className="icon-button refresh-button" aria-label="Refresh dashboard"><RefreshCw size={16} /></button><button className="icon-button" aria-label="Notifications"><Bell size={16} /><i className="notification-dot" /></button><button className="icon-button settings-button" aria-label="Settings"><Settings2 size={17} /></button></div>
  </header>;
}
