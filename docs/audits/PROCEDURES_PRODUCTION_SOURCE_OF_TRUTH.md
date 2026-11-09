# Procedures — Production Source of Truth

## Audit record

- **Audit date:** 2026-11-07
- **Production URL:** https://app.nvector.io/procedures
- **Scope:** The Procedures list, Coverage view, the one accessible procedure record, its detail tabs and draft editor, and procedure-specific forms and menus reachable without saving.
- **Method:** Read the authenticated production UI and accessibility tree. Opened read-only views and unsaved forms to inspect their contents. Did not submit, save, import, export, clone, reassign, retire, delete, or change settings.
- **Authority:** Values below are transcribed from the live application. The local prototype was not used to fill gaps.

## Verified inventory

| Item | Production result |
|---|---:|
| Procedure records in the list | 1 |
| Header summary | “1 open · 0 active · 1 drafts” |
| Active | 0 |
| Under revision | 0 |
| Pending approval | 0 |
| Review overdue | 0 |
| Governance gaps | 0 |
| Coverage view controls | 221 |
| HIPAA controls | 115 |
| NIST CSF 2.0 controls | 106 |
| Controls carried out by a procedure | 1 |
| Configured procedure categories | 13 |
| Procedure status filter values (excluding Any status) | 6 |

The only visible procedure is marked as a draft. The only covered control is HIPAA AC-01. The list summary says “0% Control coverage · 0 of 221 controls”, while Coverage says “1 of 221 controls carried out by a procedure”. The one linked procedure is Draft. The UI does not explain this difference; it may be using a different coverage rule, so the relationship is recorded without assuming why the totals differ.

## Page hierarchy

1. **Procedures** — /procedures
   - Summary line, metric strip, search and quick filters, status filter, sortable table, pagination, and toolbar actions.
2. **Procedure coverage** — /procedures/coverage
   - Framework and category filters, Only covered controls, legend, and a control-to-procedure matrix.
3. **Procedure detail** — /procedures/{record-id}
   - Overview, Steps, Links, Versions, Review triggers, Tasks & runs, and Audit log tabs.
4. **Draft version editor** — /procedures/{record-id}/versions/{version-id}
   - Details, RACI, Steps, and a Before you submit checklist.

No separate Procedures tabs were present on the list page.

## Procedures list

### Layout and summary

The page is headed **Procedures**. Beneath it the exact summary is “1 open · 0 active · 1 drafts”. The toolbar actions are Coverage, Export, Settings, Import, Clone from skeleton, and + New procedure.

The summary tiles show:

- 0 Active
- 0 Under revision
- 0 Pending approval
- 0 Review overdue
- 0 Governance gaps
- 0% Control coverage and 0 of 221 controls
- — Run outcomes and No completed runs yet

### Search, filters, sorting, and paging

- Search placeholder: “Filter procedures — e.g. severity >= 15 or type = "RUNBOOK"”.
- **How to search** opens a help dialog. Plain words search names and descriptions. Structured searches accept a field, operator, and value; text values use quotes, while numbers and dates do not. Multiple values use in (…). Searches remain inside the organisation.
- Operators documented in the help: colon means partial-text contains; equals means exact match; not-equals; in (…) means any of these; > >= < <=; between a..b; has; is empty / is set.
- Date keywords documented: overdue, today, yesterday, last 30d, last 3m, next 7d, this_week, this_month, this_quarter, this_year, and expiring 30.
- Example searches shown include type = "RUNBOOK" and review_date overdue, classification = "restricted", and owner = "dana" and governance_gap = true.
- Search help lists fields: category, classification, created, governance_gap, governs, owner, purpose, record_status, recurrence, ref, review_date, severity, task_generation, title, trigger, type, updated, and version. Examples of values include internal, confidential, restricted; open, retired; once, daily, weekly, monthly…; SCHEDULED, ON_DEMAND, EVENT; and STANDARD_SOP, RUNBOOK, TREATMENT, REMEDIATION….
- Quick filters are checkboxes: My procedures, Under revision, Review overdue, Governance gap, Pending my approval. Selecting My procedures returned the one record. Selecting Draft in the status filter also returned the one record.
- Status values: Any status, Draft, In review, Approved (pending), Active, Active · Under revision, Retired.
- Table columns: REF, TITLE, TYPE, STATUS, GOVERNED BY, OWNER, ACTIVE VERSION, NEXT REVIEW, SEVERITY. REF, NEXT REVIEW, and SEVERITY are exposed as buttons in the header; sorting behavior beyond the visible controls was not separately tested.
- The row has a selection checkbox. Selecting it exposes Reassign owner and Clear. Pagination reads 1–1 of 1; Previous and Next are disabled.
- When a filter is active, Clear filters and Save this view appear. Save this view was not activated because it would persist a production change.

