import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Activity, AlertCircle, ArrowDown, ArrowUp, ArrowUpDown, BookOpen, Check,
  ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Copy,
  Download, ExternalLink, FileCheck2, FileInput, FileText, Filter, History,
  Link2, MoreHorizontal, Pencil, Plus, Search, Settings2,
  ShieldCheck, Trash2, Upload, UsersRound, X,
} from 'lucide-react';
import {
  coverageFrameworks,
  evidenceTypes,
  exportFormats,
  governedByTypes,
  procedureCategories,
  procedureClassifications,
  procedureOwners,
  procedureQuickFilters,
  procedureRecord,
  procedureRecurrences,
  procedureStatuses,
  procedureTriggers,
  procedureTypes,
  raciOptions,
  searchExamples,
  searchFields,
  verifiedCoveredControl,
} from '../../data/proceduresData.js';
import './Procedures.css';

const DETAIL_TABS = [
  'Overview', 'Steps', 'Links 1', 'Versions', 'Review triggers 0',
  'Tasks & runs 0', 'Audit log',
];

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Notice({ children, onDismiss }) {
  if (!children) return null;
  return (
    <div className="procedures-notice" role="status" aria-live="polite">
      <AlertCircle size={16} aria-hidden="true" />
      <span>{children}</span>
      {onDismiss && <button type="button" aria-label="Dismiss message" onClick={onDismiss}><X size={15} /></button>}
    </div>
  );
}

function Modal({ title, eyebrow, children, onClose, wide = false, footer }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    dialogRef.current?.querySelector('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])')?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = [...dialogRef.current.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]')];
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);
  return (
    <div className="procedures-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section
        aria-modal="true"
        aria-labelledby="procedures-modal-title"
        className={cx('procedures-modal', wide && 'procedures-modal--wide')}
        ref={dialogRef}
        role="dialog"
      >
        <header className="procedures-modal-head">
          <div>
            {eyebrow && <span className="procedures-eyebrow">{eyebrow}</span>}
            <h2 id="procedures-modal-title">{title}</h2>
          </div>
          <button className="procedures-icon-button" type="button" aria-label="Close dialog" onClick={onClose}><X size={17} /></button>
        </header>
        <div className="procedures-modal-body">{children}</div>
        {footer && <footer className="procedures-modal-foot">{footer}</footer>}
      </section>
    </div>
  );
}

function Field({ label, required = false, hint, children, className }) {
  return (
    <label className={cx('procedures-field', className)}>
      <span className="procedures-field-label">{label}{required && <span className="required-mark"> *</span>}</span>
      {children}
      {hint && <span className="procedures-field-hint">{hint}</span>}
    </label>
  );
}

function SelectField({ label, value, onChange, options, required = false, hint, placeholder, className }) {
  return (
    <Field label={label} required={required} hint={hint} className={className}>
      <select value={value} onChange={onChange} required={required}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => typeof option === 'string'
          ? <option key={option} value={option}>{option}</option>
          : <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </Field>
  );
}

function Button({ children, variant = 'secondary', className, ...props }) {
  return <button className={cx('procedures-button', `procedures-button--${variant}`, className)} type="button" {...props}>{children}</button>;
}

function StatusBadge({ children }) {
  return <span className={cx('procedure-status', `procedure-status--${children.toLowerCase().replace(/[^a-z]+/g, '-')}`)}>{children}</span>;
}

function Metric({ label, value, detail, emphasized = false }) {
  return (
    <div className={cx('procedure-metric', emphasized && 'procedure-metric--emphasized')}>
      <span className="procedure-metric-label">{label}</span>
      <strong>{value}</strong>
      {detail && <span className="procedure-metric-detail">{detail}</span>}
    </div>
  );
}

function useBackendMessage() {
  const [notice, setNotice] = useState('');
  const timer = useRef(null);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const show = (action) => {
    setNotice(`${action} is not connected to a backend in this local prototype; nothing was changed or saved.`);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setNotice(''), 7000);
  };
  return [notice, show, () => setNotice('')];
}

function parseRoute(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[1] === 'coverage') return { view: 'coverage' };
  if (parts.length >= 4 && parts[2] === 'versions') return { view: 'editor', reference: parts[1], versionId: parts[3] };
  if (parts.length >= 2) return { view: 'detail', reference: parts[1] };
  return { view: 'list' };
}

function makeDefaultNewProcedure() {
  return {
    title: '',
    type: '',
    owner: 'Demo Admin (you)',
    governedBy: '',
    primaryLink: '',
    trigger: 'On demand',
    recurrence: '',
    category: '',
    severity: 6,
    classification: 'Inherited — internal unless what governs it needs higher',
    generateTasks: false,
    appliesToAllVendors: false,
  };
}

