# NVector Policy Library — Production Functional Audit

**Observed:** 2 November 2026<br>
**Production route:** https://app.nvector.io/policies/library<br>
**Scope:** Read-only inspection of the authenticated Policy Library UI. No application source files were changed.

## A. Module overview

Policy Library is a separate sidebar module from Policies. The page describes its purpose as maintaining policy templates across HIPAA and NIST CSF 2.0, with search, filtering, preview, and an action to start a draft in the policy register.

The desktop UI has two inner tabs: Templates (70) and Categories (16). Templates are displayed as cards. Categories are displayed as a list of category rows. No standalone record detail route was found; selecting Preview opens a modal.

## B. Complete page hierarchy

- Policy Library — /policies/library
  - Templates (70) — default tab
    - Preview of a template — modal; no route change observed
    - New policy template — three-step modal; no route change observed
  - Categories (16) — /policies/library?tab=categories
    - New category — modal; no route change observed

The active tab and list filters are reflected in query parameters. No additional Policy Library inner page, tab, detail route, drawer, or sub-navigation was found in the visible module UI.

## C. Page-by-page content

### Templates

Header:

- Page title: Policy library
- Description: Maintained policy templates across HIPAA and NIST CSF 2.0 — search, filter, and start a draft in your register.
- Action: + New template

The tab label is Templates (70). The list contains 70 cards in a three-column desktop arrangement. The list is vertically scrollable with the document. No pagination controls or sortable columns were visible.

Each card shows:

- Template code and title
- Status badge: New
- Short description, or No description.
- A framework badge when one is shown
- Category, with — when no category is shown
- Review frequency
- Number of linked controls, or 0 — none linked
- Version and updated month
- Preview and Use template actions

Across the observed cards, version was v1.0, review frequency was Annually, and the update label was Updated Oct 2026. All 70 cards displayed the New badge.

Visible framework filters returned 31 HIPAA cards and 36 NIST CSF 2.0 cards. Three cards had no visible framework badge: HIPAA-004, HIPAA-018, and HIPAA-026. This is a description of the rendered badges, not an assertion about hidden framework assignment.

Representative cards:

| Code | Title | Framework badge | Category | Review | Controls | Description |
|---|---|---|---|---|---:|---|
| HIPAA-035 | Access Control Policy | HIPAA | — | Annually | 7 mapped | Requires access permissions to be defined, managed, enforced, and reviewed with least privilege and separation of duties |
| NIST-001 | Access Control Policy | NIST CSF 2.0 | Protect | Annually | 1 mapped | Requires access permissions to be defined, managed, enforced, and reviewed with least privilege and separation of duties |
| HIPAA-002 | Application Security & Software Development Policy | HIPAA | Technical | Annually | 12 mapped | No description. |
| HIPAA-036 | Asset Management Policy | HIPAA | Physical | Annually | 1 mapped | Mandates maintaining a complete, accurate, and current hardware asset inventory |
| HIPAA-004 | Assign Security Responsibility Policy | No badge shown | Administrative | Annually | 0 — none linked | No description. |
| NIST-025 | Incident Response Policy | NIST CSF 2.0 | Govern | Annually | 24 mapped | Requires relevant suppliers and third parties to be included in incident planning, response, and recovery |
| NIST-036 | Vulnerability Management Policy | NIST CSF 2.0 | Identify | Annually | 2 mapped | Requires vulnerabilities in assets to be systematically identified, validated, and recorded |

The list order appeared alphabetical by title in the inspected view. There was no sort control, so this is not recorded as a configurable or guaranteed default sort.

### Categories

The tab label is Categories (16). It contains 16 category rows. Each row shows the category name, template count, and policy count. No column headings or row actions were visible. Clicking a row did not open a detail view.

| Category | Templates | Policies |
|---|---:|---:|
| Access Management | 0 | 0 |
| Identify | 7 | 0 |
| Protect | 14 | 0 |
| Governance & Oversight | 0 | 0 |
| Risk & Compliance | 0 | 0 |
| Asset & Configuration | 0 | 0 |
| Data Protection & Cryptography | 0 | 0 |
| Human Resource Security | 0 | 0 |
| Operations & Resilience | 0 | 0 |
| Threat & Incident Management | 0 | 0 |
| Third-Party & Supplier | 0 | 0 |
| Govern | 13 | 0 |
| Detect | 2 | 0 |
| Administrative | 20 | 0 |
| Physical | 6 | 0 |
| Technical | 6 | 0 |

