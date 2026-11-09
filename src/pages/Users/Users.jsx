import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  Archive, ArrowDownToLine, ArrowRight, BadgeCheck, Check, ChevronDown, CircleHelp,
  Clock3, KeyRound, Mail, Plus, Search, Shield, ShieldCheck, SlidersHorizontal,
  UserPlus, UsersRound,
  X,
} from 'lucide-react';
import { initialUsers, userRoles, userScopes, userTeams } from '../../data/usersData.js';
import './Users.css';

const statusOptions = ['All statuses', 'Active', 'Deactivated', 'Archived'];
const departmentOptions = ['All departments', 'Unassigned'];

function initials(name) {
  return name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

function Modal({ title, description, children, onClose, className = '' }) {
  const titleId = useId();
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="users-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`users-modal ${className}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="users-modal-header">
          <div><h2 id={titleId}>{title}</h2>{description && <p>{description}</p>}</div>
          <button type="button" className="users-icon-button" aria-label="Close dialog" onClick={onClose}><X size={18} /></button>
        </header>
        {children}
      </section>
    </div>
  );
}

function Field({ label, required = false, children, hint, className = '' }) {
  return (
    <label className={`users-field ${className}`}>
      <span>{label}{required && <b aria-hidden="true"> *</b>}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

function SelectField({ value, onChange, options, disabled = false, ariaLabel }) {
  return (
    <span className="users-select-wrap">
      <select value={value} onChange={onChange} disabled={disabled} aria-label={ariaLabel}>
        {options.map((option) => {
          const item = typeof option === 'string' ? { value: option, label: option } : option;
          return <option key={item.value} value={item.value} disabled={item.disabled}>{item.label}</option>;
        })}
      </select>
      <ChevronDown size={15} aria-hidden="true" />
    </span>
  );
}

function AddUserDialog({ onClose, onCreate }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [scope, setScope] = useState('Global — the whole organisation');
  const [target, setTarget] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const needsTarget = ['Department', 'Business Unit', 'Asset Group', 'Team'].includes(scope);
  const noTargetOptions = needsTarget && scope !== 'Team';

  const changeRole = (event) => {
    const nextRole = event.target.value;
    setRole(nextRole);
    setScope(nextRole === 'Analyst' ? 'Department' : 'Global — the whole organisation');
    setTarget('');
    setReason('');
  };

  const changeScope = (event) => {
    setScope(event.target.value);
    setTarget('');
  };

  const targetOptions = scope === 'Team' ? userTeams : [];
  const canCreate = firstName.trim() && username.trim() && email.includes('@') && (!role || (reason.trim() && (!needsTarget || target)));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canCreate) {
      setError('Complete the required fields and access details before adding this user.');
      return;
    }
    onCreate({
      name: `${firstName.trim()} ${lastName.trim()}`.trim(),
      username: username.trim(),
      email: email.trim(),
      department: '',
      roles: role ? [{ id: `new-role-${Date.now()}`, name: role, scope: scope.startsWith('Global') ? 'Global' : `${scope}${target ? `: ${target}` : ''}` }] : [],
      teams: target && scope === 'Team' ? [target] : [],
      status: 'Active',
      lastLogin: 'Never',
      dormant: false,
      accent: 'blue',
    });
  };

  return (
    <Modal title="Add user" description="Create a local directory entry and set its initial access." onClose={onClose} className="users-form-modal">
      <form className="users-form" onSubmit={handleSubmit}>
        <div className="users-form-grid">
          <Field label="First name" required><input autoFocus value={firstName} onChange={(event) => setFirstName(event.target.value)} autoComplete="given-name" /></Field>
          <Field label="Last name"><input value={lastName} onChange={(event) => setLastName(event.target.value)} autoComplete="family-name" /></Field>
          <Field label="Username" required><input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" /></Field>
          <Field label="Email" required><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></Field>
          <Field label="Department" className="users-field-wide" hint="No departments are configured in this prototype.">
            <SelectField value="—" onChange={() => {}} options={['—']} ariaLabel="Department" />
          </Field>
        </div>

        <section className="users-access-form">
          <div className="users-access-intro"><span className="users-access-icon"><Shield size={17} /></span><span><strong>Access assignment</strong><small>Role says what they can do. Scope says where it applies.</small></span></div>
          <div className="users-form-grid">
            <Field label="Role">
              <SelectField value={role} onChange={changeRole} options={[{ value: '', label: 'No role yet' }, ...userRoles]} ariaLabel="Role" />
            </Field>
            <Field label="Scope">
              <SelectField value={scope} onChange={changeScope} options={userScopes} disabled={!role} ariaLabel="Scope" />
            </Field>
            {needsTarget && (
              <Field label={scope === 'Team' ? 'Team' : scope} required className="users-field-wide" hint={noTargetOptions ? `No ${scope.toLowerCase()} units are configured. Create one under Organisation units first.` : undefined}>
                <SelectField value={target} onChange={(event) => setTarget(event.target.value)} options={[{ value: '', label: noTargetOptions ? 'None available' : 'Select…', disabled: true }, ...targetOptions]} disabled={noTargetOptions} ariaLabel={`${scope} target`} />
              </Field>
            )}
            {role && <Field label="Justification for this access" required className="users-field-wide"><textarea rows="3" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Explain why this access is needed…" /></Field>}
          </div>
          {role && <p className="users-form-note"><CircleHelp size={14} /> Permission details are not available in this local prototype.</p>}
        </section>

        <p className="users-form-note"><Mail size={14} /> Production emails a temporary password; no email is sent from this prototype.</p>
        {error && <p className="users-form-error" role="alert">{error}</p>}
        <footer className="users-modal-actions"><button type="button" className="users-button users-button--quiet" onClick={onClose}>Cancel</button><button type="submit" className="users-button users-button--primary" disabled={!canCreate}><UserPlus size={16} /> Add user</button></footer>
      </form>
    </Modal>
  );
}

function InviteDialog({ onClose, onInvite }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validEmail) return;
    onInvite({ email: email.trim(), role, message: message.trim() });
  };

  return (
    <Modal title="Invite people to your organisation" description="Prepare an invitation without sending email from this prototype." onClose={onClose} className="users-form-modal">
      <form className="users-form" onSubmit={handleSubmit}>
        <Field label="Email address" required hint="They choose their own username and password when they accept."><input autoFocus type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@company.com" /></Field>
        <Field label="Role" hint="Granted automatically when they accept. Leave blank to decide later."><SelectField value={role} onChange={(event) => setRole(event.target.value)} options={[{ value: '', label: 'No role — read-only until you assign one' }, ...userRoles]} ariaLabel="Invitation role" /></Field>
        <Field label="Message (optional)"><textarea rows="4" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Add a note to the invitation…" /></Field>
        <p className="users-form-note"><Mail size={14} /> No invitation email will be sent.</p>
        <footer className="users-modal-actions"><button type="button" className="users-button users-button--quiet" onClick={onClose}>Close</button><button type="submit" className="users-button users-button--primary" disabled={!validEmail}><Mail size={15} /> Prepare invitation</button></footer>
      </form>
    </Modal>
  );
}

