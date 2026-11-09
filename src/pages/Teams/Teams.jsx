import { useEffect, useId, useMemo, useState } from 'react';
import {
  Archive, ArrowRight, Building2, Check, ChevronDown, Crown, Layers3,
  Plus, Search, Server, ShieldCheck, Trash2, UserPlus, UsersRound, X,
} from 'lucide-react';
import { availableTeamMembers, initialTeams, teamLeadOptions } from '../../data/teamsData.js';
import './Teams.css';

const teamIcons = {
  blue: Layers3,
  cyan: Server,
  violet: ShieldCheck,
  amber: Building2,
};

function initials(name) {
  if (name.startsWith('Team member')) return name.slice(-2);
  return name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

function TeamCard({ team, index, onOpen }) {
  const Icon = teamIcons[team.accent] || UsersRound;
  return (
    <article className={`teams-card teams-card--${team.accent}${team.archived ? ' is-archived' : ''}`}>
      <div className="teams-card-topline" />
      <div className="teams-card-head">
        <span className="teams-card-icon"><Icon size={21} aria-hidden="true" /></span>
        <span className="teams-card-index">TEAM {String(index + 1).padStart(2, '0')}</span>
        {team.archived && <span className="teams-archived-badge">Archived</span>}
      </div>

      <div className="teams-card-title-row">
        <div className="teams-card-copy">
          <h3>{team.name}</h3>
          <p>{team.description || 'No team description has been added.'}</p>
        </div>
        <div className="teams-member-total" aria-label={`${team.members.length} members`}>
          <strong>{team.members.length}</strong><span>MEMBERS</span>
        </div>
      </div>

      <div className="teams-card-members" aria-hidden="true">
        <div className="teams-avatar-stack">
          {team.members.slice(0, 4).map((member) => (
            <span className="teams-avatar" key={member.id}>{initials(member.name)}</span>
          ))}
          {team.members.length > 4 && <span className="teams-avatar teams-avatar--more">+{team.members.length - 4}</span>}
        </div>
        <span>Team roster</span>
      </div>

      <footer className="teams-card-footer">
        <div className="teams-lead">
          <span className="teams-lead-avatar">{team.lead ? initials(team.lead) : '—'}</span>
          <span><small>TEAM LEAD</small><strong>{team.lead || 'Not assigned'}</strong></span>
        </div>
        <button type="button" className="teams-open-button" onClick={() => onOpen(team.id)}>
          Manage team <ArrowRight size={15} aria-hidden="true" />
        </button>
      </footer>
    </article>
  );
}

function ModalFrame({ title, description, onClose, children, className = '' }) {
  const titleId = useId();
  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  return (
    <div className="teams-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`teams-modal ${className}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="teams-modal-heading">
          <div><h2 id={titleId}>{title}</h2>{description && <p>{description}</p>}</div>
          <button type="button" className="teams-icon-button" aria-label="Close dialog" onClick={onClose}><X size={17} /></button>
        </header>
        {children}
      </section>
    </div>
  );
}

function CreateTeamDialog({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [lead, setLead] = useState('');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (!name.trim()) {
      setError('Enter a team name to continue.');
      return;
    }
    onCreate({ name: name.trim(), description: description.trim(), department, lead });
  };

  return (
    <ModalFrame title="New team" description="Create a workspace group and assign its team lead." onClose={onClose}>
      <form className="teams-form" onSubmit={submit}>
        <label className="teams-field"><span>Team name <b>*</b></span><input autoFocus maxLength={80} placeholder="e.g. Blue Team" value={name} onChange={(event) => { setName(event.target.value); setError(''); }} /></label>
        <label className="teams-field"><span>Description</span><textarea rows={3} maxLength={240} placeholder="What does this team own?" value={description} onChange={(event) => setDescription(event.target.value)} /></label>
        <div className="teams-form-row">
          <label className="teams-field"><span>Department / unit</span><span className="teams-native-select"><select value={department} onChange={(event) => setDepartment(event.target.value)}><option value="">—</option></select><ChevronDown size={15} aria-hidden="true" /></span></label>
          <label className="teams-field"><span>Team lead</span><span className="teams-native-select"><select value={lead} onChange={(event) => setLead(event.target.value)}><option value="">—</option>{teamLeadOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select><ChevronDown size={15} aria-hidden="true" /></span></label>
        </div>
        {lead && <p className="teams-form-hint"><Check size={14} aria-hidden="true" /> {lead} will be added as a team member.</p>}
        {error && <p className="teams-form-error" role="alert">{error}</p>}
        <footer className="teams-modal-actions"><button type="button" className="teams-button teams-button--quiet" onClick={onClose}>Cancel</button><button type="submit" className="teams-button teams-button--primary" disabled={!name.trim()}><Plus size={15} />Create team</button></footer>
      </form>
    </ModalFrame>
  );
}

function AddPeopleDialog({ team, onClose, onAdd }) {
  const [selected, setSelected] = useState([]);
  const [query, setQuery] = useState('');
  const eligibleMembers = availableTeamMembers.filter((name) => (
    !team.members.some((member) => member.name === name)
    && name.toLowerCase().includes(query.trim().toLowerCase())
  ));
  const hasUnassignedMembers = availableTeamMembers.some((name) => !team.members.some((member) => member.name === name));

  return (
    <ModalFrame title="Add people to the team" description={`Choose workspace members to add to ${team.name}.`} onClose={onClose}>
      <div className="teams-add-content">
        <label className="teams-add-search"><Search size={16} aria-hidden="true" /><input aria-label="Search people" placeholder="Search people" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        {eligibleMembers.length > 0 && <div className="teams-pick-list">{eligibleMembers.map((name) => (
          <label className={`teams-pick-row${selected.includes(name) ? ' is-selected' : ''}`} key={name}>
            <span className="teams-lead-avatar">{initials(name)}</span><span className="teams-pick-name">{name}<small>Workspace member</small></span>
            <input type="checkbox" checked={selected.includes(name)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, name] : current.filter((item) => item !== name))} />
          </label>
        ))}</div>}
        {hasUnassignedMembers && query && eligibleMembers.length === 0 && <p className="teams-add-empty">No available people match “{query}”.</p>}
        {!hasUnassignedMembers && <p className="teams-add-empty">Everyone matching is already on this team.</p>}
        <footer className="teams-modal-actions"><button type="button" className="teams-button teams-button--quiet" onClick={onClose}>Cancel</button><button type="button" className="teams-button teams-button--primary" disabled={!selected.length} onClick={() => onAdd(selected)}><UserPlus size={15} />Add{selected.length ? ` ${selected.length} people` : ''}</button></footer>
      </div>
    </ModalFrame>
  );
}

