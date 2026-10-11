const MingleLogo = ({ iconSize = "size-9", wordmark = true, className = "" }) => (
  <span className={`mingle-logo inline-flex items-center gap-2.5 ${className}`}>
    <span className={`mingle-logo-mark ${iconSize}`} aria-hidden="true">
      <svg viewBox="0 0 40 40" fill="none" className="size-[62%]" role="presentation">
        <path d="M11 11.5h18a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H20l-7 4v-4h-2a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="16" cy="20" r="1.5" fill="currentColor" />
        <circle cx="20" cy="20" r="1.5" fill="currentColor" />
        <circle cx="24" cy="20" r="1.5" fill="currentColor" />
      </svg>
    </span>
    {wordmark && <span className="mingle-wordmark">Mingle</span>}
  </span>
);

export default MingleLogo;