function ListingView({
  navigate,
  onOpenModal,
  onBackend,
  selected,
  setSelected,
  query,
  setQuery,
  status,
  setStatus,
  quickFilters,
  setQuickFilters,
}) {
  const [exportOpen, setExportOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [sort, setSort] = useState({ column: '', direction: 'asc' });

  const activeQuick = Object.values(quickFilters).some(Boolean);
  const activeFilters = Boolean(query.trim()) || status !== 'Any status' || activeQuick;
  const matchesQuery = (record, value) => {
    const trimmed = value.trim();
    if (!trimmed) return true;
    const structured = trimmed.match(/^([\w_]+)\s*(>=|<=|!=|=|>|<|:)\s*(?:"([^"]*)"|'([^']*)'|(.+))$/);
    if (!structured) return `${record.reference} ${record.title} ${record.type} ${record.status} ${record.governedBy.reference} ${record.owner} ${record.purpose}`.toLowerCase().includes(trimmed.toLowerCase());
    const [, rawField, operator, quotedDouble, quotedSingle, bare] = structured;
    const expected = (quotedDouble ?? quotedSingle ?? bare ?? '').trim().replace(/^"|"$/g, '').toLowerCase();
    const field = rawField.toLowerCase();
    const actualValues = {
      ref: record.reference,
      reference: record.reference,
      title: record.title,
      type: record.type,
      record_status: record.status,
      status: record.status,
      owner: record.owner,
      category: record.category,
      classification: record.classification,
      trigger: record.trigger,
      recurrence: record.recurrence,
      governs: record.governedBy.reference,
      purpose: record.purpose,
      severity: String(record.severity.score),
    };
    if (!(field in actualValues)) return false;
    const actual = String(actualValues[field]).toLowerCase();
    if (operator === ':') return actual.includes(expected);
    if (operator === '!=') return actual !== expected;
    if (operator === '=') return actual === expected;
    const left = Number(actual);
    const right = Number(expected);
    if (!Number.isFinite(left) || !Number.isFinite(right)) return false;
    if (operator === '>') return left > right;
    if (operator === '>=') return left >= right;
    if (operator === '<') return left < right;
    if (operator === '<=') return left <= right;
    return true;
  };
  const visibleRecord = matchesQuery(procedureRecord, query)
    && (status === 'Any status' || procedureRecord.status === status)
    && (!quickFilters['My procedures'] || procedureRecord.owner === 'Demo Admin')
    && (!quickFilters['Under revision'] || false)
    && (!quickFilters['Review overdue'] || false)
    && (!quickFilters['Governance gap'] || false)
    && (!quickFilters['Pending my approval'] || false);
  const displayedRecord = visibleRecord ? procedureRecord : null;

  const toggleQuickFilter = (label) => {
    setQuickFilters((current) => ({ ...current, [label]: !current[label] }));
    setSelected(false);
  };
  const clearFilters = () => {
    setQuery('');
    setStatus('Any status');
    setQuickFilters({});
  };

  const updateSort = (column) => {
    setSort((current) => ({ column, direction: current.column === column && current.direction === 'asc' ? 'desc' : 'asc' }));
  };

  return (
    <div className="procedures-page">
      <div className="procedures-list-heading">
        <p className="procedures-summary">1 open <span>·</span> 0 active <span>·</span> 1 drafts</p>
        <div className="procedures-toolbar">
          <Button onClick={() => navigate('/procedures/coverage')}><Activity size={15} /> Coverage</Button>
          <div className="procedures-menu-wrap">
            <Button aria-expanded={exportOpen} onClick={() => setExportOpen((open) => !open)}><Download size={15} /> Export <ChevronDown size={14} /></Button>
            {exportOpen && <div className="procedures-popover" role="menu">
              {exportFormats.map(({ format, description }) => <button key={format} role="menuitem" type="button" onClick={() => { setExportOpen(false); onBackend(`${format} export`); }}><strong>{format}</strong><span>{description}</span></button>)}
            </div>}
          </div>
          <Button onClick={() => onOpenModal('settings')}><Settings2 size={15} /> Settings</Button>
          <Button onClick={() => onOpenModal('import')}><Upload size={15} /> Import</Button>
          <Button onClick={() => onOpenModal('clone')}><Copy size={15} /> Clone from skeleton</Button>
          <Button variant="primary" onClick={() => onOpenModal('new')}><Plus size={15} /> New procedure</Button>
        </div>
      </div>

      <section className="procedure-metrics" aria-label="Procedure summary">
        <Metric label="Active" value="0" />
        <Metric label="Under revision" value="0" />
        <Metric label="Pending approval" value="0" />
        <Metric label="Review overdue" value="0" />
        <Metric label="Governance gaps" value="0" />
        <Metric label="Control coverage" value="0%" detail="0 of 221 controls" emphasized />
        <Metric label="Run outcomes" value="—" detail="No completed runs yet" />
      </section>

      <section className="procedures-list-section" aria-label="Procedures">
        <div className="procedures-filters">
          <div className="procedure-search-wrap">
            <Search size={16} aria-hidden="true" />
            <input
              aria-label="Filter procedures"
              value={query}
              onChange={(event) => { setQuery(event.target.value); setSelected(false); }}
              placeholder={'Filter procedures — e.g. severity >= 15 or type = "RUNBOOK"'}
            />
            {query && <button type="button" className="procedures-search-clear" aria-label="Clear search" onClick={() => setQuery('')}><X size={14} /></button>}
          </div>
          <Button className="procedures-help-button" aria-label="How to search" onClick={() => setHelpOpen(true)}><CircleHelp size={16} /> <span>How to search</span></Button>
          <label className="procedure-status-select"><span className="sr-only">Status</span><select value={status} onChange={(event) => { setStatus(event.target.value); setSelected(false); }}>{procedureStatuses.map((item) => <option key={item}>{item}</option>)}</select></label>
        </div>

        <div className="procedure-quick-filters" aria-label="Quick filters">
          {procedureQuickFilters.map((label) => <label key={label} className="procedure-check"><input type="checkbox" checked={Boolean(quickFilters[label])} onChange={() => toggleQuickFilter(label)} /><span>{label}</span></label>)}
        </div>

        {activeFilters && <div className="procedure-filter-actions"><span><Filter size={14} /> Filters applied</span><Button onClick={clearFilters}>Clear filters</Button><Button onClick={() => onBackend('Saving this view')}>Save this view</Button></div>}

        {selected && displayedRecord && <div className="procedure-selection-bar"><span>1 selected</span><Button onClick={() => onOpenModal('reassign')}><UsersRound size={14} /> Reassign owner</Button><Button onClick={() => setSelected(false)}>Clear</Button></div>}

        <div className="procedures-table-scroll">
          <table className="procedures-table">
            <thead><tr>
              <th className="procedure-select-column"><span className="sr-only">Select</span></th>
              {['REF', 'TITLE', 'TYPE', 'STATUS', 'GOVERNED BY', 'OWNER', 'ACTIVE VERSION', 'NEXT REVIEW', 'SEVERITY'].map((column) => <th key={column}>{['REF', 'NEXT REVIEW', 'SEVERITY'].includes(column) ? <button type="button" className="procedure-sort-button" onClick={() => updateSort(column)}>{column}<ArrowUpDown size={12} aria-hidden="true" />{sort.column === column && <span className="sr-only"> sorted {sort.direction}</span>}</button> : column}</th>)}
              <th><span className="sr-only">Actions</span></th>
            </tr></thead>
            <tbody>
              {displayedRecord ? <tr>
                <td className="procedure-select-column" data-label="Select"><input type="checkbox" aria-label={`Select ${procedureRecord.reference}`} checked={selected} onChange={(event) => setSelected(event.target.checked)} /></td>
                <td data-label="Ref"><button className="procedure-ref-link" type="button" onClick={() => navigate(`/procedures/${procedureRecord.reference}`)}>{procedureRecord.reference}</button></td>
                <td data-label="Title"><button className="procedure-title-link" type="button" onClick={() => navigate(`/procedures/${procedureRecord.reference}`)}>{procedureRecord.title}</button></td>
                <td data-label="Type">{procedureRecord.type}</td>
                <td data-label="Status"><StatusBadge>{procedureRecord.status}</StatusBadge></td>
                <td data-label="Governed by"><span className="procedure-governs">{procedureRecord.governedBy.reference}</span><small>{procedureRecord.governedBy.kind}</small></td>
                <td data-label="Owner">{procedureRecord.owner}</td>
                <td data-label="Active version" className="procedure-muted">{procedureRecord.activeVersion}</td>
                <td data-label="Next review" className="procedure-muted">{procedureRecord.nextReview}</td>
                <td data-label="Severity"><span className="procedure-severity-score">{procedureRecord.severity.display}</span></td>
                <td data-label="Actions"><button className="procedures-icon-button" type="button" aria-label="Procedure actions" onClick={() => onOpenModal('record-actions')}><MoreHorizontal size={17} /></button></td>
              </tr> : <tr><td colSpan="11" className="procedures-empty-row"><Search size={19} /><strong>No procedures match these filters</strong><span>Try a different search or clear the active filters.</span>{activeFilters && <Button onClick={clearFilters}>Clear filters</Button>}</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="procedures-pagination"><span>{displayedRecord ? '1–1 of 1' : '0–0 of 0'}</span><div><button type="button" aria-label="Previous page" disabled><ChevronLeft size={16} /></button><button type="button" aria-label="Next page" disabled><ChevronRight size={16} /></button></div></div>
      </section>

      {helpOpen && <Modal title="How to search" eyebrow="PROCEDURES" onClose={() => setHelpOpen(false)} footer={<Button variant="primary" onClick={() => setHelpOpen(false)}>Got it</Button>}>
        <p className="procedure-modal-copy">Plain words search names and descriptions. Structured searches accept a field, operator, and value. Text values use quotes; numbers and dates do not. Multiple values use <code>in (…)</code>. Searches remain inside the organisation.</p>
        <div className="procedure-search-operators"><strong>Operators</strong><p><code>:</code> contains · <code>=</code> exact · <code>!=</code> not equal · <code>in (…)</code> any of · <code>&gt; &gt;= &lt; &lt;=</code> comparisons · <code>between a..b</code> · <code>has</code> · <code>is empty</code> / <code>is set</code></p></div>
        <div className="procedure-search-operators"><strong>Date keywords</strong><p>overdue, today, yesterday, last 30d, last 3m, next 7d, this_week, this_month, this_quarter, this_year, expiring 30</p></div>
        <div className="procedure-search-examples"><strong>Examples</strong>{searchExamples.map((example) => <button type="button" key={example} onClick={() => { setQuery(example); setHelpOpen(false); }}><code>{example}</code><ArrowUp size={13} /></button>)}</div>
        <div className="procedure-search-operators"><strong>Fields</strong><p>{searchFields.join(', ')}</p></div>
        <p className="procedure-prototype-note">The local prototype applies basic text, equality, contains, and numeric comparisons to the one audited record. Other documented query operators are shown here but are not evaluated locally.</p>
      </Modal>}
    </div>
  );
}

function CoverageView({ navigate, onReturn, onOpenDetail }) {
  const [framework, setFramework] = useState('All active frameworks');
  const [category, setCategory] = useState('All categories');
  const [onlyCovered, setOnlyCovered] = useState(false);
  const showCovered = (framework === 'All active frameworks' || framework === verifiedCoveredControl.framework);
  return (
    <div className="procedures-page procedures-secondary-page">
      <div className="procedures-view-topline"><Button onClick={onReturn}><ChevronLeft size={15} /> Procedures</Button><span className="procedures-view-context">Coverage</span></div>
      <div className="procedure-coverage-heading"><div><span className="procedures-eyebrow">CONTROL COVERAGE</span><h2>Procedure coverage</h2><p>{onlyCovered ? '1 of 1 controls carried out by a procedure' : '1 of 221 controls carried out by a procedure'}</p></div><div className="procedure-framework-counts">{coverageFrameworks.map((item) => <div key={item.name}><span>{item.name}</span><strong>{item.controls}</strong></div>)}<div className="procedure-framework-total"><span>Total controls</span><strong>221</strong></div></div></div>
      <div className="procedure-coverage-toolbar">
        <SelectField label="Framework" value={framework} onChange={(event) => setFramework(event.target.value)} options={['All active frameworks', ...coverageFrameworks.map((item) => item.name)]} />
        <SelectField label="Category" value={category} onChange={(event) => setCategory(event.target.value)} options={['All categories', ...procedureCategories]} />
        <label className="procedure-check procedure-covered-only"><input type="checkbox" checked={onlyCovered} onChange={(event) => setOnlyCovered(event.target.checked)} /><span>Only covered controls</span></label>
      </div>
      <div className="procedure-coverage-legend" aria-label="Coverage legend"><span><i className="legend-dot legend-dot--active" />Active</span><span><i className="legend-dot legend-dot--revision" />Active · under revision</span><span><i className="legend-dot legend-dot--draft" />Draft · in review · approved</span><span><i className="legend-dot legend-dot--gap" />Governance gap</span><span><i className="legend-dot legend-dot--none" />No procedure</span><span><i className="legend-dot legend-dot--inherited" />Faded: inherited link</span></div>
      <section className="procedure-coverage-matrix">
        <div className="procedure-matrix-head"><div><span className="procedures-eyebrow">COVERED CONTROL</span><h3>Controls carried out by a procedure</h3></div><span>{onlyCovered ? '1 / 1 covered' : '1 / 221 covered'}</span></div>
        {showCovered && category === 'All categories' ? <div className="procedure-coverage-row">
          <div className="procedure-framework-label">HIPAA</div><div className="procedure-control-reference"><span>AC-01</span><strong>{verifiedCoveredControl.title}</strong></div>
          <div className="procedure-covered-by"><button type="button" onClick={() => { onOpenDetail(); navigate(`/procedures/${procedureRecord.reference}`); }}><span className="procedure-coverage-chip">AC-01 · PRC-2026-0001: Draft · in review · approved</span><strong>{verifiedCoveredControl.procedureTitle}</strong><small>{verifiedCoveredControl.procedureReference}</small></button></div>
        </div> : null}
        {(!showCovered || category !== 'All categories') && <div className="procedures-empty-row procedure-coverage-empty"><BookOpen size={19} /><strong>No verified covered controls match these filters</strong><span>The audited Procedures data identifies only the HIPAA AC-01 relationship.</span></div>}
        {!onlyCovered && <div className="procedure-unverified-controls"><span>Uncovered controls</span><strong>220</strong><p>Individual titles are not included in the audited Procedures dataset, so only verified control details are shown.</p></div>}
      </section>
      <p className="procedure-prototype-note">The production list shows 0 of 221 controls covered; this Coverage view shows 1 of 221. Both audited values are preserved.</p>
    </div>
  );
}

function ProcedureDetail({ navigate, onOpenModal, activeTab, setActiveTab, onBackend }) {
  const tabToKey = (tab) => tab.replace(/\s+\d+$/, '');
  const currentTab = tabToKey(activeTab);
  const openEditor = () => navigate(`/procedures/${procedureRecord.reference}/versions/draft`);
  return (
    <div className="procedures-page procedures-detail-page">
      <div className="procedures-view-topline"><Button onClick={() => navigate('/procedures')}><ChevronLeft size={15} /> Procedures</Button><span className="procedures-view-context">{procedureRecord.reference}</span></div>
      <header className="procedure-detail-header">
        <div className="procedure-detail-main">
          <div className="procedure-detail-ref"><span>{procedureRecord.reference}</span><StatusBadge>Draft</StatusBadge><span className="procedure-classification">Internal</span><span className="procedure-severity-score">6 · Medium</span></div>
          <h2>{procedureRecord.title}</h2>
          <div className="procedure-detail-meta"><span>Owner: <strong>Demo Admin</strong></span><span>Governed by: <strong>HIPAA AC-01</strong></span></div>
        </div>
        <div className="procedure-detail-actions">
          <Button variant="primary" onClick={openEditor}><Pencil size={14} /> Edit draft</Button>
          <div className="procedures-menu-wrap"><Button onClick={() => onOpenModal('record-actions')}><MoreHorizontal size={16} /> Actions <ChevronDown size={14} /></Button></div>
        </div>
      </header>
      <nav className="procedure-detail-tabs" aria-label="Procedure sections">{DETAIL_TABS.map((tab) => <button type="button" key={tab} className={currentTab === tabToKey(tab) ? 'is-active' : ''} aria-current={currentTab === tabToKey(tab) ? 'page' : undefined} onClick={() => setActiveTab(tab)}>{tab}</button>)}</nav>
      <DetailTabContent tab={currentTab} onEditDetails={() => onOpenModal('edit-details')} onAddLink={() => onOpenModal('add-link')} openEditor={openEditor} onBackend={onBackend} />
    </div>
  );
}

function DetailTabContent({ tab, onEditDetails, onAddLink, openEditor, onBackend }) {
  if (tab === 'Overview') return <div className="procedure-detail-content">
    <div className="procedure-not-in-force"><ShieldCheck size={18} /><div><strong>Not yet in force</strong><span>This procedure is not yet in force: draft · Dummy - MFA enrolment for new staff Draft</span></div></div>
    <div className="procedure-overview-grid"><section className="procedure-content-panel"><div className="procedure-panel-heading"><div><span className="procedures-eyebrow">OVERVIEW</span><h3>Procedure definition</h3></div><Button onClick={onEditDetails}><Pencil size={14} /> Edit details</Button></div>
      <dl className="procedure-definition-list"><div><dt>Type</dt><dd>Standard operating procedure</dd></div><div><dt>Trigger</dt><dd>On demand</dd></div><div><dt>Created</dt><dd>11/3/2026</dd></div><div><dt>Submitted</dt><dd>—</dd></div><div><dt>Change reason</dt><dd>Initial version.</dd></div><div><dt>Category</dt><dd>—</dd></div><div><dt>Review cycle</dt><dd>12 months</dd></div><div><dt>Next review</dt><dd>—</dd></div><div><dt>Next cycle</dt><dd>—</dd></div><div><dt>Task generation</dt><dd>Off</dd></div><div><dt>Applies to all vendors</dt><dd>No</dd></div><div><dt>Created by</dt><dd>Demo Admin</dd></div><div><dt>Cloned from</dt><dd>—</dd></div></dl>
    </section><aside className="procedure-content-panel procedure-version-panel"><span className="procedures-eyebrow">IN-FLIGHT VERSION</span><h3>Unnumbered draft</h3><p>Initial version.</p><div className="procedure-version-meta"><span>Created</span><strong>11/3/2026 · Demo Admin</strong></div><Button onClick={openEditor}><FileText size={14} /> Open version</Button></aside></div>
    <button type="button" className="procedure-edit-draft-link" onClick={openEditor}>Edit the draft <ChevronRight size={15} /></button>
  </div>;
  if (tab === 'Steps') return <div className="procedure-content-panel procedure-detail-content procedure-tab-placeholder"><span className="procedures-eyebrow">STEPS</span><h3>No version is in force yet</h3><p>The steps are being written in the in-flight version.</p><Button onClick={openEditor}><Pencil size={14} /> Edit the draft</Button></div>;
  if (tab === 'Links') return <div className="procedure-content-panel procedure-detail-content"><div className="procedure-panel-heading"><div><span className="procedures-eyebrow">LINKS · 1</span><h3>Linked records</h3></div><Button onClick={onAddLink}><Plus size={14} /> Add link</Button></div><div className="procedure-link-row"><div className="procedure-link-icon"><Link2 size={17} /></div><div className="procedure-link-copy"><span className="procedure-link-kind">CONTROL · GOVERNED BY</span><strong>HIPAA AC-01</strong><span>Multi-factor authentication for the cloud console (e.g., AWS)</span></div><Button onClick={() => onBackend('Removing the link')} aria-label="Remove HIPAA AC-01 link"><X size={15} /> Remove</Button></div></div>;
  if (tab === 'Versions') return <div className="procedure-content-panel procedure-detail-content"><div className="procedure-panel-heading"><div><span className="procedures-eyebrow">VERSIONS</span><h3>Procedure versions</h3></div></div><div className="procedure-version-row"><div className="procedure-version-symbol"><FileText size={17} /></div><div className="procedure-version-copy"><div><strong>Unnumbered draft</strong><StatusBadge>Draft</StatusBadge></div><span>Dummy - MFA enrolment for new staff</span><small>Initial version. · 11/3/2026 · Demo Admin</small></div><Button onClick={openEditor}>Open <ChevronRight size={14} /></Button></div></div>;
  if (tab === 'Review triggers') return <div className="procedure-detail-content procedure-review-layout"><section className="procedure-content-panel"><div className="procedure-panel-heading"><div><span className="procedures-eyebrow">OPEN REVIEWS</span><h3>No open reviews</h3></div></div><p className="procedure-panel-copy">“No change needed” takes two people: the owner proposes it, then a GRC Manager who is not the owner confirms it.</p></section><section className="procedure-content-panel"><span className="procedures-eyebrow">HISTORY</span><h3>No resolved reviews yet.</h3></section></div>;
  if (tab === 'Tasks & runs') return <div className="procedure-detail-content procedure-review-layout"><section className="procedure-content-panel"><div className="procedure-panel-heading"><div><span className="procedures-eyebrow">RUNS</span><h3>No completed runs yet</h3></div></div><p className="procedure-panel-copy">No completed procedure runs are available.</p></section><section className="procedure-content-panel"><span className="procedures-eyebrow">GENERATED TASKS</span><h3>Task generation is switched off for this procedure.</h3></section></div>;
  if (tab === 'Audit log') return <div className="procedure-content-panel procedure-detail-content procedure-tab-placeholder"><History size={19} /><h3>Audit log</h3><p>Audit log entries or a definitive empty state were not available in the production audit.</p></div>;
  return null;
}

function makeEditorState() {
  return {
    title: procedureRecord.title,
    type: procedureRecord.type,
    trigger: procedureRecord.trigger,
    purpose: procedureRecord.purpose,
    scope: procedureRecord.scope,
    prerequisites: procedureRecord.prerequisites,
    exceptions: procedureRecord.exceptionsAndEscalation,
    changeReason: procedureRecord.version.changeReason,
    changeSummary: procedureRecord.changeSummary,
    raci: procedureRecord.raciRoles.map((role) => ({ ...role })),
    steps: procedureRecord.steps.map((step) => ({ ...step })),
  };
}

function DraftEditor({ navigate, onBackend }) {
  const [section, setSection] = useState('Details');
  const [draft, setDraft] = useState(makeEditorState);
  const [stepModal, setStepModal] = useState(null);
  const [raciChanged, setRaciChanged] = useState(false);
  const [detailsChanged, setDetailsChanged] = useState(false);
  const update = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setDetailsChanged(true);
  };
  const updateRole = (index, key, value) => {
    setDraft((current) => ({ ...current, raci: current.raci.map((role, i) => i === index ? { ...role, [key]: value } : role) }));
    setRaciChanged(true);
  };
  const responsibleRoles = draft.raci.filter((role) => role.raci === 'R · Responsible').map((role) => role.role).filter(Boolean);
  const checklist = [];
  const accountableCount = draft.raci.filter((role) => role.raci === 'A · Accountable').length;
  if (accountableCount !== 1) checklist.push(`The RACI needs exactly one Accountable role (has ${accountableCount}).`);
  draft.steps.forEach((step, index) => {
    if (!responsibleRoles.includes(step.performer)) checklist.push(`Step ${index + 1}'s performer '${step.performer}' is not a Responsible (R) role in the RACI.`);
  });
  const contentChanged = detailsChanged || raciChanged;
  const moveStep = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= draft.steps.length) return;
    const steps = [...draft.steps];
    [steps[index], steps[target]] = [steps[target], steps[index]];
    setDraft((current) => ({ ...current, steps: steps.map((step, i) => ({ ...step, order: i + 1 })) }));
    setDetailsChanged(true);
  };

  return (
    <div className="procedures-page procedure-editor-page">
      <div className="procedures-view-topline"><Button onClick={() => navigate(`/procedures/${procedureRecord.reference}`)}><ChevronLeft size={15} /> Procedure</Button><span className="procedures-view-context">Draft version editor</span></div>
      <header className="procedure-editor-heading"><div><span className="procedures-eyebrow">UNNUMBERED DRAFT · PRC-2026-0001</span><h2>Draft version</h2><p>{procedureRecord.title}</p></div><Button onClick={() => navigate(`/procedures/${procedureRecord.reference}`)}>Close editor</Button></header>
      <div className="procedure-editor-tabs" role="tablist" aria-label="Draft editor sections">{['Details', 'RACI', 'Steps', 'Before you submit'].map((item) => <button key={item} type="button" role="tab" aria-selected={section === item} className={section === item ? 'is-active' : ''} onClick={() => setSection(item)}>{item}{item === 'Steps' && <span>{draft.steps.length}</span>}</button>)}</div>
      {section === 'Details' && <section className="procedure-editor-panel">
        <div className="procedure-editor-panel-title"><span className="procedures-eyebrow">DRAFT DETAILS</span><h3>Details</h3></div>
        <div className="procedure-form-grid"><Field label="Title" required hint="At least 10 characters, unique among your procedures."><input value={draft.title} minLength={10} onChange={(event) => update('title', event.target.value)} /></Field>
          <SelectField label="Procedure type" value={draft.type} onChange={(event) => update('type', event.target.value)} options={procedureTypes.map((item) => ({ value: item.label, label: item.label }))} />
          <p className="procedure-type-description">{procedureTypes.find((item) => item.label === draft.type)?.description}</p>
          <SelectField label="Trigger" value={draft.trigger} onChange={(event) => update('trigger', event.target.value)} options={procedureTriggers} />
          <Field label="Purpose" required hint="Why this procedure exists — at least 30 characters."><textarea value={draft.purpose} minLength={30} rows={3} onChange={(event) => update('purpose', event.target.value)} /></Field>
          <Field label="Scope"><textarea value={draft.scope} rows={3} onChange={(event) => update('scope', event.target.value)} /></Field>
          <Field label="Prerequisites"><textarea value={draft.prerequisites} rows={3} onChange={(event) => update('prerequisites', event.target.value)} /></Field>
          <Field label="Exceptions & escalation"><textarea value={draft.exceptions} rows={3} onChange={(event) => update('exceptions', event.target.value)} /></Field>
          <Field label="Change reason"><input value={draft.changeReason} onChange={(event) => update('changeReason', event.target.value)} /></Field>
          <Field label="Change summary" hint="Optional on a first version."><textarea value={draft.changeSummary} rows={3} onChange={(event) => update('changeSummary', event.target.value)} /></Field>
        </div>
        <div className="procedure-editor-actions"><Button onClick={() => navigate(`/procedures/${procedureRecord.reference}`)}>Discard</Button><Button variant="primary" disabled={!contentChanged} onClick={() => onBackend('Saving draft details')}>Save details</Button></div>
      </section>}
      {section === 'RACI' && <section className="procedure-editor-panel"><div className="procedure-editor-panel-title"><span className="procedures-eyebrow">RESPONSIBILITY MATRIX</span><h3>RACI</h3><p>Who is Responsible, Accountable, Consulted and Informed.</p></div>
        {!draft.raci.length && <div className="procedure-empty-inline"><UsersRound size={18} /><strong>No roles yet</strong><span>Add the people who do, own, advise on and hear about this procedure.</span></div>}
        {draft.raci.length > 0 && <div className="procedure-raci-table"><div className="procedure-raci-head"><span>Role</span><span>RACI</span><span>Default assignee</span><span /></div>{draft.raci.map((role, index) => <div className="procedure-raci-row" key={role.key}><Field label={`Role ${index + 1}`}><input aria-label="Role" value={role.role} onChange={(event) => updateRole(index, 'role', event.target.value)} /></Field><SelectField label={`RACI ${index + 1}`} value={role.raci} onChange={(event) => updateRole(index, 'raci', event.target.value)} options={raciOptions} /><SelectField label={`Default assignee ${index + 1}`} value={role.assignee} onChange={(event) => updateRole(index, 'assignee', event.target.value)} options={['No default', 'Demo Admin', 'Maizah Kaleem', 'Nimra Khan']} /><button className="procedures-icon-button procedure-remove-role" type="button" aria-label={`Remove role ${role.role || index + 1}`} onClick={() => { setDraft((current) => ({ ...current, raci: current.raci.filter((_, i) => i !== index) })); setRaciChanged(true); }}><Trash2 size={15} /></button></div>)}</div>}
        <div className="procedure-raci-validation"><AlertCircle size={15} />The RACI needs exactly one Accountable (A) role — it has {accountableCount}.</div>
        <div className="procedure-editor-actions"><Button onClick={() => { setDraft((current) => ({ ...current, raci: [...current.raci, { key: `role-${Date.now()}`, role: '', raci: 'R · Responsible', assignee: 'No default' }] })); setRaciChanged(true); }}><Plus size={14} /> Add role</Button><Button onClick={() => setDraft((current) => ({ ...current, raci: [] }))}>Reset</Button><Button variant="primary" disabled={!raciChanged} onClick={() => onBackend('Saving RACI')}>Save RACI</Button></div>
      </section>}
      {section === 'Steps' && <section className="procedure-editor-panel"><div className="procedure-editor-panel-title"><span className="procedures-eyebrow">IN-FLIGHT VERSION</span><h3>Steps</h3><p>Drag to reorder, or use the arrows.</p></div>
        <div className="procedure-step-summary"><span>{draft.steps.length} steps</span><span>{draft.steps.filter((step) => step.mandatory).length} mandatory</span><span>{draft.steps.filter((step) => step.conditional).length} conditional</span><span>{draft.steps.filter((step) => step.evidenceRequired).length} need evidence</span></div>
        <div className="procedure-steps-list">{draft.steps.map((step, index) => <article className="procedure-step-card" key={`${step.order}-${step.title}`}><div className="procedure-step-order">{String(index + 1).padStart(2, '0')}</div><div className="procedure-step-description"><h4>{step.title}</h4><p>{step.instructions}</p><div className="procedure-step-meta"><span>{step.performer}</span>{step.expectedOutput && <span>Expected: {step.expectedOutput}</span>}<span>{step.mandatory ? 'Mandatory' : 'Optional'}</span>{step.conditional && <span>Conditional</span>}{step.evidenceRequired && <span>Evidence required</span>}</div></div><div className="procedure-step-actions"><button type="button" aria-label={`Move step ${index + 1} up`} disabled={index === 0} onClick={() => moveStep(index, -1)}><ArrowUp size={15} /></button><button type="button" aria-label={`Move step ${index + 1} down`} disabled={index === draft.steps.length - 1} onClick={() => moveStep(index, 1)}><ArrowDown size={15} /></button><button type="button" onClick={() => setStepModal({ mode: 'edit', index, step: { ...step } })}><Pencil size={14} /><span>Edit</span></button><button type="button" onClick={() => { setDraft((current) => ({ ...current, steps: current.steps.filter((_, i) => i !== index).map((item, i) => ({ ...item, order: i + 1 })) })); setDetailsChanged(true); }}><Trash2 size={14} /><span>Delete</span></button></div></article>)}</div>
        <Button onClick={() => setStepModal({ mode: 'add', index: -1, step: { title: '', instructions: '', performer: '', system: '', expectedOutput: '', mandatory: true, conditional: false, appliesWhen: '', evidenceRequired: false, evidenceType: 'Screenshot', evidenceDescription: '' } })}><Plus size={14} /> Add step</Button>
      </section>}
      {section === 'Before you submit' && <section className="procedure-editor-panel"><div className="procedure-editor-panel-title"><span className="procedures-eyebrow">REVIEW CHECKLIST</span><h3>Before you submit</h3><p>Resolve each item before this draft can be submitted for review.</p></div>
        {checklist.length ? <ul className="procedure-checklist">{checklist.map((issue) => <li key={issue}><AlertCircle size={16} /><span>{issue}</span></li>)}</ul> : <div className="procedure-checklist-clear"><Check size={16} />The checklist is complete.</div>}
        <div className="procedure-editor-actions"><Button onClick={() => setSection('Details')}>Review draft</Button><Button variant="primary" disabled={checklist.length > 0} onClick={() => onBackend('Submitting the draft for review')}>Submit for review</Button></div>
      </section>}
      {stepModal && <StepModal modal={stepModal} responsibleRoles={responsibleRoles} onClose={() => setStepModal(null)} onSubmit={(step) => { const steps = [...draft.steps]; if (stepModal.mode === 'add') steps.push({ ...step, order: steps.length + 1 }); else steps[stepModal.index] = { ...step, order: stepModal.index + 1 }; setDraft((current) => ({ ...current, steps })); setDetailsChanged(true); setStepModal(null); }} />}
    </div>
  );
}

