import { useEffect, useId, useRef, useState } from 'react';
import {
  Activity, Archive, ArrowUpRight, BriefcaseBusiness, Check, CheckCheck,
  ChevronDown, FileClock, ListChecks, ScrollText, ShieldAlert,
  ShieldCheck, Siren, Users, X,
} from 'lucide-react';
import { reportCount, reportFilters, reportGroups } from '../../data/reportsData.js';
import './Reports.css';

const groupIcons = {
  risk: ShieldAlert,
  compliance: CheckCheck,
  control: ShieldCheck,
  audit: FileClock,
  incident: Siren,
  policy: ScrollText,
  asset: Archive,
  vendor: BriefcaseBusiness,
  procedure: ListChecks,
  executive: Activity,
};

function ReportSelect({ label, value, options, onChange }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const listRef = useRef(null);
  const labelId = `${id}-label`;
  const valueId = `${id}-value`;
  const listId = `${id}-options`;
  const selectedIndex = Math.max(options.findIndex((option) => option.value === value), 0);
  const selectedOption = options[selectedIndex];

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.focus();
    document.getElementById(`${listId}-option-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, listId, open]);

  const openList = () => {
    setActiveIndex(selectedIndex);
    setOpen(true);
  };
  const choose = (index) => {
    const option = options[index];
    if (!option) return;
    if (option.value !== value) onChange(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  };
  const onTriggerKeyDown = (event) => {
    if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
    event.preventDefault();
    if (!open) openList();
    else setActiveIndex((current) => Math.min(Math.max(current + (event.key === 'ArrowDown' ? 1 : -1), 0), options.length - 1));
  };
  const onListKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) => Math.min(Math.max(current + (event.key === 'ArrowDown' ? 1 : -1), 0), options.length - 1));
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      setActiveIndex(event.key === 'Home' ? 0 : options.length - 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      choose(activeIndex);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div
      className={`reports-select${open ? ' is-open' : ''}`}
      ref={rootRef}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <span className="reports-visually-hidden" id={labelId}>{label}</span>
      <button
        ref={triggerRef}
        className="reports-select-trigger"
        type="button"
        aria-labelledby={`${labelId} ${valueId}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onTriggerKeyDown}
      >
        <span className="reports-select-value" id={valueId}>{selectedOption?.label}</span>
        <ChevronDown size={15} aria-hidden="true" />
      </button>
      {open && (
        <div
          ref={listRef}
          className="reports-select-menu"
          id={listId}
          role="listbox"
          tabIndex={0}
          aria-labelledby={labelId}
          aria-activedescendant={`${listId}-option-${activeIndex}`}
          onKeyDown={onListKeyDown}
        >
          {options.map((option, index) => (
            <div
              className={`reports-select-option${index === activeIndex ? ' is-active' : ''}${option.value === value ? ' is-selected' : ''}`}
              id={`${listId}-option-${index}`}
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onMouseMove={() => setActiveIndex(index)}
              onClick={() => choose(index)}
            >
              <span>{option.label}</span>
              {option.value === value && <Check size={15} aria-hidden="true" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterField({ label, type = 'text', value, onChange }) {
  return (
    <label className="reports-filter-field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function ReportFilters({ filters, onChange }) {
  return (
    <section className="reports-filter-panel" aria-labelledby="reports-filters-heading">
      <div className="reports-filter-heading">
        <div>
          <h2 id="reports-filters-heading">Filters</h2>
          <p>Set the scope to use when requesting a report.</p>
        </div>
        <span className="reports-filter-local">Local prototype</span>
      </div>
      <div className="reports-filter-grid">
        <div className="reports-filter-field reports-select-field">
          <span>Framework</span>
          <ReportSelect label="Framework" value={filters.framework} options={reportFilters.frameworks} onChange={(framework) => onChange('framework', framework)} />
        </div>
        <div className="reports-filter-field reports-select-field">
          <span>Asset criticality</span>
          <ReportSelect label="Asset criticality" value={filters.assetCriticality} options={reportFilters.assetCriticalities} onChange={(assetCriticality) => onChange('assetCriticality', assetCriticality)} />
        </div>
        <div className="reports-filter-field reports-select-field">
          <span>Severity</span>
          <ReportSelect label="Severity" value={filters.severity} options={reportFilters.severities} onChange={(severity) => onChange('severity', severity)} />
        </div>
        <div className="reports-filter-field reports-select-field">
          <span>Status</span>
          <ReportSelect label="Status" value={filters.status} options={reportFilters.statuses} onChange={(status) => onChange('status', status)} />
        </div>
        <FilterField label="Business Unit" value={filters.businessUnit} onChange={(businessUnit) => onChange('businessUnit', businessUnit)} />
        <FilterField label="Owner" value={filters.owner} onChange={(owner) => onChange('owner', owner)} />
        <FilterField label="From" type="date" value={filters.from} onChange={(from) => onChange('from', from)} />
        <FilterField label="To" type="date" value={filters.to} onChange={(to) => onChange('to', to)} />
      </div>
    </section>
  );
}

function ReportCard({ group, report, onGenerate }) {
  const CardIcon = groupIcons[group.icon];

  return (
    <article className={`report-card report-card--${group.id}`}>
      <header className="report-card-topline">
        <div className="report-card-identity">
          <span className="report-card-icon" aria-hidden="true"><CardIcon size={18} /></span>
          <span className="report-card-category">{group.label}</span>
        </div>
        {report.badge && <span className="report-card-badge">{report.badge}</span>}
      </header>
      <div className="report-card-copy">
        <h3>{report.title}</h3>
        <p className="report-card-description">{report.description}</p>
      </div>
      <footer className="report-card-footer">
        <p className="report-card-audience"><Users size={14} aria-hidden="true" /><span>For {report.audience}</span></p>
        <button className="report-generate-button" type="button" aria-label={`Generate ${report.title}`} onClick={() => onGenerate(report.title)}>
          Generate <ArrowUpRight size={15} aria-hidden="true" />
        </button>
      </footer>
    </article>
  );
}

export default function Reports() {
  const [filters, setFilters] = useState({
    framework: 'all',
    assetCriticality: 'any',
    severity: 'any',
    status: 'any',
    businessUnit: '',
    owner: '',
    from: '',
    to: '',
  });
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(''), 6000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <div className="reports-page">
      <header className="reports-page-heading">
        <div>
          <span className="reports-eyebrow">REPORTING</span>
          <h1>Report Catalog</h1>
          <p>{reportCount} report definitions across {reportGroups.length} sections — generated reports are assembled, filtered, and frozen with an as-of timestamp</p>
        </div>
        <div className="reports-count" aria-label={`${reportCount} reports available`}>
          <span>{reportCount}</span>
          <span>reports</span>
        </div>
      </header>

      <ReportFilters filters={filters} onChange={updateFilter} />

      <div className="reports-groups">
        {reportGroups.map((group) => {
          const GroupIcon = groupIcons[group.icon];
          return (
            <section className="reports-group" key={group.id} aria-labelledby={`reports-group-${group.id}`}>
              <header className="reports-group-heading">
                <span className={`reports-group-icon reports-group-icon--${group.id}`} aria-hidden="true"><GroupIcon size={16} /></span>
                <h2 id={`reports-group-${group.id}`}>{group.label}</h2>
                <span className="reports-group-count">{group.reports.length} {group.reports.length === 1 ? 'report' : 'reports'}</span>
              </header>
              <div className="reports-grid">
                {group.reports.map((report) => <ReportCard key={report.title} group={group} report={report} onGenerate={(title) => setNotice(`${title} is a prototype action. Report generation will be available after backend integration.`)} />)}
              </div>
            </section>
          );
        })}
      </div>

      <p className="reports-prototype-note">Report generation is not connected to a backend. Filter values and notices stay in this browser session.</p>
      {notice && (
        <div className="reports-notice" role="status" aria-live="polite">
          <span>{notice}</span>
          <button type="button" aria-label="Dismiss message" onClick={() => setNotice('')}><X size={15} /></button>
        </div>
      )}
    </div>
  );
}