function TeamDetailDialog({ team, onClose, onAddPeople, onMakeLead, onUnsetLead, onRemoveMember, onToggleArchive, onDelete }) {
  const [showAddPeople, setShowAddPeople] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <ModalFrame title={team.name} description={team.description} onClose={onClose} className="teams-detail-modal">
      <div className="teams-detail-summary">
        <div><span>Members</span><strong>{team.members.length}</strong></div>
        <div><span>Team lead</span><strong>{team.lead || 'Not assigned'}</strong></div>
        <button type="button" className="teams-button teams-button--primary" onClick={() => setShowAddPeople(true)}><UserPlus size={15} />Add people</button>
      </div>
      <div className="teams-roster-heading"><div><span className="teams-eyebrow">TEAM DIRECTORY</span><h3>Members</h3></div><span>{team.members.length} total</span></div>
      <div className="teams-roster-list">
        {team.members.map((member) => (
          <div className="teams-roster-row" key={member.id}>
            <span className="teams-lead-avatar">{initials(member.name)}</span>
            <span className="teams-roster-name">{member.name}<small>{member.isLead ? 'Team lead' : 'Workspace member'}</small></span>
            {member.isLead ? <><span className="teams-lead-tag"><Crown size={13} />Lead</span><button type="button" className="teams-row-action" onClick={() => onUnsetLead(member.name)}>Unset lead</button></> : <button type="button" className="teams-row-action" onClick={() => onMakeLead(member.name)}>Make lead</button>}
            <button type="button" className="teams-remove-button" aria-label={`Remove ${member.name}`} onClick={() => onRemoveMember(member.id)}><X size={15} /></button>
          </div>
        ))}
      </div>
      <footer className="teams-detail-footer">
        <button type="button" className="teams-danger-link" onClick={() => setConfirmDelete(true)}><Trash2 size={14} />Delete team</button>
        <button type="button" className="teams-button teams-button--quiet" onClick={() => onToggleArchive(team.id)}><Archive size={14} />{team.archived ? 'Restore team' : 'Archive team'}</button>
      </footer>

      {showAddPeople && <AddPeopleDialog team={team} onClose={() => setShowAddPeople(false)} onAdd={(names) => { onAddPeople(team.id, names); setShowAddPeople(false); }} />}
      {confirmDelete && (
        <ModalFrame title="Delete team?" description={`“${team.name}” and its local sample roster will be removed from this prototype.`} onClose={() => setConfirmDelete(false)} className="teams-confirm-modal">
          <footer className="teams-modal-actions"><button type="button" className="teams-button teams-button--quiet" onClick={() => setConfirmDelete(false)}>Cancel</button><button type="button" className="teams-button teams-button--danger" onClick={() => onDelete(team.id)}>Delete team</button></footer>
        </ModalFrame>
      )}
    </ModalFrame>
  );
}

