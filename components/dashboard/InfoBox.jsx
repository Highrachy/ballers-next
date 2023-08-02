import Link from 'next/link';
import { Card } from 'react-bootstrap';

export const InfoBox = ({
  color = 'primary',
  title,
  children,
  Icon,
  linkHref,
  linkText,
}) => (
  <Card className="info-box widget card  d-block my-4 position-relative h-100">
    <section className={`widget-${color} p-3`}>
      <div className="card-body">
        <div className="row">
          <h4 className={`fw-bold text-${color}`}>{title}</h4>
          <div className="col-8">
            <p className="mt-3 mb-4 text-gray">{children}</p>
            <Link href={linkHref}>
              <a className={`btn btn-${color}`}>{linkText}</a>
            </Link>
          </div>
          <div className="col-3 col-sm-4 text-end widget-svg">{Icon}</div>
        </div>
      </div>
    </section>
  </Card>
);
