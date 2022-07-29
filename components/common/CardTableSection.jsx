import React from 'react';
import { Card } from 'react-bootstrap';

const CardTableSection = ({ name, className, children }) => (
  <Card className={`card-container card-table-section mb-5 ${className}`}>
    <div className="row mt-3">
      <div className="col-sm-12">
        {name && <h5>{name}</h5>}

        <div className="table-responsive">
          <table className="table table-border table-sm">
            <tbody>{children}</tbody>
          </table>
        </div>
      </div>
    </div>
  </Card>
);

export default CardTableSection;
