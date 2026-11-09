import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  BellRing,
  Box,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Code2,
  Database,
  Eye,
  FileText,
  Folder,
  KeyRound,
  Layers,
  Plus,
  Search,
  ShieldCheck,
  Users,
  RefreshCw,
  X,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import clauseCatalog from '../../../docs/audits/policy-library-controls.json';
import {
  policyLibraryCategories,
  policyLibraryCategoryRecords,
  policyLibraryFilters,
  policyLibraryTemplates,
} from '../../data/policyLibraryData.js';
import './PolicyLibrary.css';

const categoryOptions = [
  'Access Management',
  'Governance & Oversight',
  'Risk & Compliance',
  'Asset & Configuration',
  'Data Protection & Cryptography',
  'Human Resource Security',
  'Operations & Resilience',
  'Threat & Incident Management',
  'Third-Party & Supplier',
  'Govern',
  'Identify',
  'Protect',
  'Detect',
  'Administrative',
  'Physical',
  'Technical',
];

const frameworkOptions = ['HIPAA', 'NIST CSF 2.0'];
const csfFunctions = ['Govern', 'Identify', 'Protect', 'Detect', 'Respond', 'Recover'];
const reviewFrequencies = ['Annually', 'Bi-annually', 'Quarterly', 'Every 2 years'];
const classifications = ['Internal', 'Confidential', 'Restricted'];
const modalName = { preview: 'preview', template: 'template', category: 'category' };

const clauseGroups = clauseCatalog.frameworks
  .filter(({ framework }) => frameworkOptions.includes(framework))
  .map(({ framework, groups }) => ({
    framework,
    controls: groups.flatMap(({ controls }) => controls),
  }));

const newTemplateForm = () => ({
  code: '',
  name: '',
  category: '',
  csfFunction: '',
  reviewFrequency: 'Annually',
  version: 'v1.0',
  owner: '',
  description: '',
  suggestedClassification: '',
  accountableRole: '',
  supportingProcedure: '',
  effectiveFrom: '',
  lastReviewed: '',
  frameworks: [],
  selectedClauses: [],
  markdownContent: '',
  richTextHtml: '',
  richTextText: '',
  contentMode: 'Markdown',
  publish: false,
});

function useModalFocus(activeModal, modalRef, closeRef, triggerRef, onClose) {
  useEffect(() => {
    const triggerElement = triggerRef.current;
    if (!activeModal) {
      if (triggerRef.current?.isConnected) triggerRef.current.focus();
      return undefined;
    }

    const previousFocus = document.activeElement;
    const frame = window.requestAnimationFrame(() => closeRef.current?.focus());
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = Array.from(modalRef.current?.querySelectorAll(
        'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [contenteditable="true"], [tabindex]:not([tabindex="-1"])',
      ) ?? []).filter((element) => element.getClientRects().length > 0);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !modalRef.current?.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !modalRef.current?.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('keydown', handleKeyDown);
      if (previousFocus?.isConnected && !triggerElement?.isConnected) previousFocus.focus();
    };
  }, [activeModal, closeRef, modalRef, onClose, triggerRef]);
}

