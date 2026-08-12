import React from "react";

interface GridItem {
  icon: string;
  description: string;
}

interface GridSectionProps {
  title: string;
  description: string;
  items: GridItem[];
  bgClass?: string;
}

const GridSection: React.FC<GridSectionProps> = ({
  title,
  description,
  items,
  bgClass = "",
}) => {
  return (
    <section className={`page-main-custom page-section grid-service image_setting ${bgClass}`}>
      <div className="container">
        <div className="page-section__heading">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

        <div className="info-grid info-grid--three">
          {items.map((item, index) => (
            <article className="info-card" key={index}>
              <div className="bottom-grid-area">
                <div className="info-card__icon info-card__icon--blue">
                  <img src={item.icon} />
                </div>

                <div className="h3-bottom">
                  <p>{item.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GridSection;