### Listed procedure record

| Field | Exact displayed value |
|---|---|
| Reference | PRC-2026-0001 |
| Title | Dummy - MFA enrolment for new staff |
| Type | Standard operating procedure |
| Status | Draft |
| Governed by | HIPAA AC-01 · Control |
| Owner | Demo Admin |
| Active version | — |
| Next review | — |
| Severity | 6 · Medium |

The title and body text identify this as a demonstration record.

## Coverage view

The page heading is **Procedure coverage**. With all filters clear it reads “1 of 221 controls carried out by a procedure”.

- **Framework:** All active frameworks, HIPAA, NIST CSF 2.0.
- **Category:** All categories, Access Control, Asset Management & Hardening, Audit & Compliance, Business Continuity & DR, Change Management, Cryptography & Key Management, Data Handling & Classification, Human Resources, Incident Response, Logging & Monitoring, Physical Security, Privileged Access, Third-Party / Vendor, Vulnerability & Patch Management.
- **Only covered controls:** When enabled, the count changes to “1 of 1 controls carried out by a procedure”, and only the HIPAA AC-01 row remains.
- **Legend:** Active; Active · under revision; Draft · in review · approved; Governance gap; No procedure; Faded: inherited link.
- The complete rendered list contained 221 control rows: HIPAA 115 and NIST CSF 2.0 106. Only one had a procedure relationship.

The covered row is HIPAA AC-01 — Multi-factor authentication for the cloud console (e.g., AWS), related to PRC-2026-0001 — Dummy - MFA enrolment for new staff. The row badge text is “AC-01 · PRC-2026-0001: Draft · in review · approved”.

The 220 uncovered controls are visible in the all-controls matrix, but their individual titles are not reproduced in this Procedures audit dataset because they are control-library records, not procedure records. The full list was loaded and its framework counts were checked.

## Procedure detail

### Header and Overview

The record header shows PRC-2026-0001, Draft, Internal, 6 · Medium, Dummy - MFA enrolment for new staff, Owner: Demo Admin, and Governed by: HIPAA AC-01.

Actions: Edit draft, Edit details, Retire, Delete, and Open version. Retire and Delete were not activated because they could alter production data.

The selected Overview section includes:

- Status notice: “This procedure is not yet in force: draft · Dummy - MFA enrolment for new staff Draft”
- Section heading: Not yet in force
- Type: Standard operating procedure
- Trigger: On demand
- Created: 11/3/2026
- Submitted: —
- Change reason: Initial version.
- Edit the draft → link

The Record definition list shows Category —; Review cycle 12 months; Next review —; Next cycle —; Task generation Off; Applies to all vendors No; Created 11/3/2026 by Demo Admin; Cloned from —.

### Detail sections

- **Overview**
- **Steps** — The screen states no version is in force yet and the steps are being written in the in-flight version.
- **Links 1** — One CONTROL link: HIPAA AC-01, title “Multi-factor authentication for the cloud console (e.g., AWS)”, marked Governed by. Add link is available; the existing relationship has a Remove button.
- **Versions** — One Unnumbered draft in Draft, title Dummy - MFA enrolment for new staff, reason Initial version., created 11/3/2026 · Demo Admin, with an Open action.
- **Review triggers 0** — Open reviews says No open reviews. The page explains: “No change needed” takes two people: the owner proposes it, then a GRC Manager who is not the owner confirms it. History says No resolved reviews yet.
- **Tasks & runs 0** — Headings Runs and Generated tasks; message: Task generation is switched off for this procedure.
- **Audit log** — The tab was selectable, but no log entries or empty-state message were exposed in the accessible view; contents are unverified.

## Forms and workflows

### New procedure

The + New procedure action opens New procedure. Required markers were visible for Title, Type, Owner, Governed by, and the primary link.

