export default function MetricItem({ metric, index }) {
  return (
    <article className={`metric-card metric-${metric.tone}`}>
      <div className="metric-top">
        <span>{metric.label}</span>
        <i className="metric-mark">{String(index + 1).padStart(2, "0")}</i>
      </div>
      <div className="metric-value">{metric.value}</div>
      <div className="metric-bottom">
        <strong>{metric.change}</strong>
        <span>{metric.detail}</span>
      </div>
      <div className="metric-rule">
        <i />
      </div>
    </article>
  );
}
