import {
  Blocks,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  Landmark,
  Layers,
  Settings2,
  Shield,
  ShieldCheck,
  TriangleAlert,
  Zap,
} from 'lucide-react';
import {
  boardReadiness,
  cyberShieldPillars,
  executiveMetrics,
  frameworks,
  riskThemes,
  trendMonths,
} from '../../data/dashboardData.js';

const metricIcons = [Shield, TriangleAlert, Layers, Clock3];
const frameworkIcons = [ShieldCheck, Blocks];
const boardIcons = [ClipboardCheck, CalendarDays, FileCheck2, ShieldCheck, Landmark, ShieldCheck];
const pillarIcons = [Shield, Settings2, ChartNoAxesCombined, Blocks, Zap];
const trendScale = ['400', '300', '200', '100', '0'];

function PanelHeading({ icon: Icon, kicker, title, description, id, action }) {
  return (
    <header className="dashboard-section-heading">
      <span className="dashboard-section-icon" aria-hidden="true"><Icon size={17} strokeWidth={1.8} /></span>
      <div className="dashboard-section-copy">
        <span className="dashboard-section-kicker">{kicker}</span>
        <h2 id={id}>{title}</h2>
        <p>{description}</p>
      </div>
      {action}
    </header>
  );
}

function ExecutiveMetrics() {
  return (
    <section className="executive-metrics" aria-label="Executive metrics">
      {executiveMetrics.map((metric, index) => {
        const Icon = metricIcons[index];
        return (
          <div className={`executive-metric executive-metric--${metric.tone}`} key={metric.label}>
            <span className="executive-metric-icon" aria-hidden="true"><Icon size={23} strokeWidth={1.8} /></span>
            <div className="executive-metric-copy">
              <span className="executive-metric-label">{metric.label}</span>
              <strong className="executive-metric-value">{metric.value}</strong>
              <span className="executive-metric-supporting">{metric.supporting}</span>
            </div>
          </div>
        );
      })}
    </section>
  );
}

function FrameworkCompliance() {
  return (
    <section className="framework-compliance executive-panel" aria-labelledby="framework-compliance-title">
      <PanelHeading
        icon={Landmark}
        kicker="CONTROL COVERAGE"
        title="Framework Compliance"
        description="Controls implemented against each framework you track"
        id="framework-compliance-title"
      />
      <div className="framework-list">
        {frameworks.map((framework, index) => {
          const Icon = frameworkIcons[index];
          return (
            <article className="framework-item" key={framework.name}>
              <span className="framework-identity" aria-hidden="true"><Icon size={23} strokeWidth={1.7} /></span>
              <div className="framework-copy">
                <h3>{framework.name}</h3>
                <span className="framework-summary">{framework.implemented} of {framework.total} controls</span>
                <div className="framework-state"><span aria-hidden="true" />{framework.state}</div>
              </div>
              <strong className="framework-percentage">{framework.percentage}%</strong>
              <div
                className="framework-progress-track"
                role="progressbar"
                aria-label={`${framework.name} implementation`}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={framework.percentage}
              >
                <span style={{ width: `${framework.percentage}%` }} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function TopRiskThemes() {
  return (
    <section className="risk-theme-section executive-panel" aria-labelledby="risk-theme-title">
      <PanelHeading
        icon={TriangleAlert}
        kicker="RANKED EXPOSURES"
        title="Top Risk Themes"
        description="Open risks grouped by domain, worst first"
        id="risk-theme-title"
      />
      <ol className="risk-theme-list">
        {riskThemes.map((theme, index) => (
          <li className={`risk-theme-row risk-theme-row--${theme.tone}`} key={theme.name}>
            <span className="risk-theme-rank">{String(index + 1).padStart(2, '0')}</span>
            <div className="risk-theme-details">
              <h3>{theme.name}</h3>
              <p><span>{theme.open} open</span><span className="risk-theme-dot" aria-hidden="true">·</span><span>Owner: {theme.owner}</span></p>
            </div>
            <span className={`risk-theme-severity risk-theme-severity--${theme.tone}`}>{theme.severity}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function PostureTrend() {
  return (
    <section className="posture-trend executive-panel" aria-labelledby="posture-trend-title">
      <PanelHeading
        icon={ChartNoAxesCombined}
        kicker="12-MONTH HISTORY"
        title="Posture Trend"
        description="Controls implemented, month by month"
        id="posture-trend-title"
      />
      <div className="posture-trend-chart" role="img" aria-label="No implemented controls recorded from November 2025 through October 2026">
        <div className="posture-trend-y-axis" aria-hidden="true">
          {trendScale.map((value) => <span key={value}>{value}</span>)}
        </div>
        <div className="posture-trend-plot">
          <div className="posture-trend-grid" aria-hidden="true">
            {trendScale.map((value) => <span key={value} />)}
          </div>
          <div className="posture-trend-empty">
            <ChartNoAxesCombined size={21} strokeWidth={1.7} aria-hidden="true" />
            <span>No implemented controls recorded for this period</span>
          </div>
          <span className="posture-trend-baseline" aria-hidden="true" />
        </div>
      </div>
      <div className="posture-trend-months" aria-hidden="true">
        {trendMonths.map((month, index) => <span key={`${month}-${index}`}>{month}</span>)}
      </div>
      <div className="posture-trend-range"><span>Nov 2025</span><span>Oct 2026</span></div>
    </section>
  );
}

function BoardReadiness() {
  return (
    <section className="board-readiness executive-panel" aria-labelledby="board-readiness-title">
      <PanelHeading
        icon={ClipboardCheck}
        kicker="GOVERNANCE STATUS"
        title="Board Readiness"
        description="What the next board pack would say today"
        id="board-readiness-title"
      />
      <dl className="board-readiness-list">
        {boardReadiness.map((item, index) => {
          const Icon = boardIcons[index];
          return (
            <div className="board-readiness-row" key={item.label}>
              <dt><Icon size={15} strokeWidth={1.7} aria-hidden="true" /><span>{item.label}</span></dt>
              <dd className={`board-readiness-value board-readiness-value--${item.tone}`}>{item.value}</dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}

function CyberShieldProgress() {
  return (
    <section className="cyber-shield-progress executive-panel" aria-labelledby="cyber-shield-title">
      <PanelHeading
        icon={ShieldCheck}
        kicker="REGULATORY FRAMEWORK"
        title="SBP Cyber Shield — Pillar Progress"
        description="The circular read by its own pillars"
        id="cyber-shield-title"
      />
      <div className="cyber-shield-list">
        {cyberShieldPillars.map((pillar, index) => {
          const Icon = pillarIcons[index];
          return (
            <div className="cyber-shield-row" key={pillar.name}>
              <Icon className="cyber-shield-icon" size={17} strokeWidth={1.7} aria-hidden="true" />
              <span className="cyber-shield-name">{pillar.name}</span>
              <span className="cyber-shield-count">{pillar.implemented} / {pillar.total}</span>
              <div
                className="cyber-shield-track"
                role="progressbar"
                aria-label={`${pillar.name} pillar progress`}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={pillar.percentage}
              >
                <span style={{ width: `${pillar.percentage}%` }} />
              </div>
              <span className="cyber-shield-percentage">{pillar.percentage}%</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function ExecutivePosture() {
  return (
    <div className="executive-posture">
      <ExecutiveMetrics />
      <div className="executive-primary-grid">
        <FrameworkCompliance />
        <TopRiskThemes />
      </div>
      <div className="executive-secondary-grid">
        <PostureTrend />
        <BoardReadiness />
      </div>
      <CyberShieldProgress />
    </div>
  );
}
