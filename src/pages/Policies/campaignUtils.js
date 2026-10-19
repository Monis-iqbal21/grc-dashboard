export function getCompletionLabel(completion) {
  const value = completion.toFixed(1);
  return `${value.endsWith('.0') ? value.slice(0, -2) : value}%`;
}

export function formatCampaignDate(value) {
  if (!value) return 'Not scheduled';
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    .format(new Date(year, month - 1, day));
}
