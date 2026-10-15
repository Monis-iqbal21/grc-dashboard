import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  KeyRound,
  LogOut,
  Settings,
  X,
} from "lucide-react";
import { navigation } from "../../data/navigation.js";
import { breakpointQueries } from "../../data/breakpoints.js";
import SidebarSection from "./SidebarSection.jsx";

const profile = {
  initials: "DA",
  name: "Demo Admin",
  role: "CISO",
};

export default function Sidebar({
  mode,
  collapsed,
  overlayOpen,
  onToggle,
  onClose,
  onNavigate,
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileZoneRef = useRef(null);
  const profileButtonRef = useRef(null);
  const profileMenuRef = useRef(null);
  const compact =
    mode === "desktop" ? collapsed : mode !== "mobile" && !overlayOpen;
  const expandedOverlay = mode !== "desktop" && overlayOpen;
  const menuVisible = profileOpen && !compact && !(mode === "mobile" && !overlayOpen);

  useEffect(() => {
    if (!menuVisible) return undefined;

    const closeOnOutsidePointer = (event) => {
      if (!profileZoneRef.current?.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        setProfileOpen(false);
        profileButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuVisible]);

  useEffect(() => {
    if (menuVisible) {
      profileMenuRef.current?.querySelector('[role="menuitem"]')?.focus();
    }
  }, [menuVisible]);

  useEffect(() => {
    const mediaQueries = Object.values(breakpointQueries).map((query) =>
      window.matchMedia(query),
    );
    const closeOnResponsiveChange = () => setProfileOpen(false);
    mediaQueries.forEach((query) =>
      query.addEventListener("change", closeOnResponsiveChange),
    );
    return () =>
      mediaQueries.forEach((query) =>
        query.removeEventListener("change", closeOnResponsiveChange),
      );
  }, []);

  const handleSidebarToggle = () => {
    setProfileOpen(false);
    onToggle();
  };

  const handleProfileToggle = () => {
    if (compact) {
      handleSidebarToggle();
      return;
    }
    setProfileOpen((open) => !open);
  };

  const handleNavigate = () => {
    setProfileOpen(false);
    onNavigate?.();
  };

  const handleMenuKeyDown = (event) => {
    const items = Array.from(
      profileMenuRef.current?.querySelectorAll('[role="menuitem"]') ?? [],
    );
    const currentIndex = items.indexOf(document.activeElement);
    let nextIndex;

    if (event.key === "ArrowDown") nextIndex = (currentIndex + 1) % items.length;
    else if (event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + items.length) % items.length;
    } else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = items.length - 1;
    else return;

    event.preventDefault();
    items[nextIndex]?.focus();
  };

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
            onClick={handleSidebarToggle}
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
            onNavigate={handleNavigate}
          />
        ))}
      </nav>
      <div className="sidebar-profile-zone" ref={profileZoneRef}>
        <button
          className="profile-button"
          type="button"
          id="sidebar-profile-trigger"
          ref={profileButtonRef}
          aria-label={`${profile.name}, ${profile.role} profile`}
          aria-expanded={menuVisible}
          aria-controls="sidebar-profile-menu"
          aria-haspopup="menu"
          onClick={handleProfileToggle}
        >
          <span className="avatar">{profile.initials}</span>
          <span className="profile-copy">
            <strong>{profile.name}</strong>
            <small>{profile.role}</small>
          </span>
          <ChevronDown className="profile-chevron" size={15} />
        </button>
        <div
          id="sidebar-profile-menu"
          className={`sidebar-profile-menu${menuVisible ? " is-open" : ""}`}
          ref={profileMenuRef}
          role="menu"
          aria-labelledby="sidebar-profile-trigger"
          aria-hidden={!menuVisible}
          inert={!menuVisible}
          onKeyDown={handleMenuKeyDown}
        >
          <button className="profile-menu-item" type="button" role="menuitem">
            <Settings size={16} aria-hidden="true" />
            <span>Settings</span>
          </button>
          <button className="profile-menu-item" type="button" role="menuitem">
            <KeyRound size={16} aria-hidden="true" />
            <span>Change password</span>
          </button>
          <div className="profile-menu-divider" role="separator" />
          <button
            className="profile-menu-item profile-menu-item--danger"
            type="button"
            role="menuitem"
          >
            <LogOut size={16} aria-hidden="true" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
