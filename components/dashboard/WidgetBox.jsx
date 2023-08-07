import Button from '../forms/Button';

export const WidgetBox = ({
  children,
  title,
  buttonName = 'View All',
  href = null,
  data = [],
  Icon = null,
}) => {
  const classes = 'col-sm-6 mt-4';

  return (
    <div className={classes}>
      <div className="widget h-100 card widget-box">
        <div className="d-flex align-items-center justify-content-between">
          <h6 className="fw-bold mb-4">{title}</h6>
          {!!href && (
            <Button
              color="secondary-light"
              href={href}
              className="px-4 py-1 mb-4 text-sm"
            >
              {buttonName}
            </Button>
          )}
        </div>
        {data?.length > 0 ? (
          children
        ) : (
          <h6 className="text-muted text-center my-5 fw-normal">
            {Icon} You have no {title}
          </h6>
        )}
      </div>
    </div>
  );
};

export default WidgetBox;