function UserAccessDialog({ user, onClose, onUpdate, notify }) {
  const [role, setRole] = useState('');
  const [scope, setScope] = useState('Global — the whole organisation');
  const [target, setTarget] = useState('');
  const roleCounts = user.roles.length;
  const needsTarget = ['Department', 'Business Unit', 'Asset Group', 'Team'].includes(scope);
  const targetOptions = scope === 'Team' ? userTeams : [];
  const targetUnavailable = needsTarget && targetOptions.length === 0;

  const update = (changes) => onUpdate(user.id, changes);
  const addRole = () => {
    if (!role) return;
    const roleScope = scope.startsWith('Global') ? 'Global' : scope === 'Own records only — just what they raise or are named on' ? 'Own records only' : `${scope}${target ? `: ${target}` : ''}`;
    update({ roles: [...user.roles, { id: `${user.id}-role-${Date.now()}`, name: role, scope: roleScope }] });
    setRole('');
    setScope('Global — the whole organisation');
    setTarget('');
    notify(`${role} access was added to this local prototype.`);
  };
  const removeRole = (roleId) => {
    update({ roles: user.roles.filter((item) => item.id !== roleId) });
    notify('Role assignment removed from this local prototype.');
  };
  const setStatus = (status) => {
    update({ status });
    notify(`${user.name} marked ${status.toLowerCase()} in this local prototype.`);
    onClose();
  };

  return (
    <Modal title={user.name} description={user.email} onClose={onClose} className="users-access-modal">
      <div className="users-access-body">
        <div className="users-profile-summary"><span className={`users-avatar users-avatar--${user.accent}`}>{initials(user.name)}</span><div><strong>{user.username}</strong><span className={`users-status users-status--${user.status.toLowerCase()}`}>{user.status}</span></div><div className="users-profile-count"><strong>{roleCounts}</strong><small>role assignments</small></div></div>
        <section className="users-detail-section">
          <div className="users-section-heading"><div><span className="users-section-kicker">ACCESS</span><h3>Role assignments</h3></div><button type="button" className="users-button users-button--quiet users-button--small" onClick={() => document.getElementById('users-add-role')?.focus()}><Plus size={14} /> Assign a role</button></div>
          {user.roles.length ? <div className="users-assignment-list">{user.roles.map((item) => <div className="users-assignment" key={item.id}><span className="users-assignment-icon"><ShieldCheck size={15} /></span><span><strong>{item.name}</strong><small>{item.scope}</small></span><button type="button" className="users-text-action users-text-action--danger" onClick={() => removeRole(item.id)}>Revoke</button></div>)}</div> : <p className="users-empty-inline">No role assignments yet.</p>}
          <div className="users-inline-role-form">
            <SelectField value={role} onChange={(event) => setRole(event.target.value)} options={[{ value: '', label: 'Select a role…' }, ...userRoles]} ariaLabel="Role to assign" />
            <SelectField value={scope} onChange={(event) => { setScope(event.target.value); setTarget(''); }} options={userScopes} ariaLabel="Role scope" />
            {needsTarget && <SelectField value={target} onChange={(event) => setTarget(event.target.value)} options={[{ value: '', label: targetUnavailable ? 'None available' : 'Select team…', disabled: true }, ...targetOptions]} disabled={targetUnavailable} ariaLabel={`${scope} target`} />}
            <button id="users-add-role" type="button" className="users-button users-button--primary users-button--small" disabled={!role || (needsTarget && !target)} onClick={addRole}><Plus size={14} /> Add</button>
            {targetUnavailable && <small className="users-target-hint">No {scope.toLowerCase()} units are configured under Organisation units.</small>}
          </div>
        </section>

        <section className="users-detail-section">
          <div className="users-section-heading"><div><span className="users-section-kicker">MEMBERSHIPS</span><h3>Teams</h3></div></div>
          <div className="users-team-chips">{user.teams.length ? user.teams.map((team) => <span key={team}><UsersRound size={13} />{team}</span>) : <small>No team memberships</small>}</div>
        </section>

        <section className="users-detail-section users-department-section">
          <div><span className="users-section-kicker">ORGANISATION</span><h3>Department</h3></div>
          <span className="users-department-value">{user.department || 'No department'}</span>
        </section>

        <footer className="users-manage-footer">
          <button type="button" className="users-text-action" onClick={() => notify('Password reset is unavailable in the local prototype.')}><KeyRound size={15} /> Reset password</button>
          <div>{user.status === 'Archived' ? <button type="button" className="users-text-action" onClick={() => setStatus('Active')}><ArrowRight size={15} /> Restore</button> : <button type="button" className="users-text-action" onClick={() => setStatus(user.status === 'Active' ? 'Deactivated' : 'Active')}><SlidersHorizontal size={15} /> {user.status === 'Active' ? 'Deactivate' : 'Reactivate'}</button>}{user.status !== 'Archived' && <button type="button" className="users-text-action users-text-action--danger" onClick={() => setStatus('Archived')}><Archive size={15} /> Archive</button>}</div>
        </footer>
      </div>
    </Modal>
  );
}

