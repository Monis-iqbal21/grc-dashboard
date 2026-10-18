export const cisoDashboardMetrics = {
  openRisks: 26,
  overAppetite: 6,
  activeVulnerabilities: 20,
  criticalVulnerabilities: 5,
  slaBreached: 5,
  estimatedLossExposure: 'PKR 0',
  openIncidents: 0,
};

export const highestDisplayedRiskScore = 25;

export const priorityRisks = [
  { rank: '01', id: 'R-025', name: 'SQL Injection', score: 25, severity: 'Critical' },
  { rank: '02', id: 'R-001', name: 'Ransomware', score: 20, severity: 'Critical' },
  { rank: '03', id: 'R-026', name: 'End-of-life PHP', score: 16, severity: 'High' },
  { rank: '04', id: 'R-004', name: 'Phishing', score: 16, severity: 'High' },
  { rank: '05', id: 'R-010', name: 'AML', score: 15, severity: 'High' },
];

export const governanceSections = [
  { id: 'average-compliance', label: 'Average Compliance', value: 'Not available' },
  { id: 'assessments', label: 'Assessments', value: '0' },
  { id: 'controls-tested', label: 'Controls Tested', value: '0' },
  {
    id: 'vendor-and-control-metrics',
    metrics: [
      { label: 'Vendors', value: '0' },
      { label: 'Ineffective Controls', value: '0' },
    ],
  },
];
