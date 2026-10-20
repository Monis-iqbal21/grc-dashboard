import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import {
  acknowledgementMethodOptions,
  campaignEligiblePolicies,
  initialCampaignForm,
} from '../../data/campaignFormData.js';
import './NewPolicyModal.css';
import './NewCampaignModal.css';

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function CheckboxField({ id, checked, onChange, label, helper, helperId }) {
  return (
    <div className="campaign-modal__checkbox-field">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        aria-describedby={helper ? helperId : undefined}
        onChange={(event) => onChange(event.target.checked)}
      />
      <div>
        <label htmlFor={id}>{label}</label>
        {helper && <p className="campaign-modal__helper" id={helperId}>{helper}</p>}
      </div>
    </div>
  );
}

export default function NewCampaignModal({ onClose, onCreate, triggerRef }) {
  const modalRef = useRef(null);
  const nameInputRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();
  const [form, setForm] = useState(() => ({ ...initialCampaignForm }));
  const selectedPolicy = useMemo(
    () => campaignEligiblePolicies.find((policy) => policy.value === form.policyId) ?? null,
    [form.policyId],
  );
  const selectedMethod = acknowledgementMethodOptions.find((method) => method.value === form.acknowledgementMethod);
  const gracePeriodIsValid = form.gracePeriodDays === ''
    || (Number.isFinite(Number(form.gracePeriodDays)) && Number(form.gracePeriodDays) >= 0);
  const canCreate = Boolean(
    form.name.trim()
    && selectedPolicy
    && isValidDate(form.deadline)
    && gracePeriodIsValid,
  );

  useEffect(() => {
    const trigger = triggerRef?.current;
    document.body.classList.add('policy-modal-open');
    nameInputRef.current?.focus({ preventScroll: true });

    return () => {
      document.body.classList.remove('policy-modal-open');
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [triggerRef]);

  const updateField = (name, value) => setForm((current) => ({ ...current, [name]: value }));

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
    if (!canCreate || !selectedPolicy) return;

    onCreate({
      ...form,
      name: form.name.trim(),
      gracePeriodDays: form.gracePeriodDays === '' ? 0 : Number(form.gracePeriodDays),
      roles: form.everyoneInOrganisation ? '' : form.roles,
      departments: form.everyoneInOrganisation ? '' : form.departments,
      policy: selectedPolicy,
    });
  };

  const campaignNameId = `${titleId}-name`;
  const policyId = `${titleId}-policy`;
  const deadlineId = `${titleId}-deadline`;
  const graceId = `${titleId}-grace`;
  const methodId = `${titleId}-method`;
  const declarationId = `${titleId}-declaration`;
  const everyoneId = `${titleId}-everyone`;
  const rolesId = `${titleId}-roles`;
  const departmentsId = `${titleId}-departments`;
  const scrollId = `${titleId}-scroll`;
  const passwordId = `${titleId}-password`;
  const remindersId = `${titleId}-reminders`;

  return createPortal(
    <div
      className="policy-modal__backdrop"
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div
        className="policy-modal campaign-modal"
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
              <h2 className="policy-modal__title" id={titleId}>New acknowledgement campaign</h2>
              <p className="policy-modal__subtitle" id={descriptionId}>
                Create a draft configuration for a policy acknowledgment campaign.
              </p>
            </div>
            <button className="policy-modal__close" type="button" aria-label="Close New acknowledgement campaign form" onClick={onClose}>
              <X aria-hidden="true" size={18} />
            </button>
          </header>

          <div className="policy-modal__body campaign-modal__body">
            <div className="policy-modal__field policy-modal__field--full">
              <label htmlFor={campaignNameId}>Campaign name <span className="policy-modal__required" aria-hidden="true">*</span></label>
              <input
                id={campaignNameId}
                ref={nameInputRef}
                type="text"
                required
                aria-required="true"
                placeholder="e.g. Acceptable Use — annual 2026"
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
              />
            </div>

            <div className="policy-modal__field policy-modal__field--full">
              <label htmlFor={policyId}>Policy <span className="policy-modal__required" aria-hidden="true">*</span></label>
              <select
                id={policyId}
                required
                aria-required="true"
                value={form.policyId}
                onChange={(event) => updateField('policyId', event.target.value)}
              >
                <option value="">Choose an approved policy…</option>
                {campaignEligiblePolicies.map((policy) => (
                  <option key={policy.value} value={policy.value}>{policy.label}</option>
                ))}
              </select>
              <p className="campaign-modal__helper">Only approved policies can carry a campaign.</p>
            </div>

            <div className="policy-modal__field-grid">
              <div className="policy-modal__field">
                <label htmlFor={deadlineId}>Deadline <span className="policy-modal__required" aria-hidden="true">*</span></label>
                <input
                  id={deadlineId}
                  type="date"
                  required
                  aria-required="true"
                  value={form.deadline}
                  onChange={(event) => updateField('deadline', event.target.value)}
                />
              </div>
              <div className="policy-modal__field">
                <label htmlFor={graceId}>Grace period (days)</label>
                <input
                  id={graceId}
                  type="number"
                  min="0"
                  value={form.gracePeriodDays}
                  onChange={(event) => updateField('gracePeriodDays', event.target.value === '' ? '' : Number(event.target.value))}
                  aria-describedby={`${graceId}-help`}
                />
                <p className="campaign-modal__helper" id={`${graceId}-help`}>Days after the deadline before someone counts as overdue.</p>
              </div>
            </div>

            <div className="policy-modal__field policy-modal__field--full">
              <label htmlFor={methodId}>How people acknowledge</label>
              <select id={methodId} value={form.acknowledgementMethod} onChange={(event) => updateField('acknowledgementMethod', event.target.value)}>
                {acknowledgementMethodOptions.map((method) => (
                  <option key={method.value} value={method.value}>{method.label}</option>
                ))}
              </select>
              <p className="campaign-modal__helper" aria-live="polite">{selectedMethod?.helper}</p>
            </div>

            <div className="policy-modal__field policy-modal__field--full">
              <label htmlFor={declarationId}>Declaration</label>
              <textarea
                id={declarationId}
                rows="3"
                value={form.declaration}
                onChange={(event) => updateField('declaration', event.target.value)}
                aria-describedby={`${declarationId}-help`}
              />
              <p className="campaign-modal__helper" id={`${declarationId}-help`}>
                The exact sentence recorded against each person. It is shown above the button they press.
              </p>
            </div>

            <div className="campaign-modal__option-group">
              <CheckboxField
                id={everyoneId}
                checked={form.everyoneInOrganisation}
                onChange={(value) => updateField('everyoneInOrganisation', value)}
                label="Everyone in the organisation"
                helper="The audience is fixed when the campaign launches, so later joiners do not change the completion figure after the fact."
                helperId={`${everyoneId}-help`}
              />
              {!form.everyoneInOrganisation && (
                <div className="policy-modal__field-grid campaign-modal__audience-fields">
                  <div className="policy-modal__field">
                    <label htmlFor={rolesId}>Roles</label>
                    <input id={rolesId} type="text" placeholder="CISO, ANALYST" value={form.roles} onChange={(event) => updateField('roles', event.target.value)} />
                    <p className="campaign-modal__helper">Comma separated.</p>
                  </div>
                  <div className="policy-modal__field">
                    <label htmlFor={departmentsId}>Departments</label>
                    <input id={departmentsId} type="text" placeholder="IT Security, Finance" value={form.departments} onChange={(event) => updateField('departments', event.target.value)} />
                    <p className="campaign-modal__helper">Comma separated.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="campaign-modal__option-group campaign-modal__checkbox-list">
              <CheckboxField
                id={scrollId}
                checked={form.requireScrollToEnd}
                onChange={(value) => updateField('requireScrollToEnd', value)}
                label="Require scrolling to the end before acknowledging"
              />
              <CheckboxField
                id={passwordId}
                checked={form.requirePasswordReentry}
                onChange={(value) => updateField('requirePasswordReentry', value)}
                label="Require password re-entry (high-sensitivity policies)"
              />
            </div>

            <div className="policy-modal__field policy-modal__field--full">
              <label htmlFor={remindersId}>Reminder days after launch</label>
              <input
                id={remindersId}
                type="text"
                placeholder="3, 7"
                value={form.reminderDaysAfterLaunch}
                onChange={(event) => updateField('reminderDaysAfterLaunch', event.target.value)}
                aria-describedby={`${remindersId}-help`}
              />
              <p className="campaign-modal__helper" id={`${remindersId}-help`}>
                Comma separated. Escalation to the line manager and CISO runs on its own schedule after the deadline.
              </p>
            </div>
          </div>

          <footer className="policy-modal__footer">
            <button className="policy-modal__button policy-modal__button--quiet" type="button" onClick={onClose}>Cancel</button>
            <button className="policy-modal__button policy-modal__button--primary" type="submit" disabled={!canCreate}>Create as draft</button>
          </footer>
        </form>
      </div>
    </div>,
    document.body,
  );
}