function UserIdentity({ user }) {
  return (
    <div className="users-identity-cell">
      <span className={`users-avatar users-avatar--${user.accent}`}>{initials(user.name)}</span>
      <span className="users-identity-copy"><strong>{user.name}</strong><small>{user.email}</small></span>
    </div>
  );
}

function UserRoles({ roles }) {
  if (!roles.length) return <span className="users-muted">No role yet</span>;
  return <div className="users-role-stack">{roles.slice(0, 2).map((role) => <span className="users-role-pill" key={role.id}><strong>{role.name}</strong><small>{role.scope}</small></span>)}{roles.length > 2 && <span className="users-role-more">+{roles.length - 2}</span>}</div>;
}

function UserTableRow({ user, selected, onSelect, onManage }) {
  return (
    <div className={`users-table-row${selected ? ' is-selected' : ''}`} role="row">
      <div className="users-cell users-cell--check"><input type="checkbox" checked={selected} onChange={() => onSelect(user.id)} aria-label={`Select ${user.name}`} /></div>
      <div className="users-cell users-cell--user"><UserIdentity user={user} /></div>
      <div className="users-cell users-cell--department">{user.department || <span className="users-muted">—</span>}</div>
      <div className="users-cell users-cell--roles"><UserRoles roles={user.roles} /></div>
      <div className="users-cell users-cell--teams"><div className="users-team-list">{user.teams.slice(0, 2).map((team) => <span key={team}>{team}</span>)}{user.teams.length > 2 && <small>+{user.teams.length - 2} more</small>}</div></div>
      <div className="users-cell users-cell--status"><span className={`users-status users-status--${user.status.toLowerCase()}`}><i />{user.status}</span></div>
      <div className="users-cell users-cell--login"><span>{user.lastLogin}</span>{user.dormant && <small>Dormant</small>}</div>
      <div className="users-cell users-cell--action"><button type="button" className="users-manage-button" onClick={() => onManage(user.id)}>Manage <ArrowRight size={14} /></button></div>
    </div>
  );
}

