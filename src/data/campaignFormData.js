// Read-only production-audited options for the local campaign form prototype.
// These examples are intentionally separate from the mock policy registry.
export const campaignEligiblePolicies = [
  {
    value: '2',
    reference: 'POL-002',
    title: 'Asset Management Policy v1.0',
    label: 'POL-002 · Asset Management Policy v1.0',
  },
  {
    value: '1',
    reference: 'POL-001',
    title: 'Access Control Policy v1.0',
    label: 'POL-001 · Access Control Policy v1.0',
  },
];

export const acknowledgementMethodOptions = [
  { value: 'simple', label: 'Simple accept', helper: 'Read, then confirm.' },
  { value: 'quiz', label: 'Comprehension quiz', helper: 'Must pass before the record is written.' },
  { value: 'upload', label: 'Signed document upload', helper: 'For wet-signature scans.' },
];

export const initialCampaignForm = {
  name: '',
  policyId: '',
  deadline: '',
  gracePeriodDays: 0,
  acknowledgementMethod: 'simple',
  declaration: 'I confirm that I have read, understood, and agree to comply with this policy.',
  everyoneInOrganisation: true,
  roles: '',
  departments: '',
  requireScrollToEnd: true,
  requirePasswordReentry: false,
  reminderDaysAfterLaunch: '3, 7',
};
