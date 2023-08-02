import Link from 'next/link';
import { BgWave } from '../utils/Icons';
import Colors from 'style-dictionary/build/color.tokens.js';
import Humanize from 'humanize-plus';

export const Widget = ({
  name,
  color,
  link,
  Icon,
  value,
  className = 'col-6',
  role = 'user',
}) => {
  const url = `/${role}/${(link || name).toLowerCase()}`;

  return (
    <section className={`widget ${className}`}>
      <Link href={url} passHref>
        <a className="text-reset">
          <div className={`card position-relative`}>
            <section className={`widget-${color}`}>
              <div className="bg-holder">
                <BgWave color={Colors[color][500]} />
              </div>
              <div className="card-body">
                <span className="widget-icon">{Icon}</span>

                <h3 className="mt-3 pt-3 mb-1 fw-semibold">{value || 0}</h3>
                <h6 className="card-title mt-0" title="Number of Customers">
                  {Humanize.capitalize(name)}
                </h6>
              </div>
            </section>
          </div>
        </a>
      </Link>
    </section>
  );
};
