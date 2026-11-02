# Policy Library: Local Prototype vs Production Review

**Inspected:** 2 November 2026<br>
**Production:** https://app.nvector.io/policies/library<br>
**Local route:** `/policy-library`<br>
**Scope:** Read-only comparison of Templates, Categories, New template, and New category.

## Summary

Production displays 70 templates and 16 categories. The local Templates directory now contains all 70 uniquely coded records extracted from the production page. The local data preserves the three records without a visible framework badge and the two records without a category.

The local search and filters match the verified production options. Preview now opens a read-only local modal populated with the captured metadata, descriptions, linked-control references, and framework references. The Categories view remains a placeholder, and the New template and Use template actions remain prototype-only.

## Comparison

| Area | Production | Local prototype | Difference |
|---|---|---|---|
| Templates | 70 cards. Each shows code, title, status, description, visible framework, category, review frequency, linked-control count, version/update label, Preview, and Use template. | 70 production-derived records with counts calculated from the displayed dataset. Missing framework/category values are retained as unavailable. | No production records are missing from the audited snapshot. The six prior illustrative examples were removed from the production-derived catalogue. |
| Search and filters | Search by template name/code; Framework, Category, and Review filters combine. Current choices: HIPAA/NIST CSF 2.0; Administrative, Detect, Govern, Identify, Physical, Protect, Technical; Any review/Annually. | Search by title/code and the same filter choices; filters combine and can be cleared. | Verified result counts: 31 HIPAA, 36 NIST CSF 2.0, and 3 with no visible framework badge. Category counts total 68; two records have no visible category. |
| Selected template / Preview | Preview opens a read-only modal with metadata and sections such as Purpose, Scope, Policy statements, Roles & responsibilities, linked controls, framework references, Exceptions, Review cadence, and Related policies. | Selecting a card updates the inline inspector. Preview opens an accessible, scrollable modal with captured metadata, populated purpose text where available, linked controls, and framework references. | Generic empty-state copy in production for Scope, Policy statements, Roles & responsibilities, Exceptions, Review cadence, and Related policies is omitted from the local record content. Escape and focus restoration are supported. |
| Categories | 16 category rows, each with template and policy counts; no column headings or row actions were visible. | Categories tab navigates to `?tab=categories` and shows a placeholder with the audited count of 16. | All 16 rows and their counts are missing from the local page. |
| New template | Opens a three-step modal: Details, Framework mapping, Content. | New template shows a prototype notice; it does not open a form. | The entire form workflow is missing locally by design for a separate implementation task. |
| New category | Opens a modal with Name and Description. | Categories is a placeholder and has no New category action or form. | The form and category creation entry point are missing locally by design for a separate implementation task. |
| Visual layout | Production template cards use light surfaces and a three-column desktop grid. | Local page uses the NVector dark navy theme, a template directory beside an inline inspector, and scoped surfaces. | The local two-zone layout and persistent inspector are visual additions from the prototype design direction. |

## Production category rows

Each value is **templates / policies**:

- Access Management: 0 / 0
- Identify: 7 / 0
- Protect: 14 / 0
- Governance & Oversight: 0 / 0
- Risk & Compliance: 0 / 0
- Asset & Configuration: 0 / 0
- Data Protection & Cryptography: 0 / 0
- Human Resource Security: 0 / 0
- Operations & Resilience: 0 / 0
- Threat & Incident Management: 0 / 0
- Third-Party & Supplier: 0 / 0
- Govern: 13 / 0
- Detect: 2 / 0
- Administrative: 20 / 0
- Physical: 6 / 0
- Technical: 6 / 0

The displayed template counts sum to 68; two production cards showed category `—`.

## Production New template form

### Details

Required fields are Name, Category, Domain · CSF function, and Review frequency.

| Field | Observed details |
|---|---|
| Template code | Disabled text input; placeholder “Chosen from the category”; helper says the code is auto-generated from category when saved. |
| Name | Required text input; placeholder “Access Control Policy”. |
| Category | Required select: Access Management; Governance & Oversight; Risk & Compliance; Asset & Configuration; Data Protection & Cryptography; Human Resource Security; Operations & Resilience; Threat & Incident Management; Third-Party & Supplier; Govern; Identify; Protect; Detect; Administrative; Physical; Technical. |
| Domain · CSF function | Required select: Govern; Identify; Protect; Detect; Respond; Recover. |
| Review frequency | Required; defaults to Annually. Options: Annually; Bi-annually; Quarterly; Every 2 years. |
| Version | Optional text; defaults to `v1.0`; helper says the template has its own version and an adopted policy numbers itself. |
| Owner / author | Optional text; placeholder “e.g. Governance, Risk & Compliance”. |
| Description | Optional text area; placeholder “Shown to authors when they browse templates.” |

More details (optional):

- Suggested classification: —, Internal, Confidential, Restricted. Helper: “Advice an adopter may overrule.”
- Accountable role: placeholder “Privacy Officer”. Helper: “A role, not a person.”
- Supporting procedure: placeholder “Access Permission Management Procedure”. Helper: “What carries the policy out.”
- Effective from: optional date.
- Last reviewed: optional date.
- Footer: “Fields marked * are required.”

### Framework mapping

The form presents HIPAA and NIST CSF 2.0 checkboxes, both unchecked by default, and explains that one policy can map to several frameworks. Enabling a framework reveals its searchable clause selector. No framework was enabled during this comparison.

### Content

The form offers Markdown and Rich text modes, Save now, a content editor, a word/read-time counter, an “Autosaves every 60 s” notice, a Publish checkbox, and Create template. The form was closed without entering content or activating Save now, Publish, or Create template.

## Production New category form

- Name: optional text field; placeholder “Information Security”.
- Description: optional text area; no placeholder observed.
- Actions: Cancel, Create category, Close.
- Required validation was not tested.

## Local-only entries

The six illustrative examples that were present in the earlier prototype have been removed; none are mixed into the production-derived catalogue. The local page retains a prototype notice. New template and Use template display safe feedback and do not create or change records.

## Inspection limits and data safety

- I did not submit either production form, create a category/template, publish, save, or activate Use template.
- Framework mapping and Content steps were inspected without adding data; the exact production result of Use template remains unverified.
- All 70 rendered production cards and their read-only previews were inspected. Template codes are unique, linked-control counts match the displayed reference lists, and framework reference rows match those lists.
- No domain value was displayed. Several preview sections use identical generic empty-state text across all 70 records; the local preview does not present that text as authored template content.
- No application source files or production records were changed during this comparison.
