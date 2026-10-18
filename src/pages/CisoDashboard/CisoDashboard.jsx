import { useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  Bug,
  CircleDollarSign,
  ClipboardCheck,
  FileText,
  MessageSquareText,
  ShieldAlert,
  Siren,
  Sparkles,
} from 'lucide-react';
import {
  cisoDashboardMetrics,
  governanceSections,
  highestDisplayedRiskScore,
  priorityRisks,
} from '../../data/cisoDashboardData.js';
import './CisoDashboard.css';

const riskScoreScale = [0, 5, 10, 15, 20, 25];

const postureMetrics = [
  {
    label: 'Active vulnerabilities',
    value: cisoDashboardMetrics.activeVulnerabilities,
    icon: Bug,
    tone: 'blue',
  },
  {
    label: 'Critical vulnerabilities',
    value: cisoDashboardMetrics.criticalVulnerabilities,
    icon: ShieldAlert,
    tone: 'danger',
  },
  {
    label: 'SLA breached',
    value: cisoDashboardMetrics.slaBreached,
    icon: Activity,
    tone: 'warning',
  },
  {
    label: 'Estimated loss exposure',
    value: cisoDashboardMetrics.estimatedLossExposure,
    icon: CircleDollarSign,
    tone: 'neutral',
  },
  {
    label: 'Open incidents',
    value: cisoDashboardMetrics.openIncidents,
    icon: Siren,
    tone: 'neutral',
  },
];

function OverAppetiteRing() {
  const { openRisks, overAppetite } = cisoDashboardMetrics;
  const circumference = 2 * Math.PI * 42;
  const highlightedLength = circumference * (overAppetite / openRisks);

  return (
    <div
      className="ciso-risk-ring"
      role="img"
      aria-label={`Over appetite: ${overAppetite} of ${openRisks} open risks`}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <circle className="ciso-risk-ring__track" cx="50" cy="50" r="42" />
        <circle
          className="ciso-risk-ring__value"
          cx="50"
          cy="50"
          r="42"
          strokeDasharray={`${highlightedLength} ${circumference - highlightedLength}`}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <span className="ciso-risk-ring__center">
        <strong>{overAppetite}<small>/{openRisks}</small></strong>
        <span>Over appetite</span>
      </span>
    </div>
  );
}

