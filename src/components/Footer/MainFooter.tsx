import React from "react";
import { Link } from "react-router-dom";

// Import assets (adjust paths as needed)
const asset = (path: string) => `/images/${path}`;

const MainFooter: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        {/* Footer Top */}
        <div className="footer-top">
          {/* Column 1 - Brand */}
          <div className="footer-col footer-brand">
            <Link to="/" className="footer-logo">
              <img src={asset("logo-white.png")} alt="Rumax" />
            </Link>
            <div className="bottom-foot">
              <div className="cqc-card">
                <img src={asset("cqc-rating.png")} alt="CQC Rating" />
              </div>
              <hr />
              <h4>Overall: Good</h4>
              <img src={asset("dom-care-cqc-external.svg")} alt="" class="dom-care-cqc__external" aria-hidden="true">
            </div>
          </div>

          {/* Column 2 - Useful Links */}
          <div className="footer-col">
            <h4>Useful Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/contact-us">Contact Us</Link></li>
              <li><Link to="/clinical-trials-homecare-services">Clinical Trial Home Nursing</Link></li>
              <li><Link to="/investigator-trial-location-support-service">Investigator Site Support</Link></li>
            </ul>
          </div>

          {/* Column 3 - Who We Partner With */}
          <div className="footer-col">
            <h4>Who We Partner With</h4>
            <ul>
              <li><Link to="/partners/cros-sponsors">CROs &amp; Sponsors</Link></li>
              <li><Link to="/partners/investigator-sites">Investigator Sites &amp; NHS Trusts</Link></li>
              <li><Link to="/partners/global-vendors">Global Vendor Companies</Link></li>
            </ul>
          </div>

          {/* Column 4 - Company */}
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link to="/gdpr-and-privacy">GDPR</Link></li>
              <li><Link to="/gdpr-and-privacy">GDPR &amp; Privacy</Link></li>
              <li><Link to="/cookie-policy">Privacy &amp; Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Column 5 - Social Media */}
          <div className="footer-col footer-social">
            <h4>Social Media</h4>
            <p>
              Follow Rumax Limited across Essex to get the latest updates.
            </p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <img src={asset("f1.png")} alt="Facebook" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <img src={asset("insta.png")} alt="Instagram" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <img src={asset("linked1.png")} alt="LinkedIn" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <img src={asset("twitter1.png")} alt="Twitter" />
              </a>
            </div>

            <Link to="/contact" className="footer-btn trial-btn primary-btn">
              Contact Our Clinical Trials
            </Link>

            <Link to="/schedule-presentation" className="footer-btn secondary-btn">
              Schedule a Capacity Presentation
            </Link>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="copyright">
            <p>
              Copyright 2026 © RUMAX LIMITED 2026, trading as RUMAX LIMITED,
              registered in England and Wales at Cornwallis House, Unit 2,
              Howard Chase, Basildon, Essex, SS14 3BB, United Kingdom
            </p>
            <p className="reg-no">
              Registered No: 7468421 &nbsp;&nbsp; ICO Registration Nr: ZA038243
            </p>
          </div>

          <div className="footer-certificates">
            <div className="logo-foot">
              <img src={asset("eca.png")} alt="ECA" />
            </div>
            <div className="logo-foot">
              <img src={asset("cqc-logo.png")} alt="CQC" />
            </div>
            <div className="logo-foot">
              <img src={asset("nhs.png")} alt="NHS" />
            </div>
            <div className="logo-foot">
              <img src={asset("ico.png")} alt="ICO" />
            </div>
            <div className="logo-foot">
              <img src={asset("iso.png")} alt="ISO" />
            </div>
            <div className="logo-foot">
              <img src={asset("cyber-essential.png")} alt="Cyber Essentials" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
