import { useId, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { policyTagsData } from '../../data/policyTagsData.js';

export default function PolicyTagsInput({ selectedTags, onChange, error }) {
  const listId = useId();
  const [availableTags, setAvailableTags] = useState(policyTagsData);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const selectedTagSet = useMemo(
    () => new Set(selectedTags.map((tag) => tag.toLocaleLowerCase())),
    [selectedTags],
  );
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const suggestions = useMemo(() => {
    const existing = availableTags
      .filter((tag) => !selectedTagSet.has(tag.toLocaleLowerCase()))
      .filter((tag) => !normalizedQuery || tag.toLocaleLowerCase().includes(normalizedQuery));
    const exactMatch = availableTags.some((tag) => tag.toLocaleLowerCase() === normalizedQuery);
    const canCreate = Boolean(query.trim()) && !exactMatch && !selectedTagSet.has(normalizedQuery);
    return [
      ...existing.map((tag) => ({ tag, create: false })),
      ...(canCreate ? [{ tag: query.trim(), create: true }] : []),
    ];
  }, [availableTags, normalizedQuery, query, selectedTagSet]);

  const addTag = (requestedTag) => {
    const cleanedTag = requestedTag.trim();
    if (!cleanedTag) return;
    const matchingTag = availableTags.find((tag) => tag.toLocaleLowerCase() === cleanedTag.toLocaleLowerCase());
    const tag = matchingTag || cleanedTag;
    if (!selectedTagSet.has(tag.toLocaleLowerCase())) onChange([...selectedTags, tag]);
    if (!matchingTag) setAvailableTags((current) => [...current, tag]);
    setQuery('');
    setActiveIndex(0);
    setIsOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown' && suggestions.length) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => (current + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp' && suggestions.length) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => (current - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === 'Enter' && query.trim()) {
      event.preventDefault();
      addTag(suggestions[activeIndex]?.tag || query);
    } else if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      setIsOpen(false);
    } else if (event.key === 'Backspace' && !query && selectedTags.length) {
      onChange(selectedTags.slice(0, -1));
    }
  };

  return (
    <div className="policy-tags" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
    }}>
      <div className="policy-tags__input-wrap">
        {selectedTags.map((tag) => (
          <span className="policy-tags__chip" key={tag}>
            {tag}
            <button
              className="policy-tags__remove"
              type="button"
              aria-label={`Remove ${tag} tag`}
              onClick={() => onChange(selectedTags.filter((selected) => selected !== tag))}
            >
              <X aria-hidden="true" size={13} />
            </button>
          </span>
        ))}
        <input
          type="text"
          role="combobox"
          aria-label="Search or create policy tags"
          aria-autocomplete="list"
          aria-expanded={isOpen && suggestions.length > 0}
          aria-controls={listId}
          aria-activedescendant={isOpen && suggestions.length ? `${listId}-option-${activeIndex}` : undefined}
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); setIsOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder={selectedTags.length ? 'Add a tag...' : 'Search or create a tag...'}
        />
      </div>
      {isOpen && suggestions.length > 0 && (
        <div className="policy-tags__suggestions" id={listId} role="listbox" aria-label="Available tags">
          {suggestions.map(({ tag, create }, index) => (
            <button
              className={`policy-tags__suggestion${activeIndex === index ? ' is-active' : ''}`}
              id={`${listId}-option-${index}`}
              key={`${create ? 'new' : 'tag'}-${tag}`}
              type="button"
              role="option"
              aria-selected={activeIndex === index}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => addTag(tag)}
            >
              {create ? `Create “${tag}”` : tag}
            </button>
          ))}
        </div>
      )}
      {error && <p className="policy-modal__error" role="alert">{error}</p>}
    </div>
  );
}