function StepModal({ modal, responsibleRoles, onClose, onSubmit }) {
  const [step, setStep] = useState(modal.step);
  const patch = (key, value) => setStep((current) => ({ ...current, [key]: value }));
  const submit = (event) => { event.preventDefault(); onSubmit(step); };
  return <Modal title={modal.mode === 'add' ? 'Add step' : 'Edit step'} onClose={onClose} wide footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" onClick={() => document.getElementById('procedure-step-form')?.requestSubmit()}>{modal.mode === 'add' ? 'Add step' : 'Save step'}</Button></>}>
    <form id="procedure-step-form" className="procedure-form-grid" onSubmit={submit}>
      <Field label="Title" required><input required value={step.title} onChange={(event) => patch('title', event.target.value)} /></Field>
      <Field label="Instructions" required><textarea required rows={3} value={step.instructions} onChange={(event) => patch('instructions', event.target.value)} /></Field>
      <SelectField label="Performer" value={step.performer} onChange={(event) => patch('performer', event.target.value)} options={responsibleRoles} placeholder={responsibleRoles.length ? 'Choose a Responsible role' : 'Add an R role to the RACI first'} hint={responsibleRoles.length ? 'Limited to the RACI’s Responsible (R) roles.' : 'Add an R role to the RACI first'} />
      <Field label="System"><input value={step.system} onChange={(event) => patch('system', event.target.value)} /></Field>
      <Field label="Expected output"><input value={step.expectedOutput} onChange={(event) => patch('expectedOutput', event.target.value)} /></Field>
      <div className="procedure-form-checks"><label className="procedure-check"><input type="checkbox" checked={step.mandatory} onChange={(event) => patch('mandatory', event.target.checked)} /><span>Mandatory</span></label><p>A mandatory step skipped or not done lowers the run’s outcome.</p><label className="procedure-check"><input type="checkbox" checked={step.conditional} onChange={(event) => patch('conditional', event.target.checked)} /><span>Conditional step</span></label><p>Applies only when a condition holds; may be recorded Not applicable.</p>{step.conditional && <Field label="Applies when" required hint={`${step.appliesWhen?.length || 0}/500 characters, at least 10.`}><textarea required minLength={10} maxLength={500} rows={2} value={step.appliesWhen || ''} onChange={(event) => patch('appliesWhen', event.target.value)} /></Field>}<label className="procedure-check"><input type="checkbox" checked={step.evidenceRequired} onChange={(event) => patch('evidenceRequired', event.target.checked)} /><span>Evidence required</span></label><p>Completing the step needs evidence attached.</p>{step.evidenceRequired && <><SelectField label="Evidence type" value={step.evidenceType} onChange={(event) => patch('evidenceType', event.target.value)} options={evidenceTypes} /><Field label="Evidence description"><textarea rows={2} value={step.evidenceDescription || ''} onChange={(event) => patch('evidenceDescription', event.target.value)} /></Field></>}</div>
    </form>
  </Modal>;
}

