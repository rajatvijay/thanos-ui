import React from "react";

const FooterLink = ({ footerLinks = [] }) => {
  if (!footerLinks.length) {
    return null;
  }
  return (
    <div className="footer-link-container">
      {footerLinks.map((link, index) => (
        <span key={`${index}`}>
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            {link.label}
          </a>
        </span>
      ))}
    </div>
  );
};

export default FooterLink;
