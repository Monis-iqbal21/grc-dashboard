import { useMemo, useRef, useState } from 'react';
import { ArrowDownToLine, FilePlus2 } from 'lucide-react';
import { policiesData } from '../../data/policiesData.js';
import { getPolicyStatusPresentation } from '../../data/policyStatusPresentation.js';
import NewPolicyModal from '../../components/policies/NewPolicyModal.jsx';
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
  const newPolicyTriggerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('all');
  const [policyRecords, setPolicyRecords] = useState(() => [...policiesData]);
  const [localCampaignRecords, setLocalCampaignRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPolicyId, setSelectedPolicyId] = useState(policiesData[0]?.id ?? null);
  const [currentPage, setCurrentPage] = useState(1);
  const [notice, setNotice] = useState('');
  const [isNewPolicyOpen, setIsNewPolicyOpen] = useState(false);
  const pageSize = 5;

  const availableStatuses = useMemo(() => [...new Set(policyRecords.map((policy) => (
    policy.status ? getPolicyStatusPresentation(policy.status).label : 'Not provided'
  )))], [policyRecords]);

  const filteredPolicies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return policyRecords.filter((policy) => {
      const searchableText = [policy.name, policy.policyId, policy.category, policy.owner]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const matchesSearch = !query || searchableText.includes(query);
      const matchesStatus = statusFilter === 'all'
        || (statusFilter === 'Not provided' && !policy.status)
        || getPolicyStatusPresentation(policy.status).label === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [policyRecords, searchQuery, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredPolicies.length / pageSize));
  const visiblePolicies = filteredPolicies.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const selectedOnPage = visiblePolicies.find((policy) => policy.id === selectedPolicyId);
  const selectedPolicy = selectedOnPage || visiblePolicies[0] || null;
  const visibleSelectedPolicyId = selectedPolicy?.id ?? null;
  const showIntegrationNotice = (action) => setNotice(`${action} is available after integration.`);
  const showCampaignPrototypeNotice = () => setNotice('Available after backend integration.');
  const openNewPolicy = () => {
    setNotice('');
    setIsNewPolicyOpen(true);
  };
  const addLocalPolicy = (form) => {
    const nextSerial = (policyRecords.length + 1).toString().padStart(3, '0');
    const existingPolicyIds = new Set(policyRecords.map((policy) => policy.policyId));
    const existingRecordIds = new Set(policyRecords.map((policy) => policy.id));
    let serial = Number(nextSerial);
    let policyId = `POL-LOCAL-${String(serial).padStart(3, '0')}`;
    while (existingPolicyIds.has(policyId) || existingRecordIds.has(`local-${policyId.toLocaleLowerCase()}`)) {
      serial += 1;
      policyId = `POL-LOCAL-${String(serial).padStart(3, '0')}`;
    }
    const id = `local-${policyId.toLocaleLowerCase()}`;
    const reviewDate = form.reviewDate
      ? new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        .format(new Date(`${form.reviewDate}T12:00:00`))
      : null;
    const record = {
      id,
      policyId,
      name: form.title,
      category: form.domain,
      owner: form.owner,
      version: form.version,
      status: form.status,
      updatedAt: new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date()),
      lastApproved: null,
      reviewCadence: null,
      nextReview: reviewDate,
      description: form.content,
      content: form.content,
      frameworks: [...new Set(form.controls.map((control) => control.framework))],
      controls: form.controls.map(({ framework, id: controlId, title }) => ({ framework, id: controlId, title })),
      tags: [...form.tags],
    };

    setPolicyRecords((current) => [...current, record]);
    setSelectedPolicyId(record.id);
    setActiveTab('all');
    setSearchQuery('');
    setStatusFilter('all');
    setCurrentPage(Math.max(1, Math.ceil((policyRecords.length + 1) / pageSize)));
    setIsNewPolicyOpen(false);
    setNotice('Policy added to the local prototype.');
  };
  const selectTab = (tabId) => {
    setActiveTab(tabId);
    setIsNewPolicyOpen(false);
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
          {activeTab === 'all' && (
            <button
              className="policies-button policies-button--primary"
              ref={newPolicyTriggerRef}
              type="button"
              onClick={openNewPolicy}
            >
              <FilePlus2 aria-hidden="true" size={15} />
              <span>New Policy</span>
            </button>
          )}
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
          <Campaigns
            localCampaigns={localCampaignRecords}
            onPrototypeAction={showCampaignPrototypeNotice}
            onCreateDraft={(campaign) => setLocalCampaignRecords((current) => [...current, campaign])}
            onDraftCreated={() => setNotice('Campaign created as a draft in the local prototype.')}
            onOpenNewCampaign={() => setNotice('')}
          />
        ) : null}
        <div hidden={activeTab !== 'mine'}>
          <MyPolicies onPrototypeAction={showCampaignPrototypeNotice} />
        </div>
      </div>
      {isNewPolicyOpen && activeTab === 'all' && (
        <NewPolicyModal
          onClose={() => setIsNewPolicyOpen(false)}
          onCreate={addLocalPolicy}
          triggerRef={newPolicyTriggerRef}
        />
      )}
    </section>
  );
}