function NewProcedureModal({ onClose, onBackend }) {
  const [form, setForm] = useState(makeDefaultNewProcedure);
  const [error, setError] = useState('');
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const selectedType = procedureTypes.find((item) => item.label === form.type);
  const submit = (event) => {
    event.preventDefault();
    if (form.title.trim().length < 10) { setError('Title must be at least 10 characters.'); return; }
    if (!form.type || !form.owner || !form.governedBy || !form.primaryLink.trim()) { setError('Complete each required field, including the primary link.'); return; }
    setError('');
    onBackend('Creating the procedure');
    onClose();
  };
  return <Modal title="New procedure" eyebrow="PROCEDURES" onClose={onClose} wide footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" onClick={() => document.getElementById('procedure-new-form')?.requestSubmit()}>Create procedure</Button></>}>
    <form id="procedure-new-form" className="procedure-form-grid" onSubmit={submit}>
      {error && <div className="procedure-form-error" role="alert"><AlertCircle size={15} />{error}</div>}
      <Field label="Title" required hint="At least 10 characters, and not one another procedure already uses."><input required minLength={10} value={form.title} onChange={(event) => update('title', event.target.value)} /></Field>
      <SelectField label="Type" required value={form.type} onChange={(event) => { const type = procedureTypes.find((item) => item.label === event.target.value); setForm((current) => ({ ...current, type: event.target.value, governedBy: type?.defaultGovernedBy || '' })); }} options={procedureTypes.map((item) => ({ value: item.label, label: item.label }))} placeholder="Choose a type" />
      {selectedType && <p className="procedure-type-description">{selectedType.description}</p>}
      <SelectField label="Owner" required value={form.owner} onChange={(event) => update('owner', event.target.value)} options={procedureOwners} hint="Answers for the procedure: keeps it current and reviews it on schedule." />
      <SelectField label="Governed by" required value={form.governedBy} onChange={(event) => update('governedBy', event.target.value)} options={governedByTypes} hint="The primary link: the record this procedure exists to carry out." />
      <Field label="Primary link" required hint="The production audit did not return linked-record options for a blank selector."><div className="procedure-input-with-button"><input aria-label="Search primary link" value={form.primaryLink} onChange={(event) => update('primaryLink', event.target.value)} placeholder="Search records…" /><button type="button" disabled={!form.primaryLink} aria-label="Open selected primary link"><ExternalLink size={15} /></button></div><span className="procedure-lookup-limitation">No verified linked-record options are available in this prototype.</span></Field>
      <SelectField label="Trigger" value={form.trigger} onChange={(event) => { update('trigger', event.target.value); if (event.target.value !== 'Scheduled') update('recurrence', ''); }} options={procedureTriggers} />
      {form.trigger === 'Scheduled' && <SelectField label="Recurrence" value={form.recurrence} onChange={(event) => update('recurrence', event.target.value)} options={procedureRecurrences} required placeholder="How often" />}
      <SelectField label="Category" value={form.category} onChange={(event) => update('category', event.target.value)} options={procedureCategories} placeholder="No category" />
      <Field label="Severity score" hint={form.severity === 6 ? '1–25, banded like the risk register. Current score: 6 · Medium.' : '1–25, banded like the risk register.'}><div className="procedure-number-stepper"><button type="button" aria-label="Decrease severity score" disabled={form.severity <= 1} onClick={() => update('severity', Math.max(1, form.severity - 1))}>−</button><input aria-label="Severity score" type="number" min="1" max="25" value={form.severity} onChange={(event) => update('severity', Math.max(1, Math.min(25, Number(event.target.value) || 1)))} /><button type="button" aria-label="Increase severity score" disabled={form.severity >= 25} onClick={() => update('severity', Math.min(25, form.severity + 1))}>+</button></div></Field>
      <SelectField label="Classification" value={form.classification} onChange={(event) => update('classification', event.target.value)} options={['Inherited — internal unless what governs it needs higher', ...procedureClassifications]} />
      <label className="procedure-check procedure-form-check"><input type="checkbox" checked={form.generateTasks} onChange={(event) => update('generateTasks', event.target.checked)} /><span>Generate tasks</span><small>Raise a task per step for each scheduled run once the procedure is active.</small></label>
      {form.type === 'Vendor lifecycle' && <label className="procedure-check procedure-form-check"><input type="checkbox" checked={form.appliesToAllVendors} onChange={(event) => update('appliesToAllVendors', event.target.checked)} /><span>Applies to all vendors</span><small>Every vendor follows this lifecycle, not only the one it is linked to.</small></label>}
    </form>
  </Modal>;
}