function UserMobileCard({ user, selected, onSelect, onManage }) {
  return (
    <article className={`users-mobile-card${selected ? ' is-selected' : ''}`}>
      <header><label className="users-mobile-select"><input type="checkbox" checked={selected} onChange={() => onSelect(user.id)} aria-label={`Select ${user.name}`} /><span>Select user</span></label><span className={`users-status users-status--${user.status.toLowerCase()}`}><i />{user.status}</span></header>
      <UserIdentity user={user} />
      <div className="users-mobile-details"><div><small>Department</small><strong>{user.department || '—'}</strong></div><div><small>Last login</small><strong>{user.lastLogin}</strong></div><div className="users-mobile-wide"><small>Roles &amp; scopes</small><UserRoles roles={user.roles} /></div><div className="users-mobile-wide"><small>Teams</small><div className="users-team-chips">{user.teams.map((team) => <span key={team}><UsersRound size={12} />{team}</span>)}</div></div></div>
      <button type="button" className="users-manage-button users-manage-button--wide" onClick={() => onManage(user.id)}>Manage access <ArrowRight size={14} /></button>
    </article>
  );
}

export default function Users() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [departmentFilter, setDepartmentFilter] = useState('All departments');
  const [dormantOnly, setDormantOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [activeDialog, setActiveDialog] = useState('');
  const [activeUserId, setActiveUserId] = useState(null);
  const [toast, setToast] = useState('');
  const selectAllRef = useRef(null);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch = !query || [user.name, user.username, user.email].some((field) => field.toLowerCase().includes(query));
      const matchesStatus = statusFilter === 'All statuses' || user.status === statusFilter;
      const matchesDepartment = departmentFilter === 'All departments' || (departmentFilter === 'Unassigned' && !user.department);
      return matchesSearch && matchesStatus && matchesDepartment && (!dormantOnly || user.dormant);
    });
  }, [departmentFilter, dormantOnly, search, statusFilter, users]);

  const allFilteredSelected = filteredUsers.length > 0 && filteredUsers.every((user) => selectedIds.has(user.id));
  const someFilteredSelected = filteredUsers.some((user) => selectedIds.has(user.id));
  const selectedCount = selectedIds.size;
  const activeCount = users.filter((user) => user.status === 'Active').length;
  const roleCount = users.reduce((sum, user) => sum + user.roles.length, 0);
  const activeUser = users.find((user) => user.id === activeUserId);

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = someFilteredSelected && !allFilteredSelected;
  }, [allFilteredSelected, someFilteredSelected]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 3800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const notify = (message) => setToast(message);
  const toggleUser = (userId) => setSelectedIds((current) => {
    const next = new Set(current);
    if (next.has(userId)) next.delete(userId);
    else next.add(userId);
    return next;
  });
  const toggleAllFiltered = () => setSelectedIds((current) => {
    const next = new Set(current);
    if (allFilteredSelected) filteredUsers.forEach((user) => next.delete(user.id));
    else filteredUsers.forEach((user) => next.add(user.id));
    return next;
  });
  const updateUser = (userId, changes) => setUsers((current) => current.map((user) => user.id === userId ? { ...user, ...changes } : user));

  const createUser = (newUser) => {
    const created = { ...newUser, id: `local-user-${Date.now()}` };
    setUsers((current) => [created, ...current]);
    setActiveDialog('');
    notify('User added to this local prototype. No production account was created.');
  };

  const prepareInvite = () => {
    setActiveDialog('');
    notify('Invitation prepared in this local prototype. No email was sent.');
  };

  const bulkStatus = (status) => {
    setUsers((current) => current.map((user) => selectedIds.has(user.id) ? { ...user, status } : user));
    const count = selectedIds.size;
    setSelectedIds(new Set());
    notify(`${count} ${count === 1 ? 'user' : 'users'} marked ${status.toLowerCase()} in this local prototype.`);
  };

  const exportUsers = () => {
    const lines = [['Name', 'Username', 'Email', 'Department', 'Roles and scopes', 'Teams', 'Status', 'Last login'], ...filteredUsers.map((user) => [user.name, user.username, user.email, user.department || '', user.roles.map((role) => `${role.name} @ ${role.scope}`).join('; '), user.teams.join('; '), user.status, user.lastLogin])];
    const csv = lines.map((line) => line.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const file = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nvector-users-local.csv';
    link.click();
    URL.revokeObjectURL(url);
    notify('Local sample users exported as CSV.');
  };

  return (
    <main className="users-page">
      <section className="users-hero">
        <div className="users-hero-copy"><span className="users-eyebrow"><span /> ACCESS MANAGEMENT</span><h1>Users</h1><p>Manage people, assigned roles, and organisational access from one place.</p></div>
        <div className="users-hero-actions"><button type="button" className="users-button users-button--quiet" onClick={exportUsers}><ArrowDownToLine size={16} /> Export</button><button type="button" className="users-button users-button--quiet" onClick={() => setActiveDialog('invite')}><Mail size={16} /> Invite</button><button type="button" className="users-button users-button--primary" onClick={() => setActiveDialog('add')}><Plus size={17} /> Add user</button></div>
      </section>

      <section className="users-overview" aria-label="User directory summary">
        <div className="users-overview-lead"><span className="users-overview-icon"><UsersRound size={19} /></span><span><small>Directory</small><strong>{users.length} {users.length === 1 ? 'user' : 'users'}</strong></span></div>
        <div className="users-overview-stat"><span>Active users</span><strong>{activeCount}</strong></div>
        <div className="users-overview-stat"><span>Role assignments</span><strong>{roleCount}</strong></div>
        <div className="users-overview-note"><span className="users-overview-note-dot" />Local sample data</div>
      </section>

      <section className="users-register">
        <header className="users-register-heading"><div><span className="users-eyebrow">PEOPLE &amp; ACCESS</span><h2>User directory</h2><p>Search identities and review the access each person holds.</p></div><span className="users-result-count">{filteredUsers.length} {filteredUsers.length === 1 ? 'record' : 'records'}</span></header>

        <div className="users-toolbar">
          <label className="users-search"><Search size={17} aria-hidden="true" /><input value={search} onChange={(event) => { setSearch(event.target.value); setSelectedIds(new Set()); }} placeholder="Search name, username or email…" aria-label="Search users by name, username, or email" />{search && <button type="button" aria-label="Clear search" onClick={() => { setSearch(''); setSelectedIds(new Set()); }}><X size={15} /></button>}</label>
          <label className="users-filter"><span>Status</span><SelectField value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setSelectedIds(new Set()); }} options={statusOptions} ariaLabel="Filter by status" /></label>
          <label className="users-filter"><span>Department</span><SelectField value={departmentFilter} onChange={(event) => { setDepartmentFilter(event.target.value); setSelectedIds(new Set()); }} options={departmentOptions} ariaLabel="Filter by department" /></label>
          <label className={`users-dormant-filter${dormantOnly ? ' is-active' : ''}`}><input type="checkbox" checked={dormantOnly} onChange={(event) => { setDormantOnly(event.target.checked); setSelectedIds(new Set()); }} /><Clock3 size={15} /><span>Dormant only</span></label>
        </div>

        {selectedCount > 0 && <div className="users-bulk-bar"><span><Check size={15} />{selectedCount} selected</span><button type="button" onClick={() => bulkStatus('Deactivated')}><SlidersHorizontal size={14} /> Deactivate</button><button type="button" onClick={() => bulkStatus('Active')}><BadgeCheck size={14} /> Reactivate</button><button type="button" className="users-bulk-clear" onClick={() => setSelectedIds(new Set())}>Clear</button></div>}

        {filteredUsers.length ? <>
          <div className="users-table" role="table" aria-label="Users">
            <div className="users-table-header" role="row">
              <div className="users-cell users-cell--check"><input ref={selectAllRef} type="checkbox" checked={allFilteredSelected} onChange={toggleAllFiltered} aria-label="Select all visible users" /></div>
              <div className="users-cell">USER</div><div className="users-cell">DEPARTMENT</div><div className="users-cell">ROLES &amp; SCOPES</div><div className="users-cell">TEAMS</div><div className="users-cell">STATUS</div><div className="users-cell">LAST LOGIN</div><div className="users-cell users-cell--action">&nbsp;</div>
            </div>
            {filteredUsers.map((user) => <UserTableRow key={user.id} user={user} selected={selectedIds.has(user.id)} onSelect={toggleUser} onManage={setActiveUserId} />)}
          </div>
          <div className="users-mobile-list">{filteredUsers.map((user) => <UserMobileCard key={user.id} user={user} selected={selectedIds.has(user.id)} onSelect={toggleUser} onManage={setActiveUserId} />)}</div>
        </> : <div className="users-empty"><span><Search size={21} /></span><h3>No users found</h3><p>Try a different search or update the filters.</p><button type="button" className="users-button users-button--quiet users-button--small" onClick={() => { setSearch(''); setStatusFilter('All statuses'); setDepartmentFilter('All departments'); setDormantOnly(false); setSelectedIds(new Set()); }}>Clear filters</button></div>}
      </section>

      <p className="users-prototype-note"><ShieldCheck size={14} /> Actions on this page only affect this local prototype.</p>

      {activeDialog === 'add' && <AddUserDialog onClose={() => setActiveDialog('')} onCreate={createUser} />}
      {activeDialog === 'invite' && <InviteDialog onClose={() => setActiveDialog('')} onInvite={prepareInvite} />}
      {activeUser && <UserAccessDialog key={activeUser.id} user={activeUser} onClose={() => setActiveUserId(null)} onUpdate={updateUser} notify={notify} />}
      {toast && <div className="users-toast" role="status"><Check size={16} /><span>{toast}</span><button type="button" aria-label="Dismiss notification" onClick={() => setToast('')}><X size={15} /></button></div>}
    </main>
  );
}