The category template counts sum to 68. Two visible template cards showed category —. Every category row showed 0 policies at the time of inspection.

### Template preview

Preview opens a modal. The inspected example was HIPAA-035 · Access Control Policy. It showed:

- Metadata: HIPAA; Category —; Review Annually; Version v1.0; Owner —; Last reviewed Not recorded.
- Purpose: “Requires access permissions to be defined, managed, enforced, and reviewed with least privilege and separation of duties”
- Scope: “This template does not say which systems, people or third parties it applies to.”
- Policy statements: “This template has no policy statements yet.”
- Roles & responsibilities: “No responsibilities are described beyond the accountable role.”
- Controls linked (7): AC-04, AC-05, AC-07, HR-02, HR-04, HR-09, NI-08.
- Framework references table: caption “The clauses each framework answers through this policy”; no visible column-header row; the observed row has two cells, framework (`HIPAA`) and clause references (AC-04, AC-05, AC-07, HR-02, HR-04, HR-09, NI-08).
- Exceptions: “No exceptions are stated in this template. Add them when you adopt it if your organisation grants any.”
- Review cadence: “Reviewed every 12 months, or on significant change.”
- Related policies: “No related policies or documents are named.”
- Actions: Close and Use template.

Use template was not activated because it may start or create a policy draft in the register. Its exact effect was not verified.

## D. Forms

### New policy template

**Entry point:** + New template on Templates<br>
**Presentation:** Modal wizard<br>
**Steps:** Details, Framework mapping, Content<br>
**Actions observed:** Close, Cancel, Next, Back, Save now, Create template. Create template and Save now were not activated.

#### Details step

| Field | Type | Required | Default | Placeholder / helper / options |
|---|---|---:|---|---|
| Template code | Disabled text field | No | Empty | Helper: Auto-generated from category when saved. |
| Name | Text | Yes | Empty | Placeholder: Access Control Policy |
| Category | Select | Yes | — Choose — | Access Management; Governance & Oversight; Risk & Compliance; Asset & Configuration; Data Protection & Cryptography; Human Resource Security; Operations & Resilience; Threat & Incident Management; Third-Party & Supplier; Govern; Identify; Protect; Detect; Administrative; Physical; Technical |
| Domain · CSF function | Select | Yes | — Choose — | Govern; Identify; Protect; Detect; Respond; Recover |
| Review frequency | Select | Yes | Annually | Annually; Bi-annually; Quarterly; Every 2 years |
| Version | Text | No | v1.0 | Helper: The template's own. An adopted policy numbers itself. |
| Owner / author | Text | No | Empty | Placeholder: e.g. Governance, Risk & Compliance |
| Description | Text area | No | Empty | Placeholder: Shown to authors when they browse templates. |

The footer says Fields marked * are required.

The More details (optional) disclosure reveals:

| Field | Type | Required | Default | Placeholder / helper / options |
|---|---|---:|---|---|
| Suggested classification | Select | No | — | Internal; Confidential; Restricted. Helper: Advice an adopter may overrule. |
| Accountable role | Text | No | Empty | Placeholder: Privacy Officer. Helper: A role, not a person. |
| Supporting procedure | Text | No | Empty | Placeholder: Access Permission Manager. Helper: What carries the policy out. |
| Effective from date | Date | No | Empty | Helper: When this version takes effect. |
| Last reviewed date | Date | No | Empty | Helper: When somebody last read it through. |

#### Required-field validation

Clicking Next with blank required fields stayed on Details and displayed:

- Give the template a name.
- Choose a category.
- Choose the CSF function the policy serves.

Review frequency defaults to Annually, so no review-frequency error appeared.

#### Framework mapping step

- Heading: Frameworks this policy evidences.
- Framework checkboxes: HIPAA and NIST CSF 2.0; both are unchecked by default and can be enabled together.
- Helper text: Toggle a framework, then add the specific clauses this policy satisfies. One policy can map to several frameworks.
- Each enabled framework displays a searchable combo box labeled Add a [framework] clause, an Open button, and No clauses added yet when empty.
- Selecting a clause adds a row with its reference and title, a coverage toggle, and Remove action.
- Coverage starts as Full. The button for a selected AC-01 read “Coverage of AC-01: Full. Change to Partial”; toggling it displayed “Coverage of AC-01: Partial. Change to Full.”
- No aggregate selected-control count or Select All action was visible.
- Framework mapping options are documented in the companion JSON file. The controls are grouped by framework in the form; option labels include control references and titles. Prefix searches were used to inspect beyond the initial visible suggestions.

