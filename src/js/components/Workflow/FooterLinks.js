import React, { Component } from "react";

const footerLinks = [
  { label: "Terms & Condition", url: "https://google.com" },
  { label: "Privacy Policy", url: "https://google.com" },
  { label: "Legal", url: "https://google.com" }
];

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