| Order | Field | Type / requirement | Default or options | Helper / conditional behavior |
|---:|---|---|---|---|
| 1 | Title | Text; required | Empty | At least 10 characters, and not one another procedure already uses. |
| 2 | Type | Select; required | Choose a type; Standard operating procedure; Runbook; Risk treatment; Finding remediation; Vendor lifecycle | Type descriptions: A recurring operational process; BCP/DR and technical runbooks; step SLAs matter; Executed to mitigate a linked risk; Closes a linked audit finding; Onboarding, reassessment, off-boarding. |
| 3 | Owner | Select; required | Demo Admin (you); Maizah Kaleem; Nimra Khan | Answers for the procedure: keeps it current and reviews it on schedule. |
| 4 | Governed by | Select; required | Policy; Control; Risk; Audit finding; Vendor; Asset type; Risk exception | The primary link: the record this procedure exists to carry out. Defaults to Policy for Standard operating procedure, Control for Runbook, Risk for Risk treatment, Audit finding for Finding remediation, and Vendor for Vendor lifecycle. |
| 5 | Primary link | Searchable selector; required | Depends on Governed by; selection results did not load from a blank Control selector during inspection | The primary link is the record this procedure exists to carry out. An Open button is alongside the selector. |
| 6 | Trigger | Select | On demand; Scheduled; Started by another module | Defaults to On demand. Scheduled reveals Recurrence. |
| 7 | Recurrence | Select, conditional on Scheduled | How often; Once; Daily; Weekly; Monthly; Quarterly; Semi-annual; Annual | No other recurrence-dependent fields were exposed. |
| 8 | Category | Select | No category plus the 13 configured categories above | Defaults to No category. |
| 9 | Severity score | Numeric stepper | Default 6; allowed display range 1–25 | 1–25, banded like the risk register. Current score displays 6 · Medium; other band thresholds were not inferred. |
| 10 | Classification | Select | Inherited — internal unless what governs it needs higher; Internal; Confidential; Restricted | Defaults to inherited classification. |
| 11 | Generate tasks | Checkbox | Unchecked | Raise a task per step for each scheduled run once the procedure is active. |
| 12 | Applies to all vendors | Checkbox; only for Vendor lifecycle | Unchecked | Every vendor follows this lifecycle, not only the one it is linked to. |

Actions: Cancel, Create procedure. The form was not submitted, so server-side validation responses were not tested.

### Edit details

Edit details opens a modal with Owner (Demo Admin selected; other loaded options Maizah Kaleem and Nimra Khan); Category (No category plus the 13 configured categories); Severity score (6, helper “1–25, banded like the risk register.”); Classification (Internal, Confidential, Restricted; “Can be raised, never lowered.”); Review cycle (months) (12); Generate tasks (unchecked; “Each run creates a task for every step.”); and Applies to all vendors (unchecked; “For vendor lifecycle procedures: every vendor, not only linked ones.”). Actions: Cancel, Save. Save was not selected.

### Add link

**Add link** opens a modal with Link to options Policy, Control, Risk, Audit finding, Vendor, Asset type, Risk exception; a type-dependent searchable selector; a Make this the primary link checkbox with helper “The primary link is what the procedure is shown as governed by.”; and Cancel and Add link. A blank Control lookup displayed Searching… and no options loaded during this inspection. Add link was disabled until a linked record is selected. No link was added or removed.

### Draft version editor

Edit draft, Open version, and Edit the draft → lead to the draft version editor. Its sections are Details, RACI, Steps, and Before you submit.

**Details** fields:

- Title — Dummy - MFA enrolment for new staff; helper: At least 10 characters, unique among your procedures.
- Procedure type — Standard operating procedure; Runbook; Risk treatment; Finding remediation; Vendor lifecycle. The same type-specific descriptions shown on New procedure appear.
- Trigger — On demand; Scheduled; Started by another module.
- Purpose — Dummy procedure for demonstration. Not a real procedure. Helper: Why this procedure exists — at least 30 characters.
- Scope — All new joiners with system access.
- Prerequisites — empty.
- Exceptions & escalation — empty.
- Change reason — Initial version.
- Change summary — empty; helper: Optional on a first version.
- Discard and Save details were disabled while unchanged.

**RACI** explains: Who is Responsible, Accountable, Consulted and Informed. No roles yet. Add the people who do, own, advise on and hear about this procedure. Add role exposes Role (text); RACI options R · Responsible (default), A · Accountable, C · Consulted, I · Informed; Default assignee options No default, Demo Admin, Maizah Kaleem, Nimra Khan; Remove row; and Save RACI. Validation: The RACI needs exactly one Accountable (A) role — it has 0.

Adding a role only created an unsaved editor row. The editor was left without saving and reopened; it still showed no roles, confirming no RACI data was persisted.

**Steps** summary: 3 steps, 3 mandatory, 0 conditional, 0 need evidence. Help: Drag to reorder, or use the arrows. Each step has up/down controls, Edit, and Delete.

| # | Title | Instructions | Performer | System | Expected output | Flags |
|---:|---|---|---|---|---|---|
| 1 | Confirm joiner record exists in HR system | Dummy step for demonstration. | HR Officer (not a Responsible role) | Empty | Joiner record reference | Mandatory |
| 2 | Issue MFA token and register the device | Dummy step for demonstration. | IT Service Desk (not a Responsible role) | Empty | Token serial recorded | Mandatory |
| 3 | Verify first sign-in completes with MFA | Dummy step for demonstration. | IT Service Desk (not a Responsible role) | Empty | Sign-in log entry | Mandatory |

