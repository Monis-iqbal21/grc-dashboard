const taskSearchFields = {
  assigned_to: { get: (task) => task.assigneeName, type: 'text' },
  created: { get: (task) => task.createdAt, type: 'date' },
  description: { get: (task) => task.description, type: 'text' },
  due_date: { get: (task) => task.dueDate, type: 'date' },
  priority: { get: (task) => task.priority, type: 'text' },
  ref: { get: (task) => task.id, type: 'text' },
  responded: { get: (task) => task.respondedAt, type: 'date' },
  sent: { get: (task) => task.sentAt, type: 'date' },
  source_ref: { get: (task) => task.relatedRef, type: 'text' },
  source_type: { get: (task) => task.relatedType, type: 'text' },
  status: { get: (task) => task.status, type: 'text' },
  tags: { get: (task) => task.tags, type: 'list' },
  title: { get: (task) => task.title, type: 'text' },
  updated: { get: (task) => task.updatedAt, type: 'date' },
  verified_by: { get: (task) => task.verifiedBy, type: 'text' },
};

const normalize = (value) => String(value ?? '').trim().toLowerCase();

function tokenize(query) {
  const tokens = [];
  const expression = /"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)'|(\.\.|!=|>=|<=|[():,=<>])|([^\s():,=<>!]+)/g;
  let match;
  while ((match = expression.exec(query))) {
    if (match[1] !== undefined) tokens.push({ value: match[1].replace(/\\(["\\])/g, '$1'), quoted: true });
    else if (match[2] !== undefined) tokens.push({ value: match[2].replace(/\\(['\\])/g, '$1'), quoted: true });
    else tokens.push({ value: match[3] ?? match[4], quoted: false });
  }
  return tokens;
}

function parseValue(tokens, cursor) {
  const token = tokens[cursor.index];
  if (!token) return '';
  cursor.index += 1;
  const first = normalize(token.value);
  if (!token.quoted && ['last', 'next', 'expiring'].includes(first)) {
    const amount = tokens[cursor.index];
    if (amount && !['and', 'or'].includes(normalize(amount.value))) {
      cursor.index += 1;
      return `${first} ${amount.value}`;
    }
  }
  return token.value;
}

function dateMatches(value, keyword) {
  if (!value) return keyword === 'is empty';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfValue = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const deltaDays = Math.floor((startOfValue - startOfToday) / 86400000);
  const normalizedKeyword = normalize(keyword);
  if (normalizedKeyword === 'overdue') return startOfValue < startOfToday;
  if (normalizedKeyword === 'today') return deltaDays === 0;
  if (normalizedKeyword === 'yesterday') return deltaDays === -1;
  const period = normalizedKeyword.match(/^(last|next|expiring)\s+(\d+)(d|m)?$/);
  if (period) {
    const [, direction, amountText, unit] = period;
    const days = unit === 'm' ? Number(amountText) * 30 : Number(amountText);
    return direction === 'last'
      ? deltaDays <= 0 && deltaDays >= -days
      : deltaDays >= 0 && deltaDays <= days;
  }
  const currentPeriod = {
    this_week: () => deltaDays >= -((now.getDay() + 6) % 7) && deltaDays < 7 - ((now.getDay() + 6) % 7),
    this_month: () => date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth(),
    this_quarter: () => date.getFullYear() === now.getFullYear() && Math.floor(date.getMonth() / 3) === Math.floor(now.getMonth() / 3),
    this_year: () => date.getFullYear() === now.getFullYear(),
  }[normalizedKeyword];
  return currentPeriod ? currentPeriod() : false;
}

function compareValues(actual, operator, expected, fieldType) {
  if (fieldType === 'date' && ['=', '!='].includes(operator) && /^\d{4}-\d{2}-\d{2}$/.test(expected)) {
    const actualDate = String(actual ?? '').slice(0, 10);
    return operator === '=' ? actualDate === expected : actualDate !== expected;
  }
  if (fieldType === 'date' && ![':', '!=', '='].includes(operator) && !/^\d{4}-\d{2}-\d{2}$/.test(expected)) {
    return dateMatches(actual, expected);
  }
  const leftNumber = Number(actual);
  const rightNumber = Number(expected);
  const useNumbers = String(actual ?? '').trim() !== '' && String(expected).trim() !== ''
    && Number.isFinite(leftNumber) && Number.isFinite(rightNumber);
  const left = useNumbers ? leftNumber : normalize(actual);
  const right = useNumbers ? rightNumber : normalize(expected);
  if (operator === ':') return normalize(actual).includes(normalize(expected));
  if (operator === '=') return left === right;
  if (operator === '!=') return left !== right;
  if (operator === '>') return left > right;
  if (operator === '>=') return left >= right;
  if (operator === '<') return left < right;
  if (operator === '<=') return left <= right;
  return false;
}

function evaluatePredicate(task, fieldName, operator, value, rangeEnd) {
  const field = taskSearchFields[fieldName];
  if (!field) return false;
  const actual = field.get(task);
  const values = Array.isArray(actual) ? actual : [actual];
  if (operator === 'is empty') return values.every((item) => !String(item ?? '').trim());
  if (operator === 'is set') return values.some((item) => Boolean(String(item ?? '').trim()));
  if (operator === 'has') return Array.isArray(actual) && actual.some((item) => normalize(item) === normalize(value));
  if (operator === 'in') return values.some((item) => value.some((candidate) => normalize(item) === normalize(candidate)));
  if (operator === 'between') {
    return values.some((item) => {
      if (!item) return false;
      const itemNumber = Number(item);
      const startNumber = Number(value);
      const endNumber = Number(rangeEnd);
      if ([itemNumber, startNumber, endNumber].every(Number.isFinite)) return itemNumber >= startNumber && itemNumber <= endNumber;
      return String(item) >= String(value) && String(item) <= String(rangeEnd);
    });
  }
  if (field.type === 'date' && ![':', '!=', '='].includes(operator)) {
    return values.some((item) => dateMatches(item, value));
  }
  return values.some((item) => compareValues(item, operator, value, field.type));
}

function parsePredicate(tokens, cursor) {
  const first = tokens[cursor.index];
  if (!first) return () => true;
  const fieldName = normalize(first.value);
  if (taskSearchFields[fieldName] && !first.quoted) {
    cursor.index += 1;
    const next = tokens[cursor.index];
    const nextValue = normalize(next?.value);
    if (nextValue === 'is') {
      cursor.index += 1;
      const condition = normalize(tokens[cursor.index]?.value);
      cursor.index += 1;
      if (condition !== 'empty' && condition !== 'set') return () => false;
      return (task) => evaluatePredicate(task, fieldName, condition === 'empty' ? 'is empty' : 'is set', '');
    }
    if (nextValue === 'has') {
      cursor.index += 1;
      const value = parseValue(tokens, cursor);
      return (task) => evaluatePredicate(task, fieldName, 'has', value);
    }
    if (nextValue === 'in') {
      cursor.index += 1;
      const values = [];
      if (tokens[cursor.index]?.value === '(') cursor.index += 1;
      while (cursor.index < tokens.length && tokens[cursor.index].value !== ')') {
        if (tokens[cursor.index].value !== ',') values.push(parseValue(tokens, cursor));
        else cursor.index += 1;
      }
      if (tokens[cursor.index]?.value === ')') cursor.index += 1;
      return (task) => evaluatePredicate(task, fieldName, 'in', values);
    }
    if (nextValue === 'between') {
      cursor.index += 1;
      const start = parseValue(tokens, cursor);
      if (tokens[cursor.index]?.value === '..') cursor.index += 1;
      const end = parseValue(tokens, cursor);
      return (task) => evaluatePredicate(task, fieldName, 'between', start, end);
    }
    if ([':', '=', '!=', '>', '>=', '<', '<='].includes(next?.value)) {
      const operator = next.value;
      cursor.index += 1;
      const value = parseValue(tokens, cursor);
      return (task) => evaluatePredicate(task, fieldName, operator, value);
    }
    if (['overdue', 'today', 'yesterday', 'last', 'next', 'this_week', 'this_month', 'this_quarter', 'this_year', 'expiring'].includes(nextValue)) {
      const value = parseValue(tokens, cursor);
      return (task) => dateMatches(taskSearchFields[fieldName].get(task), value);
    }
    return () => false;
  }

  const phrase = [];
  while (cursor.index < tokens.length) {
    const token = tokens[cursor.index];
    const value = normalize(token.value);
    if (value === 'and' || value === 'or' || token.value === ')') break;
    phrase.push(token.value);
    cursor.index += 1;
  }
  const needle = normalize(phrase.join(' '));
  return (task) => normalize(`${task.title} ${task.description}`).includes(needle);
}

function parseFactor(tokens, cursor) {
  if (normalize(tokens[cursor.index]?.value) === 'not') {
    cursor.index += 1;
    const nested = parseFactor(tokens, cursor);
    return (task) => !nested(task);
  }
  if (tokens[cursor.index]?.value === '(') {
    cursor.index += 1;
    const nested = parseOr(tokens, cursor);
    if (tokens[cursor.index]?.value === ')') cursor.index += 1;
    return nested;
  }
  return parsePredicate(tokens, cursor);
}

function parseAnd(tokens, cursor) {
  let left = parseFactor(tokens, cursor);
  while (normalize(tokens[cursor.index]?.value) === 'and') {
    cursor.index += 1;
    const right = parseFactor(tokens, cursor);
    const previous = left;
    left = (task) => previous(task) && right(task);
  }
  return left;
}

function parseOr(tokens, cursor) {
  let left = parseAnd(tokens, cursor);
  while (normalize(tokens[cursor.index]?.value) === 'or') {
    cursor.index += 1;
    const right = parseAnd(tokens, cursor);
    const previous = left;
    left = (task) => previous(task) || right(task);
  }
  return left;
}

export function matchesTaskQuery(task, query) {
  const trimmed = query.trim();
  if (!trimmed) return true;
  const tokens = tokenize(trimmed);
  if (!tokens.length) return true;
  const cursor = { index: 0 };
  const predicate = parseOr(tokens, cursor);
  if (cursor.index < tokens.length) {
    const remaining = normalize(tokens.slice(cursor.index).map((token) => token.value).join(' '));
    if (remaining) return false;
  }
  return predicate(task);
}