function RiskPostureRail() {
  return (
    <section className="ciso-zone ciso-risk-posture" aria-labelledby="ciso-risk-posture-title">
      <div className="ciso-zone-heading">
        <p className="ciso-eyebrow">Risk posture</p>
        <h2 id="ciso-risk-posture-title">Open risk register</h2>
      </div>

      <div className="ciso-risk-posture__hero">
        <div className="ciso-open-risk-count">
          <strong>{cisoDashboardMetrics.openRisks}</strong>
          <span>Open Risks</span>
        </div>
        <OverAppetiteRing />
      </div>

      <ul className="ciso-posture-metrics" aria-label="Supporting risk metrics">
        {postureMetrics.map(({ label, value, icon: Icon, tone }) => (
          <li className={`ciso-posture-metric ciso-posture-metric--${tone}`} key={label}>
            <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
            <span>{label}</span>
            <strong>{value}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RiskTrack({ risk }) {
  const trackWidth = (risk.score / highestDisplayedRiskScore) * 100;
  const severityClass = risk.severity.toLowerCase();

  return (
    <li className={`ciso-risk-track ciso-risk-track--${severityClass}`}>
      <div className="ciso-risk-track__heading">
        <span className="ciso-risk-track__rank" aria-label={`Rank ${Number(risk.rank)}`}>
          {risk.rank}
        </span>
        <span className="ciso-risk-track__identity">
          <span className="ciso-risk-track__id">{risk.id}</span>
          <span className="ciso-risk-track__name">{risk.name}</span>
        </span>
        <span className="ciso-risk-track__details">
          <span className={`ciso-severity ciso-severity--${severityClass}`}>{risk.severity}</span>
          <span className="ciso-risk-track__score">
            <span>Score</span>
            <strong>{risk.score}</strong>
          </span>
        </span>
      </div>
      <div
        className="ciso-risk-track__bar"
        role="img"
        aria-label={`${risk.name}: score ${risk.score}; relative bar length based on the highest displayed score of ${highestDisplayedRiskScore}`}
      >
        <span style={{ '--ciso-track-width': `${trackWidth}%` }} />
      </div>
    </li>
  );
}

function PriorityRiskLandscape() {
  return (
    <section className="ciso-zone ciso-priority-landscape" aria-labelledby="ciso-priority-title">
      <div className="ciso-zone-heading ciso-priority-landscape__heading">
        <div>
          <p className="ciso-eyebrow">Priority risks</p>
          <h2 id="ciso-priority-title">Priority Risk Landscape</h2>
          <p className="ciso-zone-description">Ranked by the displayed risk score</p>
        </div>
        <span className="ciso-priority-landscape__count">{priorityRisks.length} shown</span>
      </div>

      <div className="ciso-risk-scale" aria-label={`Risk score scale from 0 to ${highestDisplayedRiskScore}`}>
        <div className="ciso-risk-scale__caption">
          <span>Risk score</span>
          <span>25 is the highest displayed score</span>
        </div>
        <div className="ciso-risk-scale__values" aria-hidden="true">
          {riskScoreScale.map((score) => <span key={score}>{score}</span>)}
        </div>
      </div>

      <ol className="ciso-risk-track-list" aria-label="Priority risks and displayed scores">
        {priorityRisks.map((risk) => <RiskTrack key={risk.id} risk={risk} />)}
      </ol>
    </section>
  );
}

function AiExecutiveBriefing() {
  const [notice, setNotice] = useState('');
  const showUnavailableNotice = () => setNotice('Available after backend integration.');

  return (
    <section className="ciso-zone ciso-ai-briefing" aria-labelledby="ciso-briefing-title">
      <div className="ciso-zone-heading ciso-ai-briefing__heading">
        <span className="ciso-ai-briefing__mark" aria-hidden="true"><Sparkles size={18} /></span>
        <div>
          <p className="ciso-eyebrow">Executive workspace</p>
          <h2 id="ciso-briefing-title">AI Executive Briefing</h2>
        </div>
      </div>

      <p className="ciso-zone-description ciso-ai-briefing__description">
        Generate an executive-ready summary of current security, risk, and compliance posture.
      </p>

      <div className="ciso-briefing-composer" aria-label="Briefing composer preview">
        <div className="ciso-briefing-composer__topline">
          <span><FileText size={15} aria-hidden="true" /> Briefing workspace</span>
          <span className="ciso-briefing-composer__state">Prototype</span>
        </div>
        <p>No generated content is shown in this UI prototype.</p>
        <div className="ciso-briefing-composer__rule" aria-hidden="true"><i /><i /><i /></div>
      </div>

      <div className="ciso-briefing-actions" aria-label="Briefing actions">
        <button className="ciso-briefing-button ciso-briefing-button--primary" type="button" onClick={showUnavailableNotice}>
          <Sparkles size={15} aria-hidden="true" />
          <span>Generate briefing</span>
          <ArrowUpRight size={15} aria-hidden="true" />
        </button>
        <button className="ciso-briefing-button" type="button" onClick={showUnavailableNotice}>
          <MessageSquareText size={15} aria-hidden="true" />
          <span>What changed in the last 7 days?</span>
        </button>
        <button className="ciso-briefing-button" type="button" onClick={showUnavailableNotice}>
          <ClipboardCheck size={15} aria-hidden="true" />
          <span>Board-ready summary</span>
        </button>
      </div>

      {notice && <p className="ciso-briefing-status" role="status" aria-live="polite">{notice}</p>}
    </section>
  );
}

function GovernanceRibbon() {
  return (
    <section className="ciso-governance-ribbon" aria-labelledby="ciso-governance-title">
      <div className="ciso-governance-ribbon__heading">
        <p className="ciso-eyebrow">Governance &amp; assurance</p>
        <h2 id="ciso-governance-title">Control and assessment snapshot</h2>
      </div>
      <div className="ciso-governance-ribbon__sections">
        {governanceSections.map((section) => (
          <div
            className="ciso-governance-section"
            key={section.id}
            role={section.metrics ? 'group' : undefined}
            aria-label={section.metrics ? 'Vendors and ineffective controls' : undefined}
          >
            {section.metrics ? (
              <div className="ciso-governance-section__paired-values">
                {section.metrics.map((metric) => (
                  <div className="ciso-governance-metric" key={metric.label}>
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ciso-governance-metric">
                <span>{section.label}</span>
                <strong>{section.value}</strong>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function CisoDashboard() {
  return (
    <div className="ciso-dashboard">
      <div className="ciso-workspace">
        <RiskPostureRail />
        <PriorityRiskLandscape />
        <AiExecutiveBriefing />
      </div>
      <GovernanceRibbon />
    </div>
  );
}
