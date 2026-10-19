import { useMemo, useRef, useState } from 'react';
import { ArrowDownToLine, FilePlus2 } from 'lucide-react';
import { policiesData } from '../../data/policiesData.js';
import AllPolicies from './AllPolicies.jsx';
import Campaigns from './Campaigns.jsx';
import MyPolicies from './MyPolicies.jsx';
import './Policies.css';

const tabs = [
  { id: 'all', label: 'All Policies' },
  { id: 'campaigns', label: 'Campaigns' },
  { id: 'mine', label: 'My Policies' },
];

export default function Policies() {
  const tabRefs = useRef({});
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPolicyId, setSelectedPolicyId] = useState(policiesData[0]?.id ?? null);
  const [currentPage, setCurrentPage] = useState(1);
  const [notice, setNotice] = useState('');

  const availableStatuses = useMemo(() => [...new Set(policiesData.map((policy) => policy.status || 'Not provided'))], []);

  const filteredPolicies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return policiesData.filter((policy) => {
      const searchableText = [policy.name, policy.policyId, policy.category, policy.owner]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const matchesSearch = !query || searchableText.includes(query);
      const matchesStatus = statusFilter === 'all'
        || (statusFilter === 'Not provided' && !policy.status)
        || policy.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const pageSize = 5;
  const pageCount = Math.max(1, Math.ceil(filteredPolicies.length / pageSize));
  const visiblePolicies = filteredPolicies.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const selectedOnPage = visiblePolicies.find((policy) => policy.id === selectedPolicyId);
  const selectedPolicy = selectedOnPage || visiblePolicies[0] || null;
  const visibleSelectedPolicyId = selectedPolicy?.id ?? null;
  const showIntegrationNotice = (action) => setNotice(`${action} is available after integration.`);
  const showCampaignPrototypeNotice = () => setNotice('Available after backend integration.');
  const selectTab = (tabId) => {
    setActiveTab(tabId);
    setNotice('');
  };
  const handleTabKeyDown = (event, index) => {
    let nextIndex;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = tabs.length - 1;
    else return;
    event.preventDefault();
    selectTab(tabs[nextIndex].id);
    tabRefs.current[tabs[nextIndex].id]?.focus();
  };

  return (
    <section className="policies-page" aria-label="Policies workspace">
      <div className="policies-toolbar">
        <div className="policies-tablist" role="tablist" aria-label="Policy views">
          {tabs.map((tab) => (
            <button
              className={`policies-tab${activeTab === tab.id ? ' is-active' : ''}`}
              id={`policies-tab-${tab.id}`}
              key={tab.id}
              ref={(element) => { tabRefs.current[tab.id] = element; }}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls="policies-tabpanel"
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => selectTab(tab.id)}
              onKeyDown={(event) => handleTabKeyDown(event, tabs.findIndex((item) => item.id === tab.id))}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="policies-toolbar-actions">
          <button className="policies-button policies-button--quiet" type="button" onClick={() => showIntegrationNotice('CSV export')}>
            <ArrowDownToLine aria-hidden="true" size={15} />
            <span>Export CSV</span>
          </button>
          <button className="policies-button policies-button--primary" type="button" onClick={() => showIntegrationNotice('Creating a policy')}>
            <FilePlus2 aria-hidden="true" size={15} />
            <span>New Policy</span>
          </button>
        </div>
      </div>

      {notice && <p className="policies-notice" role="status">{notice}</p>}

      <div id="policies-tabpanel" className="policies-tabpanel" role="tabpanel" aria-labelledby={`policies-tab-${activeTab}`}>
        {activeTab === 'all' ? (
          <AllPolicies
            availableStatuses={availableStatuses}
            currentPage={currentPage}
            filteredPolicies={filteredPolicies}
            onNotice={showIntegrationNotice}
            onPageChange={setCurrentPage}
            onSearchChange={(value) => { setSearchQuery(value); setCurrentPage(1); setSelectedPolicyId(null); }}
            onSelectPolicy={setSelectedPolicyId}
            onStatusChange={(value) => { setStatusFilter(value); setCurrentPage(1); setSelectedPolicyId(null); }}
            searchQuery={searchQuery}
            selectedPolicy={selectedPolicy}
            selectedPolicyId={visibleSelectedPolicyId}
            statusFilter={statusFilter}
            visiblePolicies={visiblePolicies}
            pageCount={pageCount}
            pageSize={pageSize}
          />
        ) : activeTab === 'campaigns' ? (
          <Campaigns onPrototypeAction={showCampaignPrototypeNotice} />
        ) : null}
        <div hidden={activeTab !== 'mine'}>
          <MyPolicies onPrototypeAction={showCampaignPrototypeNotice} />
        </div>
      </div>
    </section>
  );
}
