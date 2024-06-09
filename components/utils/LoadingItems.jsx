import React from 'react';
import PropTypes from 'prop-types';
import BallersSpinner from 'components/utils/BallersSpinner';
import NoContent from 'components/utils/NoContent';
import Toast from 'components/utils/Toast';

const LoadItems = ({ items, children, loadingText, noContent, Icon, size }) => {
  if (items == null) {
    return <Loading size={size} text={loadingText} Icon={Icon} />;
  }
  if (items.length > 0) {
    return children;
  }

  return noContent;
};

LoadItems.propTypes = {
  children: PropTypes.any,
  Icon: PropTypes.any,
  items: PropTypes.array,
  loadingText: PropTypes.string,
  noContent: PropTypes.any.isRequired,
  size: PropTypes.string,
};

LoadItems.defaultProps = {
  children: null,
  Icon: null,
  loadingText: null,
  items: null,
  size: null,
};

export const Loading = ({ Icon, text, size, className = '' }) => (
  <div className={`text-center mt-5 w-100 loading-icon ${size ? size : ''}`}>
    {Icon && Icon}
    {text && <h5 className={`my-4 ${className}`}>{text} &nbsp;</h5>}
    <BallersSpinner small={size === 'small'} />{' '}
  </div>
);

export const ContentLoader = ({
  children,
  hasContent,
  query,
  Icon,
  loadingText,
  noContentLink,
  noContentText,
  hideNoContent,
  name,
  toast,
  showFetching,
}) => (
  <>
    <Toast {...toast} showToastOnly />
    {query.isFetching && !query.isLoading && showFetching && (
      <div className="updating-spinner">
        <BallersSpinner small />
      </div>
    )}
    {query.isLoading || (showFetching && query.isFetching) ? (
      <Loading text={loadingText || `Loading ${name}`} Icon={Icon} />
    ) : hasContent ? (
      children
    ) : (
      !hideNoContent && (
        <NoContent
          buttonClassName={noContentLink?.buttonClassName || 'btn-secondary'}
          text={noContentText || `${name} not found`}
          Icon={Icon}
          linkText={noContentLink?.linkText}
          linkTo={noContentLink?.linkTo}
          isButton={noContentLink?.isButton}
        />
      )
    )}
  </>
);
export default LoadItems;
