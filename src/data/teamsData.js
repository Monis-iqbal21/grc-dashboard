const makeMembers = (teamId, count, lead = 'Demo Admin') => [
  { id: `${teamId}-member-1`, name: lead, isLead: true },
  ...Array.from({ length: Math.max(0, count - 1) }, (_, index) => ({
    id: `${teamId}-member-${index + 2}`,
    name: `Team member ${String(index + 2).padStart(2, '0')}`,
    isLead: false,
  })),
];

// Local prototype entries: team summary values mirror the production Teams overview.
// Member names are intentionally synthetic and no production member emails are included.
export const initialTeams = [
  {
    id: 'grc-core',
    name: 'GRC Core',
    description: 'Policy, control testing and audit coordination.',
    lead: 'Demo Admin',
    members: makeMembers('grc-core', 8),
    accent: 'blue',
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    description: 'Platform, network and cloud estate ownership.',
    lead: 'Demo Admin',
    members: makeMembers('infrastructure', 9),
    accent: 'cyan',
  },
  {
    id: 'security-operations',
    name: 'Security Operations',
    description: '24/7 monitoring, triage and first response.',
    lead: 'Demo Admin',
    members: makeMembers('security-operations', 7),
    accent: 'violet',
  },
  {
    id: 'third-party-risk',
    name: 'Third-Party Risk',
    description: 'Vendor due diligence and ongoing assurance.',
    lead: 'Demo Admin',
    members: makeMembers('third-party-risk', 8),
    accent: 'amber',
  },
];

export const teamLeadOptions = ['Demo Admin', 'Nimra Khan', 'Maizah Kaleem'];

// Names are demo-only choices used by this local prototype's member picker.
export const availableTeamMembers = [
  'Nimra Khan',
  'Maizah Kaleem',
  'Sarah Chen',
  'Marcus Reid',
];

