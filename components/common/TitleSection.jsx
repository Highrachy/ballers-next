import React from 'react';
import PropTypes from 'prop-types';
import SquareBubbles from './SquareBubbles';

const TitleSection = ({ name, content, children }) => {
  return (
    <section
      className={`title-section ${
        children !== null ? 'with-extra-content' : 'no-content'
      }`}
    >
      <SquareBubbles />
      <h2 className="pb-2 text-white">{name}</h2>
      <div className="mx-auto col-xl-6 col-lg-8 col-sm-9 col-11">{content}</div>
      {children}
    </section>
  );
};

TitleSection.propTypes = {
  name: PropTypes.any.isRequired,
  content: PropTypes.any.isRequired,
  children: PropTypes.any,
};

TitleSection.defaultProps = {
  children: null,
};

export const EmptyTitleSection = ({ children }) => (
  <section className="empty-section">{children}</section>
);

export default TitleSection;
