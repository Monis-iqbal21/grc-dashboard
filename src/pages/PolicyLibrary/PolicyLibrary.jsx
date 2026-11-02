import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { BookOpen, Check, ChevronDown, FileText, Plus, Search, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import {
  policyLibraryFilters,
  policyLibraryTemplates,
  policyLibraryCategories,
} from '../../data/policyLibraryData.js';
import './PolicyLibrary.css';

const initialFilters = { framework: 'all', category: 'all', review: 'all' };

function TemplateCard({ template, selected, onSelect, onPreview, onUse }) {
  return (
    <article className={`library-template${selected ? ' is-selected' : ''}`}>
      <button
        className="library-template-select"
        type="button"
        aria-pressed={selected}
        onClick={() => onSelect(template.id)}
      >
        <span className="library-template-topline">
          <span className="library-template-code">{template.code || 'Example'}</span>
          <span className="library-template-status">{template.status}</span>
        </span>
        <strong className="library-template-title">{template.title}</strong>
        <span className="library-template-description">
          {template.description || 'No description.'}
        </span>
        <span className="library-template-frameworks">
          {template.framework && <span className="library-framework-tag">{template.framework}</span>}
        </span>
      </button>

      <div className="library-template-meta" aria-label={`Metadata for ${template.title}`}>
        <span><small>Category</small><strong>{template.category || '—'}</strong></span>
        <span><small>Review</small><strong>{template.reviewFrequency || '—'}</strong></span>
        <span><small>Controls</small><strong>{Number.isFinite(template.mappedControlCount) ? template.mappedControlCount : '—'}</strong></span>
      </div>

      <footer className="library-template-footer">
        <span className="library-template-version">
          <span title={`Changed ${template.updatedAt}; last reviewed: ${template.lastReviewed}`}>
            {template.version} · Updated {template.updatedLabel}
          </span>
        </span>
        <div className="library-template-actions">
          <button
            className="library-action library-action--quiet"
            type="button"
            aria-label={`Preview ${template.title}`}
            onClick={(event) => onPreview(template, event.currentTarget)}
          >
            Preview
          </button>
          <button className="library-action library-action--use" type="button" onClick={() => onUse(template)}>
            Use template
          </button>
        </div>
      </footer>
    </article>
  );
}

function TemplateInspector({ template, onUse }) {
  if (!template) {
    return (
      <aside className="library-inspector library-inspector--empty" aria-live="polite">
        <div className="library-inspector-empty-icon"><Search size={19} aria-hidden="true" /></div>
        <h3>No matching template</h3>
        <p>Adjust or clear the search and filters to inspect a template.</p>
      </aside>
    );
  }

  return (
    <aside className="library-inspector" aria-labelledby="library-inspector-title">
      <div className="library-inspector-heading">
        <div>
          <span className="library-section-kicker"><BookOpen size={13} aria-hidden="true" /> TEMPLATE INSPECTOR</span>
          <h2 id="library-inspector-title">Selected template</h2>
        </div>
        <span className="library-inspector-check" aria-label="Selected"><Check size={15} aria-hidden="true" /></span>
      </div>

      <div className="library-inspector-record">
        <div className="library-inspector-reference">
          <FileText size={15} aria-hidden="true" />
          <span>{template.code}</span>
        </div>
        <h3>{template.title}</h3>
        <p>{template.description || 'No description.'}</p>
      </div>

      <dl className="library-inspector-metadata">
        <div><dt>Framework</dt><dd>{template.framework || 'Not shown'}</dd></div>
        <div><dt>Category</dt><dd>{template.category || '—'}</dd></div>
        <div><dt>Review</dt><dd>{template.reviewFrequency || 'Not provided'}</dd></div>
        <div><dt>Version</dt><dd>{template.version || 'Not provided'}</dd></div>
        <div><dt>Linked controls</dt><dd>{Number.isFinite(template.mappedControlCount) ? template.mappedControlCount : 'Not provided'}</dd></div>
        <div><dt>Last updated</dt><dd>{template.updatedLabel}</dd></div>
        {template.status && <div><dt>Status</dt><dd>{template.status}</dd></div>}
        {template.owner !== undefined && <div><dt>Owner</dt><dd>{template.owner}</dd></div>}
        {template.lastReviewed && <div><dt>Last reviewed</dt><dd>{template.lastReviewed}</dd></div>}
      </dl>

      <div className="library-inspector-preview library-inspector-preview--summary">
        <h3>Inspection summary</h3>
        {template.mappedControls.length > 0 ? (
          <section>
            <h4>Controls linked ({template.mappedControlCount})</h4>
            <div className="library-control-references">
              {template.mappedControls.map((reference) => <span key={reference}>{reference}</span>)}
            </div>
          </section>
        ) : (
          <p>No linked controls were shown in the production record.</p>
        )}
      </div>

      <button className="library-inspector-use" type="button" onClick={() => onUse(template)}>
        Use template
      </button>
    </aside>
  );
}

function TemplatePreviewModal({ template, onClose, onUse, dialogRef, closeButtonRef, titleId }) {
  const descriptionId = useId();

  return (
    <div
      className="library-preview-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="library-preview-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={template.description ? descriptionId : undefined}
        ref={dialogRef}
      >
        <header className="library-preview-header">
          <div className="library-preview-heading">
            <span className="library-preview-code">{template.code}</span>
            <h2 id={titleId}>{template.code} · {template.title}</h2>
          </div>
          <button
            ref={closeButtonRef}
            className="library-preview-close"
            type="button"
            aria-label="Close template preview"
            onClick={onClose}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="library-preview-body">
          <dl className="library-preview-metadata">
            <div><dt>Status</dt><dd>{template.status}</dd></div>
            <div><dt>Framework</dt><dd>{template.framework || 'Not shown'}</dd></div>
            <div><dt>Category</dt><dd>{template.category || '—'}</dd></div>
            <div><dt>Review</dt><dd>{template.reviewFrequency}</dd></div>
            <div><dt>Version</dt><dd>{template.version}</dd></div>
            <div><dt>Linked controls</dt><dd>{template.mappedControlCount}</dd></div>
            <div><dt>Owner</dt><dd>{template.owner}</dd></div>
            <div><dt>Last reviewed</dt><dd>{template.lastReviewed}</dd></div>
            <div><dt>Last updated</dt><dd title={`Changed ${template.updatedAt}`}>{template.updatedLabel}</dd></div>
          </dl>

          {template.description && (
            <section className="library-preview-section">
              <h3>Purpose</h3>
              <p id={descriptionId}>{template.description}</p>
            </section>
          )}

          {template.mappedControls.length > 0 ? (
            <>
              <section className="library-preview-section">
                <h3>Controls linked ({template.mappedControlCount})</h3>
                <div className="library-control-references">
                  {template.mappedControls.map((reference) => <span key={reference}>{reference}</span>)}
                </div>
              </section>

              {template.frameworkReferences.length > 0 && (
                <section className="library-preview-section">
                  <h3>Framework references</h3>
                  <div className="library-preview-frameworks">
                    {template.frameworkReferences.map((reference) => (
                      <div className="library-preview-framework-row" key={reference.framework}>
                        <strong>{reference.framework}</strong>
                        <div className="library-control-references">
                          {reference.controls.map((control) => <span key={control}>{control}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          ) : (
            <section className="library-preview-section">
              <h3>Controls linked</h3>
              <p>No linked controls were shown in the production record.</p>
            </section>
          )}
        </div>

        <footer className="library-preview-footer">
          <span>Read-only preview</span>
          <div>
            <button className="library-preview-secondary" type="button" onClick={onClose}>Close</button>
            <button className="library-inspector-use" type="button" onClick={() => onUse(template)}>Use template</button>
          </div>
        </footer>
      </section>
    </div>
  );
}

function CategoryPlaceholder() {
  return (
    <section className="library-category-placeholder" aria-labelledby="library-category-title">
      <div className="library-placeholder-icon"><BookOpen size={21} aria-hidden="true" /></div>
      <h2 id="library-category-title">Categories</h2>
      <p>The category directory is reserved for its own implementation pass.</p>
      <span>{policyLibraryCategories.length} categories in the production audit</span>
    </section>
  );
}

export default function PolicyLibrary() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [selectedTemplateId, setSelectedTemplateId] = useState(policyLibraryTemplates[0]?.id ?? null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [notice, setNotice] = useState('');
  const previewTriggerRef = useRef(null);
  const previewDialogRef = useRef(null);
  const previewCloseButtonRef = useRef(null);
  const searchId = useId();
  const frameworkId = useId();
  const categoryId = useId();
  const reviewId = useId();
  const previewTitleId = useId();
  const activeTab = searchParams.get('tab') === 'categories' ? 'categories' : 'templates';

  useEffect(() => {
    if (!previewTemplate) return undefined;

    const returnFocusTarget = previewTriggerRef.current;
    const focusFrame = window.requestAnimationFrame(() => previewCloseButtonRef.current?.focus());
    const handleDialogKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setPreviewTemplate(null);
        return;
      }

      if (event.key !== 'Tab') return;
      const focusableElements = Array.from(
        previewDialogRef.current?.querySelectorAll(
          'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((element) => element.getClientRects().length > 0);
      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && (document.activeElement === firstElement || !previewDialogRef.current?.contains(document.activeElement))) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && (document.activeElement === lastElement || !previewDialogRef.current?.contains(document.activeElement))) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener('keydown', handleDialogKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener('keydown', handleDialogKeyDown);
      if (returnFocusTarget?.isConnected) returnFocusTarget.focus();
    };
  }, [previewTemplate]);

  const filteredTemplates = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();

    return policyLibraryTemplates.filter((template) => {
      const matchesSearch = !query || [template.title, template.code]
        .filter(Boolean)
        .some((value) => value.toLocaleLowerCase().includes(query));
      const matchesFramework = filters.framework === 'all' || template.framework === filters.framework;
      const matchesCategory = filters.category === 'all' || template.category === filters.category;
      const matchesReview = filters.review === 'all' || template.reviewFrequency === filters.review;
      return matchesSearch && matchesFramework && matchesCategory && matchesReview;
    });
  }, [filters, searchQuery]);

  const selectedTemplate = filteredTemplates.find((template) => template.id === selectedTemplateId)
    || filteredTemplates[0]
    || null;
  const hasActiveFilters = searchQuery !== ''
    || filters.framework !== 'all'
    || filters.category !== 'all'
    || filters.review !== 'all';

  const changeTab = (tab) => {
    const nextParams = new URLSearchParams(searchParams);
    if (tab === 'categories') nextParams.set('tab', 'categories');
    else nextParams.delete('tab');
    setSearchParams(nextParams);
  };

  const updateFilter = (filterName, value) => {
    setFilters((current) => ({ ...current, [filterName]: value }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters(initialFilters);
  };

  const showPrototypeNotice = (action) => {
    setNotice(`${action} is not connected in this prototype. No records were created or changed.`);
  };

  const openPreview = (template, trigger) => {
    setSelectedTemplateId(template.id);
    previewTriggerRef.current = trigger;
    setPreviewTemplate(template);
  };

  const useTemplate = (template) => {
    showPrototypeNotice(`Use template${template ? ` · ${template.code}` : ''}`);
    setPreviewTemplate(null);
  };

  return (
    <section className="policy-library-page" aria-label="Policy Library">
      <nav className="library-tabs" aria-label="Policy Library sections">
        <button type="button" className={activeTab === 'templates' ? 'is-active' : ''} aria-current={activeTab === 'templates' ? 'page' : undefined} onClick={() => changeTab('templates')}>
          Templates <span>{policyLibraryTemplates.length}</span>
        </button>
        <button type="button" className={activeTab === 'categories' ? 'is-active' : ''} aria-current={activeTab === 'categories' ? 'page' : undefined} onClick={() => changeTab('categories')}>
          Categories <span>{policyLibraryCategories.length}</span>
        </button>
      </nav>

      {activeTab === 'categories' ? (
        <CategoryPlaceholder />
      ) : (
        <>
          <header className="library-page-heading">
            <div>
              <h1>Template directory</h1>
              <p>Maintained policy templates across HIPAA and NIST CSF 2.0.</p>
            </div>
            <button className="library-new-template" type="button" onClick={() => showPrototypeNotice('New template')}>
              <Plus size={16} aria-hidden="true" /> New template
            </button>
          </header>

          <p className="library-prototype-note">Production-derived catalogue snapshot. Actions do not create or change records.</p>

          <div className="library-workspace">
            <section className="library-directory" aria-labelledby="library-directory-title">
              <header className="library-directory-heading">
                <div>
                  <h2 id="library-directory-title">Templates</h2>
                  <p>Search by name or reference and combine the verified filters.</p>
                </div>
                <span className="library-result-count">{filteredTemplates.length}<span> / {policyLibraryTemplates.length}</span></span>
              </header>

              <div className="library-controls">
                <label className="library-search" htmlFor={searchId}>
                  <Search size={16} aria-hidden="true" />
                  <input id={searchId} type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search by name or code..." />
                </label>
                <label className="library-filter" htmlFor={frameworkId}>
                  <span>Framework</span>
                  <select id={frameworkId} value={filters.framework} onChange={(event) => updateFilter('framework', event.target.value)}>
                    <option value="all">All frameworks</option>
                    {policyLibraryFilters.frameworks.map((framework) => <option key={framework} value={framework}>{framework}</option>)}
                  </select>
                  <ChevronDown size={14} aria-hidden="true" />
                </label>
                <label className="library-filter" htmlFor={categoryId}>
                  <span>Category</span>
                  <select id={categoryId} value={filters.category} onChange={(event) => updateFilter('category', event.target.value)}>
                    <option value="all">All categories</option>
                    {policyLibraryFilters.categories.map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                  <ChevronDown size={14} aria-hidden="true" />
                </label>
                <label className="library-filter" htmlFor={reviewId}>
                  <span>Review</span>
                  <select id={reviewId} value={filters.review} onChange={(event) => updateFilter('review', event.target.value)}>
                    <option value="all">Any review</option>
                    {policyLibraryFilters.reviews.map((review) => <option key={review} value={review}>{review}</option>)}
                  </select>
                  <ChevronDown size={14} aria-hidden="true" />
                </label>
                {hasActiveFilters && <button className="library-clear-filters" type="button" onClick={clearFilters}>Clear filters</button>}
              </div>

              <p className="library-showing" aria-live="polite">Showing {filteredTemplates.length} of {policyLibraryTemplates.length} templates.</p>

              {filteredTemplates.length ? (
                <div className="library-template-list">
                  {filteredTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      selected={selectedTemplate?.id === template.id}
                      onSelect={setSelectedTemplateId}
                      onPreview={openPreview}
                      onUse={useTemplate}
                    />
                  ))}
                </div>
              ) : (
                <div className="library-empty-results">
                  <div><Search size={18} aria-hidden="true" /></div>
                  <h3>No matching templates</h3>
                  <p>Try adjusting your search or filters.</p>
                  <button type="button" onClick={clearFilters}>Clear filters</button>
                </div>
              )}
            </section>

            <TemplateInspector template={selectedTemplate} onUse={useTemplate} />
          </div>
        </>
      )}

      {activeTab === 'templates' && previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUse={useTemplate}
          dialogRef={previewDialogRef}
          closeButtonRef={previewCloseButtonRef}
          titleId={previewTitleId}
        />
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
