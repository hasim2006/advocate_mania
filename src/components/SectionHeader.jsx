/**
 * Reusable section header with subtitle, title, and description.
 * Replaces the repeated section-header pattern across multiple components.
 */
export default function SectionHeader({ subtitle, title, description }) {
  return (
    <div className="section-header text-center">
      <span className="section-subtitle">{subtitle}</span>
      <h2 className="section-title center">{title}</h2>
      <p className="section-desc">{description}</p>
    </div>
  );
}
