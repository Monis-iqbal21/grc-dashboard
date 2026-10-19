import { useMemo, useState } from 'react';
import { ArrowDownToLine, BellRing, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { campaignsData } from '../../data/campaignsData.js';
import { policiesData } from '../../data/policiesData.js';
import CampaignTracker from './CampaignTracker.jsx';
import CampaignIntelligence from './CampaignIntelligence.jsx';
import './Campaigns.css';

const statusOptions = ['In Progress', 'Completed', 'Overdue', 'Draft'];
const statusOrder = { 'In Progress': 0, Overdue: 1, Completed: 2, Draft: 3 };

function getPending(campaign) {
  return campaign.recipients - campaign.acknowledged;
}

function getCompletion(campaign) {
  return campaign.recipients > 0 ? (campaign.acknowledged / campaign.recipients) * 100 : 0;
}

function CampaignSummary({ summary }) {
  const items = [
    { label: 'In Progress', value: summary.inProgress, kind: 'in-progress' },
    { label: 'Completed', value: summary.completed, kind: 'completed' },
    { label: 'Overdue', value: summary.overdue, kind: 'overdue' },
    { label: 'Pending Acknowledgments', value: summary.pendingAcknowledgments, kind: 'pending' },
  ];

  return (
    <section className="campaign-summary" aria-label="Campaign summary">
      {items.map((item) => (
        <div className={`campaign-summary-item campaign-summary-item--${item.kind}`} key={item.kind}>
          <span>{item.label}</span>
          <strong>{item.value.toLocaleString()}</strong>
        </div>
      ))}
    </section>
  );
}

export default function Campaigns({ onPrototypeAction }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaignsData[0]?.campaignId ?? null);

  const campaignRecords = useMemo(() => campaignsData.map((campaign) => ({
    ...campaign,
    policy: policiesData.find((policy) => policy.policyId === campaign.policyId) || null,
    pending: getPending(campaign),
    completion: getCompletion(campaign),
  })), []);

  const summary = useMemo(() => campaignRecords.reduce((totals, campaign) => {
    if (campaign.status === 'In Progress') totals.inProgress += 1;
    if (campaign.status === 'Completed') totals.completed += 1;
    if (campaign.status === 'Overdue') totals.overdue += 1;
    if (campaign.status === 'In Progress' || campaign.status === 'Overdue') {
      totals.pendingAcknowledgments += campaign.pending;
    }
    return totals;
  }, { inProgress: 0, completed: 0, overdue: 0, pendingAcknowledgments: 0 }), [campaignRecords]);

  const visibleCampaigns = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const matches = campaignRecords.filter((campaign) => {
      const searchText = [campaign.title, campaign.campaignId, campaign.policy?.name, campaign.audience]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return (!query || searchText.includes(query))
        && (statusFilter === 'all' || campaign.status === statusFilter);
    });

    if (sortBy === 'deadline') {
      return matches.sort((a, b) => {
        if (a.status === 'Draft' && b.status !== 'Draft') return 1;
        if (b.status === 'Draft' && a.status !== 'Draft') return -1;
        const dateA = a.deadline;
        const dateB = b.deadline;
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        return dateA.localeCompare(dateB);
      });
    }
    if (sortBy === 'status') {
      return matches.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    }
    if (sortBy === 'completion') {
      return matches.sort((a, b) => b.completion - a.completion);
    }
    return matches;
  }, [campaignRecords, searchQuery, sortBy, statusFilter]);

  const selectedCampaign = visibleCampaigns.find((campaign) => campaign.campaignId === selectedCampaignId)
    || visibleCampaigns[0]
    || null;

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSortBy('default');
    setSelectedCampaignId(null);
  };

  return (
    <section className="campaigns-view" aria-label="Policy acknowledgment campaigns">
      <header className="campaigns-heading">
        <div>
          <h1>Acknowledgment Campaigns</h1>
          <p>Track policy distribution, acknowledgment progress, and compliance deadlines.</p>
        </div>
        <button className="policies-button policies-button--primary" type="button" onClick={onPrototypeAction}>
          <Plus aria-hidden="true" size={16} /> New Campaign
        </button>
      </header>

      <div className="campaigns-toolbar" role="search">
        <label className="campaigns-search">
          <Search aria-hidden="true" size={16} />
          <span className="visually-hidden">Search campaigns</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => { setSearchQuery(event.target.value); setSelectedCampaignId(null); }}
            placeholder="Search campaigns..."
          />
        </label>
        <label className="campaigns-select-wrap">
          <SlidersHorizontal aria-hidden="true" size={15} />
          <span className="visually-hidden">Filter campaigns by status</span>
          <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setSelectedCampaignId(null); }}>
            <option value="all">All campaigns</option>
            {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </label>
        <label className="campaigns-select-wrap campaigns-sort-wrap">
          <span className="visually-hidden">Sort campaigns</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="default">Sort by</option>
            <option value="deadline">Deadline — Soonest</option>
            <option value="status">Status</option>
            <option value="completion">Completion Rate</option>
          </select>
        </label>
        <button className="policies-button policies-button--quiet" type="button" onClick={onPrototypeAction}>
          <ArrowDownToLine aria-hidden="true" size={15} /> Export Report
        </button>
        <button className="policies-button policies-button--quiet" type="button" onClick={onPrototypeAction}>
          <BellRing aria-hidden="true" size={15} /> Remind All Pending
        </button>
      </div>

      <CampaignSummary summary={summary} />

      <div className="campaigns-workspace">
        <CampaignTracker
          campaigns={visibleCampaigns}
          selectedCampaignId={selectedCampaign?.campaignId ?? null}
          onSelect={setSelectedCampaignId}
          onReset={resetFilters}
        />
        <CampaignIntelligence campaign={selectedCampaign} onPrototypeAction={onPrototypeAction} />
      </div>
    </section>
  );
}
