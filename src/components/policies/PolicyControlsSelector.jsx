import { useId, useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import {
  getPolicyControlKey,
  policyControlCount,
  policyControlFrameworks,
} from '../../data/policyControlsData.js';

export default function PolicyControlsSelector({ selectedKeys, onChange, error }) {
  const idPrefix = useId().replaceAll(':', '');
  const [query, setQuery] = useState('');
  const [expandedFrameworks, setExpandedFrameworks] = useState(
    () => new Set(policyControlFrameworks.map(({ framework }) => framework)),
  );
  const selectedSet = useMemo(() => new Set(selectedKeys), [selectedKeys]);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visibleGroups = useMemo(() => policyControlFrameworks
    .map((group) => {
      const entries = group.controls.map((control, controlIndex) => ({ control, controlIndex }));
      if (!normalizedQuery) return { ...group, visibleControls: entries };
      const frameworkMatches = group.framework.toLocaleLowerCase().includes(normalizedQuery);
      const visibleControls = frameworkMatches
        ? entries
        : entries.filter(({ control }) =>
          control.id.toLocaleLowerCase().includes(normalizedQuery)
          || control.title.toLocaleLowerCase().includes(normalizedQuery));
      return { ...group, visibleControls };
    })
    .filter((group) => !normalizedQuery || group.visibleControls.length > 0), [normalizedQuery]);

  const toggleFramework = (framework) => {
    setExpandedFrameworks((current) => {
      const next = new Set(current);
      if (next.has(framework)) next.delete(framework);
      else next.add(framework);
      return next;
    });
  };

  const toggleControl = (framework, controlId, checked) => {
    const key = getPolicyControlKey(framework, controlId);
    const next = new Set(selectedKeys);
    if (checked) next.add(key);
    else next.delete(key);
    onChange([...next]);
  };

  const toggleFrameworkSelection = (framework, controls) => {
    const groupKeys = controls.map(({ id }) => getPolicyControlKey(framework, id));
    const isFullySelected = groupKeys.every((key) => selectedSet.has(key));
    const next = new Set(selectedKeys);
    if (isFullySelected) groupKeys.forEach((key) => next.delete(key));
    else groupKeys.forEach((key) => next.add(key));
    onChange([...next]);
  };

  return (
    <div className="policy-control-selector">
      <div className="policy-control-selector__summary">
        <label className="policy-control-selector__search">
          <Search aria-hidden="true" size={15} />
          <span className="visually-hidden">Search controls by framework, ID, or title</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search framework, ID, or title..."
          />
        </label>
        <span className="policy-control-selector__count" aria-live="polite">
          <strong>{selectedKeys.length}</strong> selected <span aria-hidden="true">/</span> {policyControlCount}
        </span>
      </div>

      <div className="policy-control-selector__list" aria-label="Framework control groups">
        {visibleGroups.length === 0 && <p className="policy-control-selector__empty">No matching controls.</p>}
        {visibleGroups.map((group, groupIndex) => {
          const panelId = `${idPrefix}-group-${groupIndex}`;
          const isExpanded = expandedFrameworks.has(group.framework);
          const selectedInGroup = group.controls.reduce(
            (count, control) => count + Number(selectedSet.has(getPolicyControlKey(group.framework, control.id))),
            0,
          );
          const allSelected = selectedInGroup === group.controls.length;

          return (
            <section className="policy-control-selector__group" key={group.framework}>
              <div className="policy-control-selector__group-header">
                <button
                  className="policy-control-selector__group-toggle"
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                  onClick={() => toggleFramework(group.framework)}
                >
                  <ChevronDown className={isExpanded ? '' : 'is-collapsed'} aria-hidden="true" size={15} />
                  <span>{group.framework}</span>
                  <span className="policy-control-selector__group-total">{group.controls.length}</span>
                  <span className="visually-hidden">, {selectedInGroup} selected</span>
                </button>
                <button
                  className="policy-control-selector__group-action"
                  type="button"
                  aria-label={`${allSelected ? 'Clear' : 'Select all'} ${group.controls.length} ${group.framework} controls`}
                  onClick={() => toggleFrameworkSelection(group.framework, group.controls)}
                >
                  {allSelected ? 'Clear' : 'Select all'}
                </button>
              </div>

              {isExpanded && (
                <div className="policy-control-selector__items" id={panelId} role="group" aria-label={`${group.framework} controls`}>
                  {group.visibleControls.map(({ control, controlIndex }) => {
                    const controlKey = getPolicyControlKey(group.framework, control.id);
                    const inputId = `${idPrefix}-control-${groupIndex}-${controlIndex}`;
                    return (
                      <label className="policy-control-selector__item" key={controlKey} htmlFor={inputId}>
                        <input
                          id={inputId}
                          type="checkbox"
                          checked={selectedSet.has(controlKey)}
                          onChange={(event) => toggleControl(group.framework, control.id, event.target.checked)}
                        />
                        <span className="policy-control-selector__item-id">{control.id}</span>
                        <span className="policy-control-selector__item-title">{control.title}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>
      {error && <p className="policy-modal__error" role="alert">{error}</p>}
    </div>
  );
}
