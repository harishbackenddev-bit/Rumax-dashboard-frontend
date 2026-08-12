// components/sections/GridSection.tsx
import React from "react";
import { Link } from "react-router-dom";

const asset = (path: string) => `/images/${path}`;

interface GridItem {
  icon: string;
  iconClass: string;
  title: string;
  description: string;
  link: string;
}

const GridSection = () => {
  const items: GridItem[] = [
    {
      icon: "first.png",
      iconClass: "info-card__icon--blue",
      title: "Global Vendor Companies",
      description: "Reliable UK operational arm regulatory navigation",
      link: "/partners/global-vendors",
    },
    {
      icon: "second.png",
      iconClass: "info-card__icon--green",
      title: "CROs & Sponsors",
      description: "Scalable DCT operations accelerated recruitment",
      link: "/partners/cros-sponsors",
    },
    {
      icon: "third.png",
      iconClass: "info-card__icon--orange",
      title: "Investigator Sites & NHS Trusts",
      description: "Vital clinical capacity preventing staff burnout",
      link: "/partners/investigator-sites",
    },
  ];

  return (
    <section className="page-main-custom page-section">
      <div className="container">
        <div className="page-section__heading">
          <h2>Who We Partner With</h2>
          <p>Interactive cards with a slight lift and shadow on hover</p>
        </div>
        <div className="info-grid info-grid--three">
          {items.map((item, index) => (
            <article key={index} className="info-card">
              <div className={`info-card__icon ${item.iconClass}`}>
                <img src={asset(item.icon)} alt="" />
              </div>
              <div className="bottom-grid-area">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Link to={item.link}>Learn More</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GridSection;