export default function Teams() {
  const [teams, setTeams] = useState(initialTeams);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [view, setView] = useState('active');
  const [notice, setNotice] = useState('');
  const selectedTeam = teams.find((team) => team.id === selectedTeamId);
  const visibleTeams = useMemo(() => teams.filter((team) => view === 'archived' ? team.archived : !team.archived), [teams, view]);
  const totalMembers = teams.reduce((total, team) => total + team.members.length, 0);
  const activeCount = teams.filter((team) => !team.archived).length;
  const archivedCount = teams.length - activeCount;

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(''), 5000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const createTeam = ({ name, description, lead }) => {
    const id = `team-${Date.now()}`;
    const members = lead ? [{ id: `${id}-lead`, name: lead, isLead: true }] : [];
    setTeams((current) => [...current, { id, name, description, lead, members, accent: ['blue', 'cyan', 'violet', 'amber'][current.length % 4], archived: false }]);
    setShowCreateTeam(false);
    setView('active');
    setNotice(`${name} was added to this local prototype.`);
  };

  const updateTeam = (teamId, updater) => setTeams((current) => current.map((team) => team.id === teamId ? updater(team) : team));
  const addPeople = (teamId, names) => {
    updateTeam(teamId, (team) => ({ ...team, members: [...team.members, ...names.map((name) => ({ id: `${teamId}-${Date.now()}-${name.toLowerCase().replaceAll(' ', '-')}`, name, isLead: false }))] }));
    setNotice(`${names.length} ${names.length === 1 ? 'person was' : 'people were'} added to the team.`);
  };
  const makeLead = (teamId, name) => {
    updateTeam(teamId, (team) => {
      const alreadyMember = team.members.some((member) => member.name === name);
      const members = alreadyMember
        ? team.members.map((member) => ({ ...member, isLead: member.name === name }))
        : [...team.members.map((member) => ({ ...member, isLead: false })), { id: `${teamId}-lead-${Date.now()}`, name, isLead: true }];
      return { ...team, lead: name, members };
    });
    setNotice(`${name} is now the team lead.`);
  };
  const unsetLead = (teamId, name) => {
    updateTeam(teamId, (team) => ({ ...team, lead: team.lead === name ? '' : team.lead, members: team.members.map((member) => member.name === name ? { ...member, isLead: false } : member) }));
    setNotice(`${name} is no longer marked as the team lead.`);
  };
  const removeMember = (teamId, memberId) => {
    updateTeam(teamId, (team) => {
      const removedMember = team.members.find((member) => member.id === memberId);
      return { ...team, lead: removedMember?.isLead ? '' : team.lead, members: team.members.filter((member) => member.id !== memberId) };
    });
    setNotice('The member was removed from this local team.');
  };
  const toggleArchive = (teamId) => {
    updateTeam(teamId, (team) => ({ ...team, archived: !team.archived }));
    setSelectedTeamId(null);
    setNotice('Team status updated in this local prototype.');
  };
  const deleteTeam = (teamId) => {
    setTeams((current) => current.filter((team) => team.id !== teamId));
    setSelectedTeamId(null);
    setNotice('Team removed from this local prototype.');
  };

  return (
    <div className="teams-page">
      <header className="teams-hero">
        <div className="teams-hero-copy">
          <span className="teams-eyebrow">ADMINISTRATION / PEOPLE &amp; ACCESS</span>
          <h1>Teams</h1>
          <p>Bring ownership, response, and governance work together in clear groups.</p>
        </div>
        <button type="button" className="teams-button teams-button--primary teams-create-button" onClick={() => setShowCreateTeam(true)}><Plus size={17} />New team</button>
      </header>

      <section className="teams-overview" aria-label="Team overview">
        <div className="teams-overview-lead"><span className="teams-overview-icon"><UsersRound size={19} /></span><span><small>Team directory</small><strong>{teams.length} teams</strong></span></div>
        <div className="teams-overview-stat"><span>Active teams</span><strong>{activeCount}</strong></div>
        <div className="teams-overview-stat"><span>Member assignments</span><strong>{totalMembers}</strong></div>
        <span className="teams-demo-label">Local demo data</span>
      </section>

      <section className="teams-directory" aria-label="Team directory">
        <div className="teams-directory-heading">
          <div><span className="teams-eyebrow">YOUR WORKSPACE</span><h2>Team directory</h2><p>Open a team to review its roster and ownership.</p></div>
          <div className="teams-view-switch" role="group" aria-label="Team status filter">
            <button type="button" className={view === 'active' ? 'is-active' : ''} aria-pressed={view === 'active'} onClick={() => setView('active')}>Active <span>{activeCount}</span></button>
            <button type="button" className={view === 'archived' ? 'is-active' : ''} aria-pressed={view === 'archived'} onClick={() => setView('archived')}>Archived <span>{archivedCount}</span></button>
          </div>
        </div>

        {visibleTeams.length ? <div className="teams-grid">{visibleTeams.map((team, index) => <TeamCard key={team.id} team={team} index={index} onOpen={setSelectedTeamId} />)}</div> : (
          <div className="teams-empty"><span><UsersRound size={21} /></span><h3>{view === 'archived' ? 'No archived teams' : 'No teams yet'}</h3><p>{view === 'archived' ? 'Teams you archive will appear here.' : 'Create a team to start organizing workspace ownership.'}</p>{view === 'active' && <button type="button" className="teams-button teams-button--primary" onClick={() => setShowCreateTeam(true)}><Plus size={15} />Create a team</button>}</div>
        )}
      </section>

      <p className="teams-prototype-note">Changes on this page stay in this browser session and do not update production.</p>
      {showCreateTeam && <CreateTeamDialog onClose={() => setShowCreateTeam(false)} onCreate={createTeam} />}
      {selectedTeam && <TeamDetailDialog team={selectedTeam} onClose={() => setSelectedTeamId(null)} onAddPeople={addPeople} onMakeLead={(name) => makeLead(selectedTeam.id, name)} onUnsetLead={(name) => unsetLead(selectedTeam.id, name)} onRemoveMember={(memberId) => removeMember(selectedTeam.id, memberId)} onToggleArchive={toggleArchive} onDelete={deleteTeam} />}
      {notice && <div className="teams-toast" role="status" aria-live="polite"><Check size={15} /><span>{notice}</span><button type="button" aria-label="Dismiss notification" onClick={() => setNotice('')}><X size={15} /></button></div>}
    </div>
  );
}