function EditDetailsModal({ onClose, onBackend }) {
  const [form, setForm] = useState({ owner: 'Demo Admin (you)', category: '', severity: 6, classification: 'Internal', reviewCycle: 12, generateTasks: false, allVendors: false });
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  return <Modal title="Edit details" onClose={onClose} wide footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" onClick={() => { onBackend('Saving procedure details'); onClose(); }}>Save</Button></>}>
    <div className="procedure-form-grid"><SelectField label="Owner" value={form.owner} onChange={(event) => update('owner', event.target.value)} options={procedureOwners} hint="Answers for the procedure: keeps it current and reviews it on schedule." /><SelectField label="Category" value={form.category} onChange={(event) => update('category', event.target.value)} options={procedureCategories} placeholder="No category" /><Field label="Severity score" hint="1–25, banded like the risk register."><div className="procedure-number-stepper"><button type="button" aria-label="Decrease severity score" disabled={form.severity <= 1} onClick={() => update('severity', Math.max(1, form.severity - 1))}>−</button><input aria-label="Severity score" type="number" min="1" max="25" value={form.severity} onChange={(event) => update('severity', Math.max(1, Math.min(25, Number(event.target.value) || 1)))} /><button type="button" aria-label="Increase severity score" disabled={form.severity >= 25} onClick={() => update('severity', Math.min(25, form.severity + 1))}>+</button></div></Field><SelectField label="Classification" value={form.classification} onChange={(event) => update('classification', event.target.value)} options={procedureClassifications} hint="Can be raised, never lowered." /><Field label="Review cycle (months)"><input type="number" min="1" max="12" value={form.reviewCycle} onChange={(event) => update('reviewCycle', Number(event.target.value))} /></Field><label className="procedure-check procedure-form-check"><input type="checkbox" checked={form.generateTasks} onChange={(event) => update('generateTasks', event.target.checked)} /><span>Generate tasks</span><small>Each run creates a task for every step.</small></label><label className="procedure-check procedure-form-check"><input type="checkbox" checked={form.allVendors} onChange={(event) => update('allVendors', event.target.checked)} /><span>Applies to all vendors</span><small>For vendor lifecycle procedures: every vendor, not only linked ones.</small></label></div>
  </Modal>;
}

