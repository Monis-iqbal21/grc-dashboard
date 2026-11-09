import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Download,
  Link2, Plus, Search, X,
} from 'lucide-react';
import { initialTasks, taskGroupingOptions, taskPriorities, taskStatuses, taskTags } from '../../data/tasksData.js';
import { matchesTaskQuery } from './taskSearch.js';
import './Tasks.css';

const PAGE_SIZE = 10;

function dateNow() {
  return new Date().toISOString();
}

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function TaskDropdown({ label, value, options, onChange, className = '' }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const listRef = useRef(null);
  const labelId = `${id}-label`;
  const listId = `${id}-list`;
  const selectedIndex = Math.max(options.findIndex((option) => option.value === value), 0);
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      listRef.current?.focus();
      document.getElementById(`${listId}-option-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
    }
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
      ref={rootRef}
      className={cx('task-dropdown', open && 'is-open', className)}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <span className="task-visually-hidden" id={labelId}>{label}</span>
      <button
        ref={triggerRef}
        className="task-dropdown-trigger"
        type="button"
        aria-labelledby={`${labelId} ${id}-value`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onTriggerKeyDown}
      >
        <span className="task-dropdown-value" id={`${id}-value`}>{selected?.label}</span>
        <ChevronDown size={15} aria-hidden="true" />
      </button>
      {open && (
        <div
          ref={listRef}
          className="task-dropdown-menu"
          id={listId}
          role="listbox"
          tabIndex={0}
          aria-labelledby={labelId}
          aria-activedescendant={`${listId}-option-${activeIndex}`}
          onKeyDown={onListKeyDown}
        >
          {options.map((option, index) => (
            <div
              className={cx('task-dropdown-option', index === activeIndex && 'is-active', option.value === value && 'is-selected')}
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

function TaskModal({ title, description, onClose, children, footer, wide = false }) {
  const titleId = useId();
  const modalRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const focusable = modalRef.current?.querySelector('[autofocus]') ?? modalRef.current?.querySelector('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])');
    focusable?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
      if (event.key === 'Tab' && modalRef.current) {
        const items = [...modalRef.current.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]')];
        if (!items.length) return;
        const first = items[0];
        const last = items.at(-1);
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
    <div className="task-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section
        aria-labelledby={titleId}
        aria-modal="true"
        className={cx('task-modal', wide && 'task-modal--wide')}
        ref={modalRef}
        role="dialog"
      >
        <header className="task-modal-heading">
          <div>
            <span className="task-eyebrow">TASK WORKSPACE</span>
            <h2 id={titleId}>{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <button className="task-icon-button" type="button" aria-label="Close dialog" onClick={onClose}><X size={17} /></button>
        </header>
        <div className="task-modal-content">{children}</div>
        {footer && <footer className="task-modal-footer">{footer}</footer>}
      </section>
    </div>
  );
}

function TaskTagsField({ value, options, onChange }) {
  const id = useId();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const visibleOptions = [...new Set([...options, ...value])]
    .filter((option) => option.toLowerCase().includes(query.trim().toLowerCase()));
  const add = (tag) => {
    const clean = tag.trim();
    if (!clean) return;
    onChange([...new Set([...value, clean])]);
    setQuery('');
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  return (
    <div className="task-tags-field" ref={wrapRef}>
      <span className="task-field-label">Tags</span>
      {value.length > 0 && (
        <div className="task-tag-list" aria-label="Selected tags">
          {value.map((tag) => (
            <span className="task-tag-chip" key={tag}>
              {tag}
              <button type="button" aria-label={`Remove ${tag} tag`} onClick={() => onChange(value.filter((item) => item !== tag))}><X size={12} /></button>
            </span>
          ))}
        </div>
      )}
      <div className={cx('task-tags-input-wrap', open && 'is-open')}>
        <input
          id={id}
          aria-label="Tags"
          aria-autocomplete="list"
          aria-controls={`${id}-options`}
          aria-expanded={open}
          autoComplete="off"
          placeholder="Add a tag…"
          role="combobox"
          value={query}
          onChange={(event) => { setQuery(event.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && query.trim()) {
              event.preventDefault();
              add(visibleOptions.find((option) => option.toLowerCase() === query.trim().toLowerCase()) ?? query);
            }
            if (event.key === 'Escape') {
              event.stopPropagation();
              setOpen(false);
            }
          }}
        />
        {open && (
          <div className="task-tags-options" id={`${id}-options`} role="listbox" aria-label="Available task tags">
            {visibleOptions.map((tag) => {
              const selected = value.includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  role="option"
                  aria-selected={selected}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selected ? onChange(value.filter((item) => item !== tag)) : add(tag)}
                >
                  <span>{tag}</span>{selected && <Check size={14} aria-hidden="true" />}
                </button>
              );
            })}
            {query.trim() && !options.some((option) => option.toLowerCase() === query.trim().toLowerCase()) && (
              <button type="button" role="option" aria-selected={false} onMouseDown={(event) => event.preventDefault()} onClick={() => add(query)}>
                <span>Add “{query.trim()}”</span><Plus size={14} aria-hidden="true" />
              </button>
            )}
            {!visibleOptions.length && !query.trim() && <span className="task-tags-empty">No tags available</span>}
          </div>
        )}
      </div>
      <span className="task-field-hint">Pick from your organisation’s tags, or type a new one.</span>
    </div>
  );
}

function TaskFormDialog({ task, onClose, onSave }) {
  const [form, setForm] = useState(() => task ? {
    title: task.title,
    description: task.description,
    relatedType: task.relatedType,
    relatedRef: task.relatedRef,
    assigneeName: task.assigneeName,
    assigneeEmail: task.assigneeEmail,
    priority: task.priority,
    dueDate: task.dueDate,
    tags: task.tags,
  } : {
    title: '', description: '', relatedType: '', relatedRef: '', assigneeName: '',
    assigneeEmail: '', priority: 'medium', dueDate: '', tags: [],
  });
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <TaskModal
      title={task ? `Edit ${task.id}` : 'New Task'}
      onClose={onClose}
      wide
      footer={(
        <>
          <button className="task-button task-button--quiet" type="button" onClick={onClose}>Cancel</button>
          <button className="task-button task-button--primary" type="submit" form="task-editor-form">{task ? 'Save Changes' : 'Create'}</button>
        </>
      )}
    >
      <form id="task-editor-form" className="task-form" onSubmit={(event) => { event.preventDefault(); onSave(form); }}>
        <div className="task-form-grid">
          <label className="task-field task-field--full">
            <span className="task-field-label">Title <span className="task-required">*</span></span>
            <input autoFocus required maxLength={180} value={form.title} onChange={(event) => update('title', event.target.value)} />
          </label>
          <label className="task-field task-field--full">
            <span className="task-field-label">Description / context</span>
            <textarea rows={3} maxLength={2000} value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="What you need the assignee to do." />
          </label>
          <label className="task-field">
            <span className="task-field-label">Related to (type)</span>
            <input value={form.relatedType} onChange={(event) => update('relatedType', event.target.value)} placeholder="risk / control / vulnerability" />
          </label>
          <label className="task-field">
            <span className="task-field-label">Related ref</span>
            <input value={form.relatedRef} onChange={(event) => update('relatedRef', event.target.value)} placeholder="e.g. R-006" />
          </label>
          <label className="task-field">
            <span className="task-field-label">Assignee name</span>
            <input autoComplete="name" value={form.assigneeName} onChange={(event) => update('assigneeName', event.target.value)} placeholder="Name" />
          </label>
          <label className="task-field">
            <span className="task-field-label">Assignee email</span>
            <input autoComplete="email" type="email" value={form.assigneeEmail} onChange={(event) => update('assigneeEmail', event.target.value)} placeholder="external responder — no account needed" />
          </label>
          <div className="task-field">
            <span className="task-field-label">Priority</span>
            <TaskDropdown
              label="Priority"
              value={form.priority}
              onChange={(value) => update('priority', value)}
              options={taskPriorities.map((priority) => ({ value: priority, label: priority }))}
            />
          </div>
          <label className="task-field">
            <span className="task-field-label">Due date</span>
            <input type="date" value={form.dueDate} onChange={(event) => update('dueDate', event.target.value)} />
          </label>
          <div className="task-field task-field--full">
            <TaskTagsField value={form.tags} options={taskTags} onChange={(value) => update('tags', value)} />
          </div>
        </div>
      </form>
    </TaskModal>
  );
}

function TaskSearchHelp({ onClose, onUseExample }) {
  const examples = ['status = "open" and due_date overdue', 'priority = "critical"'];
  const symbols = [
    [':', 'contains partial text', 'assigned_to : "morgan"'],
    ['=', 'equals exactly', 'status = "open"'],
    ['!=', 'is not', 'status != "closed"'],
    ['in ( … )', 'is any of these (an OR)', 'priority in ("critical", "high")'],
    ['>  >=  <  <=', 'greater / less than', 'created >= 2026-11-01'],
    ['between a..b', 'in a range', 'due_date between 2026-11-01..2026-11-30'],
    ['has', 'list contains', 'tags has "bcp"'],
    ['is empty / is set', 'blank / not blank', 'source_ref is empty'],
  ];
  const dates = [
    ['overdue', 'A due date already in the past'],
    ['today / yesterday', 'Dated today / yesterday'],
    ['last 30d / last 3m', 'Within the last 30 days / 3 months'],
    ['next 7d', 'Coming up in the next 7 days'],
    ['this_week / this_month / this_quarter / this_year', 'In the current period'],
    ['expiring 30', 'Expiring within the next 30 days'],
  ];
  const fields = [
    ['assigned_to', 'Assigned to', 'text'], ['created', 'Created', 'datetime'],
    ['description', 'Description', 'text'], ['due_date', 'Due', 'date'],
    ['priority', 'Priority', 'critical, high, medium, low'], ['ref', 'Reference', 'ref'],
    ['responded', 'Responded', 'datetime'], ['sent', 'Sent', 'datetime'],
    ['source_ref', 'Source reference', 'ref'], ['source_type', 'Raised from', 'text'],
    ['status', 'Status', 'open, sent, responded, closed…'], ['title', 'Title', 'text'],
    ['updated', 'Last updated', 'datetime'], ['verified_by', 'Verified by', 'text'],
  ];

  return (
    <TaskModal title="How to search" description="Search task fields with a concise query, or enter a word to search names and descriptions." onClose={onClose} wide>
      <div className="task-search-help">
        <section className="task-help-section">
          <h3>Tasks — try one</h3>
          <div className="task-search-examples">
            {examples.map((example) => <button key={example} type="button" onClick={() => onUseExample(example)}><code>{example}</code><span>Use example</span></button>)}
          </div>
        </section>
        <section className="task-help-section">
          <h3>Symbols</h3>
          <div className="task-help-table-wrap"><table className="task-help-table"><thead><tr><th>Symbol</th><th>Means</th><th>Example</th></tr></thead><tbody>{symbols.map(([symbol, meaning, example]) => <tr key={symbol}><td><code>{symbol}</code></td><td>{meaning}</td><td><code>{example}</code></td></tr>)}</tbody></table></div>
        </section>
        <section className="task-help-section">
          <h3>Dates</h3>
          <div className="task-help-table-wrap"><table className="task-help-table"><thead><tr><th>Type this</th><th>Finds</th></tr></thead><tbody>{dates.map(([keyword, meaning]) => <tr key={keyword}><td><code>{keyword}</code></td><td>{meaning}</td></tr>)}</tbody></table></div>
        </section>
        <section className="task-help-section">
          <h3>Combining</h3>
          <div className="task-combining-list">
            <p><code>source_type = "vulnerability" and status = "open"</code><span>Both must be true</span></p>
            <p><code>priority = "critical" or priority = "high"</code><span>Either one</span></p>
            <p><code>not status = "closed"</code><span>Everything except closed</span></p>
            <p><code>(status = "open" or status = "sent") and priority = "high"</code><span>Brackets group the “or”</span></p>
          </div>
        </section>
        <section className="task-help-section">
          <h3>Fields in Tasks</h3>
          <div className="task-help-table-wrap"><table className="task-help-table"><thead><tr><th>Field</th><th>Label</th><th>Type / values</th></tr></thead><tbody>{fields.map(([field, label, type]) => <tr key={field}><td><code>{field}</code></td><td>{label}</td><td>{type}</td></tr>)}</tbody></table></div>
        </section>
        <p className="task-prototype-note">The production guide demonstrates <code>tags has</code> without listing tags in its task field index; this prototype supports that example. Queries run against local sample data only, not production or a backend.</p>
      </div>
    </TaskModal>
  );
}

function TaskExportMenu({ onExport }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    const onKeyDown = (event) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className="task-export-wrap" ref={rootRef}>
      <button className="task-button task-button--quiet" type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        <Download size={15} aria-hidden="true" /> Export <ChevronDown size={14} aria-hidden="true" />
      </button>
      {open && (
        <div className="task-export-menu" role="menu" aria-label="Export tasks">
          <button type="button" role="menuitem" onClick={() => { setOpen(false); onExport('CSV'); }}><strong>CSV</strong><span>Opens in Excel, Sheets and data tools</span></button>
          <button type="button" role="menuitem" onClick={() => { setOpen(false); onExport('PDF'); }}><strong>PDF</strong><span>For sharing and printing</span></button>
          <button type="button" role="menuitem" onClick={() => { setOpen(false); onExport('HTML'); }}><strong>HTML</strong><span>Opens in a browser, rows expand</span></button>
        </div>
      )}
    </div>
  );
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function saveDownload(content, type, filename) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportRows(format, rows) {
  const columns = [
    ['Reference', 'id'], ['Task', 'title'], ['Assignee', 'assigneeName'], ['Assignee email', 'assigneeEmail'],
    ['Priority', 'priority'], ['Status', 'status'], ['Due', 'dueDate'], ['Related to', 'relatedType'],
    ['Related ref', 'relatedRef'], ['Tags', 'tags'],
  ];
  if (format === 'PDF') {
    document.body.dataset.taskPrinting = 'true';
    window.print();
    window.setTimeout(() => { delete document.body.dataset.taskPrinting; }, 1000);
    return;
  }
  if (format === 'CSV') {
    const csvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const csv = [columns.map(([label]) => csvCell(label)).join(','), ...rows.map((task) => columns.map(([, key]) => csvCell(Array.isArray(task[key]) ? task[key].join('; ') : task[key])).join(','))].join('\r\n');
    saveDownload(`\uFEFF${csv}`, 'text/csv;charset=utf-8', 'nvector-tasks.csv');
    return;
  }
  const table = `<table><thead><tr>${columns.map(([label]) => `<th>${escapeHtml(label)}</th>`).join('')}</tr></thead><tbody>${rows.map((task) => `<tr>${columns.map(([, key]) => key === 'title' ? `<td><details><summary>${escapeHtml(task.title)}</summary><p>${escapeHtml(task.description)}</p></details></td>` : `<td>${escapeHtml(Array.isArray(task[key]) ? task[key].join(', ') : task[key])}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>NVector Tasks</title><style>body{font:14px system-ui,sans-serif;margin:32px;color:#14213d}h1{font-size:22px}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:9px;border:1px solid #d7dfeb}th{background:#edf3fb}summary{cursor:pointer}details p{white-space:pre-wrap}</style><h1>Tasks</h1><p>${rows.length} tasks</p>${table}`;
  saveDownload(html, 'text/html;charset=utf-8', 'nvector-tasks.html');
}

function taskGroupLabel(task, groupOption) {
  if (!groupOption?.field) return '';
  const value = task[groupOption.field];
  if (!value) {
    if (groupOption.value === 'due_date') return 'No due date';
    if (groupOption.value === 'responded') return 'Not responded';
    if (groupOption.value === 'sent') return 'Not sent';
    if (groupOption.value === 'verified_by') return 'Not verified';
    return 'Not set';
  }
  if (['created', 'due_date', 'updated', 'responded', 'sent'].includes(groupOption.value)) return String(value).slice(0, 10);
  return String(value).replace(/^./, (character) => character.toUpperCase());
}

function TaskRow({ task, onStatusChange, onSend, onLink, onEdit, onRemove }) {
  return (
    <tr>
      <td data-label="Ref"><span className="task-reference">{task.id}</span></td>
      <td data-label="Task" className="task-title-cell">
        <strong>{task.title}</strong>
        {task.relatedRef && <span className="task-related-reference">{task.relatedType || 'related'} {task.relatedRef}</span>}
      </td>
      <td data-label="Assignee">
        {task.assigneeName ? <><span className="task-assignee-name">{task.assigneeName}</span>{task.assigneeEmail && <span className="task-assignee-email">{task.assigneeEmail}</span>}</> : <span className="task-muted">Unassigned</span>}
      </td>
      <td data-label="Priority"><span className={cx('task-priority', `task-priority--${task.priority}`)}>{task.priority}</span></td>
      <td data-label="Status">
        <label className={cx('task-status-select', `task-status-select--${task.status}`)}>
          <span className="task-visually-hidden">Change status for {task.id}</span>
          <select value={task.status} onChange={(event) => onStatusChange(task.id, event.target.value)}>
            {taskStatuses.map((status) => <option value={status} key={status}>{status}</option>)}
          </select>
          <ChevronDown size={13} aria-hidden="true" />
        </label>
      </td>
      <td data-label="Due">{task.dueDate || <span className="task-muted">—</span>}</td>
      <td data-label="Actions">
        <div className="task-row-actions">
          {task.status === 'open' ? (
            <button className="task-text-action" type="button" onClick={() => onSend(task)}>Send</button>
          ) : task.status === 'sent' ? (
            <>
              <button className="task-text-action" type="button" onClick={() => onSend(task)}>Resend</button>
              <button className="task-text-action" type="button" onClick={() => onLink(task)}><Link2 size={13} aria-hidden="true" /><span>Link</span></button>
            </>
          ) : null}
          <button className="task-text-action" type="button" onClick={() => onEdit(task)}>Edit</button>
          <button className="task-remove-button" type="button" aria-label={`Remove ${task.id}`} onClick={() => onRemove(task)}><X size={15} aria-hidden="true" /></button>
        </div>
      </td>
    </tr>
  );
}

export default function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [query, setQuery] = useState('');
  const [groupBy, setGroupBy] = useState('none');
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [notice, setNotice] = useState('');
  const noticeTimer = useRef(null);
  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  const notify = useCallback((message) => {
    setNotice(message);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(''), 6500);
  }, []);

  const visibleTasks = useMemo(() => tasks.filter((task) => matchesTaskQuery(task, query)), [query, tasks]);
  const pageCount = Math.max(1, Math.ceil(visibleTasks.length / PAGE_SIZE));
  const displayPage = Math.min(currentPage, pageCount);
  const pageTasks = visibleTasks.slice((displayPage - 1) * PAGE_SIZE, displayPage * PAGE_SIZE);
  const rangeStart = visibleTasks.length ? (displayPage - 1) * PAGE_SIZE + 1 : 0;
  const rangeEnd = Math.min(displayPage * PAGE_SIZE, visibleTasks.length);
  const grouping = taskGroupingOptions.find((option) => option.value === groupBy);
  const groupedTasks = useMemo(() => {
    if (!grouping?.field) return null;
    const groups = new Map();
    pageTasks.forEach((task) => {
      const label = taskGroupLabel(task, grouping);
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label).push(task);
    });
    return [...groups.entries()];
  }, [grouping, pageTasks]);

  const saveTask = (form) => {
    const now = dateNow();
    if (modal?.task) {
      setTasks((current) => current.map((item) => item.id === modal.task.id ? { ...item, ...form, updatedAt: now } : item));
      notify('Task changes are saved in this local session only. Nothing was sent to a backend.');
    } else {
      setCurrentPage(1);
      setTasks((current) => {
        const nextNumber = Math.max(0, ...current.map((item) => Number(item.id.replace('TASK-', '')) || 0)) + 1;
        const id = `TASK-${String(nextNumber).padStart(3, '0')}`;
        return [{
          ...form,
          id,
          status: 'open',
          createdAt: now,
          updatedAt: now,
          sentAt: '',
          respondedAt: '',
          verifiedBy: '',
        }, ...current];
      });
      notify('Task added to the local sample list. No backend request or email was sent.');
    }
    setModal(null);
  };

  const updateStatus = (id, status) => {
    const now = dateNow();
    setTasks((current) => current.map((task) => task.id === id ? {
      ...task,
      status,
      updatedAt: now,
      sentAt: status === 'sent' ? (task.sentAt || now) : task.sentAt,
      respondedAt: status === 'responded' ? (task.respondedAt || now) : task.respondedAt,
    } : task));
    notify('Status updated in this local session only. Nothing was changed on production.');
  };

  const sendTask = () => notify('Sending is available after backend integration. No email was sent.');
  const linkTask = () => notify('Task response links are available after backend integration. No link was shared.');
  const removeTask = () => {
    const id = removeTarget?.id;
    if (!id) return;
    setTasks((current) => current.filter((task) => task.id !== id));
    setRemoveTarget(null);
    notify('Task removed from this local session only.');
  };

  return (
    <div className="tasks-page">
      <header className="tasks-page-heading">
        <div>
          <span className="task-eyebrow">WORK QUEUE</span>
          <h1>Task Register</h1>
          <p>{visibleTasks.length} {visibleTasks.length === 1 ? 'task' : 'tasks'}</p>
        </div>
        <div className="tasks-page-actions">
          <TaskExportMenu onExport={(format) => exportRows(format, visibleTasks)} />
          <button className="task-button task-button--primary" type="button" onClick={() => setModal({ type: 'new' })}><Plus size={16} aria-hidden="true" /> New Task</button>
        </div>
      </header>

      <section className="tasks-register" aria-label="Tasks">
        <div className="tasks-controls">
          <label className="tasks-search">
            <Search size={17} aria-hidden="true" />
            <input
              aria-label="Search tasks"
              autoComplete="off"
              placeholder={'Search — try status = "open", or just a word'}
              value={query}
              onChange={(event) => { setQuery(event.target.value); setCurrentPage(1); }}
            />
            {query && <button className="tasks-search-clear" type="button" aria-label="Clear search" onClick={() => { setQuery(''); setCurrentPage(1); }}><X size={14} /></button>}
          </label>
          <button className="task-help-button" type="button" aria-label="How to search" onClick={() => setModal({ type: 'help' })}><CircleHelp size={16} aria-hidden="true" /><span>How to search</span></button>
          <div className="tasks-group-control">
            <span>Group by</span>
            <TaskDropdown
              label="Group by"
              value={groupBy}
              options={taskGroupingOptions.map(({ value, label }) => ({ value, label }))}
              onChange={setGroupBy}
            />
          </div>
        </div>

        <div className="tasks-table-scroll">
          <table className="tasks-table">
            <thead><tr><th>REF</th><th>TASK</th><th>ASSIGNEE</th><th>PRIORITY</th><th>STATUS</th><th>DUE</th><th>ACTIONS</th></tr></thead>
            <tbody>
              {pageTasks.length ? (groupedTasks
                ? groupedTasks.map(([groupLabel, records]) => (
                  <TaskGroup key={groupLabel} label={groupLabel} count={records.length}>
                    {records.map((task) => <TaskRow key={task.id} task={task} onStatusChange={updateStatus} onSend={sendTask} onLink={linkTask} onEdit={(item) => setModal({ type: 'edit', task: item })} onRemove={setRemoveTarget} />)}
                  </TaskGroup>
                ))
                : pageTasks.map((task) => <TaskRow key={task.id} task={task} onStatusChange={updateStatus} onSend={sendTask} onLink={linkTask} onEdit={(item) => setModal({ type: 'edit', task: item })} onRemove={setRemoveTarget} />))
                : <tr><td className="tasks-empty-state" colSpan="7"><Search size={20} aria-hidden="true" /><strong>No tasks match this search</strong><span>Try another term or clear the query.</span>{query && <button className="task-button task-button--quiet" type="button" onClick={() => setQuery('')}>Clear search</button>}</td></tr>}
            </tbody>
          </table>
        </div>

        <footer className="tasks-pagination">
          <span>Showing {rangeStart}–{rangeEnd} of {visibleTasks.length}</span>
          <div>
            <button className="task-pagination-button" type="button" aria-label="Previous page" disabled={displayPage <= 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}><ChevronLeft size={16} /></button>
            <span>Page {displayPage} of {pageCount}</span>
            <button className="task-pagination-button" type="button" aria-label="Next page" disabled={displayPage >= pageCount} onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}><ChevronRight size={16} /></button>
          </div>
        </footer>
      </section>

      <p className="tasks-local-note">Sample task data is local to this prototype. Changes are not synchronized with the production application.</p>
      {notice && <div className="tasks-notice" role="status" aria-live="polite">{notice}<button type="button" aria-label="Dismiss message" onClick={() => setNotice('')}><X size={14} /></button></div>}

      {modal?.type === 'new' && <TaskFormDialog onClose={() => setModal(null)} onSave={saveTask} />}
      {modal?.type === 'edit' && <TaskFormDialog task={modal.task} onClose={() => setModal(null)} onSave={saveTask} />}
      {modal?.type === 'help' && <TaskSearchHelp onClose={() => setModal(null)} onUseExample={(example) => { setQuery(example); setCurrentPage(1); setModal(null); }} />}
      {removeTarget && (
        <TaskModal
          title="Remove task?"
          description={`${removeTarget.id} will be removed from the local sample list for this session.`}
          onClose={() => setRemoveTarget(null)}
          footer={<><button className="task-button task-button--quiet" type="button" onClick={() => setRemoveTarget(null)}>Cancel</button><button className="task-button task-button--danger" type="button" onClick={removeTask}>Remove task</button></>}
        >
          <p className="task-confirm-copy">This does not remove or change any production record.</p>
        </TaskModal>
      )}
    </div>
  );
}

function TaskGroup({ label, count, children }) {
  return <><tr className="task-group-row"><th colSpan="7" scope="rowgroup"><span>{label}</span><span>{count}</span></th></tr>{children}</>;
}

