import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import Button from '../forms/Button';
import { HelpIcon } from '../utils/Icons';
import HelpModal from './HelpModal';

export const HelpBox = ({ helpGuide }) => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <Card className="info-box widget card widget-box d-block position-relative h-100">
            <section className="widget-dark p-3">
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-8">
                    <h5 className="fw-bold text-dark d-flex align-items-center">
                      Need Help?
                    </h5>
                    <p className="mt-2 text-gray">
                      If you need assistance with the features on this page,
                      please refer to our detailed help guide. <br /> For
                      further support, feel free to{' '}
                      <a href="mailto:support@company.com">
                        contact our support team
                      </a>
                      .
                    </p>
                  </div>
                  <div className="col-sm-4 text-sm-end">
                    <Button color="dark" className="mt-3" onClick={handleShow}>
                      Learn About This Page
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </Card>
        </div>
      </div>
      <HelpModal
        show={showModal}
        handleClose={handleClose}
        helpGuide={helpGuide}
      />
    </div>
  );
};