function AddLinkModal({ onClose, onBackend }) {
  const [linkType, setLinkType] = useState('Policy');
  const [query, setQuery] = useState('');
  const [primary, setPrimary] = useState(false);
  return <Modal title="Add link" onClose={onClose} footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" disabled={!query.trim()} onClick={() => { onBackend('Adding the link'); onClose(); }}>Add link</Button></>}>
    <div className="procedure-form-grid"><SelectField label="Link to" value={linkType} onChange={(event) => { setLinkType(event.target.value); setQuery(''); }} options={governedByTypes} /><Field label="Linked record" required hint="Linked-record results did not load during the production audit."><div className="procedure-input-with-button"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${linkType.toLowerCase()} records…`} /><button type="button" disabled={!query} aria-label="Open linked record"><ExternalLink size={15} /></button></div><span className="procedure-lookup-limitation">No verified {linkType} lookup options are available in this prototype.</span></Field><label className="procedure-check procedure-form-check"><input type="checkbox" checked={primary} onChange={(event) => setPrimary(event.target.checked)} /><span>Make this the primary link</span><small>The primary link is what the procedure is shown as governed by.</small></label></div>
  </Modal>;
}

function SettingsModal({ onClose, onBackend }) {
  const [form, setForm] = useState({ reviewDue: 30, governanceGrace: 30, reassignment: 7, longestCycle: 12, selfApproval: false, secondPerson: false });
  const [categories, setCategories] = useState(procedureCategories);
  const [newCategory, setNewCategory] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const addCategory = () => {
    const value = newCategory.trim();
    if (!value || categories.includes(value)) { setCategoryError(value ? 'This category is already listed.' : 'Enter a category name.'); return; }
    setCategories((current) => [...current, value]);
    setNewCategory('');
    setCategoryError('');
  };
  return <Modal title="Procedure settings" onClose={onClose} wide footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" onClick={() => { onBackend('Saving procedure settings'); onClose(); }}>Save settings</Button></>}>
    <div className="procedure-settings-grid"><Field label="Review due within (days)" hint="How long a review trigger has before it is overdue and escalated."><input type="number" value={form.reviewDue} onChange={(event) => update('reviewDue', event.target.value)} /></Field><Field label="Governance gap grace (days)" hint="After a linked policy is retired, how long before the CISO is told."><input type="number" value={form.governanceGrace} onChange={(event) => update('governanceGrace', event.target.value)} /></Field><Field label="Owner reassignment (days)" hint="How long to reassign the procedures of a deactivated owner."><input type="number" value={form.reassignment} onChange={(event) => update('reassignment', event.target.value)} /></Field><Field label="Longest review cycle (months)" hint="No procedure may go longer than this between reviews (1–12)."><input type="number" min="1" max="12" value={form.longestCycle} onChange={(event) => update('longestCycle', event.target.value)} /></Field></div>
    <div className="procedure-settings-checks"><label className="procedure-check"><input type="checkbox" checked={form.selfApproval} onChange={(event) => update('selfApproval', event.target.checked)} /><span>Allow a single GRC user to approve their own procedures</span></label><p>Each use needs a justification, is logged at high severity, and the CISO is told.</p><label className="procedure-check"><input type="checkbox" checked={form.secondPerson} onChange={(event) => update('secondPerson', event.target.checked)} /><span>Second person confirms 'not applicable' on critical procedures</span></label><p>A run of a CRITICAL procedure cannot complete until another GRC Manager confirms each not-applicable step.</p></div>
    <div className="procedure-settings-categories"><div><span className="procedures-eyebrow">CATEGORIES</span></div><ul>{categories.map((item) => <li key={item}>{item}</li>)}</ul><div className="procedure-add-category"><input aria-label="New category" value={newCategory} onChange={(event) => { setNewCategory(event.target.value); setCategoryError(''); }} onKeyDown={(event) => event.key === 'Enter' && (event.preventDefault(), addCategory())} placeholder="Add a category" /><Button onClick={addCategory}><Plus size={14} /> Add</Button></div>{categoryError && <span className="procedure-form-error-text" role="alert">{categoryError}</span>}<p className="procedure-prototype-note">Category edits in this dialog are local until you close it.</p></div>
  </Modal>;
}

function ImportModal({ onClose, onBackend }) {
  const [fileName, setFileName] = useState('');
  return <Modal title="Import procedures" onClose={onClose} footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" disabled={!fileName} onClick={() => { onBackend('Checking the import file'); onClose(); }}>Check file</Button></>}>
    <p className="procedure-modal-copy">Upload a CSV with a Title, Type, Owner, Governed by type and Governed by column — what the New procedure form asks for. A row whose Trigger is SCHEDULED also needs a Recurrence, as on the form. Columns are matched by name in any order. Every row becomes a draft; nothing is activated by an import.</p>
    <label className="procedure-upload-field"><FileInput size={19} /><span>{fileName || 'CSV file'}</span><input type="file" accept=".csv,text/csv" aria-label="CSV file" onChange={(event) => setFileName(event.target.files?.[0]?.name || '')} /></label>
    <Button onClick={() => onBackend('Downloading the CSV template')}>Download template</Button>
    {fileName && <p className="procedure-file-selected">Selected file: {fileName}</p>}
  </Modal>;
}

function CloneModal({ onClose, onBackend }) {
  const [form, setForm] = useState({ title: '', owner: 'Demo Admin (you)', governedBy: '', primaryLink: '' });
  const [error, setError] = useState('');
  const submit = (event) => {
    event.preventDefault();
    if (form.title.trim().length < 10 || !form.owner || !form.governedBy || !form.primaryLink.trim()) { setError('Complete each required field, including the primary link.'); return; }
    onBackend('Cloning from skeleton');
    onClose();
  };
  return <Modal title="Clone from skeleton" onClose={onClose} footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" onClick={() => document.getElementById('procedure-clone-form')?.requestSubmit()}>Clone</Button></>}>
    <p className="procedure-skeleton-empty"><Copy size={18} /><strong>No skeletons have been installed for your organisation.</strong></p>
    <form id="procedure-clone-form" className="procedure-form-grid" onSubmit={submit}>{error && <div className="procedure-form-error" role="alert">{error}</div>}<Field label="Title" required hint="Change it if your organisation already has a procedure by this name."><input required minLength={10} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></Field><SelectField label="Owner" value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })} options={procedureOwners} hint="Answers for the procedure: keeps it current and reviews it on schedule." /><SelectField label="Governed by" value={form.governedBy} onChange={(event) => setForm({ ...form, governedBy: event.target.value })} options={governedByTypes} /><Field label="Primary link" required hint="A skeleton has no links of its own, so the copy needs its primary link."><input value={form.primaryLink} onChange={(event) => setForm({ ...form, primaryLink: event.target.value })} placeholder="Search records…" /></Field></form>
  </Modal>;
}

function ReassignModal({ onClose, onBackend }) {
  const [owner, setOwner] = useState('Demo Admin (you)');
  return <Modal title="Reassign 1 procedure" onClose={onClose} footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" onClick={() => { onBackend('Reassigning procedure owner'); onClose(); }}>Reassign</Button></>}>
    <SelectField label="New owner" value={owner} onChange={(event) => setOwner(event.target.value)} options={procedureOwners} hint="Answers for the procedure: keeps it current and reviews it on schedule." />
    <p className="procedure-modal-copy">Each procedure is changed on its own. Any that cannot be — a retired one, or one somebody else has just edited — are listed afterwards rather than skipped.</p>
  </Modal>;
}

function RecordActionsModal({ onClose, onOpenModal, onBackend, navigate }) {
  return <Modal title="Procedure actions" onClose={onClose} footer={<Button onClick={onClose}>Close</Button>}>
    <div className="procedure-actions-list"><button type="button" onClick={() => { onClose(); navigate(`/procedures/${procedureRecord.reference}/versions/draft`); }}><Pencil size={15} /><span><strong>Edit draft</strong><small>Open the in-flight version editor.</small></span></button><button type="button" onClick={() => { onClose(); onOpenModal('edit-details'); }}><Settings2 size={15} /><span><strong>Edit details</strong><small>Change owner, category, severity or classification.</small></span></button><button type="button" onClick={() => { onClose(); onBackend('Retiring the procedure'); }}><FileCheck2 size={15} /><span><strong>Retire</strong><small>Retirement requires a connected backend.</small></span></button><button type="button" className="procedure-action-danger" onClick={() => { onClose(); onBackend('Deleting the procedure'); }}><Trash2 size={15} /><span><strong>Delete</strong><small>Deletion requires a connected backend.</small></span></button></div>
  </Modal>;
}

export default function Procedures() {
  const location = useLocation();
  const navigate = useNavigate();
  const route = useMemo(() => parseRoute(location.pathname), [location.pathname]);
  const [detailTab, setDetailTab] = useState({ path: '', value: 'Overview' });
  const [modalState, setModalState] = useState({ name: '', path: '' });
  const [selectionState, setSelectionState] = useState({ path: '', value: false });
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Any status');
  const [quickFilters, setQuickFilters] = useState({});
  const [notice, showBackendMessage, dismissNotice] = useBackendMessage();
  const activeTab = detailTab.path === location.pathname ? detailTab.value : 'Overview';
  const setActiveTab = (value) => setDetailTab({ path: location.pathname, value });
  const modal = modalState.path === location.pathname ? modalState.name : '';
  const selected = selectionState.path === location.pathname && selectionState.value;
  const setSelected = (value) => setSelectionState({ path: location.pathname, value });
  const openModal = (name) => setModalState({ name, path: location.pathname });
  const closeModal = () => setModalState({ name: '', path: location.pathname });

  return <div className="procedures-module">
    <Notice onDismiss={dismissNotice}>{notice}</Notice>
    {route.view === 'coverage' && <CoverageView navigate={navigate} onReturn={() => navigate('/procedures')} onOpenDetail={() => setActiveTab('Overview')} />}
    {route.view === 'detail' && route.reference === procedureRecord.reference && <ProcedureDetail navigate={navigate} onOpenModal={openModal} activeTab={activeTab} setActiveTab={setActiveTab} onBackend={showBackendMessage} />}
    {route.view === 'editor' && route.reference === procedureRecord.reference && <DraftEditor navigate={navigate} onBackend={showBackendMessage} />}
    {(route.view === 'list' || (route.view !== 'coverage' && route.reference && route.reference !== procedureRecord.reference)) && <ListingView navigate={navigate} onOpenModal={openModal} onBackend={showBackendMessage} selected={selected} setSelected={setSelected} query={query} setQuery={setQuery} status={status} setStatus={setStatus} quickFilters={quickFilters} setQuickFilters={setQuickFilters} />}
    {modal === 'new' && <NewProcedureModal onClose={closeModal} onBackend={showBackendMessage} />}
    {modal === 'edit-details' && <EditDetailsModal onClose={closeModal} onBackend={showBackendMessage} />}
    {modal === 'add-link' && <AddLinkModal onClose={closeModal} onBackend={showBackendMessage} />}
    {modal === 'settings' && <SettingsModal onClose={closeModal} onBackend={showBackendMessage} />}
    {modal === 'import' && <ImportModal onClose={closeModal} onBackend={showBackendMessage} />}
    {modal === 'clone' && <CloneModal onClose={closeModal} onBackend={showBackendMessage} />}
    {modal === 'reassign' && <ReassignModal onClose={closeModal} onBackend={showBackendMessage} />}
    {modal === 'record-actions' && <RecordActionsModal onClose={closeModal} onOpenModal={openModal} onBackend={showBackendMessage} navigate={navigate} />}
  </div>;
}
