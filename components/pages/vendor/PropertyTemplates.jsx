import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { Card } from 'react-bootstrap';
import { Link } from '@reach/router';
import PaginatedContent from 'components/common/PaginatedContent';
import { API_ENDPOINT } from 'utils/URL';
import { PropertyIcon } from 'components/utils/Icons';
import { Spacing } from 'components/common/Helpers';
import Button from 'components/forms/Button';
import { useBoolean } from 'hooks/useBoolean';
import Modal from 'components/common/Modal';
import { BUTTON_TYPES } from 'components/forms/Button';
import Axios from 'axios';
import { refreshQuery } from 'hooks/useQuery';
import { BASE_API_URL } from 'utils/constants';
import { getTokenFromStore } from 'utils/localStorage';
import { getError, statusIsSuccessful } from 'utils/helpers';

const PropertyTemplates = () => (
  <BackendPage>
    <PaginatedContent
      endpoint={API_ENDPOINT.getAllPropertyTemplates()}
      pageName="Property Template"
      DataComponent={PropertysRowList}
      PageIcon={<PropertyIcon />}
      queryName="propertyTemplates"
      childrenKey="propertyTemplate"
    />
  </BackendPage>
);

export const PropertysRowList = ({ results, offset, setToast }) => (
  <div className="container-fluid mb-5">
    <Card>
      <div className="table-responsive">
        <table className="table table-border table-hover mb-0">
          <tbody>
            {results?.map((property, index) => (
              <PropertysRow
                key={index}
                number={offset + index + 1}
                propertyTemplate={property}
                setToast={setToast}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

const PropertysRow = ({ number, propertyTemplate, setToast }) => {
  const { status, _id, name } = propertyTemplate;
  return (
    <>
      <tr>
        <td>{number}</td>
        <td>{name}</td>
        <td>{status}</td>

        <td>
          <ViewPropertyTemplateButton propertyTemplate={propertyTemplate} />
          <Spacing />
          <Link
            className="btn btn-xs btn-dark btn-wide"
            to={`/vendor/property-template/${_id}`}
          >
            Edit Template
          </Link>
          <Spacing />
          <DeletePropertyTemplateButton
            propertyTemplate={propertyTemplate}
            setToast={setToast}
          />
        </td>
      </tr>
    </>
  );
};

const ViewPropertyTemplateButton = ({ propertyTemplate }) => {
  const [showModal, setShowModalToTrue, setShowModalToFalse] =
    useBoolean(false);

  return (
    <>
      <Modal
        title="View Property Template"
        show={showModal}
        onHide={setShowModalToFalse}
        showFooter={false}
        size="lg"
      >
        <ViewPropertyTemplate propertyTemplate={propertyTemplate} />
      </Modal>

      <Button
        color="info"
        type={BUTTON_TYPES.SMALL}
        onClick={setShowModalToTrue}
      >
        View Template
      </Button>
    </>
  );
};

const ViewPropertyTemplate = ({ propertyTemplate }) => (
  <>
    <table className="table table-sm">
      <thead>
        <tr className="text-secondary">
          <>
            <th>
              <strong>Name</strong>
            </th>
            <th>
              <h5 className="text-secondary">{propertyTemplate.name}</h5>
            </th>
          </>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>
            <strong>Status</strong>
          </td>
          <td>{propertyTemplate.status}</td>
        </tr>
        <tr>
          <td>
            <strong>Expires</strong>
          </td>
          <td>{propertyTemplate.expires}</td>
        </tr>
        <tr>
          <td>
            <strong>Payment Breakdown</strong>
          </td>
          <td>{propertyTemplate.paymentBreakdown}</td>
        </tr>
        <tr>
          <td>
            <strong>Allocation (in Percentage)</strong>
          </td>
          <td>{propertyTemplate.allocationInPercentage}%</td>
        </tr>
        <tr>
          <td>
            <strong>Title</strong>
          </td>
          <td>{propertyTemplate.title}</td>
        </tr>
        <tr>
          <td>
            <strong>Delivery State</strong>
          </td>
          <td>{propertyTemplate.deliveryState}</td>
        </tr>
      </tbody>
    </table>
  </>
);

const DeletePropertyTemplateButton = ({ propertyTemplate, setToast }) => {
  const [showModal, setShowModalToTrue, setShowModalToFalse] =
    useBoolean(false);

  const [loading, setLoading] = React.useState(false);

  const deletePropertyTemplate = () => {
    setLoading(true);
    Axios.delete(`${BASE_API_URL}/property/template/${propertyTemplate._id}`, {
      headers: { Authorization: getTokenFromStore() },
    })
      .then(function (response) {
        const { status } = response;
        if (statusIsSuccessful(status)) {
          setToast({
            type: 'success',
            message: `Property Template has been successfully deleted`,
          });

          refreshQuery('propertyTemplate', true);
          setShowModalToFalse();
          setLoading(false);
        }
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
        setLoading(false);
      });
  };

  return (
    <>
      <Modal
        title="Delete Property Template"
        show={showModal}
        onHide={setShowModalToFalse}
        showFooter={false}
      >
        <section className="row">
          <div className="col-md-12 my-3 text-center">
            <table className="table table-sm">
              <thead>
                <tr className="text-secondary">
                  <>
                    <th>
                      <h5 className="text-secondary">
                        {propertyTemplate.name}
                      </h5>
                    </th>
                  </>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Status: {propertyTemplate.status}</td>
                </tr>
              </tbody>
            </table>
            <p className="my-4 confirmation-text">
              Are you sure you want to delete this Property Template?
            </p>
            <Button
              color="danger"
              loading={loading}
              className="btn mb-5"
              onClick={() => deletePropertyTemplate()}
            >
              Delete Property Template
            </Button>
          </div>
        </section>
      </Modal>

      <Button
        color="danger"
        type={BUTTON_TYPES.SMALL}
        onClick={setShowModalToTrue}
      >
        Delete Template
      </Button>
    </>
  );
};

export default PropertyTemplates;
