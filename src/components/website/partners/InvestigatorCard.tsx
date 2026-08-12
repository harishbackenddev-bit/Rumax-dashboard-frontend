import { Link } from "react-router-dom";

interface InvestigatorCardProps {
  eyebrow: string;
  pill: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  rightTitle: string;
  features: string[];
}

const InvestigatorCard = ({
  eyebrow,
  pill,
  heading,
  description,
  buttonText,
  buttonLink,
  rightTitle,
  features,
}: InvestigatorCardProps) => {
  return (
 <section className="Investigator-main-custom">
    <div className="container">
    <div className="InvestigatorCard">
      <div className="InvestigatorCard-left">
        <div className="InvestigatorCard-badge">
          <div className="InvestigatorCard-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 21h18" />
              <path d="M5 21V7l7-4 7 4v14" />
              <path d="M9 9h1" />
              <path d="M9 13h1" />
              <path d="M9 17h1" />
              <path d="M14 9h1" />
              <path d="M14 13h1" />
              <path d="M14 17h1" />
            </svg>
          </div>

          <div className="InvestigatorCard-eyebrow">
            <span className="InvestigatorCard-title">{eyebrow}</span>
            <span className="InvestigatorCard-pill">{pill}</span>
          </div>
        </div>

        <div className="InvestigatorCard-heading">
          <h1>{heading}</h1>
        </div>

        <p className="InvestigatorCard-description">{description}</p>

        <Link to={buttonLink} className="InvestigatorCard-button">
          {buttonText}
        </Link>
      </div>

      <div className="InvestigatorCard-right">
        <h2 className="InvestigatorCard-rightTitle">{rightTitle}</h2>

        <ul className="InvestigatorCard-list">
          {features.map((item, index) => (
            <li key={index}>
              <span className="InvestigatorCard-check">
<svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 13.9991C0 7.37216 5.37216 2 11.9991 2C18.6259 2 23.9981 7.37216 23.9981 13.9991C23.9981 20.6259 18.6259 25.9981 11.9991 25.9981C5.37216 25.9981 0 20.6259 0 13.9991Z" fill="#1D1978"/>
<g clip-path="url(#clip0_8929_730)">
<path d="M11.9993 19.8265C15.2177 19.8265 17.8268 17.2175 17.8268 13.9991C17.8268 10.7807 15.2177 8.17163 11.9993 8.17163C8.78092 8.17163 6.17188 10.7807 6.17188 13.9991C6.17188 17.2175 8.78092 19.8265 11.9993 19.8265Z" stroke="white" stroke-width="1.16549" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.25 13.9991L11.4155 15.1646L13.7465 12.8336" stroke="white" stroke-width="1.16549" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_8929_730">
<rect width="13.9859" height="13.9859" fill="white" transform="translate(5.00586 7.0061)"/>
</clipPath>
</defs>
</svg>

              </span>

              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
       </div>
       </section>
  );
};

export default InvestigatorCard;