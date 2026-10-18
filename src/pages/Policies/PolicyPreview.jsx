import { ArrowUpRight, FileText } from 'lucide-react';

function PreviewField({ label, value }) {
  return (
    <div className="policy-preview-field">
      <dt>{label}</dt>
      <dd>{value || 'Not provided'}</dd>
    </div>
  );
}

export default function PolicyPreview({ policy, onNotice }) {
  if (!policy) {
    return (
      <aside className="policy-preview policy-preview--empty" aria-label="Policy preview">
        <div className="policy-preview-empty-icon"><FileText aria-hidden="true" size={21} /></div>
        <h2>Select a policy</h2>
        <p>Choose a policy from the register to view its details.</p>
      </aside>
    );
  }

  return (
    <aside className="policy-preview" aria-label={`Preview: ${policy.name}`}>
      <header className="policy-preview-header">
        <span className="policy-preview-icon"><FileText aria-hidden="true" size={19} /></span>
        <div className="policy-preview-reference">
          <span>Policy ID · {policy.version}</span>
          <strong>{policy.policyId}</strong>
        </div>
        <span className={`policy-status policy-status--${policy.status.toLowerCase().replaceAll(' ', '-')}`}>{policy.status}</span>
      </header>

      <div className="policy-preview-body">
        <span className="policy-preview-eyebrow">Policy information</span>
        <h2>{policy.name}</h2>
        <p className="policy-preview-description">{policy.description || 'Description not provided in the prototype data.'}</p>

        <section className="policy-preview-section" aria-labelledby="policy-metadata-title">
          <h3 id="policy-metadata-title">Metadata</h3>
          <dl className="policy-preview-fields">
            <PreviewField label="Assigned owner" value={policy.owner} />
            <PreviewField label="Version" value={policy.version} />
            <PreviewField label="Last approved" value={policy.lastApproved || (policy.status === 'Draft' ? 'Not applicable' : null)} />
            <PreviewField label="Review cadence" value={policy.reviewCadence} />
            <PreviewField label="Next review" value={policy.nextReview} />
          </dl>
        </section>

        <section className="policy-preview-section" aria-labelledby="policy-frameworks-title">
          <h3 id="policy-frameworks-title">Framework mapping</h3>
          {policy.frameworks?.length ? (
            <div className="policy-framework-tags">
              {policy.frameworks.map((framework) => <span key={framework}>{framework}</span>)}
            </div>
          ) : <p className="policy-preview-muted">No framework mapping supplied.</p>}
        </section>
      </div>

      <footer className="policy-preview-actions">
        <button className="policies-button policies-button--primary" type="button" onClick={() => onNotice('Policy details')}>
          View details <ArrowUpRight aria-hidden="true" size={15} />
        </button>
        <span>Document not provided</span>
      </footer>
    </aside>
  );
}
