import { useId } from 'react';
import { ChevronLeft, ChevronRight, FileText, MoreHorizontal, Search, SlidersHorizontal } from 'lucide-react';
import PolicyPreview from './PolicyPreview.jsx';

const unavailable = '—';

export default function AllPolicies({
  availableStatuses,
  currentPage,
  filteredPolicies,
  onNotice,
  onPageChange,
  onSearchChange,
  onSelectPolicy,
  onStatusChange,
  searchQuery,
  selectedPolicy,
  selectedPolicyId,
  statusFilter,
  visiblePolicies,
  pageCount,
  pageSize,
}) {
  const statusId = useId();
  const firstResult = filteredPolicies.length ? (currentPage - 1) * pageSize + 1 : 0;
  const lastResult = Math.min(currentPage * pageSize, filteredPolicies.length);

  return (
    <div className="policies-workspace">
      <section className="policy-register" aria-labelledby="policy-register-title">
        <header className="policy-register-header">
          <div>
            <h1 id="policy-register-title">Policy Register</h1>
            <p>Browse and manage organizational policies in one place.</p>
          </div>
          <span className="policy-total">{filteredPolicies.length} {filteredPolicies.length === 1 ? 'record' : 'records'}</span>
        </header>

        <div className="policy-controls">
          <label className="policy-search">
            <Search aria-hidden="true" size={16} />
            <span className="visually-hidden">Search policies</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search policies..."
            />
          </label>
          <label className="policy-status-filter" htmlFor={statusId}>
            <SlidersHorizontal aria-hidden="true" size={15} />
            <span className="visually-hidden">Filter by status</span>
            <select id={statusId} value={statusFilter} onChange={(event) => onStatusChange(event.target.value)}>
              <option value="all">All statuses</option>
              {availableStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>
        </div>

        {filteredPolicies.length ? (
          <>
            <div className="policy-table-wrap">
              <table className="policy-table">
                <thead>
                  <tr>
                    <th scope="col">Policy</th>
                    <th scope="col">Owner</th>
                    <th scope="col">Version</th>
                    <th scope="col">Status</th>
                    <th scope="col">Updated</th>
                    <th scope="col"><span className="visually-hidden">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {visiblePolicies.map((policy) => (
                    <tr className={selectedPolicyId === policy.id ? 'is-selected' : ''} key={policy.id}>
                      <td data-label="Policy">
                        <button
                          className="policy-select-button"
                          type="button"
                          aria-pressed={selectedPolicyId === policy.id}
                          onClick={() => onSelectPolicy(policy.id)}
                        >
                          <span className="policy-document-icon"><FileText aria-hidden="true" size={17} /></span>
                          <span className="policy-name-copy">
                            <strong>{policy.name}</strong>
                            <small>{policy.policyId} <span aria-hidden="true">·</span> {policy.category}</small>
                          </span>
                        </button>
                      </td>
                      <td data-label="Owner">{policy.owner || unavailable}</td>
                      <td data-label="Version">{policy.version || unavailable}</td>
                      <td data-label="Status"><span className={`policy-status policy-status--${policy.status.toLowerCase().replaceAll(' ', '-')}`}>{policy.status}</span></td>
                      <td data-label="Updated">{policy.updatedAt || unavailable}</td>
                      <td className="policy-actions-cell" data-label="Actions">
                        <button
                          className="policy-icon-button"
                          type="button"
                          aria-label={`More actions for ${policy.name}`}
                          onClick={() => onNotice('Policy actions')}
                        >
                          <MoreHorizontal aria-hidden="true" size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <footer className="policy-pagination" aria-label="Policy list pagination">
              <span>Showing {firstResult}–{lastResult} of {filteredPolicies.length}</span>
              <div className="policy-pagination-controls">
                <button type="button" aria-label="Previous page" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
                  <ChevronLeft aria-hidden="true" size={16} />
                </button>
                <span>Page {currentPage} of {pageCount}</span>
                <button type="button" aria-label="Next page" disabled={currentPage >= pageCount} onClick={() => onPageChange(currentPage + 1)}>
                  <ChevronRight aria-hidden="true" size={16} />
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="policy-empty-results">
            <Search aria-hidden="true" size={20} />
            <strong>No policies found</strong>
            <p>Try adjusting your search or status filter.</p>
          </div>
        )}
      </section>

      <PolicyPreview policy={selectedPolicy} onNotice={onNotice} />
    </div>
  );
}
