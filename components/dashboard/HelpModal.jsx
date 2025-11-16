import { DocsSteps } from 'pages/documentation/[slug]';
import React from 'react';
import { Modal } from 'react-bootstrap';
import Button from '../forms/Button';

const HelpModal = ({ show, handleClose, helpGuide }) => {
  const { steps, title, subtitle } = helpGuide;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Help Guide</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <section className="px-5 py-2">
          <h4 className="my-3">{title}</h4>
          <p className="lead">{subtitle}</p>
          <DocsSteps steps={steps} />
        </section>
      </Modal.Body>
      <Modal.Footer>
        <Button color="dark" className="btn-sm" wide onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default HelpModal;