All three steps were marked mandatory, not conditional, and did not require evidence. A step’s Performer is limited to the RACI’s Responsible roles; with no R roles, the selector says Add an R role to the RACI first.

**Add step** fields: Title; Instructions; Performer; System; Expected output; Mandatory (A mandatory step skipped or not done lowers the run’s outcome.); Conditional step (Applies only when a condition holds; may be recorded Not applicable.); Evidence required (Completing the step needs evidence attached.). Conditional adds Applies when with 0/500 characters, at least 10. Evidence required adds Evidence type options Screenshot, Export, Signed form, Report, Log extract, Attestation, Other, and Evidence description. Actions: Cancel, Add step. The form was cancelled without adding a step.

The **Before you submit** checklist contains:

1. The RACI needs exactly one Accountable role (has 0).
2. Step 1’s performer HR Officer is not a Responsible (R) role in the RACI.
3. Step 2’s performer IT Service Desk is not a Responsible (R) role in the RACI.
4. Step 3’s performer IT Service Desk is not a Responsible (R) role in the RACI.

Submit for review was disabled with these checklist issues. No version was submitted.

### Clone from skeleton

The modal says: No skeletons have been installed for your organisation. It asks for a Title, Owner, Governed by, and a required primary link. Helper text says Change it if your organisation already has a procedure by this name; Answers for the procedure: keeps it current and reviews it on schedule; and A skeleton has no links of its own, so the copy needs its primary link. Actions: Cancel, Clone. No clone was created.

### Import procedures

The modal is titled **Import procedures** and says:

> Upload a CSV with a Title, Type, Owner, Governed by type and Governed by column — what the New procedure form asks for. A row whose Trigger is SCHEDULED also needs a Recurrence, as on the form. Columns are matched by name in any order. Every row becomes a draft; nothing is activated by an import.

Actions: CSV file, Download template, Cancel, Check file. No file was chosen, uploaded, checked, or downloaded.

### Bulk reassignment

Selecting a row exposes **Reassign owner**. The modal is titled **Reassign 1 procedure**, with New owner, a loading initial value followed by Demo Admin (you), and helper “Answers for the procedure: keeps it current and reviews it on schedule.”

It states: “Each procedure is changed on its own. Any that cannot be — a retired one, or one somebody else has just edited — are listed afterwards rather than skipped.” Actions: Cancel, Reassign. No owner was changed.

### Procedure settings

**Settings** opens **Procedure settings** with:

- **Review due within (days):** 30 — How long a review trigger has before it is overdue and escalated.
- **Governance gap grace (days):** 30 — After a linked policy is retired, how long before the CISO is told.
- **Owner reassignment (days):** 7 — How long to reassign the procedures of a deactivated owner.
- **Longest review cycle (months):** 12 — No procedure may go longer than this between reviews (1–12).
- **Allow a single GRC user to approve their own procedures:** unchecked. Helper says each use needs a justification, is logged at high severity, and the CISO is told.
- **Second person confirms 'not applicable' on critical procedures:** unchecked. Helper says a run of a CRITICAL procedure cannot complete until another GRC Manager confirms each not-applicable step.
- **Categories:** the 13 categories listed under Coverage.
- **Add a category** text field and **Add** button.

Actions: Cancel, Save settings. No setting or category was changed.

### Export

The Export menu exposes CSV — Opens in Excel, Sheets and data tools; PDF — For sharing and printing; and HTML — Opens in a browser, rows expand. No export was initiated.

## Unverified behavior and limits

- There is only one visible procedure and it is a draft demonstration record. Active, under-revision, pending-approval, retired, review-overdue, and completed-run behaviors could not be observed on records in those states.
- Link-target result options did not load for a blank selector; all possible Policy, Control, Risk, Audit finding, Vendor, Asset type, and Risk exception records were not enumerated.
- Create, save, submit, import, export, clone, reassign, retire, delete, and settings-save operations were deliberately not executed. Any resulting confirmation or server-side validation beyond the visible disabled Submit for review button is unverified.
- The Audit log tab did not expose rows or a definitive empty-state message.
- The individual titles of 220 uncovered framework controls are not duplicated here; the visible list was loaded and checked to derive its total and framework counts.

## Read-only confirmation

No production record or setting was created, edited, saved, submitted, imported, exported, cloned, reassigned, retired, or deleted. Temporary filters and unsaved form state were cleared or abandoned. No local application code was changed.
