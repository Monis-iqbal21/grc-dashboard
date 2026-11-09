import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  Activity, CalendarDays, Check, ChevronDown, CircleHelp, Download,
  FileCode2, FileText, Search, X,
} from 'lucide-react';
import {
  auditActionFilters, auditEntries, auditModules, auditUsers,
} from '../../data/auditTrailData.js';
import './AuditTrail.css';

const initialFilters = {
  module: 'all',
  action: 'all',
  user: 'all',
  recordId: '',
  from: '',
  to: '',
};

const moduleOptions = [
  { value: 'all', label: 'All Modules' },
  ...auditModules.map((module) => ({ value: module, label: module })),
];
const userOptions = [
  { value: 'all', label: 'All Users' },
  ...auditUsers.map((user) => ({ value: user, label: user })),
];

function AuditSelect({ label, value, options, onChange }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const listRef = useRef(null);
  const selectedIndex = Math.max(options.findIndex((option) => option.value === value), 0);
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return undefined;
    const closeOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.focus();
    document.getElementById(`${id}-option-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, id, open]);

  const openList = () => {
    setActiveIndex(selectedIndex);
    setOpen(true);
  };
  const choose = (index) => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className={`audit-select${open ? ' is-open' : ''}`} ref={rootRef}>
      <span className="audit-visually-hidden" id={`${id}-label`}>{label}</span>
      <button
        ref={triggerRef}
        className="audit-select-trigger"
        type="button"
        aria-labelledby={`${id}-label ${id}-value`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-options` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={(event) => {
          if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
          event.preventDefault();
          if (!open) openList();
          else setActiveIndex((current) => Math.min(Math.max(current + (event.key === 'ArrowDown' ? 1 : -1), 0), options.length - 1));
        }}
      >
        <span className="audit-select-value" id={`${id}-value`}>{selected?.label}</span>
        <ChevronDown size={15} aria-hidden="true" />
      </button>
      {open && (
        <div
          ref={listRef}
          className="audit-select-menu"
          id={`${id}-options`}
          role="listbox"
          tabIndex={0}
          aria-labelledby={`${id}-label`}
          aria-activedescendant={`${id}-option-${activeIndex}`}
          onKeyDown={(event) => {
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
          }}
        >
          {options.map((option, index) => (
            <div
              className={`audit-select-option${index === activeIndex ? ' is-active' : ''}${option.value === value ? ' is-selected' : ''}`}
              id={`${id}-option-${index}`}
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

function getAuditFieldValue(entry, field) {
  switch (field.toLowerCase()) {
    case 'action': return entry.action.toUpperCase().replaceAll(' ', '_');
    case 'created': return entry.createdAt;
    case 'module': return entry.module;
    case 'performed_by':
    case 'user': return entry.user;
    case 'record_id':
    case 'record': return entry.recordId;
    default: return undefined;
  }
}

function matchesDateWindow(value, windowName) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  const end = new Date(today);
  const keyword = windowName.toLowerCase().replaceAll(' ', '_');

  if (keyword === 'today') {
    end.setDate(end.getDate() + 1);
    return date >= start && date < end;
  }
  if (keyword === 'yesterday') {
    start.setDate(start.getDate() - 1);
    return date >= start && date < today;
  }
  if (keyword === 'last_30d' || keyword === 'last_3m') {
    if (keyword === 'last_30d') start.setDate(start.getDate() - 30);
    else start.setMonth(start.getMonth() - 3);
    return date >= start && date <= new Date();
  }
  if (keyword === 'next_7d') {
    end.setDate(end.getDate() + 7);
    return date >= today && date < end;
  }
  if (keyword === 'this_week') {
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    end.setTime(start.getTime());
    end.setDate(end.getDate() + 7);
    return date >= start && date < end;
  }
  if (keyword === 'this_month') return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth();
  if (keyword === 'this_quarter') return date.getFullYear() === today.getFullYear() && Math.floor(date.getMonth() / 3) === Math.floor(today.getMonth() / 3);
  if (keyword === 'this_year') return date.getFullYear() === today.getFullYear();
  return false;
}

function compareAuditValue(actual, operator, expected, field) {
  if (actual === undefined) return false;
  const left = String(actual).trim();
  const right = expected.trim().replace(/^(["'])(.*)\1$/, '$2');
  const lowerLeft = left.toLowerCase();
  const lowerRight = right.toLowerCase();

  if (field.toLowerCase() === 'created' && ['today', 'yesterday', 'last 30d', 'last 3m', 'next 7d', 'this_week', 'this_month', 'this_quarter', 'this_year'].includes(lowerRight.replaceAll(' ', '_'))) {
    return matchesDateWindow(left, lowerRight);
  }
  if (operator === ':') return lowerLeft.includes(lowerRight);
  if (operator === '=') {
    if (field.toLowerCase() === 'created') return left.slice(0, 10) === right.slice(0, 10);
    return lowerLeft.replaceAll(' ', '_') === lowerRight.replaceAll(' ', '_');
  }
  if (operator === '!=') return !compareAuditValue(actual, '=', expected, field);

  const leftNumber = field.toLowerCase() === 'created' ? new Date(left).getTime() : Number(left);
  let rightNumber = field.toLowerCase() === 'created' ? new Date(right).getTime() : Number(right);
  if (field.toLowerCase() === 'created' && operator === '<=' && /^\d{4}-\d{2}-\d{2}$/.test(right)) {
    rightNumber = new Date(`${right}T23:59:59.999`).getTime();
  }
  const comparableLeft = Number.isNaN(leftNumber) ? lowerLeft : leftNumber;
  const comparableRight = Number.isNaN(rightNumber) ? lowerRight : rightNumber;
  if (operator === '>') return comparableLeft > comparableRight;
  if (operator === '>=') return comparableLeft >= comparableRight;
  if (operator === '<') return comparableLeft < comparableRight;
  if (operator === '<=') return comparableLeft <= comparableRight;
  return false;
}

function matchesAuditTerm(entry, term) {
  const cleanTerm = term.trim().replace(/^\(+|\)+$/g, '');
  const negated = /^not\s+/i.test(cleanTerm);
  const expression = cleanTerm.replace(/^not\s+/i, '').trim();
  const emptyMatch = expression.match(/^(\w+)\s+is\s+(empty|set)$/i);
  let result;

  if (emptyMatch) {
    const value = getAuditFieldValue(entry, emptyMatch[1]);
    result = emptyMatch[2].toLowerCase() === 'empty' ? !String(value ?? '').trim() : Boolean(String(value ?? '').trim());
  } else {
    const betweenMatch = expression.match(/^(\w+)\s+between\s+(.+?)\.\.(.+)$/i);
    const inMatch = expression.match(/^(\w+)\s+in\s*\((.*)\)$/i);
    const relativeMatch = expression.match(/^(?:created\s+)?(today|yesterday|last\s+30d|last\s+3m|next\s+7d|this_week|this_month|this_quarter|this_year)$/i);
    const conditionMatch = expression.match(/^(\w+)\s*(>=|<=|!=|=|:|>|<)\s*(.+)$/i);

    if (relativeMatch) {
      result = matchesDateWindow(entry.createdAt, relativeMatch[1]);
    } else if (betweenMatch) {
      const field = betweenMatch[1];
      const value = getAuditFieldValue(entry, field);
      result = compareAuditValue(value, '>=', betweenMatch[2].trim(), field)
        && compareAuditValue(value, '<=', betweenMatch[3].trim(), field);
    } else if (inMatch) {
      const values = [...inMatch[2].matchAll(/["']([^"']*)["']|([^,]+)/g)].map((match) => (match[1] ?? match[2]).trim());
      result = values.some((value) => compareAuditValue(getAuditFieldValue(entry, inMatch[1]), '=', value, inMatch[1]));
    } else if (conditionMatch) {
      result = compareAuditValue(getAuditFieldValue(entry, conditionMatch[1]), conditionMatch[2], conditionMatch[3], conditionMatch[1]);
    } else {
      const needle = expression.replace(/^(["'])(.*)\1$/, '$2').toLowerCase();
      result = [entry.createdAt, entry.user, entry.module, entry.action, entry.recordId].some((value) => String(value).toLowerCase().includes(needle));
    }
  }

  return negated ? !result : result;
}

function matchesAuditQuery(entry, query) {
  const cleanQuery = query.trim();
  if (!cleanQuery) return true;
  return cleanQuery.split(/\s+or\s+/i).some((orGroup) => (
    orGroup.split(/\s+and\s+/i).every((term) => matchesAuditTerm(entry, term))
  ));
}

function formatTimestamp(value) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).format(new Date(value)).replace(',', '');
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(new Date(value));
}

function formatTime(value) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).format(new Date(value));
}

function initialsFor(name) {
  if (name.startsWith('System')) return 'SY';
  return name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

function actionTone(action) {
  if (/FAILED|DELETE|BREACH DETECTED/.test(action)) return 'danger';
  if (/EXPORT/.test(action)) return 'export';
  if (/CREATE|APPROVE/.test(action)) return 'success';
  if (/UPDATE|STATUS|LINK CONTROL|BREACH CLEARED/.test(action)) return 'info';
  return 'neutral';
}

function toCsvValue(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function AuditExportMenu({ onExport }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const formats = [
    { id: 'csv', label: 'CSV', description: 'Opens in Excel, Sheets and data tools', Icon: FileText },
    { id: 'pdf', label: 'PDF', description: 'For sharing and printing', Icon: FileText },
    { id: 'html', label: 'HTML', description: 'Opens in a browser', Icon: FileCode2 },
  ];

  useEffect(() => {
    if (!open) return undefined;
    const closeOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  return (
    <div className="audit-export" ref={rootRef}>
      <button className="audit-button audit-button--primary" type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        <Download size={15} aria-hidden="true" /> Export <ChevronDown size={14} aria-hidden="true" />
      </button>
      {open && (
        <div className="audit-export-menu" role="menu" aria-label="Export audit trail">
          {formats.map(({ id, label, description, Icon }) => (
            <button className="audit-export-option" type="button" role="menuitem" key={id} onClick={() => { setOpen(false); onExport(id); }}>
              <span className="audit-export-icon"><Icon size={16} aria-hidden="true" /></span>
              <span><strong>{label}</strong><small>{description}</small></span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SearchHelpDialog({ onClose, onUseExample }) {
  const titleId = useId();
  const dialogRef = useRef(null);
  const examples = [
    'action = "EXPORT"',
    'action = "LOGIN_FAILED"',
    'module : "risk" and action = "CREATE"',
    'created today',
  ];
  const operators = [
    [':', 'Contains partial text', 'module : "risk"'],
    ['=', 'Equals exactly', 'action = "EXPORT"'],
    ['!=', 'Is not', 'action != "DELETE"'],
    ['in ( … )', 'Matches any value in the list', 'action in ("CREATE", "UPDATE")'],
    ['>  >=  <  <=', 'Compares dates or values', 'created >= 2026-11-01'],
    ['between a..b', 'Matches an inclusive range', 'created between 2026-10-01..2026-10-31'],
    ['is empty / is set', 'Blank / not blank', 'record_id is set'],
  ];
  const fields = [
    ['action', 'Action code'], ['created', 'Event date and time'], ['module', 'Module name'],
    ['performed_by', 'Actor'], ['record_id', 'Record reference'],
  ];

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    dialogRef.current?.querySelector('button')?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = [...dialogRef.current.querySelectorAll('button:not([disabled]), a[href]')];
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
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
    <div className="audit-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="audit-modal" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={dialogRef}>
        <header className="audit-modal-header">
          <div>
            <span className="audit-eyebrow">AUDIT TRAIL</span>
            <h2 id={titleId}>How to search</h2>
            <p>Enter a word to match the visible audit fields, or use a field name and operator.</p>
          </div>
          <button className="audit-icon-button" type="button" aria-label="Close search guide" onClick={onClose}><X size={17} /></button>
        </header>
        <div className="audit-modal-content">
          <section className="audit-help-section">
            <h3>Try one</h3>
            <div className="audit-search-examples">
              {examples.map((example) => <button key={example} type="button" onClick={() => onUseExample(example)}><code>{example}</code><span>Use</span></button>)}
            </div>
          </section>
          <section className="audit-help-section">
            <h3>Symbols</h3>
            <div className="audit-help-table-wrap"><table className="audit-help-table"><thead><tr><th>Symbol</th><th>Meaning</th><th>Example</th></tr></thead><tbody>{operators.map(([symbol, meaning, example]) => <tr key={symbol}><td><code>{symbol}</code></td><td>{meaning}</td><td><code>{example}</code></td></tr>)}</tbody></table></div>
          </section>
          <section className="audit-help-section">
            <h3>Searchable fields</h3>
            <div className="audit-field-list">{fields.map(([field, meaning]) => <p key={field}><code>{field}</code><span>{meaning}</span></p>)}</div>
          </section>
          <section className="audit-help-section audit-help-dates">
            <h3>Date shortcuts</h3>
            <p><code>today</code><code>yesterday</code><code>last 30d</code><code>last 3m</code><code>next 7d</code></p>
            <p>Combine field expressions with <code>and</code> or <code>or</code>; prefix a condition with <code>not</code>.</p>
          </section>
        </div>
      </section>
    </div>
  );
}

function AuditFilters({ filters, onChange, onApply, onClear }) {
  return (
    <div className="audit-filter-panel" aria-label="Audit filters">
      <div className="audit-filter-grid">
        <label className="audit-filter-field">
          <span>Module</span>
          <AuditSelect label="Module" value={filters.module} options={moduleOptions} onChange={(module) => onChange('module', module)} />
        </label>
        <label className="audit-filter-field">
          <span>Action</span>
          <AuditSelect label="Action" value={filters.action} options={auditActionFilters} onChange={(action) => onChange('action', action)} />
        </label>
        <label className="audit-filter-field">
          <span>User</span>
          <AuditSelect label="User" value={filters.user} options={userOptions} onChange={(user) => onChange('user', user)} />
        </label>
        <label className="audit-filter-field">
          <span>Record ID</span>
          <input aria-label="Filter by exact record ID" placeholder="0–5" value={filters.recordId} onChange={(event) => onChange('recordId', event.target.value)} />
        </label>
        <label className="audit-filter-field">
          <span>From</span>
          <input aria-label="From date" type="date" value={filters.from} onChange={(event) => onChange('from', event.target.value)} />
        </label>
        <label className="audit-filter-field">
          <span>To</span>
          <input aria-label="To date" type="date" value={filters.to} onChange={(event) => onChange('to', event.target.value)} />
        </label>
      </div>
      <div className="audit-filter-actions">
        <button className="audit-button audit-button--primary" type="button" onClick={onApply}>Apply Filters</button>
        <button className="audit-button audit-button--quiet" type="button" onClick={onClear}>Clear</button>
      </div>
    </div>
  );
}

function eventMatchesFilters(entry, filters) {
  if (filters.module !== 'all' && entry.module !== filters.module) return false;
  if (filters.action !== 'all' && entry.actionFilter !== filters.action) return false;
  if (filters.user !== 'all' && entry.user !== filters.user) return false;
  if (filters.recordId.trim() && entry.recordId.toLowerCase() !== filters.recordId.trim().toLowerCase()) return false;
  const date = entry.createdAt.slice(0, 10);
  if (filters.from && date < filters.from) return false;
  if (filters.to && date > filters.to) return false;
  return true;
}

function downloadContent(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function AuditTrail() {
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [showSearchHelp, setShowSearchHelp] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(''), 6000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const visibleEntries = useMemo(() => auditEntries.filter((entry) => (
    eventMatchesFilters(entry, appliedFilters) && matchesAuditQuery(entry, appliedSearch)
  )), [appliedFilters, appliedSearch]);
  const visibleModuleCount = useMemo(() => new Set(visibleEntries.map((entry) => entry.module)).size, [visibleEntries]);
  const visibleActorCount = useMemo(() => new Set(visibleEntries.map((entry) => entry.user)).size, [visibleEntries]);
  const newestEventDate = visibleEntries[0] ? formatDate(visibleEntries[0].createdAt) : '—';

  const updateDraftFilter = (key, value) => setDraftFilters((current) => ({ ...current, [key]: value }));
  const applySearch = (event) => {
    event?.preventDefault();
    setAppliedSearch(searchInput.trim());
  };
  const useSearchExample = (example) => {
    setSearchInput(example);
    setAppliedSearch(example);
    setShowSearchHelp(false);
  };
  const exportEntries = (format) => {
    const columns = ['Timestamp', 'User', 'Module', 'Action', 'Record ID'];
    const rows = visibleEntries.map((entry) => [formatTimestamp(entry.createdAt), entry.user, entry.module, entry.action, entry.recordId]);
    if (format === 'csv') {
      const csv = [columns, ...rows].map((row) => row.map(toCsvValue).join(',')).join('\r\n');
      downloadContent('nvector-audit-trail.csv', csv, 'text/csv;charset=utf-8');
      setNotice('CSV file prepared from the currently displayed sample events.');
    } else if (format === 'html') {
      const tableRows = rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('');
      const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NVector Audit Trail</title><style>body{font:14px system-ui,sans-serif;margin:32px;color:#172033}h1{font-size:24px}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:10px;border-bottom:1px solid #d9e0ea}th{background:#f4f7fb;text-transform:uppercase;font-size:11px;letter-spacing:.04em}</style><h1>Audit Trail</h1><p>${rows.length} local sample events</p><table><thead><tr>${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join('')}</tr></thead><tbody>${tableRows}</tbody></table></html>`;
      downloadContent('nvector-audit-trail.html', html, 'text/html;charset=utf-8');
      setNotice('HTML file prepared from the currently displayed sample events.');
    } else {
      const afterPrint = () => {
        delete document.body.dataset.auditPrinting;
        window.removeEventListener('afterprint', afterPrint);
      };
      document.body.dataset.auditPrinting = 'true';
      window.addEventListener('afterprint', afterPrint);
      window.print();
    }
  };

  return (
    <div className="audit-page">
      <header className="audit-page-heading">
        <div className="audit-heading-main">
          <span className="audit-heading-mark" aria-hidden="true"><Activity size={22} /></span>
          <div className="audit-heading-copy">
            <span className="audit-eyebrow">GOVERNANCE / AUDIT</span>
            <h1>Activity Log</h1>
            <p>Trace workspace changes, actor activity, and record references.</p>
          </div>
        </div>
        <div className="audit-heading-actions">
          <span className="audit-sample-badge"><span aria-hidden="true" />Local sample</span>
          <AuditExportMenu onExport={exportEntries} />
        </div>
      </header>

      <section className="audit-overview" aria-label="Visible audit activity summary">
        <div className="audit-overview-primary">
          <span>Events in view</span>
          <strong>{visibleEntries.length}</strong>
          <small>of {auditEntries.length} sample events</small>
        </div>
        <div className="audit-overview-stat"><span>Modules</span><strong>{visibleModuleCount}</strong></div>
        <div className="audit-overview-stat"><span>Actors</span><strong>{visibleActorCount}</strong></div>
        <div className="audit-overview-date"><CalendarDays size={17} aria-hidden="true" /><span><small>Most recent</small><strong>{newestEventDate}</strong></span></div>
      </section>

      <section className="audit-controls" aria-label="Search the audit trail">
        <div className="audit-controls-heading">
          <div><span className="audit-eyebrow">FIND A RECORD</span><h2>Search &amp; filters</h2></div>
          <span>Search by phrase or narrow the event list with filters.</span>
        </div>
        <form className="audit-search-form" onSubmit={applySearch}>
          <Search className="audit-search-icon" size={17} aria-hidden="true" />
          <input
            aria-label="Search audit trail"
            autoComplete="off"
            placeholder={'Search the audit trail — try action = EXPORT, or a word'}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          {searchInput && <button className="audit-search-clear" type="button" aria-label="Clear search text" onClick={() => { setSearchInput(''); setAppliedSearch(''); }}><X size={15} /></button>}
          <button className="audit-help-button" type="button" aria-label="How to search" title="How to search" onClick={() => setShowSearchHelp(true)}><CircleHelp size={17} /></button>
        </form>
        <AuditFilters
          filters={draftFilters}
          onChange={updateDraftFilter}
          onApply={() => setAppliedFilters({ ...draftFilters })}
          onClear={() => { setDraftFilters({ ...initialFilters }); setAppliedFilters({ ...initialFilters }); }}
        />
      </section>

      <section className="audit-register" aria-label="Audit events">
        <header className="audit-register-heading">
          <div><span className="audit-eyebrow">EVENT STREAM</span><h2>Recent activity</h2></div>
          <div className="audit-register-meta"><span>{visibleEntries.length} results</span><span className="audit-live-sort"><span aria-hidden="true" />Newest first</span></div>
        </header>
        <div className="audit-table-scroll">
          <table className="audit-table">
            <thead><tr><th scope="col">Timestamp</th><th scope="col">User</th><th scope="col">Module</th><th scope="col">Action</th><th scope="col">Record ID</th></tr></thead>
            <tbody>
              {visibleEntries.map((entry) => (
                <tr key={entry.id}>
                  <td data-label="Timestamp"><time className="audit-timestamp" dateTime={entry.createdAt}><strong>{formatTime(entry.createdAt)}</strong><span>{formatDate(entry.createdAt)}</span></time></td>
                  <td data-label="User"><span className="audit-user"><span className="audit-user-avatar" aria-hidden="true">{initialsFor(entry.user)}</span><span className="audit-user-name">{entry.user}</span></span></td>
                  <td data-label="Module"><span className={`audit-module-chip audit-module-chip--${entry.module.toLowerCase().replaceAll(' ', '-')}`}>{entry.module}</span></td>
                  <td data-label="Action"><span className={`audit-action-chip audit-action-chip--${actionTone(entry.action)}`}>{entry.action}</span></td>
                  <td data-label="Record ID"><code className="audit-record-id">{entry.recordId}</code></td>
                </tr>
              ))}
              {!visibleEntries.length && <tr><td className="audit-empty-state" colSpan="5"><Search size={20} aria-hidden="true" /><strong>No audit events found</strong><span>Adjust the search or filters and try again.</span></td></tr>}
            </tbody>
          </table>
        </div>
        <footer className="audit-table-footer">
          <span>Showing {visibleEntries.length} of {auditEntries.length} local sample events</span>
          <span>Record references use sample IDs from 0 to 5.</span>
        </footer>
      </section>

      <p className="audit-local-note">This local prototype uses synthetic sample events; it does not connect to or change production audit records.</p>

      {notice && <div className="audit-notice" role="status" aria-live="polite"><span>{notice}</span><button type="button" aria-label="Dismiss message" onClick={() => setNotice('')}><X size={15} /></button></div>}
      {showSearchHelp && <SearchHelpDialog onClose={() => setShowSearchHelp(false)} onUseExample={useSearchExample} />}
    </div>
  );
}
