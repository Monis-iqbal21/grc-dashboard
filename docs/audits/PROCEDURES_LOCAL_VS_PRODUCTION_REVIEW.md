# Procedures — Local vs Production Review

## Review basis

- **Reviewed:** 2026-11-07
- **Production source:** https://app.nvector.io/procedures
- **Local project:** D:\work\nvector-dashboard
- **Local route:** /procedures
- **Local data/code state:** Read only; no implementation edits were made.

The local route is not a Procedures implementation yet. Production was inspected first and treated as the source of truth. See [PROCEDURES_PRODUCTION_SOURCE_OF_TRUTH.md](PROCEDURES_PRODUCTION_SOURCE_OF_TRUTH.md) and [procedures-production-source-of-truth.json](procedures-production-source-of-truth.json) for the full production observations.

## Local implementation found

- src/App.jsx renders dedicated pages only for the Dashboard, CISO Dashboard, Policies, and Policy Library. Other navigation routes, including /procedures, use the shared PlaceholderPage.
- src/data/navigation.js contains a Procedures navigation entry at /procedures.
- src/pages/PlaceholderPage.jsx renders a Workspace > Procedures breadcrumb, a Layers icon, a Procedures heading, the text “This workspace is ready for the procedures experience.”, and the PAGE PLACEHOLDER tag.
- No dedicated Procedures page, stylesheet, data file, detail component, or procedure form was found under src.

## Findings by classification

### 1. Matches production

| Area | Finding |
|---|---|
| Route identity | The local sidebar/navigation identifies Procedures and routes to /procedures, matching the production module entry point. |
| Shared shell | The route uses the existing local AppShell and global navigation rather than a Procedures-specific shell. The production module also appears inside the shared NVector shell. |

These are identity/shell matches only; they do not represent feature parity.

### 2. Missing locally

| Production capability | Production evidence | Local state |
|---|---|---|
| Procedure summary and metrics | Open/draft summary; active, revision, approval, overdue, governance-gap, control-coverage, and run-outcome measures. | No Procedures metrics. |
| Procedures listing | Searchable, filterable table with reference, title, type, status, governed-by record, owner, active version, next review, and severity. | No list or procedure data. |
| Search language | Text search plus field-aware operators, date keywords, examples, and field reference. | No search control. |
| Quick/status filters | Five quick filters and six status values plus Any status. | None. |
| Sorting, paging, selection | Sort controls, page selection, 1–1 paging, bulk reassignment. | None. |
| Coverage view | Framework/category filters and a 221-control coverage matrix across HIPAA and NIST CSF 2.0. | No coverage route or matrix. |
| Procedure record detail | Overview, Steps, Links, Versions, Review triggers, Tasks & runs, and Audit log. | No detail route/view. |
| Version editor | Details, RACI, step editor, before-submit checklist and blocked review submission. | No version editor or validation. |
| New procedure | Typed creation form, type-specific primary-link defaults, triggers, recurrence, category, severity, classification, and task-generation options. | No creation form. |
| Edit details and add link | Owner/category/severity/classification/review-cycle metadata, task generation, vendor scope, and link type selector. | No edit/link forms. |
| Settings | Review and escalation timing, approval safeguards, critical not-applicable safeguard, and category management. | No module settings. |
| Clone/import/export | Skeleton cloning, CSV import, and CSV/PDF/HTML export. | None. |
| Bulk owner reassignment | Selected-record owner reassignment flow and failure reporting. | None. |
| Record-level statuses and metadata | Production record has a reference, type, Draft status, linked control, owner, severity, classification, review cycle, and dates. | No local procedure record model. |

### 3. Different from production

| Area | Local | Production |
|---|---|---|
| Main content | Generic placeholder message and icon. | Full Procedures workspace with summary, metrics, toolbar, query/search, filters, table, and paging. |
| Heading/content terminology | A breadcrumb and placeholder-specific text are shown. | Procedures-specific controls and domain terminology are shown. |
| Record count/data | No records are represented locally. | One visible demonstration draft, PRC-2026-0001. |
| Page hierarchy | Generic placeholder only. | List → Coverage, record detail → seven sections, draft version editor. |
| Relationship between coverage and metrics | No implementation. | The list says 0 of 221 while Coverage says 1 of 221; the only linked procedure is Draft. The production UI does not explain the difference. |

### 4. Not verified

- Behavior for active, under-revision, pending-approval, retired, overdue, and completed-run records; none were visible in the production tenant’s Procedures list.
- Search results for linked Policy, Control, Risk, Audit finding, Vendor, Asset type, and Risk exception selectors; the blank lookup remained at Searching….
- Confirmation dialogs, server validation, and post-action results for submit, save, import, export, clone, reassignment, retire, and delete. These actions were not performed in production.
- Audit log contents; the tab was visible but exposed neither entries nor a definitive empty state.
- Whether a selected filter view can be saved and how saved views are restored; Save this view was intentionally not used.
- Exact titles for the 220 uncovered controls; their rendered rows were loaded and counted, but only the covered HIPAA AC-01 relation is copied into the audit dataset.

## Recommended local corrections for a later implementation phase

1. Replace the /procedures placeholder with a dedicated Procedures page while preserving the shared AppShell.
2. Add the production list structure, exact columns, counts, filters, sortable fields, pagination, and selection/reassignment controls.
3. Implement the field-aware search behavior and document unsupported operators rather than approximating them silently.
4. Add a Coverage view backed by the verified 221-control totals and live relationship data; resolve the 0/221 versus 1/221 display rule with the product/backend owner before choosing a local metric.
5. Implement record details and version editing with the observed tabs, RACI constraints, step flags, evidence options, and submit checklist.
6. Reproduce the exact creation and edit fields, conditional Recurrence and Applies to all vendors controls, category choices, and procedure-type-to-primary-link defaults.
7. Add settings, import, clone, and export only after their local behaviors and validation rules are intentionally scoped.
8. Keep demonstration fixture content explicitly labeled as demo data; do not treat Dummy - MFA enrolment for new staff as an operational security procedure.

## Files inspected

- src/App.jsx
- src/data/navigation.js
- src/pages/PlaceholderPage.jsx

No local Procedures component or stylesheet exists yet.

## Git and write-safety record

- This review created audit documentation only; no local application code was modified.
- No production write operation was performed.
- No commit, push, pull request, or deployment was performed.
- Pre-existing changes in Policy Library files and Policy Library audit documents were preserved.
