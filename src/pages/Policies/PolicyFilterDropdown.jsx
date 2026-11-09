import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export default function PolicyFilterDropdown({ label, value, options, onChange, icon, className = '' }) {
  const id = useId();
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
    if (option.value !== value) onChange(option.value);
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
      className={`policy-filter-dropdown${className ? ` ${className}` : ''}${isOpen ? ' is-open' : ''}`}
      ref={wrapperRef}
      onBlur={(event) => {
        if (!wrapperRef.current?.contains(event.relatedTarget)) setIsOpen(false);
      }}
    >
      <span className="visually-hidden" id={labelId}>{label}</span>
      <button
        ref={triggerRef}
        className="policy-filter-trigger"
        type="button"
        aria-labelledby={`${labelId} ${valueId}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        onClick={() => (isOpen ? setIsOpen(false) : openMenu())}
        onKeyDown={handleTriggerKeyDown}
      >
        {icon && <span className="policy-filter-icon" aria-hidden="true">{icon}</span>}
        <span className="policy-filter-value" id={valueId}>{selectedOption?.label}</span>
        <ChevronDown className="policy-filter-chevron" aria-hidden="true" size={14} />
      </button>
      {isOpen && (
        <div
          ref={listboxRef}
          className="policy-filter-menu"
          id={listboxId}
          role="listbox"
          tabIndex={0}
          aria-labelledby={labelId}
          aria-activedescendant={`${listboxId}-option-${activeIndex}`}
          onKeyDown={handleListboxKeyDown}
        >
          {options.map((option, index) => (
            <div
              className={`policy-filter-option${index === activeIndex ? ' is-active' : ''}${option.value === value ? ' is-selected' : ''}`}
              id={`${listboxId}-option-${index}`}
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onMouseMove={() => setActiveIndex(index)}
              onClick={() => selectOption(index)}
            >
              <span>{option.label}</span>
              {option.value === value && <Check aria-hidden="true" size={16} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
