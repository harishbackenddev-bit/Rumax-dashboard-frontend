import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaLocationDot, FaPhone, FaAngleDown, FaBars } from "react-icons/fa6";
import { FaTimes, FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLLIElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu and dropdown when navigating
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  // Helper to check if link is active
  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  // Toggle dropdown
  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Social media links
  const socialLinks = [
    { label: "Facebook", icon: FaFacebook, url: "https://facebook.com" },
    { label: "Instagram", icon: FaInstagram, url: "https://instagram.com" },
    { label: "LinkedIn", icon: FaLinkedin, url: "https://linkedin.com" },
    { label: "Twitter", icon: FaTwitter, url: "https://twitter.com" },
  ];

  // Dropdown items for Services
  const dropdownItems = [
    {
      label: "Investigator Trial Location Support Service",
      path: "/investigator-trial-location-support-service",
    },
    {
      label: "Clinical Trials Homecare Services",
      path: "/clinical-trials-homecare-services",
    }
  ];
  return (
    <>
      {/* TOP BAR */}
      <div className="top-bar">
        <div className="container">
          <div className="top-left">
            <span>
              <FaLocationDot className="icon" />
              Basildon, Essex.
            </span>
            <span>
              <FaPhone className="icon" />
              +44 3330115030 | +44 1268 293666
            </span>
          </div>
          <div className="top-right">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
              >
                <social.icon className="social-icon" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container header-flex">
          {/* Logo */}
          <div className="left-logo">
            <Link to="/" className="logo" aria-label="Rumax home">
              <img src="/images/logo.png" alt="Rumax" />
            </Link>
          </div>

          {/* Navigation */}
          <nav id="menu" className={isMobileMenuOpen ? 'active' : ''}>
            <ul>
              <li>
                <Link
                  to="/"
                  className={isActiveLink('/') ? 'active' : ''}
                  onClick={handleLinkClick}
                >
                  Home
                </Link>
              </li>

              <li
                ref={dropdownRef}
                className={`dropdown li-list ${isDropdownOpen ? 'active' : ''}`}
              >
                <a
                  href="#"
                  onClick={toggleDropdown}
                  className="dropdown-toggle"
                >
                  Services
                  <FaAngleDown className={`dropdown-arrow ${isDropdownOpen ? 'rotated' : ''}`} />
                </a>
                <ul className={`submenu ${isDropdownOpen ? 'open' : ''}`}>
                  {dropdownItems.map((item) => (
                    <li key={item.path}>
                      <Link to={item.path} onClick={handleLinkClick}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              <li>
                <Link
                  to="/partners"
                  className={isActiveLink('/partners') ? 'active' : ''}
                  onClick={handleLinkClick}
                >
                  Who We Partner With
                </Link>
              </li>

              <li>
                <Link
                  to="/careers"
                  className={isActiveLink('/careers') ? 'active' : ''}
                  onClick={handleLinkClick}
                >
                  Careers
                </Link>
              </li>

              <li>
                <Link
                  to="/contact-us"
                  className={isActiveLink('/contact-us') ? 'active' : ''}
                  onClick={handleLinkClick}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>

          {/* Trial Button */}
          <div className="btns-nav">
           <Link to="https://rumax-first-website.vercel.app/" className="trial-btn switch-main">
            Start Your Trials
          </Link>
          {/* <Link to="/contact-us" className="trial-btn">
            Start Your Trials
          </Link> */}
          </div>
          {/* Mobile Toggle */}
          <div
            className="mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
