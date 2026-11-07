export const procedureRecord = {
  reference: 'PRC-2026-0001',
  title: 'Dummy - MFA enrolment for new staff',
  type: 'Standard operating procedure',
  status: 'Draft',
  governedBy: { reference: 'HIPAA AC-01', kind: 'Control' },
  owner: 'Demo Admin',
  activeVersion: '—',
  nextReview: '—',
  severity: { score: 6, label: 'Medium', display: '6 · Medium' },
  classification: 'Internal',
  category: '—',
  trigger: 'On demand',
  recurrence: '',
  reviewCycle: '12 months',
  nextCycle: '—',
  taskGeneration: 'Off',
  appliesToAllVendors: 'No',
  created: '11/3/2026',
  submitted: '—',
  clonedFrom: '—',
  version: {
    label: 'Unnumbered draft',
    status: 'Draft',
    changeReason: 'Initial version.',
    created: '11/3/2026 · Demo Admin',
  },
  purpose: 'Dummy procedure for demonstration. Not a real procedure.',
  scope: 'All new joiners with system access.',
  prerequisites: '',
  exceptionsAndEscalation: '',
  changeSummary: '',
  steps: [
    {
      order: 1,
      title: 'Confirm joiner record exists in HR system',
      instructions: 'Dummy step for demonstration.',
      performer: 'HR Officer',
      system: '',
      expectedOutput: 'Joiner record reference',
      mandatory: true,
      conditional: false,
      evidenceRequired: false,
    },
    {
      order: 2,
      title: 'Issue MFA token and register the device',
      instructions: 'Dummy step for demonstration.',
      performer: 'IT Service Desk',
      system: '',
      expectedOutput: 'Token serial recorded',
      mandatory: true,
      conditional: false,
      evidenceRequired: false,
    },
    {
      order: 3,
      title: 'Verify first sign-in completes with MFA',
      instructions: 'Dummy step for demonstration.',
      performer: 'IT Service Desk',
      system: '',
      expectedOutput: 'Sign-in log entry',
      mandatory: true,
      conditional: false,
      evidenceRequired: false,
    },
  ],
  raciRoles: [],
};

export const procedureCategories = [
  'Access Control',
  'Asset Management & Hardening',
  'Audit & Compliance',
  'Business Continuity & DR',
  'Change Management',
  'Cryptography & Key Management',
  'Data Handling & Classification',
  'Human Resources',
  'Incident Response',
  'Logging & Monitoring',
  'Physical Security',
  'Privileged Access',
  'Third-Party / Vendor',
  'Vulnerability & Patch Management',
];

export const procedureTypes = [
  {
    label: 'Standard operating procedure',
    description: 'A recurring operational process',
    defaultGovernedBy: 'Policy',
  },
  {
    label: 'Runbook',
    description: 'BCP/DR and technical runbooks; step SLAs matter',
    defaultGovernedBy: 'Control',
  },
  {
    label: 'Risk treatment',
    description: 'Executed to mitigate a linked risk',
    defaultGovernedBy: 'Risk',
  },
  {
    label: 'Finding remediation',
    description: 'Closes a linked audit finding',
    defaultGovernedBy: 'Audit finding',
  },
  {
    label: 'Vendor lifecycle',
    description: 'Onboarding, reassessment, off-boarding',
    defaultGovernedBy: 'Vendor',
  },
];

export const procedureOwners = ['Demo Admin (you)', 'Maizah Kaleem', 'Nimra Khan'];
export const governedByTypes = [
  'Policy', 'Control', 'Risk', 'Audit finding', 'Vendor', 'Asset type', 'Risk exception',
];
export const procedureTriggers = ['On demand', 'Scheduled', 'Started by another module'];
export const procedureRecurrences = [
  'Once', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Semi-annual', 'Annual',
];
export const procedureClassifications = ['Internal', 'Confidential', 'Restricted'];
export const procedureStatuses = [
  'Any status', 'Draft', 'In review', 'Approved (pending)', 'Active',
  'Active · Under revision', 'Retired',
];
export const procedureQuickFilters = [
  'My procedures', 'Under revision', 'Review overdue', 'Governance gap', 'Pending my approval',
];
export const raciOptions = [
  'R · Responsible', 'A · Accountable', 'C · Consulted', 'I · Informed',
];
export const evidenceTypes = [
  'Screenshot', 'Export', 'Signed form', 'Report', 'Log extract', 'Attestation', 'Other',
];

export const coverageFrameworks = [
  { name: 'HIPAA', controls: 115 },
  { name: 'NIST CSF 2.0', controls: 106 },
];

export const verifiedCoveredControl = {
  framework: 'HIPAA',
  reference: 'AC-01',
  title: 'Multi-factor authentication for the cloud console (e.g., AWS)',
  procedureReference: procedureRecord.reference,
  procedureTitle: procedureRecord.title,
  status: 'Draft · in review · approved',
};

export const searchFields = [
  'category', 'classification', 'created', 'governance_gap', 'governs', 'owner',
  'purpose', 'record_status', 'recurrence', 'ref', 'review_date', 'severity',
  'task_generation', 'title', 'trigger', 'type', 'updated', 'version',
];

export const searchExamples = [
  'type = "RUNBOOK"',
  'review_date overdue',
  'classification = "restricted"',
  'owner = "dana" and governance_gap = true',
];

export const exportFormats = [
  { format: 'CSV', description: 'Opens in Excel, Sheets and data tools' },
  { format: 'PDF', description: 'For sharing and printing' },
  { format: 'HTML', description: 'Opens in a browser, rows expand' },
];