function FilterDropdown({ id, label, value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const listboxRef = useRef(null);
  const labelId = `${id}-label`;
  const valueId = `${id}-value`;
  const listboxId = `${id}-options`;
  const selectedIndex = Math.max(options.findIndex((option) => option.value === value), 0);
  const selectedOption = options[selectedIndex];

  useEffect(() => {
    if (!isOpen) return undefined;
    const handlePointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    listboxRef.current?.focus();
    document.getElementById(`${listboxId}-option-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, isOpen, listboxId]);

  const openMenu = () => {
    setActiveIndex(selectedIndex);
    setIsOpen(true);
  };

  const selectOption = (index) => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (!isOpen) {
      openMenu();
      return;
    }
    setActiveIndex((current) => Math.min(Math.max(current + (event.key === 'ArrowDown' ? 1 : -1), 0), options.length - 1));
  };

  const handleListboxKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) => Math.min(Math.max(current + (event.key === 'ArrowDown' ? 1 : -1), 0), options.length - 1));
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      setActiveIndex(event.key === 'Home' ? 0 : options.length - 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectOption(activeIndex);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div
      className={`library-filter${isOpen ? ' is-open' : ''}`}
      ref={wrapperRef}
      onBlur={(event) => {
        if (!wrapperRef.current?.contains(event.relatedTarget)) setIsOpen(false);
      }}
    >
      <span id={labelId}>{label}</span>
      <button
        ref={triggerRef}
        className="library-filter-trigger"
        type="button"
        aria-labelledby={`${labelId} ${valueId}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        onClick={() => (isOpen ? setIsOpen(false) : openMenu())}
        onKeyDown={handleTriggerKeyDown}
      >
        <span id={valueId}>{selectedOption?.label}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      {isOpen && (
        <div
          ref={listboxRef}
          className="library-filter-menu"
          id={listboxId}
          role="listbox"
          tabIndex={0}
          aria-labelledby={labelId}
          aria-activedescendant={`${listboxId}-option-${activeIndex}`}
          onKeyDown={handleListboxKeyDown}
        >
          {options.map((option, index) => (
            <div
              className={`library-filter-option${index === activeIndex ? ' is-active' : ''}${option.value === value ? ' is-selected' : ''}`}
              id={`${listboxId}-option-${index}`}
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onMouseMove={() => setActiveIndex(index)}
              onClick={() => selectOption(index)}
            >
              <span>{option.label}</span>
              {option.value === value && <Check size={16} aria-hidden="true" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TemplateGlyph({ title }) {
  const normalizedTitle = title.toLowerCase();
  if (/access|identity|authentication|credential/.test(normalizedTitle)) return <KeyRound size={28} strokeWidth={1.8} />;
  if (/asset|inventory/.test(normalizedTitle)) return <Box size={28} strokeWidth={1.8} />;
  if (/application|software|development/.test(normalizedTitle)) return <Code2 size={28} strokeWidth={1.8} />;
  if (/audit|review|assessment|logging/.test(normalizedTitle)) return <ClipboardCheck size={28} strokeWidth={1.8} />;
  if (/backup|recovery|continuity/.test(normalizedTitle)) return <Database size={28} strokeWidth={1.8} />;
  if (/breach|incident|notification/.test(normalizedTitle)) return <BellRing size={28} strokeWidth={1.8} />;
  if (/responsibilit|role|human resource/.test(normalizedTitle)) return <Users size={28} strokeWidth={1.8} />;
  return <ShieldCheck size={28} strokeWidth={1.8} />;
}

function TemplateCard({ template, onPreview, onUse }) {
  return (
    <article className="library-template">
      <div className="library-template-topline">
        <div className="library-template-badges">
          {template.framework && <span className="library-framework-tag">{template.framework}</span>}
          <span className={`library-template-status${template.status === 'In use' ? ' is-in-use' : ''}`}>
            {template.status}
          </span>
        </div>
      </div>
      <div className="library-template-summary">
        <span className="library-template-icon" aria-hidden="true"><TemplateGlyph title={template.title} /></span>
        <div className="library-template-copy">
          <h2 className="library-template-title">{template.title}</h2>
          {template.description && <p className="library-template-description">{template.description}</p>}
        </div>
      </div>

      <dl className="library-template-meta">
        {template.category && <div><dt><Folder size={15} aria-hidden="true" /><span className="library-visually-hidden">Category</span></dt><dd>{template.category}</dd></div>}
        {template.reviewFrequency && <div><dt><RefreshCw size={15} aria-hidden="true" /><span className="library-visually-hidden">Review frequency</span></dt><dd>{template.reviewFrequency}</dd></div>}
        {Number.isFinite(template.mappedControlCount) && (
          <div>
            <dt><ShieldCheck size={15} aria-hidden="true" /><span className="library-visually-hidden">Mapped controls</span></dt>
            <dd>{template.mappedControlCount ? `${template.mappedControlCount} mapped` : '0 — none linked'}</dd>
          </div>
        )}
      </dl>

      <footer className="library-template-footer">
        <span className="library-template-version">{template.version} · Updated {template.updatedLabel}</span>
        <div className="library-template-actions">
          <button className="library-action library-action--quiet" type="button" onClick={(event) => onPreview(template, event.currentTarget)}>
            <Eye size={14} aria-hidden="true" /> Preview
          </button>
          <button className="library-action library-action--use" type="button" onClick={() => onUse(template)}>
            Use template <ChevronRight size={15} aria-hidden="true" />
          </button>
        </div>
      </footer>
    </article>
  );
}

function TemplatePreviewModal({ template, onClose, onUse, dialogRef, closeRef, titleId }) {
  const purposeId = useId();
  const frameworkReferences = template.frameworkReferences ?? [];
  const linkedControls = template.mappedControls ?? [];

  return (
    <div className="library-modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="library-modal library-preview-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={dialogRef}>
        <header className="library-modal-header library-preview-header">
          <div>
            <span className="library-preview-code">{template.code}</span>
            <h2 id={titleId}>{template.code} · {template.title}</h2>
            {template.framework && <span className="library-framework-tag">{template.framework}</span>}
          </div>
          <button ref={closeRef} className="library-modal-close" type="button" aria-label="Close" onClick={onClose}>
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="library-modal-body library-preview-body">
          <dl className="library-preview-metadata">
            <div><dt>Category</dt><dd>{template.category || '—'}</dd></div>
            <div><dt>Review</dt><dd>{template.reviewFrequency}</dd></div>
            <div><dt>Version</dt><dd>{template.version}</dd></div>
            <div><dt>Owner</dt><dd>{template.owner || '—'}</dd></div>
            <div><dt>Last reviewed</dt><dd>{template.lastReviewed || 'Not recorded'}</dd></div>
            {template.hipaaReference && <div><dt>Reference</dt><dd>{template.hipaaReference}</dd></div>}
          </dl>

          <section className="library-preview-section">
            <h3>Purpose</h3>
            <p id={purposeId}>{template.description || 'This template states no purpose.'}</p>
          </section>
          <section className="library-preview-section">
            <h3>Scope</h3>
            <p>This template does not say which systems, people or third parties it applies to.</p>
          </section>
          <section className="library-preview-section">
            <h3>Policy statements</h3>
            <p>This template has no policy statements yet.</p>
          </section>
          <section className="library-preview-section">
            <h3>Roles &amp; responsibilities</h3>
            <p>No responsibilities are described beyond the accountable role.</p>
          </section>
          <section className="library-preview-section">
            <h3>Controls linked ({template.mappedControlCount})</h3>
            {linkedControls.length ? (
              <div className="library-control-references">
                {linkedControls.map((reference) => <span key={reference}>{reference}</span>)}
              </div>
            ) : (
              <p>No controls linked yet — a policy adopted from this starts with no control links, so it counts towards no framework until you add them.</p>
            )}
          </section>
          <section className="library-preview-section">
            <h3>Framework references</h3>
            <p className="library-preview-caption">The clauses each framework answers through this policy</p>
            {frameworkReferences.length ? frameworkReferences.map((reference) => (
              <div className="library-preview-framework-row" key={reference.framework}>
                <strong>{reference.framework}</strong>
                <div className="library-control-references">
                  {reference.controls.map((control) => <span key={control}>{control}</span>)}
                </div>
              </div>
            )) : <p>This template answers no clause of a framework your organisation tracks.</p>}
          </section>
          <section className="library-preview-section">
            <h3>Exceptions</h3>
            <p>No exceptions are stated in this template. Add them when you adopt it if your organisation grants any.</p>
          </section>
          <section className="library-preview-section">
            <h3>Review cadence</h3>
            <p>Reviewed every 12 months, or on significant change.</p>
          </section>
          <section className="library-preview-section">
            <h3>Related policies</h3>
            <p>No related policies or documents are named.</p>
          </section>
        </div>

        <footer className="library-modal-footer library-preview-footer">
          <button className="library-button library-button--quiet" type="button" onClick={onClose}>Close</button>
          <button className="library-button library-button--primary" type="button" onClick={() => onUse(template)}>Use template</button>
        </footer>
      </section>
    </div>
  );
}

function FieldError({ id, children }) {
  return children ? <p className="library-field-error" id={id} role="alert">{children}</p> : null;
}

function ClausePicker({ framework, selectedClauses, onAdd, onRemove, onCoverageChange }) {
  const idPrefix = useId().replaceAll(':', '');
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const controls = clauseGroups.find((group) => group.framework === framework)?.controls ?? [];
  const selectedForFramework = selectedClauses.filter((clause) => clause.framework === framework);
  const selectedIds = new Set(selectedForFramework.map((clause) => clause.id));
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const matches = controls.filter((control) => !selectedIds.has(control.id)
    && (!normalizedQuery
      || control.id.toLocaleLowerCase().includes(normalizedQuery)
      || control.title.toLocaleLowerCase().includes(normalizedQuery)))
    .slice(0, 12);

  return (
    <section className="library-framework-mapping" aria-labelledby={`${idPrefix}-title`}>
      <h3 id={`${idPrefix}-title`}>{framework}</h3>
      <label className="library-field-label" htmlFor={`${idPrefix}-clause`}>Add a {framework} clause</label>
      <div className="library-clause-combobox">
        <input
          id={`${idPrefix}-clause`}
          type="search"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={`${idPrefix}-options`}
          aria-autocomplete="list"
          value={query}
          placeholder="Type a clause ref or words from its title"
          onFocus={() => setIsOpen(true)}
          onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
          onChange={(event) => { setQuery(event.target.value); setIsOpen(true); }}
        />
        <button
          className="library-clause-open"
          type="button"
          aria-label="Open"
          aria-expanded={isOpen}
          aria-controls={`${idPrefix}-options`}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setIsOpen((current) => !current)}
        >
          Open
        </button>
        {isOpen && (
          <div className="library-clause-options" id={`${idPrefix}-options`} role="listbox" aria-label={`${framework} clauses`}>
            {matches.length ? matches.map((control) => (
              <button
                className="library-clause-option"
                key={control.id}
                type="button"
                role="option"
                aria-selected="false"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => { onAdd({ ...control, framework }); setQuery(''); setIsOpen(false); }}
              >
                <strong>{control.id}</strong><span>{control.title}</span>
              </button>
            )) : <p className="library-clause-empty">No matching clauses.</p>}
          </div>
        )}
      </div>
      {selectedForFramework.length ? (
        <ul className="library-selected-clauses">
          {selectedForFramework.map((clause) => (
            <li key={clause.id}>
              <span className="library-selected-clause-label"><strong>{clause.id}</strong> {clause.title}</span>
              <button className="library-coverage-toggle" type="button" onClick={() => onCoverageChange(framework, clause.id)}>
                Coverage of {clause.id}: {clause.coverage}. Change to {clause.coverage === 'Full' ? 'Partial' : 'Full'}
              </button>
              <button className="library-remove-clause" type="button" onClick={() => onRemove(framework, clause.id)}>Remove</button>
            </li>
          ))}
        </ul>
      ) : <p className="library-no-clauses">No clauses added yet.</p>}
    </section>
  );
}

function RichTextToolbar({ editorRef, onUpdate }) {
  const controls = [
    ['H1', 'formatBlock', 'H1'], ['H2', 'formatBlock', 'H2'], ['H3', 'formatBlock', 'H3'], ['H4', 'formatBlock', 'H4'],
    ['B', 'bold'], ['I', 'italic'], ['U', 'underline'], ['• List', 'insertUnorderedList'], ['1. List', 'insertOrderedList'],
    ['Left', 'justifyLeft'], ['Centre', 'justifyCenter'], ['Right', 'justifyRight'], ['Table', 'insertHTML', '<table><tbody><tr><td>Cell</td><td>Cell</td></tr></tbody></table>'],
    ['Link', 'createLink'], ['Rule', 'insertHorizontalRule'],
  ];
  const run = (command, value) => {
    editorRef.current?.focus();
    if (command === 'createLink') {
      const href = window.prompt('Link URL');
      if (!href) return;
      document.execCommand(command, false, href);
    } else {
      document.execCommand(command, false, value);
    }
    onUpdate();
  };

  return (
    <div className="library-rich-toolbar" role="toolbar" aria-label="Rich text formatting">
      {controls.map(([label, command, value]) => (
        <button key={label} type="button" aria-label={label} title={label} onMouseDown={(event) => event.preventDefault()} onClick={() => run(command, value)}>
          {label}
        </button>
      ))}
    </div>
  );
}

function MarkdownPreview({ markdown }) {
  const lines = markdown.split('\n');
  const rendered = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const Tag = `h${heading[1].length}`;
      rendered.push(<Tag key={`heading-${index}`}>{heading[2]}</Tag>);
      index += 1;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^\s*[-*]\s+/.test(lines[index])) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ''));
        index += 1;
      }
      rendered.push(<ul key={`unordered-${index}`}>{items.map((item, itemIndex) => <li key={`${index}-${itemIndex}`}>{item}</li>)}</ul>);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^\s*\d+\.\s+/.test(lines[index])) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ''));
        index += 1;
      }
      rendered.push(<ol key={`ordered-${index}`}>{items.map((item, itemIndex) => <li key={`${index}-${itemIndex}`}>{item}</li>)}</ol>);
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (index < lines.length && lines[index].trim() && !/^(#{1,6}\s+|[-*]\s+|\d+\.\s+)/.test(lines[index].trim())) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    rendered.push(<p key={`paragraph-${index}`}>{paragraph.join(' ')}</p>);
  }

  return <div className="library-markdown-preview-content">{rendered}</div>;
}

function TemplateWizardModal({
  form,
  setForm,
  step,
  setStep,
  errors,
  onClose,
  onNext,
  onBack,
  onSaveNow,
  onCreate,
  dialogRef,
  closeRef,
  titleId,
}) {
  const ids = {
    code: useId(), name: useId(), category: useId(), csfFunction: useId(), review: useId(), version: useId(),
    owner: useId(), description: useId(), classification: useId(), role: useId(), procedure: useId(), effective: useId(),
    lastReviewed: useId(), markdown: useId(),
  };
  const richTextRef = useRef(null);
  const words = form.contentMode === 'Markdown'
    ? form.markdownContent.trim().split(/\s+/).filter(Boolean).length
    : form.richTextText.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    if (form.contentMode === 'Rich text' && richTextRef.current && richTextRef.current.innerHTML !== form.richTextHtml) {
      richTextRef.current.innerHTML = form.richTextHtml;
    }
  }, [form.contentMode, form.richTextHtml]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };
  const updateSelectedClauses = (next) => updateField('selectedClauses', next);
  const addClause = (clause) => updateSelectedClauses([
    ...form.selectedClauses,
    { ...clause, coverage: 'Full' },
  ]);
  const removeClause = (framework, id) => updateSelectedClauses(
    form.selectedClauses.filter((clause) => !(clause.framework === framework && clause.id === id)),
  );
  const changeCoverage = (framework, id) => updateSelectedClauses(form.selectedClauses.map((clause) => (
    clause.framework === framework && clause.id === id
      ? { ...clause, coverage: clause.coverage === 'Full' ? 'Partial' : 'Full' }
      : clause
  )));
  const toggleFramework = (framework, checked) => updateField(
    'frameworks',
    checked ? [...form.frameworks, framework] : form.frameworks.filter((value) => value !== framework),
  );
  const saveRichText = () => {
    if (!richTextRef.current) return;
    updateField('richTextHtml', richTextRef.current.innerHTML);
    updateField('richTextText', richTextRef.current.innerText || richTextRef.current.textContent || '');
  };

  return (
    <div className="library-modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="library-modal library-wizard-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={dialogRef}>
        <header className="library-modal-header">
          <div className="library-wizard-title">
            <FileText size={18} aria-hidden="true" />
            <h2 id={titleId}>New policy template</h2>
          </div>
          <button ref={closeRef} className="library-modal-close" type="button" aria-label="Close" onClick={onClose}><X size={18} aria-hidden="true" /></button>
        </header>

        <nav className="library-wizard-steps" aria-label="New policy template steps">
          {['Details', 'Framework mapping', 'Content'].map((label, index) => (
            <button key={label} type="button" className={step === index ? 'is-active' : ''} aria-current={step === index ? 'step' : undefined} onClick={() => setStep(index)}>
              <span>{index + 1}</span>{label}
            </button>
          ))}
        </nav>

        <div className="library-modal-body library-wizard-body">
          {step === 0 && (
            <div className="library-form-step">
              <h3>Details</h3>
              <div className="library-form-grid">
                <div className="library-form-field">
                  <label htmlFor={ids.code}>Template code</label>
                  <input id={ids.code} type="text" disabled value={form.code} placeholder="Chosen from the category" />
                  <small>Auto-generated from category when saved.</small>
                </div>
                <div className="library-form-field">
                  <label htmlFor={ids.name}>Name <span aria-hidden="true">*</span></label>
                  <input id={ids.name} value={form.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Access Control Policy" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${ids.name}-error` : undefined} />
                  <FieldError id={`${ids.name}-error`}>{errors.name}</FieldError>
                </div>
                <div className="library-form-field">
                  <label htmlFor={ids.category}>Category <span aria-hidden="true">*</span></label>
                  <select id={ids.category} value={form.category} onChange={(event) => updateField('category', event.target.value)} aria-invalid={Boolean(errors.category)} aria-describedby={errors.category ? `${ids.category}-error` : undefined}>
                    <option value="">— Choose —</option>
                    {categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                  <FieldError id={`${ids.category}-error`}>{errors.category}</FieldError>
                </div>
                <div className="library-form-field">
                  <label htmlFor={ids.csfFunction}>Domain · CSF function <span aria-hidden="true">*</span></label>
                  <select id={ids.csfFunction} value={form.csfFunction} onChange={(event) => updateField('csfFunction', event.target.value)} aria-invalid={Boolean(errors.csfFunction)} aria-describedby={errors.csfFunction ? `${ids.csfFunction}-error` : undefined}>
                    <option value="">— Choose —</option>
                    {csfFunctions.map((value) => <option key={value} value={value}>{value}</option>)}
                  </select>
                  <FieldError id={`${ids.csfFunction}-error`}>{errors.csfFunction}</FieldError>
                </div>
                <div className="library-form-field">
                  <label htmlFor={ids.review}>Review frequency <span aria-hidden="true">*</span></label>
                  <select id={ids.review} value={form.reviewFrequency} onChange={(event) => updateField('reviewFrequency', event.target.value)}>
                    {reviewFrequencies.map((value) => <option key={value} value={value}>{value}</option>)}
                  </select>
                </div>
                <div className="library-form-field">
                  <label htmlFor={ids.version}>Version</label>
                  <input id={ids.version} value={form.version} onChange={(event) => updateField('version', event.target.value)} />
                  <small>The template's own. An adopted policy numbers itself.</small>
                </div>
                <div className="library-form-field">
                  <label htmlFor={ids.owner}>Owner / author</label>
                  <input id={ids.owner} value={form.owner} onChange={(event) => updateField('owner', event.target.value)} placeholder="e.g. Governance, Risk & Compliance" />
                </div>
                <div className="library-form-field library-form-field--wide">
                  <label htmlFor={ids.description}>Description</label>
                  <textarea id={ids.description} value={form.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Shown to authors when they browse templates." rows="3" />
                </div>
              </div>

              <details className="library-more-details">
                <summary>More details (optional)</summary>
                <div className="library-form-grid">
                  <div className="library-form-field">
                    <label htmlFor={ids.classification}>Suggested classification</label>
                    <select id={ids.classification} value={form.suggestedClassification} onChange={(event) => updateField('suggestedClassification', event.target.value)}>
                      <option value="">—</option>
                      {classifications.map((value) => <option key={value} value={value}>{value}</option>)}
                    </select>
                    <small>Advice an adopter may overrule.</small>
                  </div>
                  <div className="library-form-field">
                    <label htmlFor={ids.role}>Accountable role</label>
                    <input id={ids.role} value={form.accountableRole} onChange={(event) => updateField('accountableRole', event.target.value)} placeholder="Privacy Officer" />
                    <small>A role, not a person.</small>
                  </div>
                  <div className="library-form-field">
                    <label htmlFor={ids.procedure}>Supporting procedure</label>
                    <input id={ids.procedure} value={form.supportingProcedure} onChange={(event) => updateField('supportingProcedure', event.target.value)} placeholder="Access Permission Management" />
                    <small>What carries the policy out.</small>
                  </div>
                  <div className="library-form-field">
                    <label htmlFor={ids.effective}>Effective from date</label>
                    <input id={ids.effective} type="date" value={form.effectiveFrom} onChange={(event) => updateField('effectiveFrom', event.target.value)} />
                    <small>When this version takes effect.</small>
                  </div>
                  <div className="library-form-field">
                    <label htmlFor={ids.lastReviewed}>Last reviewed date</label>
                    <input id={ids.lastReviewed} type="date" value={form.lastReviewed} onChange={(event) => updateField('lastReviewed', event.target.value)} />
                    <small>When somebody last read it through.</small>
                  </div>
                </div>
              </details>
            </div>
          )}

          {step === 1 && (
            <div className="library-form-step">
              <h3>Frameworks this policy evidences</h3>
              <p className="library-form-intro">Toggle a framework, then add the specific clauses this policy satisfies. One policy can map to several frameworks.</p>
              <div className="library-framework-checkboxes">
                {frameworkOptions.map((framework) => (
                  <label key={framework}>
                    <input type="checkbox" checked={form.frameworks.includes(framework)} onChange={(event) => toggleFramework(framework, event.target.checked)} />
                    <span>{framework}</span>
                  </label>
                ))}
              </div>
              {form.frameworks.map((framework) => (
                <ClausePicker
                  key={framework}
                  framework={framework}
                  selectedClauses={form.selectedClauses}
                  onAdd={addClause}
                  onRemove={removeClause}
                  onCoverageChange={changeCoverage}
                />
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="library-form-step library-content-step">
              <h3>POLICY CONTENT</h3>
              <div className="library-content-toolbar">
                <div className="library-editor-modes" role="group" aria-label="Content editor mode">
                  {['Markdown', 'Rich text'].map((mode) => (
                    <button key={mode} className={form.contentMode === mode ? 'is-active' : ''} type="button" aria-pressed={form.contentMode === mode} onClick={() => updateField('contentMode', mode)}>{mode}</button>
                  ))}
                </div>
                <button className="library-button library-button--quiet" type="button" onClick={onSaveNow}>Save now</button>
              </div>
              {form.contentMode === 'Markdown' ? (
                <div className="library-markdown-workspace">
                  <label className="library-markdown-label" htmlFor={ids.markdown}>
                    <span className="library-visually-hidden">Policy content in Markdown</span>
                    <textarea id={ids.markdown} value={form.markdownContent} onChange={(event) => updateField('markdownContent', event.target.value)} placeholder={'# Policy title\n\nWrite in Markdown. The preview beside this is what readers will see.'} rows="14" />
                  </label>
                  <section className="library-markdown-preview" aria-label="Policy content preview">
                    <h4>Preview</h4>
                    <MarkdownPreview markdown={form.markdownContent} />
                  </section>
                </div>
              ) : (
                <div className="library-rich-editor-wrap">
                  <RichTextToolbar editorRef={richTextRef} onUpdate={saveRichText} />
                  <div
                    className="library-rich-editor"
                    ref={richTextRef}
                    contentEditable
                    role="textbox"
                    aria-label="Policy content in Rich text"
                    aria-multiline="true"
                    suppressContentEditableWarning
                    onInput={saveRichText}
                  />
                </div>
              )}
              <div className="library-content-meta">
                <span aria-live="polite">{words} words{words === 0 ? ' ~ 1 min read' : ''}</span>
                <span>Autosaves every 60s</span>
              </div>
              <label className="library-publish-option">
                <input type="checkbox" checked={form.publish} onChange={(event) => updateField('publish', event.target.checked)} />
                <span><strong>Publish it — authors can start from this straight away</strong><small>Leave it off while the template is still being written.</small></span>
              </label>
              <p className="library-prototype-disclaimer">Local prototype: changes are not saved or published.</p>
            </div>
          )}
        </div>

        <footer className="library-modal-footer library-wizard-footer">
          <span className="library-required-note">Fields marked * are required.</span>
          <div>
            {step > 0 && <button className="library-button library-button--quiet" type="button" onClick={onBack}>Back</button>}
            {step < 2 ? (
              <button className="library-button library-button--primary" type="button" onClick={onNext}>Next →</button>
            ) : (
              <button className="library-button library-button--primary" type="button" onClick={onCreate}>Create template</button>
            )}
          </div>
        </footer>
      </section>
    </div>
  );
}

function NewCategoryModal({ onClose, onCreate, dialogRef, closeRef, titleId }) {
  const nameId = useId();
  const descriptionId = useId();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="library-modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="library-modal library-category-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={dialogRef}>
        <header className="library-modal-header">
          <h2 id={titleId}>New category</h2>
          <button ref={closeRef} className="library-modal-close" type="button" aria-label="Close" onClick={onClose}><X size={18} aria-hidden="true" /></button>
        </header>
        <div className="library-modal-body library-category-form">
          <div className="library-form-field">
            <label htmlFor={nameId}>Name</label>
            <input id={nameId} value={name} onChange={(event) => setName(event.target.value)} placeholder="Information Security" />
          </div>
          <div className="library-form-field">
            <label htmlFor={descriptionId}>Description</label>
            <textarea id={descriptionId} value={description} onChange={(event) => setDescription(event.target.value)} rows="4" />
          </div>
        </div>
        <footer className="library-modal-footer">
          <button className="library-button library-button--quiet" type="button" onClick={onClose}>Cancel</button>
          <button className="library-button library-button--primary" type="button" onClick={() => onCreate({ name, description })}>Create category</button>
        </footer>
      </section>
    </div>
  );
}

function CategoriesPage() {
  return (
    <section className="library-category-list" aria-label="Categories">
      {policyLibraryCategoryRecords.map((category) => (
        <article className="library-category-row" key={category.name}>
          <h2>{category.name}</h2>
          <div className="library-category-counts">
            <span><strong>{category.templateCount}</strong> {category.templateCount === 1 ? 'template' : 'templates'}</span>
            <span><strong>{category.policyCount}</strong> {category.policyCount === 1 ? 'policy' : 'policies'}</span>
          </div>
        </article>
      ))}
    </section>
  );
}

export default function PolicyLibrary() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeModal, setActiveModal] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [templateForm, setTemplateForm] = useState(newTemplateForm);
  const [wizardStep, setWizardStep] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [notice, setNotice] = useState('');
  const modalRef = useRef(null);
  const modalCloseRef = useRef(null);
  const modalTriggerRef = useRef(null);
  const titleId = useId();
  const searchId = useId();
  const frameworkId = useId();
  const categoryId = useId();
  const reviewId = useId();
  const activeTab = searchParams.get('tab') === 'categories' ? 'categories' : 'templates';
  const searchQuery = searchParams.get('search') ?? '';
  const filters = {
    framework: searchParams.get('framework') ?? 'all',
    category: searchParams.get('category') ?? 'all',
    review: searchParams.get('review') ?? 'all',
  };
  const hasActiveFilters = searchQuery !== '' || Object.values(filters).some((value) => value !== 'all');
  const modalIsRelevant = (activeModal === modalName.category && activeTab === 'categories')
    || (activeModal !== modalName.category && activeTab === 'templates');

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setPreviewTemplate(null);
  }, []);
  useModalFocus(modalIsRelevant ? activeModal : null, modalRef, modalCloseRef, modalTriggerRef, closeModal);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(''), 6000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const filteredTemplates = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    return policyLibraryTemplates.filter((template) => {
      const matchesSearch = !query || [template.title, template.code].some((value) => value.toLocaleLowerCase().includes(query));
      const matchesFramework = filters.framework === 'all' || template.framework === filters.framework;
      const matchesCategory = filters.category === 'all' || template.category === filters.category;
      const matchesReview = filters.review === 'all' || template.reviewFrequency === filters.review;
      return matchesSearch && matchesFramework && matchesCategory && matchesReview;
    });
  }, [filters.category, filters.framework, filters.review, searchQuery]);

  const updateSearchParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all') next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    const next = new URLSearchParams(searchParams);
    ['search', 'framework', 'category', 'review'].forEach((key) => next.delete(key));
    setSearchParams(next, { replace: true });
  };

  const changeTab = (tab) => {
    setActiveModal(null);
    setPreviewTemplate(null);
    const next = new URLSearchParams(searchParams);
    if (tab === 'categories') next.set('tab', 'categories');
    else next.delete('tab');
    setSearchParams(next);
  };

  const openTemplateModal = (trigger) => {
    modalTriggerRef.current = trigger;
    setTemplateForm(newTemplateForm());
    setWizardStep(0);
    setFormErrors({});
    setActiveModal(modalName.template);
  };

  const openCategoryModal = (trigger) => {
    modalTriggerRef.current = trigger;
    setActiveModal(modalName.category);
  };

  const openPreview = (template, trigger) => {
    modalTriggerRef.current = trigger;
    setPreviewTemplate(template);
    setActiveModal(modalName.preview);
  };

  const showNotice = (message) => setNotice(message);
  const useTemplate = (template) => {
    closeModal();
    showNotice(`Use template${template ? ` · ${template.code}` : ''} is not connected in this prototype. No policy draft was created.`);
  };

  const goNext = () => {
    const nextErrors = {};
    if (!templateForm.name.trim()) nextErrors.name = 'Give the template a name.';
    if (!templateForm.category) nextErrors.category = 'Choose a category.';
    if (!templateForm.csfFunction) nextErrors.csfFunction = 'Choose the CSF function the policy serves.';
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setWizardStep((current) => Math.min(current + 1, 2));
  };

  const onCategoryCreate = () => {
    closeModal();
    showNotice('Saving is unavailable in this prototype. No category was created.');
  };

  return (
    <section className="policy-library-page" aria-label="Policy Library">
      <header className="library-page-heading">
        <div>
          <p>Maintained policy templates across HIPAA and NIST CSF 2.0 — search, filter, and start a draft in your register.</p>
        </div>
        {activeTab === 'templates' ? (
          <button className="library-primary-action" type="button" onClick={(event) => openTemplateModal(event.currentTarget)}>
            <Plus size={16} aria-hidden="true" /> New template
          </button>
        ) : (
          <button className="library-primary-action" type="button" onClick={(event) => openCategoryModal(event.currentTarget)}>
            <Plus size={16} aria-hidden="true" /> New category
          </button>
        )}
      </header>

      <nav className="library-tabs" aria-label="Policy Library sections">
        <button type="button" className={activeTab === 'templates' ? 'is-active' : ''} aria-current={activeTab === 'templates' ? 'page' : undefined} onClick={() => changeTab('templates')}>
          <Layers size={18} aria-hidden="true" /> Templates <span>{policyLibraryTemplates.length}</span>
        </button>
        <button type="button" className={activeTab === 'categories' ? 'is-active' : ''} aria-current={activeTab === 'categories' ? 'page' : undefined} onClick={() => changeTab('categories')}>
          <Folder size={18} aria-hidden="true" /> Categories <span>{policyLibraryCategories.length}</span>
        </button>
      </nav>

      {activeTab === 'categories' ? (
        <CategoriesPage />
      ) : (
        <section className="library-template-catalog" aria-label="Templates">
          <div className="library-controls">
            <label className="library-search" htmlFor={searchId}>
              <Search size={16} aria-hidden="true" />
              <span>Search</span>
              <input id={searchId} type="search" value={searchQuery} onChange={(event) => updateSearchParam('search', event.target.value)} placeholder="Search by name or code..." />
            </label>
            <FilterDropdown
              id={frameworkId}
              label="Framework"
              value={filters.framework}
              options={[
                { value: 'all', label: 'All frameworks' },
                ...policyLibraryFilters.frameworks.map((framework) => ({ value: framework, label: framework })),
              ]}
              onChange={(value) => updateSearchParam('framework', value)}
            />
            <FilterDropdown
              id={categoryId}
              label="Category"
              value={filters.category}
              options={[
                { value: 'all', label: 'All categories' },
                ...policyLibraryFilters.categories.map((category) => ({ value: category, label: category })),
              ]}
              onChange={(value) => updateSearchParam('category', value)}
            />
            <FilterDropdown
              id={reviewId}
              label="Review"
              value={filters.review}
              options={[
                { value: 'all', label: 'Any review' },
                ...policyLibraryFilters.reviews.map((review) => ({ value: review, label: review })),
              ]}
              onChange={(value) => updateSearchParam('review', value)}
            />
          </div>

          <div className="library-results-heading">
            <p aria-live="polite">Showing {filteredTemplates.length} of {policyLibraryTemplates.length} templates</p>
            {hasActiveFilters && (
              <p className="library-filtered-note">
                Filtered. <button type="button" onClick={clearFilters}>Clear the filters</button> to see all {policyLibraryTemplates.length} templates.
              </p>
            )}
          </div>

          {filteredTemplates.length ? (
            <div className="library-template-list">
              {filteredTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} onPreview={openPreview} onUse={useTemplate} />
              ))}
            </div>
          ) : (
            <p className="library-empty-results">No template matches these filters.</p>
          )}
        </section>
      )}

      {modalIsRelevant && activeModal === modalName.preview && previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={closeModal}
          onUse={useTemplate}
          dialogRef={modalRef}
          closeRef={modalCloseRef}
          titleId={titleId}
        />
      )}
      {modalIsRelevant && activeModal === modalName.template && (
        <TemplateWizardModal
          form={templateForm}
          setForm={setTemplateForm}
          step={wizardStep}
          setStep={setWizardStep}
          errors={formErrors}
          onClose={closeModal}
          onNext={goNext}
          onBack={() => setWizardStep((current) => Math.max(current - 1, 0))}
          onSaveNow={() => showNotice('Saving is unavailable in this prototype. No template was saved.')}
          onCreate={() => showNotice('Saving is unavailable in this prototype. No template was created or published.')}
          dialogRef={modalRef}
          closeRef={modalCloseRef}
          titleId={titleId}
        />
      )}
      {modalIsRelevant && activeModal === modalName.category && (
        <NewCategoryModal onClose={closeModal} onCreate={onCategoryCreate} dialogRef={modalRef} closeRef={modalCloseRef} titleId={titleId} />
      )}

      {notice && (
        <div className="library-notice" role="status">
          <p>{notice}</p>
          <button type="button" aria-label="Dismiss message" onClick={() => setNotice('')}><X size={15} aria-hidden="true" /></button>
        </div>
      )}
    </section>
  );
}
