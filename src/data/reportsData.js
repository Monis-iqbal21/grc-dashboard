export const reportFilters = {
  frameworks: [
    { value: 'all', label: 'All Frameworks' },
    { value: 'hipaa', label: 'HIPAA' },
    { value: 'nist-csf-2', label: 'NIST CSF 2.0' },
  ],
  assetCriticalities: [
    { value: 'any', label: 'Any Asset Criticality' },
    { value: 'unclassified', label: 'Unclassified' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ],
  severities: [
    { value: 'any', label: 'Any Severity' },
    { value: 'critical', label: 'CRITICAL' },
    { value: 'high', label: 'HIGH' },
    { value: 'medium', label: 'MEDIUM' },
    { value: 'low', label: 'LOW' },
  ],
  statuses: [
    { value: 'any', label: 'Any Status' },
    { value: 'open', label: 'OPEN' },
    { value: 'reopened', label: 'REOPENED' },
    { value: 'mitigating', label: 'MITIGATING' },
    { value: 'accepted', label: 'ACCEPTED' },
    { value: 'closed', label: 'CLOSED' },
    { value: 'in-progress', label: 'IN PROGRESS' },
    { value: 'resolved', label: 'RESOLVED' },
  ],
};

export const reportGroups = [
  {
    id: 'risk',
    label: 'Risk',
    icon: 'risk',
    reports: [
      { title: 'Risk Register Report', description: 'Complete inventory of risks with inherent/residual scores, owners, linked assets, controls, and appetite state.', audience: 'Auditor / Risk Team' },
      { title: 'Risk Heat Map', description: 'Impact × likelihood distribution, severity bands, residual-vs-inherent shift, and red-zone percentage.', audience: 'Board / Risk Team' },
      { title: 'Breached Risks Report', description: 'Risks over the appetite line, by how much, time in breach, escalation status, and accountable owner.', audience: 'Board / Governance' },
      { title: 'Risk Treatment / Mitigation Status', description: 'Treatment strategy mix, completion, overdue actions, and accepted risks with justification & expiry.', audience: 'Risk Team' },
      { title: 'Risk Trend Report', description: 'Opened vs closed, breach count, net change over the selected period.', audience: 'Board', badge: 'TREND' },
    ],
  },
  {
    id: 'compliance',
    label: 'Compliance',
    icon: 'compliance',
    reports: [
      { title: 'Compliance Score Report', description: 'Compliance percentage per framework with implemented/uncovered counts; critical gaps surfaced separately.', audience: 'Board / Auditor' },
      { title: 'Coverage & Gap Report', description: 'Covered vs partial vs gap, grouped by severity, with owner and remediation due date.', audience: 'Auditor / Compliance Team' },
      { title: 'Cross-Framework Overlap Report', description: "The 'test once, comply many' view — controls shared across frameworks and effort saved through reuse.", audience: 'Compliance Team' },
      { title: 'Audit-Readiness Report', description: 'Evidence coverage, controls tested vs untested, cert-affecting findings, and days to next assessment.', audience: 'Auditor' },
    ],
  },
  {
    id: 'control',
    label: 'Control',
    icon: 'control',
    reports: [
      { title: 'Control Library Report', description: 'Catalog of all controls by domain and pillar.', audience: 'Control Team' },
      { title: 'Control Effectiveness Report', description: 'Design and operating effectiveness distributions; controls effective by design but failing in operation.', audience: 'Auditor / Control Team' },
      { title: 'Control Testing Report', description: 'Testing activity and results — pass/fail/partial, overdue tests, and schedule adherence.', audience: 'Control Team' },
      { title: 'Failed / At-Risk Controls Report', description: 'Failing controls, the risks each exposes (blast radius), and frameworks affected.', audience: 'Risk / Control Team' },
      { title: 'Control Implementation Report', description: 'Implementation percentage and implemented-but-untested controls.', audience: 'Control Team' },
    ],
  },
  {
    id: 'audit',
    label: 'Audit',
    icon: 'audit',
    reports: [
      { title: 'Open Findings Report', description: 'Active remediation list across audit tests, compliance gaps, and CAPA — with owner and due date.', audience: 'Auditor / Remediation Team' },
      { title: 'Overdue Findings Report', description: 'What has slipped — aging buckets (1–30 / 31–60 / 60+), by severity and owner.', audience: 'Remediation Team' },
      { title: 'Remediation SLA / Aging Report', description: 'Average time-to-close by priority, SLA adherence, and backlog.', audience: 'Governance' },
      { title: 'Audit Engagement Report', description: 'Audit and pentest engagement status and findings raised per engagement.', audience: 'Auditor' },
      { title: 'Audit Trail Report', description: 'Change history — who changed what and when, system vs manual.', audience: 'Auditor' },
    ],
  },
  {
    id: 'incident',
    label: 'Incident',
    icon: 'incident',
    reports: [
      { title: 'Incident Log Report', description: 'All events in the period by severity, affected asset, linked risk, and failed control.', audience: 'Operational Team' },
      { title: 'Breach Report', description: 'Reportable vs non-reportable breaches and regulatory reporting-deadline status.', audience: 'Regulator / Governance' },
      { title: 'Incident Response Report', description: 'Mean time to resolve and close, and response volume.', audience: 'Operational Team' },
      { title: 'Root-Cause & Lessons-Learned Report', description: 'Root cause per incident, risks re-rated, and controls strengthened.', audience: 'Governance' },
    ],
  },
  {
    id: 'policy',
    label: 'Policy',
    icon: 'policy',
    reports: [
      { title: 'Attestation Status Report', description: 'Attestation completion per policy, overdue attestations, and who is pending.', audience: 'Governance / HR' },
      { title: 'Policy Coverage Report', description: 'Policy-to-control traceability and policies without backing controls.', audience: 'Compliance Team' },
      { title: 'Policy Lifecycle Report', description: 'Policies by approval state and those overdue for review.', audience: 'Governance' },
    ],
  },
  {
    id: 'asset',
    label: 'Asset',
    icon: 'asset',
    reports: [
      { title: 'Asset Inventory Report', description: 'Assets by type, criticality, and lifecycle state.', audience: 'Asset / Risk Team' },
      { title: 'Asset Risk & Coverage Report', description: 'Risks and incidents per asset, aggregated residual, and framework scope.', audience: 'Risk Team' },
      { title: 'Unclassified / Blind-Spot Report', description: 'Gaps in the foundation — unclassified assets, ownerless assets, and risks without controls.', audience: 'Asset / Risk Team' },
    ],
  },
  {
    id: 'vendor',
    label: 'Vendor',
    icon: 'vendor',
    reports: [
      { title: 'Vendor Risk Report', description: 'Vendors by tier, critical-vendor risk, and concentration exposure.', audience: 'Risk Team' },
      { title: 'Vendor Compliance Report', description: 'Vendor assessment completion and overdue reviews.', audience: 'Compliance Team' },
    ],
  },
  {
    id: 'procedure',
    label: 'Procedure',
    icon: 'procedure',
    reports: [
      { title: 'Procedure Register', description: 'Every procedure with its owner, links, review date, derived status, and full version history.', audience: 'Auditor / Governance' },
      { title: 'Procedure Execution Report', description: 'Executions with their outcome, steps performed, not-applicable frequency per step, and evidence collected.', audience: 'Operational Team / Auditor' },
    ],
  },
  {
    id: 'executive',
    label: 'Executive',
    icon: 'executive',
    reports: [
      { title: 'Governance Posture Summary', description: 'One-page posture — risk distribution, average compliance, critical findings/breaches, appetite adherence.', audience: 'Board / Leadership' },
      { title: 'KRI / KPI Dashboard', description: 'Key risk and performance indicators tracked at a glance.', audience: 'Leadership', badge: 'TREND' },
      { title: 'Board / Committee Pack', description: 'Top risks and trajectory, compliance per framework, material incidents, and decisions required.', audience: 'Board' },
      { title: 'Trend / Comparative Report', description: 'Posture, compliance, risk, and findings over time.', audience: 'Board', badge: 'TREND' },
    ],
  },
];

export const reportCount = reportGroups.reduce((total, group) => total + group.reports.length, 0);
