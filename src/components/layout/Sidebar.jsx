import { ChevronDown, ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { navigation } from "../../data/navigation.js";
import SidebarSection from "./SidebarSection.jsx";

export default function Sidebar({
  mode,
  collapsed,
  overlayOpen,
  onToggle,
  onClose,
  onNavigate,
}) {
  const compact =
    mode === "desktop" ? collapsed : mode !== "mobile" && !overlayOpen;
  const expandedOverlay = mode !== "desktop" && overlayOpen;
  return (
    <aside
      id="primary-sidebar"
      className={`sidebar${compact ? " compact" : ""}${expandedOverlay ? " overlay-open" : ""}${mode === "mobile" ? " mobile-drawer" : ""}${mode !== "desktop" && mode !== "mobile" ? " rail-sidebar" : ""}`}
      aria-label="Primary navigation"
      aria-hidden={mode === "mobile" && !overlayOpen}
      inert={mode === "mobile" && !overlayOpen}
    >
      <div className="sidebar-head">
        <div className="brand-mark" aria-hidden="true">
          N<span>.</span>
        </div>
        <div className="brand-copy">
          <span className="brand-name">NVector</span>
          <span className="brand-caption">GRC PLATFORM</span>
        </div>
        {mode === "mobile" ? (
          <button
            className="sidebar-action mobile-close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        ) : (
          <button
            className="sidebar-action collapse-action"
            onClick={onToggle}
            aria-label={
              mode === "desktop"
                ? collapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
                : overlayOpen
                  ? "Collapse sidebar"
                  : "Expand sidebar"
            }
            aria-expanded={mode === "desktop" ? !collapsed : overlayOpen}
            aria-controls="primary-sidebar"
          >
            {mode === "desktop" ? (
              collapsed ? (
                <ChevronsRight size={17} />
              ) : (
                <ChevronsLeft size={17} />
              )
            ) : overlayOpen ? (
              <ChevronsLeft size={17} />
            ) : (
              <ChevronsRight size={17} />
            )}
          </button>
        )}
      </div>
      <nav className="sidebar-nav">
        {navigation.map((section) => (
          <SidebarSection
            key={section.label}
            section={section}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
      <div className="sidebar-profile-zone">
        <button
          className="profile-button"
          type="button"
          aria-label="Demo Admin, CISO profile"
        >
          <span className="avatar">DA</span>
          <span className="profile-copy">
            <strong>Demo Admin</strong>
            <small>CISO</small>
          </span>
          <ChevronDown className="profile-chevron" size={15} />
        </button>
      </div>
    </aside>
  );
}
