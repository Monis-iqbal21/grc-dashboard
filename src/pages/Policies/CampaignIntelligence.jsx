import { ArrowUpRight, CalendarDays, CircleAlert, FileText, Users } from 'lucide-react';
import { formatCampaignDate, getCompletionLabel } from './campaignUtils.js';

const lifecycle = ['Draft', 'In Progress', 'Completed'];
const ringRadius = 39;
const ringCircumference = 2 * Math.PI * ringRadius;

function Lifecycle({ campaign }) {
  const activeStep = campaign.status === 'Draft' ? 0 : campaign.status === 'Completed' ? 2 : 1;

  return (
    <div className="campaign-lifecycle" role="group" aria-label={`Lifecycle stage: ${campaign.status === 'Overdue' ? 'In Progress' : campaign.status}`}>
      {lifecycle.map((step, index) => {
        const state = index < activeStep ? 'complete' : index === activeStep ? 'current' : 'upcoming';
        return (
          <div className={`campaign-lifecycle-step campaign-lifecycle-step--${state}`} key={step}>
            <span className="campaign-lifecycle-marker">{index < activeStep ? '✓' : index + 1}</span>
            <span>{step}</span>
          </div>
        );
      })}
      {campaign.status === 'Overdue' && (
        <span className="campaign-overdue-condition"><CircleAlert aria-hidden="true" size={13} /> Overdue</span>
      )}
    </div>
  );
}

function ProgressRing({ campaign }) {
  const completionLabel = getCompletionLabel(campaign.completion);
  const offset = ringCircumference * (1 - campaign.completion / 100);

  return (
    <div className="campaign-progress-focus">
      <svg
        className={`campaign-progress-ring campaign-progress-ring--${campaign.status.toLowerCase().replaceAll(' ', '-')}`}
        viewBox="0 0 100 100"
        role="progressbar"
        aria-label="Campaign completion"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={campaign.completion}
        aria-valuetext={completionLabel}
      >
        <circle className="campaign-ring-track" cx="50" cy="50" r={ringRadius} />
        <circle
          className="campaign-ring-value"
          cx="50"
          cy="50"
          r={ringRadius}
          strokeDasharray={ringCircumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="campaign-ring-copy" aria-hidden="true">
        <strong>{completionLabel}</strong>
        <span>complete</span>
      </div>
      <p><strong>{campaign.acknowledged}</strong> of {campaign.recipients} acknowledged</p>
    </div>
  );
}

function IntelligenceEmpty() {
  return (
    <aside className="campaign-intelligence campaign-intelligence--empty" aria-label="Campaign Intelligence">
      <div className="campaign-empty-icon"><FileText aria-hidden="true" size={20} /></div>
      <h2>No campaign selected</h2>
      <p>Select a campaign from the tracker to inspect its progress and audience.</p>
    </aside>
  );
}

export default function CampaignIntelligence({ campaign, onPrototypeAction }) {
  if (!campaign) return <IntelligenceEmpty />;

  const deadlineLabel = campaign.status === 'Completed'
    ? formatCampaignDate(campaign.completedAt)
    : formatCampaignDate(campaign.deadline);
  const canSendReminder = (campaign.status === 'In Progress' || campaign.status === 'Overdue') && campaign.pending > 0;

  return (
    <aside className="campaign-intelligence" aria-label={`Campaign Intelligence for ${campaign.title}`}>
      <header className="campaign-intelligence-header">
        <div>
          <span>Campaign Intelligence</span>
          <strong>{campaign.campaignId}</strong>
        </div>
        <span className={`campaign-status campaign-status--${campaign.status.toLowerCase().replaceAll(' ', '-')}`}>
          {campaign.status}
        </span>
      </header>

      <div className="campaign-intelligence-identity">
        <span className="campaign-intelligence-eyebrow">Selected campaign</span>
        <h2>{campaign.title}</h2>
        <p>{campaign.policy?.name || 'Policy not found'} <span aria-hidden="true">·</span> {campaign.audience}</p>
      </div>

      <section className="campaign-intelligence-section" aria-labelledby="campaign-lifecycle-heading">
        <h3 id="campaign-lifecycle-heading">Lifecycle</h3>
        <Lifecycle campaign={campaign} />
      </section>

      <ProgressRing campaign={campaign} />

      <section className="campaign-intelligence-section" aria-labelledby="campaign-breakdown-heading">
        <h3 id="campaign-breakdown-heading">Breakdown</h3>
        <div className="campaign-breakdown">
          <div><span>Acknowledged</span><strong>{campaign.acknowledged.toLocaleString()}</strong></div>
          <div><span>Pending</span><strong>{campaign.pending.toLocaleString()}</strong></div>
          <div><span>Total audience</span><strong>{campaign.recipients.toLocaleString()}</strong></div>
          <div><span>{campaign.status === 'Completed' ? 'Completed' : 'Deadline'}</span><strong>{deadlineLabel}</strong></div>
        </div>
      </section>

      <section className="campaign-intelligence-section" aria-labelledby="campaign-metadata-heading">
        <h3 id="campaign-metadata-heading">Campaign metadata</h3>
        <dl className="campaign-metadata">
          <div><dt><FileText aria-hidden="true" size={13} />Associated policy</dt><dd>{campaign.policy?.name || 'Policy not found'} <small>{campaign.policyId}</small></dd></div>
          <div><dt><Users aria-hidden="true" size={13} />Target audience</dt><dd>{campaign.audience}</dd></div>
          <div><dt><CalendarDays aria-hidden="true" size={13} />{campaign.status === 'Completed' ? 'Completed on' : 'Deadline'}</dt><dd>{deadlineLabel}</dd></div>
        </dl>
      </section>

      <footer className="campaign-intelligence-actions">
        <button className="policies-button policies-button--quiet" type="button" onClick={onPrototypeAction}>
          View Campaign Details <ArrowUpRight aria-hidden="true" size={14} />
        </button>
        <button
          className="policies-button policies-button--primary"
          type="button"
          disabled={!canSendReminder}
          title={canSendReminder ? undefined : 'Reminders are only available for launched campaigns with pending acknowledgments.'}
          onClick={onPrototypeAction}
        >
          Send Reminder to Pending
        </button>
      </footer>
    </aside>
  );
}
