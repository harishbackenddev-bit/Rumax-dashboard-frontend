interface ImageTextSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageLeft?: boolean; // true = image left, false = image right
}

const ImageTextSection: React.FC<ImageTextSectionProps> = ({
  title,
  subtitle,
  description,
  imageSrc,
  imageAlt,
  imageLeft = true,
}) => {
  return (
    <section className="hvs-section page-main-custom page-section second-main-grid">
      <div className="container">
        <div
          className={`inner-hvs-sec ${
            imageLeft ? "layout-image-left" : "layout-image-right"
          }`}
        >
          <div className="hvs-visual">
            <img src={imageSrc} alt={imageAlt} />
          </div>

          <div className="page-section__heading">
            <h2>{title}</h2>

            {subtitle && <p>{subtitle}</p>}

            {description && <p>{description}</p>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageTextSection;