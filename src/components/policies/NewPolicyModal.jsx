import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import {
  getPolicyControlKey,
  policyControlFrameworks,
} from '../../data/policyControlsData.js';
import PolicyControlsSelector from './PolicyControlsSelector.jsx';
import PolicyTagsInput from './PolicyTagsInput.jsx';
import './NewPolicyModal.css';

const policyStatusOptions = ['DRAFT', 'REVIEW', 'APPROVED', 'EXPIRED'];

const controlByKey = new Map(policyControlFrameworks.flatMap(({ framework, controls }) =>
  controls.map((control) => [getPolicyControlKey(framework, control.id), { ...control, framework }]),
));

function createInitialForm() {
  return {
    title: '',
    version: '1.0',
    status: 'DRAFT',
    domain: '',
    owner: '',
    reviewDate: '',
    content: '',
    selectedControlKeys: [],
    tags: [],
  };
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export default function NewPolicyModal({ onClose, onCreate, triggerRef }) {
  const modalRef = useRef(null);
  const titleInputRef = useRef(null);
  const reviewDateInputRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();
  const [form, setForm] = useState(createInitialForm);
  const [errors, setErrors] = useState({});
  const frameworkControls = useMemo(
    () => form.selectedControlKeys.map((key) => controlByKey.get(key)).filter(Boolean),
    [form.selectedControlKeys],
  );

  useEffect(() => {
    const trigger = triggerRef?.current;
    document.body.classList.add('policy-modal-open');
    titleInputRef.current?.focus({ preventScroll: true });

    return () => {
      document.body.classList.remove('policy-modal-open');
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [triggerRef]);

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    if (name === 'title' && value.trim()) setErrors((current) => ({ ...current, title: undefined }));
    if (name === 'reviewDate' && (!value || isValidDate(value))) setErrors((current) => ({ ...current, reviewDate: undefined }));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== 'Tab' || !modalRef.current) return;

    const focusable = [...modalRef.current.querySelectorAll(
      'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
    )].filter((element) => element.getClientRects().length > 0 && element.getAttribute('aria-hidden') !== 'true');
    if (!focusable.length) {
      event.preventDefault();
      modalRef.current.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || !modalRef.current.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !modalRef.current.contains(document.activeElement))) {
      event.preventDefault();
      first.focus();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Enter a policy title.';
    if (form.reviewDate && !isValidDate(form.reviewDate)) nextErrors.reviewDate = 'Enter a valid review date.';

    const uniqueControlKeys = new Set(form.selectedControlKeys);
    if (uniqueControlKeys.size !== form.selectedControlKeys.length
      || form.selectedControlKeys.some((key) => !controlByKey.has(key))) {
      nextErrors.controls = 'Remove any control that is not in the audited framework list.';
    }

    const normalizedTags = form.tags.map((tag) => tag.trim().toLocaleLowerCase());
    if (normalizedTags.some((tag) => !tag) || new Set(normalizedTags).size !== normalizedTags.length) {
      nextErrors.tags = 'Tags must be present and unique.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      if (nextErrors.title) titleInputRef.current?.focus();
      else if (nextErrors.reviewDate) reviewDateInputRef.current?.focus();
      return;
    }

    onCreate({
      ...form,
      title: form.title.trim(),
      version: form.version.trim(),
      domain: form.domain.trim(),
      owner: form.owner.trim(),
      content: form.content.trim(),
      controls: frameworkControls,
    });
  };

  return createPortal(
    <div
      className="policy-modal__backdrop"
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div
        className="policy-modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <form className="policy-modal__form" noValidate onSubmit={handleSubmit}>
          <header className="policy-modal__header">
            <div>
              <h2 className="policy-modal__title" id={titleId}>New Policy</h2>
              <p className="policy-modal__subtitle" id={descriptionId}>
                Add a policy and map it to the controls it supports.
              </p>
            </div>
            <button className="policy-modal__close" type="button" aria-label="Close New Policy form" onClick={onClose}>
              <X aria-hidden="true" size={18} />
            </button>
          </header>

          <div className="policy-modal__body">
            <section className="policy-modal__section" aria-labelledby={`${titleId}-general`}>
              <h3 className="policy-modal__section-title" id={`${titleId}-general`}>General information</h3>
              <div className="policy-modal__field-grid">
                <div className="policy-modal__field policy-modal__field--full">
                  <label htmlFor={`${titleId}-policy-title`}>Title <span className="policy-modal__required" aria-hidden="true">*</span></label>
                  <input
                    id={`${titleId}-policy-title`}
                    ref={titleInputRef}
                    type="text"
                    placeholder="Policy title"
                    value={form.title}
                    aria-required="true"
                    aria-invalid={Boolean(errors.title)}
                    aria-describedby={errors.title ? `${titleId}-title-error` : undefined}
                    onChange={(event) => updateField('title', event.target.value)}
                    onBlur={() => { if (!form.title.trim()) setErrors((current) => ({ ...current, title: 'Enter a policy title.' })); }}
                  />
                  {errors.title && <p className="policy-modal__error" id={`${titleId}-title-error`} role="alert">{errors.title}</p>}
                </div>

                <div className="policy-modal__field">
                  <label htmlFor={`${titleId}-version`}>Version</label>
                  <input id={`${titleId}-version`} type="text" placeholder="1.0" value={form.version} onChange={(event) => updateField('version', event.target.value)} />
                </div>
                <div className="policy-modal__field">
                  <label htmlFor={`${titleId}-status`}>Status</label>
                  <select id={`${titleId}-status`} value={form.status} onChange={(event) => updateField('status', event.target.value)}>
                    {policyStatusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </div>
                <div className="policy-modal__field">
                  <label htmlFor={`${titleId}-domain`}>Domain</label>
                  <input id={`${titleId}-domain`} type="text" placeholder="e.g. Data Protection" value={form.domain} onChange={(event) => updateField('domain', event.target.value)} />
                </div>
                <div className="policy-modal__field">
                  <label htmlFor={`${titleId}-owner`}>Owner</label>
                  <input id={`${titleId}-owner`} type="text" placeholder="Policy owner" value={form.owner} onChange={(event) => updateField('owner', event.target.value)} />
                </div>
                <div className="policy-modal__field">
                  <label htmlFor={`${titleId}-review-date`}>Review Date</label>
                  <input
                    id={`${titleId}-review-date`}
                    ref={reviewDateInputRef}
                    type="date"
                    value={form.reviewDate}
                    aria-invalid={Boolean(errors.reviewDate)}
                    aria-describedby={errors.reviewDate ? `${titleId}-date-error` : undefined}
                    onChange={(event) => updateField('reviewDate', event.target.value)}
                  />
                  {errors.reviewDate && <p className="policy-modal__error" id={`${titleId}-date-error`} role="alert">{errors.reviewDate}</p>}
                </div>
              </div>
            </section>

            <section className="policy-modal__section" aria-labelledby={`${titleId}-content`}>
              <h3 className="policy-modal__section-title" id={`${titleId}-content`}>Content</h3>
              <div className="policy-modal__field">
                <label className="visually-hidden" htmlFor={`${titleId}-policy-content`}>Policy content</label>
                  <textarea
                  id={`${titleId}-policy-content`}
                  rows="4"
                    placeholder="Policy content..."
                  value={form.content}
                  onChange={(event) => updateField('content', event.target.value)}
                />
              </div>
            </section>

            <section className="policy-modal__section" aria-labelledby={`${titleId}-controls`}>
              <div className="policy-modal__section-heading">
                <h3 className="policy-modal__section-title" id={`${titleId}-controls`}>Controls this policy implements</h3>
                <span className="policy-modal__section-meta">Search and select controls</span>
              </div>
              <PolicyControlsSelector
                selectedKeys={form.selectedControlKeys}
                onChange={(selectedControlKeys) => {
                  setForm((current) => ({ ...current, selectedControlKeys }));
                  setErrors((current) => ({ ...current, controls: undefined }));
                }}
                error={errors.controls}
              />
            </section>

            <section className="policy-modal__section" aria-labelledby={`${titleId}-tags`}>
              <div className="policy-modal__section-heading">
                <h3 className="policy-modal__section-title" id={`${titleId}-tags`}>Tags</h3>
                <span className="policy-modal__section-meta">Add existing or new tags</span>
              </div>
              <PolicyTagsInput
                selectedTags={form.tags}
                onChange={(tags) => {
                  setForm((current) => ({ ...current, tags }));
                  setErrors((current) => ({ ...current, tags: undefined }));
                }}
                error={errors.tags}
              />
            </section>
          </div>

          <footer className="policy-modal__footer">
            <button className="policy-modal__button policy-modal__button--quiet" type="button" onClick={onClose}>Cancel</button>
            <button className="policy-modal__button policy-modal__button--primary" type="submit">Create Policy</button>
          </footer>
        </form>
      </div>
    </div>,
    document.body,
  );
}
