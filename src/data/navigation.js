import { Activity, Archive, BellRing, BookOpen, BriefcaseBusiness, CheckCheck, ClipboardList, FileCheck2, FileClock, Fingerprint, Gauge, KeyRound, LayoutDashboard, ListChecks, Network, Radio, ScrollText, ShieldAlert, ShieldCheck, Siren, Users, Waypoints } from 'lucide-react';

export const navigation = [
  { label: 'Executive', items: [
    { label: 'CISO Dashboard', path: '/ciso', icon: Gauge },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ] },
  { label: 'Governance', items: [
    { label: 'Policies', path: '/policies', icon: ScrollText },
    { label: 'Policy Library', path: '/policy-library', icon: BookOpen },
    { label: 'Tasks', path: '/tasks', icon: ListChecks },
    { label: 'Approvals', path: '/approvals', icon: CheckCheck },
    { label: 'Reports', path: '/reports', icon: FileCheck2 },
    { label: 'Audit Trail', path: '/audit-trail', icon: FileClock },
  ] },
  { label: 'Administration', items: [
    { label: 'Users', path: '/users', icon: Users },
    { label: 'Teams', path: '/teams', icon: BriefcaseBusiness },
    { label: 'Org Hierarchy', path: '/org-hierarchy', icon: Network },
    { label: 'Roles & Permissions', path: '/roles-permissions', icon: KeyRound },
    { label: 'Access Governance', path: '/access-governance', icon: Fingerprint },
  ] },
  { label: 'Risk', items: [
    { label: 'Risk Register', path: '/risks', icon: ShieldAlert },
    { label: 'Vulnerabilities', path: '/vulnerabilities', icon: Siren },
    { label: 'Incidents', path: '/incidents', icon: BellRing },
    { label: 'Asset Inventory', path: '/asset-inventory', icon: Archive },
    { label: 'Vendors', path: '/vendors', icon: BriefcaseBusiness },
    { label: 'Vendor Campaigns', path: '/vendor-campaigns', icon: Radio },
    { label: 'Exceptions', path: '/exceptions', icon: ShieldCheck },
  ] },
  { label: 'Compliance', items: [
    { label: 'Compliance', path: '/compliance', icon: ClipboardList },
    { label: 'Controls Library', path: '/controls', icon: BookOpen },
    { label: 'Audit Projects', path: '/audit-projects', icon: FileCheck2 },
    { label: 'Monitoring', path: '/monitoring', icon: Activity },
    { label: 'Evidence Vault', path: '/evidence-vault', icon: Archive },
    { label: 'CAPA & Findings', path: '/capa-findings', icon: Waypoints },
  ] },
];

export const allNavigationItems = navigation.flatMap((group) => group.items);
