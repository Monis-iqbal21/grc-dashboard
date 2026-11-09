export const userRoles = [
  'Analyst',
  'Approver',
  'Asset Owner',
  'CISO / Executive',
  'Compliance Manager',
  'Internal Auditor',
  'Organisation Owner',
  'Risk Manager',
  'User Administrator',
  'Viewer / Read-Only',
];

export const userScopes = [
  'Global — the whole organisation',
  'Department',
  'Business Unit',
  'Asset Group',
  'Team',
  'Own records only — just what they raise or are named on',
];

export const userTeams = [
  'GRC Core',
  'Infrastructure',
  'Security Operations',
  'Third-Party Risk',
];

export const initialUsers = [
  {
    id: 'user-01',
    name: 'Nimra Khan',
    username: 'Khan_nimra592',
    email: 'nimra.khan@example.test',
    department: '',
    roles: [
      { id: 'user-01-role-01', name: 'Viewer / Read-Only', scope: 'Global' },
      { id: 'user-01-role-02', name: 'Analyst', scope: 'Team: Infrastructure' },
    ],
    teams: ['GRC Core', 'Infrastructure', 'Security Operations'],
    status: 'Active',
    lastLogin: '06 Sep 2026',
    dormant: false,
    accent: 'blue',
  },
  {
    id: 'user-02',
    name: 'Maizah Kaleem',
    username: 'maizah_k',
    email: 'maizah.kaleem@example.test',
    department: '',
    roles: [
      { id: 'user-02-role-01', name: 'Viewer / Read-Only', scope: 'Global' },
      { id: 'user-02-role-02', name: 'Analyst', scope: 'Global' },
    ],
    teams: ['GRC Core', 'Infrastructure', 'Security Operations', 'Third-Party Risk'],
    status: 'Active',
    lastLogin: '06 Sep 2026',
    dormant: false,
    accent: 'violet',
  },
  {
    id: 'user-03',
    name: 'Demo Admin',
    username: 'nvector_demo',
    email: 'demo.admin@example.test',
    department: '',
    roles: [
      { id: 'user-03-role-01', name: 'Organisation Owner', scope: 'Global' },
    ],
    teams: ['GRC Core', 'Infrastructure', 'Security Operations', 'Third-Party Risk'],
    status: 'Active',
    lastLogin: '09 Nov 2026',
    dormant: false,
    accent: 'cyan',
  },
];
