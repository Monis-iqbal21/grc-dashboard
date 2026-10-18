import { useState } from 'react';
import ExecutivePosture from './ExecutivePosture.jsx';
import GrcOperations from './GrcOperations.jsx';
import './Dashboard.css';

const dashboardViews = ['executive', 'operations'];

export function Dashboard() {
  const [activeView, setActiveView] = useState('executive');

  const handleTabKeyDown = (event) => {
    const currentView = event.currentTarget.dataset.dashboardView;
    const currentIndex = dashboardViews.indexOf(currentView);
    let nextView;

    if (event.key === 'ArrowRight') nextView = dashboardViews[(currentIndex + 1) % dashboardViews.length];
    else if (event.key === 'ArrowLeft') nextView = dashboardViews[(currentIndex - 1 + dashboardViews.length) % dashboardViews.length];
    else if (event.key === 'Home') nextView = dashboardViews[0];
    else if (event.key === 'End') nextView = dashboardViews[dashboardViews.length - 1];
    else return;

    event.preventDefault();
    setActiveView(nextView);
    event.currentTarget.parentElement
      ?.querySelector(`[data-dashboard-view="${nextView}"]`)
      ?.focus();
  };

  return (
    <div className="dashboard-workspace">
      <div className="dashboard-viewbar">
        <div className="dashboard-tabs" role="tablist" aria-label="Dashboard views">
          <button
            className={`dashboard-tab${activeView === 'executive' ? ' is-active' : ''}`}
            type="button"
            id="dashboard-tab-executive"
            data-dashboard-view="executive"
            role="tab"
            aria-selected={activeView === 'executive'}
            aria-controls="dashboard-view-panel"
            onClick={() => setActiveView('executive')}
            onKeyDown={handleTabKeyDown}
          >
            Executive Posture
          </button>
          <button
            className={`dashboard-tab${activeView === 'operations' ? ' is-active' : ''}`}
            type="button"
            id="dashboard-tab-operations"
            data-dashboard-view="operations"
            role="tab"
            aria-selected={activeView === 'operations'}
            aria-controls="dashboard-view-panel"
            onClick={() => setActiveView('operations')}
            onKeyDown={handleTabKeyDown}
          >
            GRC Operations
          </button>
        </div>
      </div>

      <div
        className="dashboard-tab-panel"
        id="dashboard-view-panel"
        role="tabpanel"
        aria-labelledby={`dashboard-tab-${activeView}`}
        tabIndex={0}
      >
        {activeView === 'executive' ? <ExecutivePosture /> : <GrcOperations />}
      </div>
    </div>
  );
}

export default Dashboard;
