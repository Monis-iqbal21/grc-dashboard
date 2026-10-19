import { useMemo, useState } from 'react';
import {
  AlertCircle,
  BadgeCheck,
  BookOpenCheck,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Download,
  FileText,
  History,
  Search,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { policiesData } from '../../data/policiesData.js';
import { myPolicyAssignments, myPolicyReaderContent } from '../../data/myPoliciesData.js';
import './MyPolicies.css';

const policyByReference = new Map(policiesData.map((policy) => [policy.policyId, policy]));
const filterOptions = [
  { id: 'all', label: 'All' },
  { id: 'attention', label: 'Needs Attention' },
  { id: 'acknowledged', label: 'Acknowledged' },
];

function getLocalDateISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatCalendarDate(value) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function getAssignmentStatus(assignment, today) {
  if (assignment.acknowledgedAt) return 'Acknowledged';
  return assignment.dueDate && assignment.dueDate < today ? 'Overdue' : 'Pending';
}

function StatusLabel({ status }) {
  const Icon = status === 'Acknowledged' ? BadgeCheck : status === 'Overdue' ? AlertCircle : Clock3;
  return (
    <span className={`my-policy-status my-policy-status--${status.toLowerCase().replaceAll(' ', '-')}`}>
      <Icon aria-hidden="true" size={13} />
      {status}
    </span>
  );
}

function CompletionRing({ counts, total }) {
  const radius = 37;
  const circumference = 2 * Math.PI * radius;
  const segments = [
    { label: 'Acknowledged', count: counts.acknowledged, color: 'var(--success)' },
    { label: 'Awaiting acknowledgment', count: counts.pending, color: 'var(--blue-primary)' },
    { label: 'Overdue', count: counts.overdue, color: 'var(--danger)' },
  ];
  let offset = 0;
  const acknowledgedPercent = total ? (counts.acknowledged / total) * 100 : 0;

  return (
    <div className="my-policy-completion">
      <div className="my-policy-ring-wrap">
        <svg className="my-policy-ring" viewBox="0 0 100 100" role="img" aria-label={`${acknowledgedPercent.toFixed(1)} percent acknowledged`}>
          <circle className="my-policy-ring-track" cx="50" cy="50" r={radius} />
          {segments.map((segment) => {
            const segmentLength = total ? (segment.count / total) * circumference : 0;
            const currentOffset = offset;
            offset += segmentLength;
            return segmentLength > 0 ? (
              <circle
                className="my-policy-ring-segment"
                key={segment.label}
                cx="50"
                cy="50"
                r={radius}
                stroke={segment.color}
                strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                strokeDashoffset={-currentOffset}
              />
            ) : null;
          })}
        </svg>
        <div className="my-policy-ring-copy" aria-hidden="true">
          <strong>{acknowledgedPercent.toFixed(1)}%</strong>
          <span>acknowledged</span>
        </div>
      </div>
      <div className="my-policy-completion-details">
        <strong>{counts.acknowledged} of {total} completed</strong>
        <ul className="my-policy-legend">
          <li><span className="my-policy-legend-dot is-acknowledged" />Acknowledged <b>{counts.acknowledged}</b></li>
          <li><span className="my-policy-legend-dot is-pending" />Awaiting acknowledgment <b>{counts.pending}</b></li>
          <li><span className="my-policy-legend-dot is-overdue" />Overdue <b>{counts.overdue}</b></li>
        </ul>
      </div>
    </div>
  );
}

function AssignmentRow({ assignment, policy, status, selected, onSelect }) {
  const dateLabel = status === 'Acknowledged' ? 'Acknowledged' : 'Due';
  const dateValue = status === 'Acknowledged' ? assignment.acknowledgedAt : assignment.dueDate;
  return (
    <button
      type="button"
      className={`my-policy-assignment${selected ? ' is-selected' : ''} my-policy-assignment--${status.toLowerCase()}`}
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`${policy?.policyId ?? assignment.policyId}, ${policy?.name ?? 'Policy'}, ${status}`}
    >
      <span className="my-policy-assignment-state" aria-hidden="true" />
      <span className="my-policy-assignment-copy">
        <span className="my-policy-assignment-meta">
          <span className="my-policy-id">{policy?.policyId ?? assignment.policyId}</span>
          <span className="my-policy-version">{policy?.version || 'Version unavailable'}</span>
        </span>
        <strong>{policy?.name || 'Policy record unavailable'}</strong>
        <span className="my-policy-assignment-footer">
          <StatusLabel status={status} />
          <span>{dateLabel} {formatCalendarDate(dateValue) || 'Date unavailable'}</span>
        </span>
      </span>
      <ChevronRight className="my-policy-assignment-chevron" aria-hidden="true" size={16} />
    </button>
  );
}

