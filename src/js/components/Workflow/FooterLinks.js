import React from "react";

const FooterLink = ({ footerLinks = [] }) => {
  if (!footerLinks.length) {
    return null;
  }
  return (
    <div className="footer-link-container">
      {footerLinks.map(link => (
        <span>
          <a href={link.url} target="_blank">
            {link.label}
          </a>
        </span>
      ))}
    </div>
  );
};

export default FooterLink;
