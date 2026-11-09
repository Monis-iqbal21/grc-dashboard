import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle, ArrowDownToLine, ArrowLeft, Check, ChevronDown, ChevronRight,
  Copy, Eye, Info, LockKeyhole, Plus, Search, ShieldCheck, Trash2, X,
} from 'lucide-react';
import { permissionGroups, roleScopes, systemRoles, totalPermissionCount } from '../../data/rolesData.js';
import './RolesPermissions.css';

function getRiskCounts(selectedIds) {
  let high = 0;
  let medium = 0;
  permissionGroups.forEach((group) => group.permissions.forEach((permission) => {
    if (!selectedIds.has(permission.id)) return;
    if (permission.risk === 'high') high += 1;
    if (permission.risk === 'medium') medium += 1;
  }));
  return { high, medium };
}

function Dialog({ title, description, children, onClose, className = '' }) {
  const titleId = useId();
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="roles-dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`roles-dialog ${className}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="roles-dialog-header"><div><h2 id={titleId}>{title}</h2>{description && <p>{description}</p>}</div><button type="button" className="roles-icon-button" aria-label="Close dialog" onClick={onClose}><X size={17} /></button></header>
        {children}
      </section>
    </div>
  );
}

function RiskTag({ risk }) {
  if (!risk) return null;
  return <span className={`roles-risk-tag roles-risk-tag--${risk}`}>{risk} risk</span>;
}

function PermissionGroup({ group, expanded, search, selectedIds, onToggleGroup, onTogglePermission, onToggleAll }) {
  const selectAllRef = useRef(null);
  const query = search.trim().toLowerCase();
  const categoryMatches = query && group.name.toLowerCase().includes(query);
  const visiblePermissions = !query || categoryMatches ? group.permissions : group.permissions.filter((permission) => `${permission.id} ${permission.description}`.toLowerCase().includes(query));
  const selectedVisibleCount = visiblePermissions.reduce((count, permission) => count + Number(selectedIds.has(permission.id)), 0);
  const selectedGroupCount = group.permissions.reduce((count, permission) => count + Number(selectedIds.has(permission.id)), 0);
  const selectAllChecked = visiblePermissions.length > 0 && selectedVisibleCount === visiblePermissions.length;

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = selectedVisibleCount > 0 && !selectAllChecked;
  }, [selectAllChecked, selectedVisibleCount]);

  if (query && visiblePermissions.length === 0) return null;

  return (
    <section className="roles-permission-group">
      <header className="roles-permission-group-header">
        <button type="button" className="roles-group-toggle" aria-expanded={expanded || Boolean(query)} onClick={() => onToggleGroup(group.name)}>
          {expanded || query ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <strong>{group.name}</strong>
          <span>{selectedGroupCount}/{group.permissions.length}</span>
        </button>
        <label className="roles-select-all"><input ref={selectAllRef} type="checkbox" checked={selectAllChecked} disabled={!visiblePermissions.length} onChange={() => onToggleAll(visiblePermissions)} /><span>{query ? 'Select matches' : 'Select all'}</span></label>
      </header>
      {(expanded || query) && <div className="roles-permission-list">{visiblePermissions.map((permission) => <label className="roles-permission-row" key={permission.id}>
        <input type="checkbox" checked={selectedIds.has(permission.id)} onChange={() => onTogglePermission(permission.id)} />
        <span className="roles-permission-copy"><code>{permission.id}</code><small>{permission.description}</small></span>
        <RiskTag risk={permission.risk} />
      </label>)}</div>}
    </section>
  );
}

