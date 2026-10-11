const MingleLogo = ({ iconSize = "size-9", wordmark = true, className = "" }) => (
  <span className={`mingle-logo inline-flex items-center gap-2.5 ${className}`}>
    <span className={`mingle-logo-mark ${iconSize}`} aria-hidden="true">m</span>
    {wordmark && <span className="mingle-wordmark">Mingle</span>}
  </span>
);

export default MingleLogo;