function PolicyReader({ assignment, policy, status, onPrototypeAction, onAcknowledge }) {
  const [acknowledgmentCheck, setAcknowledgmentCheck] = useState({ policyId: null, checked: false });
  if (!assignment || !policy) {
    return (
      <section className="my-policy-reader my-policy-reader--empty" aria-label="Policy reader">
        <div className="my-policy-empty-icon"><FileText aria-hidden="true" size={22} /></div>
        <h2>No policy selected</h2>
        <p>Select an assigned policy to review its details.</p>
      </section>
    );
  }

  const sections = myPolicyReaderContent[policy.policyId] || [];
  const isChecked = acknowledgmentCheck.policyId === policy.policyId && acknowledgmentCheck.checked;
  const dateText = status === 'Acknowledged'
    ? `Acknowledged ${formatCalendarDate(assignment.acknowledgedAt)}`
    : `Due ${formatCalendarDate(assignment.dueDate)}`;

  return (
    <article className="my-policy-reader" aria-label={`${policy.name} policy document`}>
      <header className="my-policy-reader-header">
        <div className="my-policy-document-mark"><FileText aria-hidden="true" size={18} /></div>
        <div className="my-policy-reader-heading">
          <div className="my-policy-reader-reference">
            <span>{policy.policyId} <i aria-hidden="true">·</i> {policy.version || 'Version unavailable'}</span>
            <StatusLabel status={status} />
          </div>
          <h2>{policy.name}</h2>
          <p>{policy.description || 'No policy description is available.'}</p>
        </div>
      </header>

      <dl className="my-policy-metadata">
        <div><dt><UserRound aria-hidden="true" size={13} />Policy owner</dt><dd>{policy.owner || 'Not provided'}</dd></div>
        <div><dt>Category</dt><dd>{policy.category || 'Not provided'}</dd></div>
        <div><dt>Assignment</dt><dd>{dateText}</dd></div>
        {policy.reviewCadence && <div><dt>Review cadence</dt><dd>{policy.reviewCadence}</dd></div>}
      </dl>

      {policy.frameworks?.length > 0 && (
        <div className="my-policy-frameworks">
          <span>Framework associations</span>
          <div>{policy.frameworks.map((framework) => <span key={framework}>{framework}</span>)}</div>
        </div>
      )}

      <div className="my-policy-document-body">
        <div className="my-policy-document-title">
          <span>Policy review workspace</span>
          <h3>{policy.name}</h3>
          <p>Illustrative sample content for review and interface demonstration.</p>
        </div>
        {sections.map((section, index) => (
          <section className="my-policy-document-section" key={section.title}>
            <div className="my-policy-section-number">{String(index + 1).padStart(2, '0')}</div>
            <div>
              <h4>{section.title}</h4>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </section>
        ))}
        <p className="my-policy-sample-note"><CircleHelp aria-hidden="true" size={14} /> Sample content only. Refer to the approved policy source for authoritative requirements.</p>
      </div>

      <footer className={`my-policy-acknowledgment${status === 'Acknowledged' ? ' is-complete' : ''}`}>
        {status === 'Acknowledged' ? (
          <div className="my-policy-acknowledged" role="status">
            <span className="my-policy-acknowledged-icon"><Check aria-hidden="true" size={16} /></span>
            <span><strong>Policy acknowledged</strong><small>{formatCalendarDate(assignment.acknowledgedAt)} · Simulated locally; not submitted to a server.</small></span>
          </div>
        ) : (
          <>
            <div className="my-policy-acknowledgment-copy">
              <h3>Acknowledgment required</h3>
              <p>Review the policy before confirming your acknowledgment.</p>
            </div>
            <label className="my-policy-confirm-label">
              <input
                checked={isChecked}
                onChange={(event) => setAcknowledgmentCheck({ policyId: policy.policyId, checked: event.target.checked })}
                type="checkbox"
              />
              <span className="my-policy-custom-checkbox"><Check aria-hidden="true" size={12} /></span>
              <span>I confirm that I have reviewed this policy.</span>
            </label>
            <button
              className="my-policy-acknowledge-button"
              type="button"
              disabled={!isChecked}
              onClick={() => {
                onAcknowledge(policy.policyId);
                setAcknowledgmentCheck({ policyId: null, checked: false });
              }}
            >
              <ShieldCheck aria-hidden="true" size={16} />
              Acknowledge Policy
            </button>
            <p className="my-policy-local-note">This action is simulated locally and is not submitted to a server.</p>
          </>
        )}
      </footer>

      <div className="my-policy-reader-actions">
        <span>Document actions</span>
        <div>
          <button type="button" onClick={onPrototypeAction}><Download aria-hidden="true" size={14} />Download PDF Copy</button>
          <button type="button" onClick={onPrototypeAction}><History aria-hidden="true" size={14} />Version History</button>
        </div>
      </div>
    </article>
  );
}