#### Content step

- Editor modes: Markdown and Rich text.
- Markdown mode shows a text area. Rich text mode shows an editor toolbar with H1, H2, H3, H4, Bold, Italic, Underline, Bulleted list, Numbered list, Align left, Align centre, Align right, Table, Link, and Rule.
- Save now button.
- Empty content counter: 0 words ~ 1 min read.
- Notice: Autosaves every 60 s.
- Checkbox: Publish it — authors can start from this straight away.
- Helper: Leave it off while the template is still being written.
- Footer note: Fields marked * are required.
- Footer actions: Back and Create template.

The UI displayed Unsaved changes after switching to Rich text. No content was entered. The form was closed immediately and no Save now, Publish, or Create template action was used. Whether autosave is local or server-side was not determined.

### New category

**Entry point:** + New category on Categories<br>
**Presentation:** Modal titled New category<br>
**Fields observed:**

| Field | Type | Required | Default | Placeholder / helper |
|---|---|---|---|---|
| Name | Text | Not marked | Empty | Placeholder: Information Security |
| Description | Text area | Not marked | Empty | No helper text observed |

Actions: Cancel, Create category, Close. No required markers were visible. The create action and validation behavior were not tested because they could write production data.

## E. Dropdown datasets

The large clause selector options are saved in [policy-library-controls.json](policy-library-controls.json).

The visible template filters provide:

- Framework: All frameworks; HIPAA; NIST CSF 2.0.
- Category: All categories; Administrative; Detect; Govern; Identify; Physical; Protect; Technical.
- Review: Any review; Annually.

The template creation form provides category, CSF function, review frequency, and suggested classification options listed in Section D. The two framework clause selectors contain 74 HIPAA options across prefixes AC, AS, BR, DC, DE, DS, HR, NI, and 100 NIST CSF 2.0 options across prefixes DE, GV, ID, PR, RC, RS. These counts were derived from searching each observed prefix in the selector; the UI did not display a total option count.

## F. Interactions

### Search and filters

- Search label: Search.
- Placeholder: Search by name or code...
- Search by title text and exact template code was verified. Example: HIPAA-035 returned one result; Access Control returned two results.
- An unmatched query displayed: “Showing 0 of 70 templates. No template matches these filters.” A Clear filters button was shown.
- Framework, Category, and Review filters are single-select controls.
- Filters combine. Category Administrative + search HIPAA-004 + Review Annually returned one card.
- Results update immediately after changing search or filters.
- Selecting HIPAA returned 31 cards; selecting NIST CSF 2.0 returned 36.
- Every observed card used Annually, so the Annually review filter included all observed templates.
- Active filter values are represented in the URL query string. During a tab switch, the selected framework filter remained when returning to Templates.
- Search by framework name and behavior after a full page reload were not separately tested.

### Lists, sorting, and selection

- Template cards have Preview and Use template actions.
- Category rows showed no selection checkbox or row action.
- No sort control, table headers, pagination, page-size selector, or bulk-selection action was visible.
- The template list reaches HIPAA-034 Workstation Security Policy at the bottom; no next-page control was found.
- Browser document scrolling worked. No separate full-height internal scroll region was identified.

### Preview and forms

- Preview opens a read-only modal with template metadata and content sections.
- New template opens a modal wizard.
- New category opens a modal.
- Use template, Save now, Create template, Create category, and Publish were not activated because they may write production state.

## G. Data relationships

Observed relationships:

- Templates display a category or —, and category rows aggregate template counts.
- Category rows also display policy counts; all were zero during this audit.
- Templates can display one framework badge. The creation form allows HIPAA and NIST CSF 2.0 to be selected together for a new template.
- Framework mapping associates a policy template with specific clauses/controls and a Full or Partial coverage value.
- The preview shows linked controls and framework references for the inspected template.
- Cards display version, review cadence, update date, and sometimes owner/category metadata in Preview.
- Policy Library is a separate sidebar route from Policies. The page subtitle says Use template starts a draft in the register, but the underlying record relationship and exact action result were not verified because Use template was not clicked.

Unknown relationships:

