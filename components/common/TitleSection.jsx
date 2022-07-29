import React from 'react';
import PropTypes from 'prop-types';

const TitleSection = ({ name, content, children }) => (
  <section
    className={`title-section ${
      children !== null ? 'with-extra-content' : 'no-content'
    }`}
  >
    <h2 className="pb-3">{name}</h2>
    <p className="px-lg-8 pb-4">{content}</p>
    {children}
  </section>
);

TitleSection.propTypes = {
  name: PropTypes.string.isRequired,
  content: PropTypes.any.isRequired,
  children: PropTypes.any,
};

TitleSection.defaultProps = {
  children: null,
};

export const EmptyTitleSection = ({ children }) => (
  <section className="title-section__background">{children}</section>
);

export default TitleSection;
