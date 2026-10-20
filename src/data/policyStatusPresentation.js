const statusPresentation = {
  DRAFT: { label: 'Draft', tone: 'draft' },
  REVIEW: { label: 'Review', tone: 'pending-review' },
  APPROVED: { label: 'Approved', tone: 'published' },
  EXPIRED: { label: 'Expired', tone: 'unknown' },
  Draft: { label: 'Draft', tone: 'draft' },
  'Pending Review': { label: 'Pending Review', tone: 'pending-review' },
  Published: { label: 'Published', tone: 'published' },
};

export function getPolicyStatusPresentation(status) {
  return statusPresentation[status] || { label: status || 'Not provided', tone: 'unknown' };
}

export function isDraftPolicyStatus(status) {
  return status === 'DRAFT' || status === 'Draft';
}
