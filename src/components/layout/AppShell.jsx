import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import Backdrop from "./Backdrop.jsx";
import { allNavigationItems } from "../../data/navigation.js";
import { breakpointQueries } from "../../data/breakpoints.js";

function getMode() {
  if (window.matchMedia(breakpointQueries.mobile).matches) return "mobile";
  if (window.matchMedia(breakpointQueries.tablet).matches) return "tablet";
  if (window.matchMedia(breakpointQueries.laptop).matches) return "laptop";
  return "desktop";
}

export default function AppShell() {
  const [mode, setMode] = useState(getMode);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const location = useLocation();
  const current = allNavigationItems.find(
    (item) => item.path === location.pathname,
  );
  const closeOverlay = useCallback(() => setOverlayOpen(false), []);
  const toggleSidebar = () =>
    mode === "desktop"
      ? setDesktopCollapsed((value) => !value)
      : setOverlayOpen((value) => !value);

  useEffect(() => {
    const queries = Object.values(breakpointQueries).map((query) =>
      window.matchMedia(query),
    );
    const update = () => {
      setMode(getMode());
      setOverlayOpen(false);
    };
    queries.forEach((query) => query.addEventListener("change", update));
    return () =>
      queries.forEach((query) => query.removeEventListener("change", update));
  }, []);

  useEffect(() => {
    if (!overlayOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeOverlay();
    };
    window.addEventListener("keydown", onKeyDown);
    const lockScroll = mode === "mobile" || mode === "tablet";
    if (lockScroll) document.body.classList.add("scroll-locked");
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (lockScroll) document.body.classList.remove("scroll-locked");
    };
  }, [overlayOpen, mode, closeOverlay]);

  return (
    <div
      className={`app-frame mode-${mode}${desktopCollapsed ? " desktop-collapsed" : ""}${overlayOpen ? " overlay-active" : ""}`}
    >
      <Sidebar
        mode={mode}
        collapsed={desktopCollapsed}
        overlayOpen={overlayOpen}
        onToggle={toggleSidebar}
        onClose={closeOverlay}
        onNavigate={closeOverlay}
      />
      <Backdrop
        open={overlayOpen && mode !== "desktop"}
        onClose={closeOverlay}
      />
      <div className="main-area">
        <Topbar
          title={current?.label || "Dashboard"}
          mode={mode}
          overlayOpen={overlayOpen}
          onMenu={toggleSidebar}
        />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
