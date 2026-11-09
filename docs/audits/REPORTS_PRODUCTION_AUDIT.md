# Production Reports Audit

**Inspected:** `https://app.nvector.io/reports` in the signed-in browser, read-only.

## Page structure and controls

- The global shell supplies the Reports identity. The page content has its own Reports heading and a summary line.
- The summary claims **37 live reports across 9 modules — assembled, filtered, and frozen with an as-of timestamp**. The page visibly renders ten report sections; the section counts total 37. The local catalog preserves the 37 observed entries and uses **10 sections**, matching the visible grouping. It preserves the as-of behavior in the copy but does not invent a timestamp.
- The filter panel has four selectors, two text fields, and a date range:
  - **Framework:** All Frameworks, HIPAA, NIST CSF 2.0.
  - **Asset criticality:** Any Asset Criticality, unclassified, low, medium, high, critical.
  - **Severity:** Any Severity, CRITICAL, HIGH, MEDIUM, LOW.
  - **Status:** Any Status, OPEN, REOPENED, MITIGATING, ACCEPTED, CLOSED, IN PROGRESS, RESOLVED.
  - **Business Unit** and **Owner** text inputs.
  - **From** and **To** date inputs.
- There is no report-catalog search, category tab, create action, export menu, or visible clear-filters action.
- Each report card has a title, descriptive summary, audience (“For: …”), and **Generate** action. Three cards carry a **TREND** badge: Risk Trend Report, KRI / KPI Dashboard, and Trend / Comparative Report.

## Observed report catalog

| Section | Count | Report titles |
| --- | ---: | --- |
| Risk | 5 | Risk Register Report; Risk Heat Map; Breached Risks Report; Risk Treatment / Mitigation Status; Risk Trend Report |
| Compliance | 4 | Compliance Score Report; Coverage & Gap Report; Cross-Framework Overlap Report; Audit-Readiness Report |
| Control | 5 | Control Library Report; Control Effectiveness Report; Control Testing Report; Failed / At-Risk Controls Report; Control Implementation Report |
| Audit | 5 | Open Findings Report; Overdue Findings Report; Remediation SLA / Aging Report; Audit Engagement Report; Audit Trail Report |
| Incident | 4 | Incident Log Report; Breach Report; Incident Response Report; Root-Cause & Lessons-Learned Report |
| Policy | 3 | Attestation Status Report; Policy Coverage Report; Policy Lifecycle Report |
| Asset | 3 | Asset Inventory Report; Asset Risk & Coverage Report; Unclassified / Blind-Spot Report |
| Vendor | 2 | Vendor Risk Report; Vendor Compliance Report |
| Procedure | 2 | Procedure Register; Procedure Execution Report |
| Executive | 4 | Governance Posture Summary; KRI / KPI Dashboard; Board / Committee Pack; Trend / Comparative Report |
| **Total visible** | **37** | **10 sections** |

Full observed descriptions and audience labels are captured in [`src/data/reportsData.js`](../../src/data/reportsData.js).

## Local implementation

- `/reports` now renders a responsive Report Catalog with all observed report names, descriptions, audiences, badges, and section counts.
- The filter panel reproduces the visible framework, criticality, severity, status, business-unit, owner, and date inputs. Selectors use the project’s spaced custom dropdown pattern and keyboard support.
- Local Generate buttons show a clear prototype notice. They do not issue requests or display fabricated report results.
- The local page uses the NVector dark navy surfaces, typography, and blue actions rather than copying production’s light theme, keeping it consistent with the local app.

## Limits and discrepancies

- The production subtitle’s “9 modules” conflicts with the ten visible sections. The local implementation follows the visible grouping and count.
- Generate was not clicked in production because it may start a report job or download output. The resulting report view, file formats, and whether the filters narrow report data or only parameterize generation were not verified.
- The local page is a frontend prototype; report data retrieval and report generation remain unconnected to a backend.
