export const metrics = [
  { label: 'Overall posture', value: '84%', change: '+3.2%', tone: 'cyan', detail: 'vs. last quarter' },
  { label: 'Critical risks', value: '06', change: '2 new', tone: 'red', detail: 'require attention' },
  { label: 'Overdue remediation', value: '03', change: '−2', tone: 'amber', detail: 'from last month' },
  { label: 'Evidence pending', value: '01', change: 'On track', tone: 'green', detail: 'due this week' },
  { label: 'Open exceptions', value: '02', change: 'Stable', tone: 'blue', detail: 'across 2 teams' },
];

export const risks = [
  { risk: 'Unpatched edge gateway', category: 'Infrastructure', owner: 'M. Chen', likelihood: 'Likely', impact: 'Critical', status: 'In progress', review: 'Oct 18', initials: 'MC', tone: 'blue' },
  { risk: 'Privileged access drift', category: 'Identity', owner: 'A. Patel', likelihood: 'Possible', impact: 'High', status: 'Under review', review: 'Oct 20', initials: 'AP', tone: 'violet' },
  { risk: 'Third-party data exposure', category: 'Vendor', owner: 'S. Rivera', likelihood: 'Possible', impact: 'High', status: 'Mitigating', review: 'Oct 22', initials: 'SR', tone: 'amber' },
  { risk: 'Legacy encryption protocol', category: 'Application', owner: 'J. Park', likelihood: 'Unlikely', impact: 'Medium', status: 'Accepted', review: 'Oct 24', initials: 'JP', tone: 'green' },
  { risk: 'Incomplete recovery testing', category: 'Resilience', owner: 'L. Morgan', likelihood: 'Possible', impact: 'Medium', status: 'In progress', review: 'Oct 28', initials: 'LM', tone: 'cyan' },
];

export const executiveMetrics = [
  { label: 'Overall Posture', value: '0%', supporting: 'Risk', tone: 'danger' },
  { label: 'Critical Risks', value: '2', supporting: 'Needs board attention', tone: 'danger' },
  { label: 'Controls Implemented', value: '0 / 199', supporting: 'Across tracked frameworks', tone: 'blue' },
  { label: 'Overdue Remediation', value: '3', supporting: 'Past due date', tone: 'warning' },
];

export const frameworks = [
  { name: 'ISO/IEC 27001:2022', implemented: 0, total: 93, percentage: 0, state: 'Not yet assessed' },
  { name: 'NIST CSF 2.0', implemented: 0, total: 106, percentage: 0, state: 'Not yet assessed' },
];

export const riskThemes = [
  { name: 'Cyber', open: 7, owner: 'Tariq Mahmood', severity: 'Critical', tone: 'critical' },
  { name: 'Compliance', open: 4, owner: 'Sana Iqbal', severity: 'High', tone: 'high' },
  { name: 'Operational', open: 4, owner: 'Kamran Aziz', severity: 'Medium', tone: 'medium' },
  { name: 'Strategic', open: 2, owner: 'Hina Saeed', severity: 'Medium', tone: 'medium' },
  { name: 'Reputational', open: 2, owner: 'Hina Saeed', severity: 'Medium', tone: 'medium' },
];

export const boardReadiness = [
  { label: 'Report ready', value: 'Not yet', tone: 'warning' },
  { label: 'Next reporting date', value: 'None scheduled', tone: 'muted' },
  { label: 'Pending attestations', value: '2', tone: 'warning' },
  { label: 'Open audit findings', value: '0 major · 0 minor', tone: 'success' },
  { label: 'NCA ECC coverage', value: 'Not tracked', tone: 'muted' },
  { label: 'Data-protection coverage', value: 'Not tracked', tone: 'muted' },
];

export const cyberShieldPillars = [
  { name: 'Strengthen', implemented: 0, total: 8, percentage: 0 },
  { name: 'Mature', implemented: 0, total: 5, percentage: 0 },
  { name: 'Enhance', implemented: 0, total: 4, percentage: 0 },
  { name: 'Develop', implemented: 0, total: 5, percentage: 0 },
  { name: 'Evolve', implemented: 0, total: 4, percentage: 0 },
];

export const trendMonths = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
