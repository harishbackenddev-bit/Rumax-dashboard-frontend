import React from "react";

const ServiceOfferingBlock = () => {
    const services = [
        "UK clinical delivery layered on top of vendor logistics, cold-chain, and direct-to-participant supply solutions.",
        "Nurse-administered IMP and sample-collection services that complete the vendor's end-to-end offering.",
        "Chain-of-custody discipline for samples, IMP, and controlled substances, documented within our QMS.",
        "A regulated, CQC-registered counterparty that vendors can present to their own sponsor clients with confidence.",
        "Co-ordinated scheduling that aligns nurse visits with courier, cold-chain, and device-deployment timelines."
    ];

    return (
        <section className="Service-main-custom">
            <div className="container">
                <div className="ServiceOfferingBlock">
                    {/* LEFT */}
                    <div className="ServiceOfferingBlock-left">
                        <span className="ServiceOfferingBlock-pill">
                            Our Service Offering
                        </span>

                        <h1 className="ServiceOfferingBlock-title">
                            The trained, registered nurse at the participant's door.
                        </h1>

                        <p className="ServiceOfferingBlock-description">
                            Global logistics, technology, and specialist-service vendors increasingly need a qualified, regulated clinical partner to deliver the in-home or in-region clinical element of a decentralised trial. Rumax provides that UK clinical capability — the trained, registered nurse at the participant's door who turns a logistics or technology solution into a completed clinical visit.
                        </p>

                        {/* <div className="ServiceOfferingBlock-infoBox"><div className="ServiceOfferingBlock-infoHeader"><svg width="17" height="21" viewBox="0 0 17 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.5748 10.993C15.5748 15.5733 12.3686 17.8634 8.55786 19.1917C8.35831 19.2593 8.14155 19.2561 7.9441 19.1825C4.12416 17.8634 0.917969 15.5733 0.917969 10.993V4.58064C0.917969 4.33769 1.01448 4.10469 1.18627 3.9329C1.35807 3.7611 1.59107 3.66459 1.83402 3.66459C3.66613 3.66459 5.95627 2.56532 7.5502 1.17292C7.74427 1.00712 7.99115 0.916016 8.2464 0.916016C8.50166 0.916016 8.74853 1.00712 8.9426 1.17292C10.5457 2.57449 12.8267 3.66459 14.6588 3.66459C14.9017 3.66459 15.1347 3.7611 15.3065 3.9329C15.4783 4.10469 15.5748 4.33769 15.5748 4.58064V10.993Z" stroke="#5B4DFF" stroke-opacity="0.9" stroke-width="1.83211" stroke-linecap="round" stroke-linejoin="round"></path></svg><h3>Why sponsors choose Rumax</h3></div><p>We are not a generalist staffing agency. Rumax is a CQC-registered, ISO 9001:2015-certified specialist whose nurses, SOPs, and quality systems are purpose-built for clinical research — so the homecare arm of your trial carries the same governance as the site.</p></div> */}


                    </div>

                    {/* RIGHT */}
                    <div className="ServiceOfferingBlock-right">
                        {services.map((service, index) => (
                            <div className="ServiceOfferingBlock-card" key={index}>
                                <span className="ServiceOfferingBlock-icon">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </span>

                                <p>{service}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceOfferingBlock;