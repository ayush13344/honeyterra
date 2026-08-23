function Logo({ className = "" }) {
  return (
    <a href="/" className={`brand-logo ${className}`} aria-label="HoneyTerra home">
      <span className="brand-mark" aria-hidden="true">
        <span className="brand-mark-black" />
        <span className="brand-mark-green" />
      </span>
      <span className="brand-name">
        Honey<span>Terra</span>
      </span>
    </a>
  );
}

export default Logo;
