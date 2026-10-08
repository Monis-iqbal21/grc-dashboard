import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  CircleHelp,
  MoreHorizontal,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { metrics, risks } from '../../data/dashboardData.js';
import MetricItem from '../../components/ui/MetricItem.jsx';

function RiskExposure() {
  return (
    <article className="panel exposure-panel">
      <div className="panel-heading">
        <div><span className="panel-kicker">RISK OVERVIEW</span><h3>Risk &amp; security exposure</h3></div>
        <button className="quiet-icon" aria-label="Risk panel options"><MoreHorizontal size={18} /></button>
      </div>
      <div className="exposure-body">
        <div className="donut"><div className="donut-inner"><strong>06</strong><span>critical</span></div></div>
        <div className="exposure-legend">
          <div><i className="legend-dot dot-red" /><span>Critical</span><strong>06</strong></div>
          <div><i className="legend-dot dot-amber" /><span>High</span><strong>14</strong></div>
          <div><i className="legend-dot dot-blue" /><span>Moderate</span><strong>28</strong></div>
          <div><i className="legend-dot dot-muted" /><span>Low</span><strong>41</strong></div>
        </div>
      </div>
      <div className="panel-foot"><span><i className="live-dot" /> Updated 12 min ago</span><a href="#priority-risks">View risk register <ArrowRight size={13} /></a></div>
    </article>
  );
}

function FrameworkCoverage() {
  const frameworks = [['ISO 27001', 86, 'blue'], ['SOC 2', 72, 'cyan'], ['NIST CSF', 64, 'violet'], ['GDPR', 91, 'green']];
  return (
    <article className="panel coverage-panel">
      <div className="panel-heading">
        <div><span className="panel-kicker">COMPLIANCE</span><h3>Framework coverage</h3></div>
        <button className="quiet-icon" aria-label="Coverage panel options"><MoreHorizontal size={18} /></button>
      </div>
      <div className="coverage-list">
        {frameworks.map(([name, value, tone]) => (
          <div className="coverage-row" key={name}>
            <div className="coverage-label"><span>{name}</span><strong>{value}%</strong></div>
            <div className="progress-track"><i className={`progress-${tone}`} style={{ width: `${value}%` }} /></div>
          </div>
        ))}
      </div>
      <div className="panel-foot"><span>4 frameworks tracked</span><a href="/compliance">All frameworks <ArrowRight size={13} /></a></div>
    </article>
  );
}

function AttentionPanel() {
  return (
    <article className="panel attention-panel">
      <div className="panel-heading">
        <div><span className="panel-kicker">ACTION REQUIRED</span><h3>Needs attention <span className="attention-count">3</span></h3></div>
        <button className="quiet-icon" aria-label="Attention panel help"><CircleHelp size={17} /></button>
      </div>
      <div className="attention-list">
        <div className="attention-item"><span className="attention-icon red-icon"><ShieldAlert size={16} /></span><div><strong>Critical risk review overdue</strong><small>Edge gateway patching · 2 days ago</small></div><ChevronRight size={15} /></div>
        <div className="attention-item"><span className="attention-icon amber-icon"><ArrowDownRight size={16} /></span><div><strong>Remediation past due</strong><small>3 controls require follow-up</small></div><ChevronRight size={15} /></div>
        <div className="attention-item"><span className="attention-icon blue-icon"><Sparkles size={16} /></span><div><strong>Evidence requested</strong><small>Access review · due Oct 12</small></div><ChevronRight size={15} /></div>
      </div>
      <div className="panel-foot"><span>Priority actions</span><a href="/tasks">Open task center <ArrowRight size={13} /></a></div>
    </article>
  );
}

function EffectivenessPanel() {
  const bars = [38, 52, 47, 68, 57, 75, 64, 82, 72, 88, 79, 94];
  return (
    <article className="panel effectiveness-panel">
      <div className="panel-heading">
        <div><span className="panel-kicker">CONTROL HEALTH</span><h3>Control effectiveness</h3></div>
        <div className="trend-indicator"><ArrowUpRight size={14} /> 6.4%</div>
      </div>
      <div className="effectiveness-summary"><strong>92.4<span>%</span></strong><span>effective controls</span></div>
      <div className="bar-chart" aria-label="Control effectiveness has improved over the past 12 months">
        {bars.map((height, index) => <i key={index} style={{ height: `${height}%` }} className={index === bars.length - 1 ? 'bar-current' : ''} />)}
      </div>
      <div className="chart-axis"><span>Nov ’25</span><span>Apr ’26</span><span>Oct ’26</span></div>
      <div className="panel-foot"><span><i className="live-dot" /> 318 controls assessed</span><a href="/controls">View controls <ArrowRight size={13} /></a></div>
    </article>
  );
}

function RiskRows() {
  return (
    <>
      <div className="risk-table-scroll">
        <table className="risk-table">
          <thead><tr><th>Risk</th><th>Category</th><th>Owner</th><th>Likelihood</th><th>Impact</th><th>Status</th><th>Review</th></tr></thead>
          <tbody>
            {risks.map((row) => (
              <tr key={row.risk}>
                <td><span className="risk-name"><i className={`risk-marker marker-${row.tone}`} />{row.risk}</span></td>
                <td>{row.category}</td>
                <td><span className="owner-cell"><i className={`owner-avatar owner-${row.tone}`}>{row.initials}</i>{row.owner}</span></td>
                <td>{row.likelihood}</td>
                <td><span className={`impact impact-${row.impact.toLowerCase()}`}>{row.impact}</span></td>
                <td><span className={`status status-${row.status.toLowerCase().replace(' ', '-')}`}><i />{row.status}</span></td>
                <td><span className="review-cell">{row.review}<ChevronRight size={14} /></span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="risk-cards">
        {risks.map((row) => (
          <article className="risk-card" key={row.risk}>
            <div className="risk-card-title"><span className={`risk-marker marker-${row.tone}`} /><strong>{row.risk}</strong><ChevronRight size={15} /></div>
            <div className="risk-card-meta"><span>{row.category}</span><span className={`impact impact-${row.impact.toLowerCase()}`}>{row.impact} impact</span></div>
            <div className="risk-card-footer"><span className="owner-cell"><i className={`owner-avatar owner-${row.tone}`}>{row.initials}</i>{row.owner}</span><span className={`status status-${row.status.toLowerCase().replace(' ', '-')}`}><i />{row.status}</span></div>
          </article>
        ))}
      </div>
    </>
  );
}

export default function GrcOperations() {
  return (
    <div className="dashboard-page grc-operations-page">
      <section className="metric-grid" aria-label="Security posture metrics">
        {metrics.map((metric, index) => <MetricItem key={metric.label} metric={metric} index={index} />)}
      </section>
      <section className="analytics-grid" aria-label="Security analytics">
        <RiskExposure />
        <FrameworkCoverage />
        <AttentionPanel />
        <EffectivenessPanel />
      </section>
      <section className="panel priority-panel" id="priority-risks">
        <div className="panel-heading priority-heading">
          <div><span className="panel-kicker">RISK REGISTER</span><h3>Priority risks <span className="table-count">05</span></h3><p>Active items requiring executive visibility</p></div>
          <a className="table-link" href="/risks">View all risks <ArrowRight size={14} /></a>
        </div>
        <RiskRows />
      </section>
      <footer className="dashboard-footer"><span>NVector Security Platform</span><span>Posture data updated just now</span><ShieldCheck size={14} /></footer>
    </div>
  );
}
