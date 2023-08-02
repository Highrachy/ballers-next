const { default: Link } = require('next/link');

const ServiceBox = ({ title, link, price, content }) => (
  <div className="widget-stack service-box">
    <section className="d-flex justify-content-between">
      <div className="d-flex flex-row">
        <div className="d-flex flex-column">
          <h4
            className={`text-secondary text-md fw-semibold my-0  widget-title`}
          >
            {title}
          </h4>
        </div>
      </div>
      <div className="d-flex flex-column">
        <div className="d-flex flex-row">
          <div className="text-end">
            {price && (
              <p className="fw-semibold text-end my-0">
                <small className="text-muted fw-normal">From </small>
                <span className="text-md text-primary fw-bold">₦ {price}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
    <section>
      <p className="text-md mt-2 text-primary mb-0">{content}</p>

      <p className="mt-4">
        <Link href={link}>
          <a className="btn btn-primary-light btn-xs btn-wide">Learn More</a>
        </Link>
      </p>
    </section>
  </div>
);

export default ServiceBox;
