# Tasks Production Audit

**Audited:** 2026-11-08  
**URL:** `https://app.nvector.io/tasks`  
**Scope:** Read-only inspection of the Tasks page, its search guide, export menu, and New/Edit task forms. No production records were created, edited, sent, exported, or removed.

## Production page inventory

- The global header identifies the page as **Tasks**. The page content repeats that title and shows a task count. The local page keeps the shared topbar and labels its content **Task Register**.
- The page actions are **Export** and **New Task**.
- The register columns are **REF**, **TASK**, **ASSIGNEE**, **PRIORITY**, **STATUS**, **DUE**, and **ACTIONS**.
- The inspected view contained six records and displayed `1–6 of 6`; the previous/next controls were disabled.
- Priority choices are `critical`, `high`, `medium`, and `low`.
- The inline status selector exposed `open`, `sent`, `responded`, `closed`, and `cancelled`.
- Open rows showed **Send**; sent rows showed **Resend** and **Link**. Rows also exposed **Edit** and a remove control.
- Export offered **CSV** (“Opens in Excel, Sheets and data tools”), **PDF** (“For sharing and printing”), and **HTML** (“Opens in a browser, rows expand”).

## Search and grouping

- Search accepts plain words against names and descriptions, plus structured field/operator/value expressions.
- The guide documents `:`, `=`, `!=`, `in (…)`, `>`, `>=`, `<`, `<=`, `between a..b`, `has`, `is empty`, and `is set`.
- Date terms shown are `overdue`, `today`, `yesterday`, `last 30d`, `last 3m`, `next 7d`, `this_week`, `this_month`, `this_quarter`, `this_year`, and `expiring 30`.
- Combining syntax shown includes `and`, `or`, `not`, and parentheses.
- Listed task fields are `assigned_to`, `created`, `description`, `due_date`, `priority`, `ref`, `responded`, `sent`, `source_ref`, `source_type`, `status`, `title`, `updated`, and `verified_by`.
- **Group by** choices are No grouping, Assigned to, Created, Due, Last updated, Priority, Raised from, Responded, Sent, Source reference, Status, and Verified by.

The production help content has mismatches: its generic examples mention `impact`, `severity`, `category`, and `review_date`, which are absent from the Tasks field list. It also demonstrates `tags has …` without listing `tags` among task fields. The local search supports listed task fields and the demonstrated tag-list operator; it does not invent the other fields.

## New/Edit form

Both forms expose **Title**, **Description / context**, **Related to (type)**, **Related ref**, **Assignee name**, **Assignee email**, **Priority**, **Due date**, and **Tags**. Title is required; the other inspected fields are optional. Placeholder text includes “What you need the assignee to do.”, “risk / control / vulnerability”, “e.g. R-006”, “external responder — no account needed”, and “Add a tag…”. Priority uses the four values listed above. Tags allow choosing an organisation tag or typing a new one; the opened selector showed `Antivirus`, `bcp`, `compliance`, `ransomware`, `sbp`, and `social media`. The form actions are **Cancel** and **Create** or **Save Changes**.

## Local implementation and limitations

- `/tasks` now renders a responsive task register using the existing app shell and centralized NVector tokens.
- Search, grouping, local create/edit/remove, inline status changes, pagination, and CSV/PDF/HTML exports work against illustrative local data.
- Local task names and assignees are anonymized sample values, not production records.
- Sending, resending, and sharing response links require backend integration; the local UI explains that it does not send or share anything.
- No production API or data synchronization was added.
