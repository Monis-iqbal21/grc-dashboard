import { CalendarDays, FileText, Users } from 'lucide-react';
import { formatCampaignDate, getCompletionLabel } from './campaignUtils.js';

function getDateLabel(campaign) {
  if (campaign.status === 'Completed') return `Completed ${formatCampaignDate(campaign.completedAt)}`;
  if (!campaign.deadline) return 'Deadline not scheduled';
  return `Deadline ${formatCampaignDate(campaign.deadline)}`;
}

export default function CampaignTracker({ campaigns, selectedCampaignId, onSelect, onReset }) {
  return (
    <section className="campaign-tracker" aria-labelledby="campaign-tracker-title">
      <header className="campaign-panel-heading">
        <div>
          <h2 id="campaign-tracker-title">Campaign Tracker</h2>
          <p>Policy distribution and acknowledgment progress</p>
        </div>
        <span className="campaign-record-count">{campaigns.length} {campaigns.length === 1 ? 'campaign' : 'campaigns'}</span>
      </header>

      {campaigns.length ? (
        <div className="campaign-list">
          {campaigns.map((campaign) => {
            const selected = campaign.campaignId === selectedCampaignId;
            const completionLabel = campaign.isLocalDraft ? null : getCompletionLabel(campaign.completion);
            return (
              <button
                className={`campaign-row${selected ? ' is-selected' : ''}`}
                type="button"
                key={campaign.campaignId}
                aria-pressed={selected}
                onClick={() => onSelect(campaign.campaignId)}
              >
                <span className="campaign-row-main">
                  <span className="campaign-row-title-line">
                    <strong>{campaign.title}</strong>
                    <span className={`campaign-status campaign-status--${campaign.status.toLowerCase().replaceAll(' ', '-')}`}>
                      {campaign.status}
                    </span>
                  </span>
                  <span className="campaign-row-date"><CalendarDays aria-hidden="true" size={13} />{getDateLabel(campaign)}</span>
                </span>

                <span className="campaign-row-meta">
                  <span><FileText aria-hidden="true" size={13} />{campaign.policy?.name || 'Policy not found'}</span>
                  <span><Users aria-hidden="true" size={13} />{campaign.audience}</span>
                </span>

                {campaign.isLocalDraft ? (
                  <span className="campaign-row-not-launched">Not launched · no audience snapshot</span>
                ) : (
                  <>
                    <span className="campaign-row-stats">
                      <span><strong>{campaign.acknowledged}</strong> of {campaign.recipients} acknowledged</span>
                      <span><strong>{campaign.pending}</strong> pending</span>
                      <strong className="campaign-row-completion">{completionLabel}</strong>
                    </span>
                    <span
                      className={`campaign-progress campaign-progress--${campaign.status.toLowerCase().replaceAll(' ', '-')}`}
                      role="progressbar"
                      aria-label={`${campaign.title} completion`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={campaign.completion}
                      aria-valuetext={completionLabel}
                    >
                      <span style={{ width: `${campaign.completion}%` }} />
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="campaign-empty-results">
          <strong>No campaigns found</strong>
          <p>Try adjusting your search or filters.</p>
          <button className="campaign-reset-button" type="button" onClick={onReset}>Reset Filters</button>
        </div>
      )}
    </section>
  );
}
