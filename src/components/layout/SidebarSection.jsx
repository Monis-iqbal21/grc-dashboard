import SidebarItem from './SidebarItem.jsx';

export default function SidebarSection({ section, onNavigate }) {
  return <section className="nav-section"><h2 className="section-label">{section.label}</h2>
    {section.items.map((item) => <SidebarItem key={item.path} item={item} onNavigate={onNavigate} />)}
  </section>;
}
