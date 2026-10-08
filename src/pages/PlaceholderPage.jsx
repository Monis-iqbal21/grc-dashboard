import { ChevronRight, Layers3 } from "lucide-react";

export default function PlaceholderPage({ title }) {
  return (
    <div className="placeholder-page">
      <div className="breadcrumb">
        <span>Workspace</span>
        <ChevronRight size={12} />
        <span>{title}</span>
      </div>
      <span className="placeholder-icon">
        <Layers3 size={20} />
      </span>
      <h2>{title}</h2>
      <p>This workspace is ready for the {title.toLowerCase()} experience.</p>
      <span className="placeholder-tag">PAGE PLACEHOLDER</span>
    </div>
  );
}
