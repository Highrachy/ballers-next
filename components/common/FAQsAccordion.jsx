import React from 'react';
import PropTypes from 'prop-types';
import { Card, Accordion } from 'react-bootstrap';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { Fade } from 'react-awesome-reveal';

export const ContextAwareToggle = ({
  children,
  eventKey,
  callback,
  iconClose,
  iconOpen,
}) => {
  const { activeEventKey } = React.useContext(AccordionContext);

  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => callback && callback(eventKey)
  );

  const isCurrentEventKey = activeEventKey === eventKey;

  return (
    <h5 className="m-0" onClick={decoratedOnClick}>
      {children}
      <span className="accordion-icon float-end d-none d-md-inline">
        {isCurrentEventKey ? iconOpen : iconClose}
      </span>
    </h5>
  );
};

ContextAwareToggle.propTypes = {
  children: PropTypes.any.isRequired,
  eventKey: PropTypes.any.isRequired,
  callback: PropTypes.func,
  iconClose: PropTypes.any,
  iconOpen: PropTypes.any,
};

ContextAwareToggle.defaultProps = {
  callback: () => {},
  iconClose: '+',
  iconOpen: '-',
};

const FAQsAccordion = ({ faqs }) => {
  return (
    <Fade>
      <Accordion defaultActiveKey={1}>
        {faqs.map((faq, index) => (
          <Card key={index + 1}>
            <Card.Header eventKey={index + 1}>
              <ContextAwareToggle eventKey={index + 1}>
                {faq.question}
              </ContextAwareToggle>
            </Card.Header>
            <Accordion.Collapse eventKey={index + 1}>
              <Card.Body>{faq.answer}</Card.Body>
            </Accordion.Collapse>
          </Card>
        ))}
      </Accordion>
    </Fade>
  );
};

FAQsAccordion.propTypes = {
  faqs: PropTypes.array.isRequired,
};

export default FAQsAccordion;