function RoleBuilder({ seed, onBack, onSave, notify }) {
  const [name, setName] = useState(seed?.name || '');
  const [description, setDescription] = useState(seed?.description || '');
  const [scope, setScope] = useState(seed?.scope || roleScopes[1]);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState(() => new Set(seed?.permissionIds || []));
  const [expandedGroups, setExpandedGroups] = useState(() => new Set(search ? [] : ['Dashboard']));
  const [error, setError] = useState('');
  const selectedRisk = useMemo(() => getRiskCounts(selectedIds), [selectedIds]);

  const togglePermission = (permissionId) => setSelectedIds((current) => {
    const next = new Set(current);
    if (next.has(permissionId)) next.delete(permissionId);
    else next.add(permissionId);
    return next;
  });
  const toggleGroup = (groupName) => setExpandedGroups((current) => {
    const next = new Set(current);
    if (next.has(groupName)) next.delete(groupName);
    else next.add(groupName);
    return next;
  });
  const toggleAllVisible = (permissions) => setSelectedIds((current) => {
    const next = new Set(current);
    const allSelected = permissions.length > 0 && permissions.every((permission) => next.has(permission.id));
    permissions.forEach((permission) => allSelected ? next.delete(permission.id) : next.add(permission.id));
    return next;
  });

  const save = () => {
    if (!name.trim()) {
      setError('Enter a role name to continue.');
      return;
    }
    onSave({
      id: seed?.id || `custom-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      permissionIds: [...selectedIds],
      permissionCount: selectedIds.size,
      highRiskCount: selectedRisk.high,
      usersAssigned: 0,
      lastModified: new Date().toLocaleDateString('en-GB'),
      type: 'Custom',
      scope,
      sodExempt: false,
    });
    notify('Custom role saved to this local prototype.');
  };

  return (
    <div className="roles-builder">
      <div className="roles-builder-topbar"><button type="button" className="roles-back-button" onClick={onBack}><ArrowLeft size={16} /> Back to roles</button><div className="roles-builder-actions"><button type="button" className="roles-button roles-button--quiet" onClick={onBack}>Cancel</button><button type="button" className="roles-button roles-button--primary" onClick={save}><Check size={15} /> Create role</button></div></div>
      <header className="roles-builder-title"><span className="roles-kicker">ACCESS CONTROL</span><h1>{seed ? 'Clone custom role' : 'New custom role'}</h1><p>Define a role, set its default assignment scope, and select only the permissions it needs.</p></header>

      <section className="roles-builder-meta">
        <label className="roles-field"><span>Role name <b>*</b></span><input autoFocus value={name} onChange={(event) => { setName(event.target.value); setError(''); }} placeholder="e.g. Policy Reviewer" /></label>
        <label className="roles-field"><span>Description</span><textarea rows="2" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the responsibilities and limits of this role." /></label>
        <label className="roles-field roles-field--scope"><span>Default scope when assigned</span><span className="roles-select-wrap"><select value={scope} onChange={(event) => setScope(event.target.value)}>{roleScopes.map((item) => <option key={item} value={item}>{item}</option>)}</select><ChevronDown size={15} /></span></label>
        <p className="roles-scope-hint"><Info size={14} /> A role is scope-free; scope is chosen when it is assigned to a person. This is the default the assignment dialog preselects.</p>
        {seed && <p className="roles-clone-limit"><AlertTriangle size={15} /> Production exposes the clone action but not the system role’s individual grant IDs in its read-only detail. This copy starts without selected permissions; review the catalog before saving.</p>}
      </section>

      <div className="roles-builder-layout">
        <section className="roles-catalog" aria-label="Permission catalog">
          <header className="roles-catalog-header"><div><h2>Permissions</h2><p>Select the specific actions this role needs.</p></div><strong>{selectedIds.size} selected</strong></header>
          <label className="roles-permission-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by permission, description, or section…" aria-label="Search permissions" />{search && <button type="button" aria-label="Clear permission search" onClick={() => setSearch('')}><X size={14} /></button>}</label>
          <p className="roles-catalog-meta">{search ? 'Matches update as you type. Select all applies to the visible matches in that section.' : `${totalPermissionCount} permissions across ${permissionGroups.length} sections`}</p>
          {permissionGroups.map((group) => <PermissionGroup key={group.name} group={group} expanded={expandedGroups.has(group.name)} search={search} selectedIds={selectedIds} onToggleGroup={toggleGroup} onTogglePermission={togglePermission} onToggleAll={toggleAllVisible} />)}
          {search && !permissionGroups.some((group) => group.name.toLowerCase().includes(search.trim().toLowerCase()) || group.permissions.some((permission) => `${permission.id} ${permission.description}`.toLowerCase().includes(search.trim().toLowerCase()))) && <div className="roles-catalog-empty">No permissions match that search.</div>}
        </section>

        <aside className="roles-builder-summary" aria-label="Role summary">
          <h2>Role summary</h2>
          <dl><div><dt>Permissions selected</dt><dd>{selectedIds.size}</dd></div><div><dt>High risk</dt><dd className={selectedRisk.high ? 'is-high-risk' : ''}>{selectedRisk.high}</dd></div><div><dt>Medium risk</dt><dd>{selectedRisk.medium}</dd></div><div><dt>Default scope</dt><dd className="roles-scope-summary">{scope.split(' — ')[0]}</dd></div></dl>
          <div className="roles-sod-summary"><div><ShieldCheck size={16} /><strong>Segregation of duties</strong></div><p>Conflict analysis is not connected in this local prototype. Review approval and administration grants before assigning this role.</p></div>
          {selectedIds.size === 0 && <div className="roles-no-access"><Info size={15} /><p>This role currently grants no access. Empty roles can be useful placeholders, but assigned users will not be able to perform actions.</p></div>}
          {error && <p className="roles-form-error" role="alert">{error}</p>}
          <button type="button" className="roles-button roles-button--primary roles-summary-create" onClick={save}><Check size={15} /> Create role</button>
          <p className="roles-local-note">Changes stay in this local prototype and are not sent to production.</p>
        </aside>
      </div>
    </div>
  );
}

function RoleDetailsDialog({ role, onClose, onClone, onEdit }) {
  const isSystem = role.type === 'System';
  return (
    <Dialog title={role.name} description={isSystem ? 'System role — locked template' : 'Custom role'} onClose={onClose} className="roles-detail-dialog">
      <div className="roles-detail-body">
        {isSystem && <div className="roles-locked-note"><LockKeyhole size={17} /><div><strong>This is a system role and cannot be edited</strong><p>System roles are locked so upgrades can add permissions without colliding with your changes. Clone it from the roles list to make a custom copy.</p></div></div>}
        <p className="roles-detail-description">{role.description}</p>
        <dl className="roles-detail-stats"><div><dt>Permissions</dt><dd>{role.permissionCount}{role.highRiskCount > 0 && <small>{role.highRiskCount} high risk</small>}</dd></div><div><dt>Users assigned</dt><dd>{role.usersAssigned}</dd></div><div><dt>Last modified</dt><dd>{role.lastModified || 'Not available'}</dd></div><div><dt>Default scope</dt><dd>{role.scope ? role.scope.split(' — ')[0] : 'Assignment-specific'}</dd></div></dl>
        {!isSystem && <div className="roles-detail-permission-preview"><strong>Selected permissions</strong>{role.permissionIds?.length ? <div>{role.permissionIds.slice(0, 8).map((permissionId) => <code key={permissionId}>{permissionId}</code>)}{role.permissionIds.length > 8 && <small>+{role.permissionIds.length - 8} more</small>}</div> : <p>No permissions selected.</p>}</div>}
        <footer className="roles-dialog-actions">{isSystem ? <button type="button" className="roles-button roles-button--primary" onClick={() => { onClose(); onClone(role); }}><Copy size={15} /> Clone role</button> : <button type="button" className="roles-button roles-button--primary" onClick={() => { onClose(); onEdit(role); }}>Edit role</button>}</footer>
      </div>
    </Dialog>
  );
}

function CloneDialog({ role, onClose, onContinue }) {
  const [name, setName] = useState(`${role.name} (copy)`);
  const isSystem = role.type === 'System';
  return (
    <Dialog title="Clone role" description="Create an editable custom copy." onClose={onClose} className="roles-clone-dialog">
      <div className="roles-clone-body"><div className="roles-clone-info"><Copy size={17} /><p>Permissions from <strong>{role.name}</strong> will be copied into the custom role. Assigned users are not copied.</p></div><label className="roles-field"><span>New role name</span><input autoFocus value={name} onChange={(event) => setName(event.target.value)} /></label>{isSystem && <p className="roles-clone-limit"><AlertTriangle size={15} /> Production shows the system role’s permission total but not its individual grants. The local builder opens without selections so you can review the catalog.</p>}<footer className="roles-dialog-actions"><button type="button" className="roles-button roles-button--quiet" onClick={onClose}>Cancel</button><button type="button" className="roles-button roles-button--primary" disabled={!name.trim()} onClick={() => onContinue(role, name.trim())}>Clone &amp; edit</button></footer></div>
    </Dialog>
  );
}

function DeleteDialog({ role, onClose, onDelete }) {
  return (
    <Dialog title="Delete custom role?" description={role.name} onClose={onClose} className="roles-delete-dialog">
      <div className="roles-delete-body"><p>This only removes the role from this local prototype. Production data will not be changed.</p><footer className="roles-dialog-actions"><button type="button" className="roles-button roles-button--quiet" onClick={onClose}>Cancel</button><button type="button" className="roles-button roles-button--danger" onClick={() => onDelete(role.id)}><Trash2 size={15} /> Delete role</button></footer></div>
    </Dialog>
  );
}

function RoleTableRow({ role, onView, onClone, onDelete }) {
  const highRiskCount = role.highRiskCount || 0;
  return (
    <div className="roles-table-row" role="row">
      <div className="roles-cell roles-cell--name"><strong title={role.name}>{role.name}</strong><small>{role.description || 'No description added.'}</small></div>
      <div className="roles-cell roles-cell--type"><span className={`roles-type-badge roles-type-badge--${role.type.toLowerCase()}`}>{role.type === 'System' && <LockKeyhole size={12} />}{role.type}</span>{role.sodExempt && <span className="roles-exempt-badge">SoD exempt</span>}</div>
      <div className="roles-cell roles-permission-count"><strong>{role.permissionCount}</strong>{highRiskCount > 0 && <small>{highRiskCount} high risk</small>}</div>
      <div className="roles-cell roles-assigned-count">{role.usersAssigned}</div>
      <div className="roles-cell roles-modified">{role.lastModified || '—'}</div>
      <div className="roles-cell roles-actions"><button type="button" className="roles-text-button" onClick={() => onView(role)}><Eye size={14} /><span>View</span></button><button type="button" className="roles-text-button" onClick={() => onClone(role)}><Copy size={14} /><span>Clone</span></button><button type="button" className="roles-text-button roles-text-button--danger" disabled={role.type === 'System'} title={role.type === 'System' ? 'System roles cannot be deleted' : undefined} onClick={() => role.type !== 'System' && onDelete(role)}><Trash2 size={14} /><span>Delete</span></button></div>
    </div>
  );
}

function RoleMobileCard({ role, onView, onClone, onDelete }) {
  return (
    <article className="roles-mobile-card"><header><span className={`roles-type-badge roles-type-badge--${role.type.toLowerCase()}`}>{role.type === 'System' && <LockKeyhole size={12} />}{role.type}</span>{role.sodExempt && <span className="roles-exempt-badge">SoD exempt</span>}</header><div className="roles-mobile-title"><strong>{role.name}</strong><p>{role.description || 'No description added.'}</p></div><dl><div><dt>Permissions</dt><dd>{role.permissionCount}{role.highRiskCount > 0 && <small>{role.highRiskCount} high risk</small>}</dd></div><div><dt>Users assigned</dt><dd>{role.usersAssigned}</dd></div><div><dt>Last modified</dt><dd>{role.lastModified || '—'}</dd></div></dl><footer><button type="button" className="roles-text-button" onClick={() => onView(role)}><Eye size={14} /> View</button><button type="button" className="roles-text-button" onClick={() => onClone(role)}><Copy size={14} /> Clone</button><button type="button" className="roles-text-button roles-text-button--danger" disabled={role.type === 'System'} onClick={() => role.type !== 'System' && onDelete(role)}><Trash2 size={14} /> Delete</button></footer></article>
  );
}

export default function RolesPermissions() {
  const [roles, setRoles] = useState(systemRoles);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All roles');
  const [screen, setScreen] = useState('list');
  const [builderSeed, setBuilderSeed] = useState(null);
  const [activeRole, setActiveRole] = useState(null);
  const [cloneRole, setCloneRole] = useState(null);
  const [deleteRole, setDeleteRole] = useState(null);
  const [toast, setToast] = useState('');

  const filteredRoles = useMemo(() => {
    const query = search.trim().toLowerCase();
    return roles.filter((role) => (typeFilter === 'All roles' || role.type === typeFilter) && (!query || `${role.name} ${role.description}`.toLowerCase().includes(query)));
  }, [roles, search, typeFilter]);
  const systemCount = roles.filter((role) => role.type === 'System').length;
  const customCount = roles.filter((role) => role.type === 'Custom').length;

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 3600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const notify = (message) => setToast(message);
  const startCreate = () => {
    setBuilderSeed(null);
    setScreen('builder');
  };
  const startClone = (role, name = `${role.name} (copy)`) => {
    setBuilderSeed({ name, description: role.description, scope: role.scope || roleScopes[1], permissionIds: role.type === 'Custom' ? (role.permissionIds || []) : [], sourceRole: role.name });
    setCloneRole(null);
    setScreen('builder');
  };
  const saveRole = (role) => {
    setRoles((current) => current.some((item) => item.id === role.id) ? current.map((item) => item.id === role.id ? role : item) : [...current, role]);
    setScreen('list');
    setBuilderSeed(null);
  };
  const editRole = (role) => {
    setBuilderSeed({ ...role, scope: role.scope || roleScopes[1] });
    setScreen('builder');
  };
  const deleteRoleById = (roleId) => {
    setRoles((current) => current.filter((role) => role.id !== roleId));
    setDeleteRole(null);
    notify('Custom role removed from this local prototype.');
  };
  const exportRoles = () => {
    const records = [['Role', 'Type', 'Description', 'Permissions', 'High risk permissions', 'Users assigned', 'Last modified'], ...filteredRoles.map((role) => [role.name, role.type, role.description, role.permissionCount, role.highRiskCount || 0, role.usersAssigned, role.lastModified || ''])];
    const csv = records.map((record) => record.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const file = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nvector-roles-local.csv';
    link.click();
    URL.revokeObjectURL(url);
    notify('Local role list exported as CSV.');
  };

  if (screen === 'builder') return <main className="roles-page"><RoleBuilder key={builderSeed?.id || builderSeed?.sourceRole || 'new-role'} seed={builderSeed} onBack={() => { setScreen('list'); setBuilderSeed(null); }} onSave={saveRole} notify={notify} />{toast && <div className="roles-toast" role="status"><Check size={15} /><span>{toast}</span><button type="button" aria-label="Dismiss notification" onClick={() => setToast('')}><X size={14} /></button></div>}</main>;

  return (
    <main className="roles-page">
      <header className="roles-page-header"><div><span className="roles-kicker">ADMINISTRATION / ACCESS CONTROL</span><h1>Roles &amp; Permissions</h1><p>Review system access templates and create roles for your organisation.</p></div><div className="roles-page-actions"><button type="button" className="roles-button roles-button--quiet" onClick={exportRoles}><ArrowDownToLine size={16} /> Export</button><button type="button" className="roles-button roles-button--primary" onClick={startCreate}><Plus size={16} /> New custom role</button></div></header>

      <section className="roles-overview" aria-label="Roles summary">
        <div><span>System templates</span><strong>{systemCount}</strong></div><div><span>Custom roles</span><strong>{customCount}</strong></div><div><span>Permissions in catalog</span><strong>{totalPermissionCount}</strong></div><p><LockKeyhole size={14} /> System roles are locked; clone to make an editable copy.</p>
      </section>

      <section className="roles-register">
        <header className="roles-register-header"><div><h2>Role register</h2><p>Role names, permission counts, and assignment totals.</p></div><span>{filteredRoles.length} {filteredRoles.length === 1 ? 'role' : 'roles'}</span></header>
        <div className="roles-toolbar"><label className="roles-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search roles or descriptions…" aria-label="Search roles" />{search && <button type="button" aria-label="Clear search" onClick={() => setSearch('')}><X size={14} /></button>}</label><label className="roles-type-filter"><span>Type</span><span className="roles-select-wrap"><select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} aria-label="Filter by type"><option>All roles</option><option>System</option><option>Custom</option></select><ChevronDown size={14} /></span></label></div>
        <div className="roles-table" role="table" aria-label="Role register"><div className="roles-table-header" role="row"><div className="roles-cell">ROLE</div><div className="roles-cell">TYPE</div><div className="roles-cell">PERMISSIONS</div><div className="roles-cell">USERS ASSIGNED</div><div className="roles-cell">LAST MODIFIED</div><div className="roles-cell">ACTIONS</div></div>{filteredRoles.map((role) => <RoleTableRow key={role.id} role={role} onView={setActiveRole} onClone={setCloneRole} onDelete={setDeleteRole} />)}</div>
        <div className="roles-mobile-list">{filteredRoles.map((role) => <RoleMobileCard key={role.id} role={role} onView={setActiveRole} onClone={setCloneRole} onDelete={setDeleteRole} />)}</div>
        {filteredRoles.length === 0 && <div className="roles-empty"><span><Search size={20} /></span><strong>No roles match</strong><p>Adjust your search or role type filter.</p><button type="button" className="roles-button roles-button--quiet roles-button--small" onClick={() => { setSearch(''); setTypeFilter('All roles'); }}>Clear filters</button></div>}
      </section>
      <p className="roles-local-note"><Info size={14} /> Role and permission actions in this page only affect the local prototype.</p>

      {activeRole && <RoleDetailsDialog role={activeRole} onClose={() => setActiveRole(null)} onClone={setCloneRole} onEdit={editRole} />}
      {cloneRole && <CloneDialog role={cloneRole} onClose={() => setCloneRole(null)} onContinue={startClone} />}
      {deleteRole && <DeleteDialog role={deleteRole} onClose={() => setDeleteRole(null)} onDelete={deleteRoleById} />}
      {toast && <div className="roles-toast" role="status"><Check size={15} /><span>{toast}</span><button type="button" aria-label="Dismiss notification" onClick={() => setToast('')}><X size={14} /></button></div>}
    </main>
  );
}