- Whether identical titles across HIPAA and NIST cards are related records or independent templates.
- Whether cards with no framework badge have an underlying framework association.
- Whether a template's Publish checkbox immediately changes visibility or status, and how that status is persisted.
- Whether owner, version, and review dates are linked to separate entities or stored directly on the template.

## H. Responsive behavior

Only the desktop browser viewport (2560 × 1220) was inspected. The visible template cards used three columns at that size. Tablet and mobile breakpoints, card reflow, sidebar collapse behavior, horizontal overflow, and modal layout at narrow widths were not verified in this production audit.

## I. Suggested frontend data models

The following fields are grounded in visible production UI and are a model proposal, not an implementation dataset:

- PolicyTemplate: id, code, title, description, status, categoryId, frameworkIds, reviewFrequency, version, updatedAt, ownerAuthor, mappedControls.
- MappedControl: frameworkId, controlId, title, coverage (Full or Partial).
- TemplateDetails: suggestedClassification, accountableRole, supportingProcedure, effectiveFrom, lastReviewedAt.
- TemplateContent: mode (Markdown or Rich text), body, wordCount.
- PolicyCategory: id, name, description, templateCount, policyCount.

Category counts are displayed in production; whether they should be stored or derived in the prototype is an implementation decision. The production relationship between templates and policy records remains unverified.

## J. Stitch functional requirements

### Templates page

- Show the policy-template catalog and its current total.
- Support searching by template name/title and code.
- Provide Framework, Category, and Review filters, with combined filtering and a clear-filters empty result state.
- Each template exposes its code, title, status, optional description, framework badge when present, category, review frequency, mapped-control count, version/update metadata, Preview, and Use template.
- Preview reveals the template details and linked framework controls.
- Use template is an action that may start a draft in Policies; its exact production result was not tested.

### Categories tab

- Show the 16 category names and template/policy counts.
- Provide New category.
- No row detail or row action was found.

### New policy template workflow

- Use a three-step wizard: Details, Framework mapping, Content.
- Required Details fields are Name, Category, Domain · CSF function, and Review frequency.
- Support the optional metadata and classification fields listed in Section D.
- Allow HIPAA, NIST CSF 2.0, or both; searchable clause selectors add controls with Full/Partial coverage and removal.
- Support Markdown and Rich text editing, a publish checkbox, Save now, and Create template.
- Show the observed required-field feedback for Name, Category, and CSF function.

### Template preview

- Show the observed metadata, Purpose, Scope, Policy statements, Roles & responsibilities, Controls linked, Framework references, Exceptions, Review cadence, and Related policies sections.
- Provide Close and Use template actions.

### New category workflow

- Provide Name and Description inputs with Cancel, Close, and Create category.
- Required validation was not verified.

## K. Audit limitations and evidence levels

### Confirmed

- One Policy Library route with two inner tabs: Templates (70) and Categories (16).
- Template-card structure, visible filter values, category counts, template creation fields/options, empty required-field feedback, control mapping behavior, and one read-only template preview.
- HIPAA and NIST CSF 2.0 clause options were searched by code prefix and saved in the companion JSON.

### Partially verified

- Template ordering appeared alphabetical by title; no sort setting was shown.
- Framework badges and category counts are rendered data. Three cards lacked a visible framework chip; two cards had category —.
- Search by name and code was verified. Search behavior for framework names was not.
- URL query parameters reflected filters and tab state; only one tab-switch persistence case was checked.
- No aggregate selected-control count was visible in the inspected mapping step.

### Not verified

- Tablet/mobile layout and narrower viewport behavior.
- Create, save, publish, Use template, New category, or any action that could write data.
- Whether the displayed 60-second autosave is local or server-side.
- New category validation.
- All 70 card descriptions and metadata were not transcribed individually; representative examples and repeated field structure are recorded.
- Any action or route hidden by account permissions.

### Restricted by permissions

The sidebar states that menu items the current account cannot open are hidden. No attempt was made to reveal or bypass inaccessible items.

## Safety and change record

No policy, template, or category was created, edited, published, archived, or deleted. No file was uploaded, no campaign was triggered, and no form was submitted. Temporary framework/control selections in the unsaved template form were removed, and the form was closed. No explicit save or create action was used.

Only this audit report and its companion control-options JSON are added under docs/audits. No application source files were changed. No commit, push, deployment, or pull request was made.