export default function MyPolicies({ onPrototypeAction }) {
  const [assignments, setAssignments] = useState(() => myPolicyAssignments.map((assignment) => ({ ...assignment })));
  const [selectedPolicyId, setSelectedPolicyId] = useState('POL-BCP-02');
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const today = getLocalDateISO();

  const enrichedAssignments = useMemo(() => assignments
    .map((assignment, index) => ({
      ...assignment,
      policy: policyByReference.get(assignment.policyId) || null,
      status: getAssignmentStatus(assignment, today),
      sourceOrder: index,
    }))
    .sort((first, second) => {
      const statusOrder = { Overdue: 0, Pending: 1, Acknowledged: 2 };
      return statusOrder[first.status] - statusOrder[second.status] || first.sourceOrder - second.sourceOrder;
    }), [assignments, today]);

  const counts = useMemo(() => enrichedAssignments.reduce((result, assignment) => {
    if (assignment.status === 'Acknowledged') result.acknowledged += 1;
    else if (assignment.status === 'Overdue') result.overdue += 1;
    else result.pending += 1;
    return result;
  }, { acknowledged: 0, overdue: 0, pending: 0 }), [enrichedAssignments]);

  const filteredAssignments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return enrichedAssignments.filter(({ policy, policyId, status }) => {
      const matchesFilter = activeFilter === 'all'
        || (activeFilter === 'attention' && status !== 'Acknowledged')
        || (activeFilter === 'acknowledged' && status === 'Acknowledged');
      const searchable = [policy?.name, policy?.policyId, policy?.category].filter(Boolean).join(' ').toLowerCase();
      return matchesFilter && (!normalizedQuery || searchable.includes(normalizedQuery) || policyId.toLowerCase().includes(normalizedQuery));
    });
  }, [activeFilter, enrichedAssignments, query]);

  const selectedVisibleAssignment = filteredAssignments.find(({ policyId }) => policyId === selectedPolicyId);
  const selectedAssignment = selectedVisibleAssignment || filteredAssignments[0] || null;
  const needsAttention = counts.pending + counts.overdue;

  const selectFilter = (filterId) => {
    setActiveFilter(filterId);
  };
  const selectPolicy = (policyId) => setSelectedPolicyId(policyId);
  const acknowledgePolicy = (policyId) => {
    const acknowledgedAt = getLocalDateISO();
    setAssignments((current) => current.map((assignment) => (
      assignment.policyId === policyId ? { ...assignment, acknowledgedAt } : assignment
    )));
    setActiveFilter('all');
    setSelectedPolicyId(policyId);
  };

  return (
    <div className="my-policies">
      <section className="my-policy-summary" aria-labelledby="my-policy-summary-title">
        <div className="my-policy-summary-copy">
          <div className="my-policy-summary-icon"><BookOpenCheck aria-hidden="true" size={17} /></div>
          <div>
            <p className="my-policy-eyebrow">Personal action center</p>
            <h1 id="my-policy-summary-title">Your Policy Obligations</h1>
            <p className="my-policy-summary-description">Stay up to date with the policies assigned to you.</p>
            <div className="my-policy-attention-count">
              <strong>{needsAttention} require attention</strong>
              <span>{counts.pending} awaiting acknowledgment <i aria-hidden="true">·</i> {counts.overdue} overdue</span>
            </div>
          </div>
        </div>
        <CompletionRing counts={counts} total={enrichedAssignments.length} />
      </section>

      <div className="my-policies-workspace">
        <section className="my-policy-queue" aria-labelledby="my-policy-queue-title">
          <header className="my-policy-queue-header">
            <div>
              <div className="my-policy-queue-title-row"><h2 id="my-policy-queue-title">Assigned to Me</h2><span>{enrichedAssignments.length}</span></div>
              <p>Review your outstanding and completed policy acknowledgments.</p>
            </div>
          </header>

          <div className="my-policy-filters" role="group" aria-label="Filter assigned policies">
            {filterOptions.map((filter) => {
              const count = filter.id === 'all' ? enrichedAssignments.length
                : filter.id === 'attention' ? needsAttention : counts.acknowledged;
              return (
                <button
                  type="button"
                  key={filter.id}
                  className={activeFilter === filter.id ? 'is-active' : ''}
                  aria-pressed={activeFilter === filter.id}
                  onClick={() => selectFilter(filter.id)}
                >
                  {filter.label}<span>{count}</span>
                </button>
              );
            })}
          </div>

          <label className="my-policy-search">
            <Search aria-hidden="true" size={15} />
            <span className="visually-hidden">Filter assigned policies</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter assigned policies..."
            />
          </label>

          <div className="my-policy-assignment-list" aria-label="Assigned policies">
            {filteredAssignments.length ? filteredAssignments.map(({ policyId, policy, status, ...assignment }) => (
              <AssignmentRow
                key={policyId}
                assignment={{ policyId, ...assignment }}
                policy={policy}
                status={status}
                selected={selectedAssignment?.policyId === policyId}
                onSelect={() => selectPolicy(policyId)}
              />
            )) : (
              <div className="my-policy-queue-empty" role="status">
                <Search aria-hidden="true" size={19} />
                <strong>No assignments found</strong>
                <span>Try another filter or search term.</span>
              </div>
            )}
          </div>
          <p className="my-policy-queue-footnote">Assignment status is based on the due date and local acknowledgment state.</p>
        </section>

        <PolicyReader
          key={selectedAssignment?.policyId || 'empty'}
          assignment={selectedAssignment}
          policy={selectedAssignment?.policy}
          status={selectedAssignment?.status}
          onPrototypeAction={onPrototypeAction}
          onAcknowledge={acknowledgePolicy}
        />
      </div>
    </div>
  );
}
