import React from 'react';
import { OnlineImage } from '../utils/Image';
import Link from 'next/link';
import AvatarColor from './AvatarColor';

const StackBox = ({
  avatarColor = null,
  avatarInitials = null,
  avatarCircle = false,
  btnColor = 'secondary',
  src,
  title,
  subtitle,
  value,
  statusColor,
  statusName = '',
  href = '#',
  isButton = false,
}) => {
  return (
    <Link href={href}>
      <a className="widget-stack">
        <section className="d-flex flex-column flex-md-row justify-content-between">
          <div className="d-flex flex-row mb-3">
            {src ? (
              <OnlineImage
                src={src}
                name={`property`}
                width="40"
                className="img-rounded"
                alt="property"
              />
            ) : (
              <AvatarColor
                title={title}
                avatarInitials={avatarInitials}
                avatarColor={avatarColor}
                avatarCircle={avatarCircle}
              />
            )}
            <div className="d-flex flex-column">
              <h4 className={`text-primary text-md fw-semibold my-0`}>
                {title}
              </h4>
              {subtitle && (
                <p className="text-sm text-primary mt-1 my-0">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="d-flex flex-column">
            <div className="d-flex flex-row">
              {isButton ? (
                <>
                  {value && (
                    <span
                      className={`fw-bold text-end mb-0 btn btn-${btnColor}-light btn`}
                    >
                      <span className="fw-semibold">{value}</span>
                    </span>
                  )}
                </>
              ) : (
                <>
                  <div className="text-end">
                    {value && (
                      <p className="fw-bold text-end mb-0">
                        <span className="fw-semibold">{value}</span>
                      </p>
                    )}
                    {statusName && (
                      <div className="text-sm status-badge">
                        <div className={`badge bg-${statusColor} rounded-pill`}>
                          {statusName}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </a>
    </Link>
  );
};

export default StackBox;
