import React from 'react';
import PropertyPlaceholderImage from 'assets/img/placeholder/property.png';
import Modal from 'components/common/Modal';
import { Card } from 'react-bootstrap';
import Toast, { useToast } from 'components/utils/Toast';
import Axios from 'axios';
import {
  setInitialValues,
  DisplayFormikState,
} from 'components/forms/form-helper';
import Button from 'components/forms/Button';
import { Formik, Form } from 'formik';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import { BASE_API_URL } from 'utils/constants';
import { getTokenFromStore } from 'utils/localStorage';
import { addFloorPlansSchema } from 'components/forms/schemas/propertySchema';
import { getError, statusIsSuccessful } from 'utils/helpers';
import Upload from 'components/utils/Upload';
import Input from 'components/forms/Input';
import Image, { OnlineImage } from 'components/utils/Image';
import { Accordion } from 'react-bootstrap';
import { ArrowDownIcon } from 'components/utils/Icons';
import { ContextAwareToggle } from 'components/common/FAQsAccordion';
import { ArrowUpIcon } from 'components/utils/Icons';
import { LinkSeparator } from 'components/common/Helpers';
import { useCurrentRole } from 'hooks/useUser';
import { setQueryCache } from 'hooks/useQuery';

export const FloorPlansForm = ({
  hideForm,
  setToast,
  setProperty,
  property,
  floorPlan,
}) => {
  const [toast] = useToast();
  const [image, setImage] = React.useState(null);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={setInitialValues(addFloorPlansSchema, {
        name: floorPlan?.name,
      })}
      onSubmit={({ name }, actions) => {
        const payload = {
          name,
          plan: image || floorPlan?.plan,
        };

        if (!payload.plan) {
          setToast({ message: 'Kindly upload a Floor Plans' });
          return;
        }

        Axios({
          method: floorPlan?._id ? 'put' : 'post',
          url: `${BASE_API_URL}/property/${property._id}/floorplan`,
          data: floorPlan?._id
            ? { ...payload, floorPlanId: floorPlan?._id }
            : payload,
          headers: { Authorization: getTokenFromStore() },
        })
          .then(function (response) {
            const { status, data } = response;
            if (statusIsSuccessful(status)) {
              setToast({
                type: 'success',
                message: `Your floor plans has been successfully ${
                  floorPlan?._id ? 'updated' : 'added'
                }`,
              });
              hideForm();
              setProperty(data.property);
              setQueryCache([pageOptions.key, property._id], {
                property: data.property,
              });
              actions.setSubmitting(false);
              actions.resetForm();
            }
          })
          .catch(function (error) {
            setToast({
              message: getError(error),
            });
            actions.setSubmitting(false);
          });
      }}
      validationSchema={createSchema(addFloorPlansSchema)}
    >
      {({ isSubmitting, handleSubmit, ...props }) => (
        <Form>
          <Toast {...toast} showToastOnly />
          <section className="row">
            <div className="col-md-10 px-4">
              <h5>Add Floor Plans</h5>
              <Input label="Title" name="name" placeholder="Title" />
              <div className="my-4">
                <Upload
                  afterUpload={(image) => setImage(image)}
                  allowPdf
                  changeText={`Update Floor Plan`}
                  defaultImage={PropertyPlaceholderImage}
                  imgOptions={{ className: 'mb-3', watermark: true }}
                  name="floorPlan"
                  oldImage={floorPlan?.plan}
                  uploadText={`Upload Floor Plan`}
                />
              </div>
              <Button
                className="btn-secondary mt-4"
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                {floorPlan?._id ? 'Update' : 'Add'} Floor Plan
              </Button>
              <DisplayFormikState {...props} showAll />
            </div>
          </section>
        </Form>
      )}
    </Formik>
  );
};

export const AddFloorPlans = ({
  className,
  setToast,
  setProperty,
  property,
}) => {
  const [showAddFloorPlansModal, setShowAddFloorPlansModal] =
    React.useState(false);
  return (
    <>
      <span
        className={className}
        onClick={() => setShowAddFloorPlansModal(true)}
      >
        Add Floor Plans
      </span>

      <Modal
        title="Floor Plans"
        show={showAddFloorPlansModal}
        onHide={() => setShowAddFloorPlansModal(false)}
        showFooter={false}
        size="lg"
      >
        <FloorPlansForm
          hideForm={() => setShowAddFloorPlansModal(false)}
          setToast={setToast}
          setProperty={setProperty}
          property={property}
        />
      </Modal>
    </>
  );
};

const pageOptions = {
  key: 'property',
  pageName: 'Floor Plans',
};

export const FloorPlansList = ({
  property,
  setProperty,
  setToast,
  isPublicPage,
}) => {
  const [showEditFloorPlansModal, setShowEditFloorPlansModal] =
    React.useState(false);
  const [showDeleteFloorPlansModal, setShowDeleteFloorPlansModal] =
    React.useState(false);

  const [floorPlan, setFloorPlan] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const deleteFloorPlan = () => {
    setLoading(true);
    Axios.delete(`${BASE_API_URL}/property/${property._id}/floorPlan`, {
      headers: { Authorization: getTokenFromStore() },
      data: { floorPlanId: floorPlan._id },
    })
      .then(function (response) {
        const { status, data } = response;
        if (statusIsSuccessful(status)) {
          setToast({
            type: 'success',
            message: `Floor plan has been successfully deleted`,
          });
          setProperty(data.property);
          setQueryCache([pageOptions.key, property._id], {
            property: data.property,
          });
          setShowDeleteFloorPlansModal(false);
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
  const isVendor = useCurrentRole().isVendor;
  const userIsVendor = !isPublicPage && isVendor;
  const noFloorPlans = property?.floorPlans?.length === 0;
  return (
    <>
      <div className="property__floor-plans">
        {(!noFloorPlans || userIsVendor) && (
          <h5 className="header-content">Floor Plans</h5>
        )}
        {!noFloorPlans && (
          <Accordion>
            {property?.floorPlans.map(({ _id, name, plan }, index) => (
              <Card key={_id}>
                <Card.Header>
                  <ContextAwareToggle
                    iconOpen={<ArrowUpIcon />}
                    iconClose={<ArrowDownIcon />}
                    eventKey={index + 1}
                  >
                    {name}
                  </ContextAwareToggle>
                </Card.Header>
                <Accordion.Collapse eventKey={index + 1}>
                  <Card.Body>
                    <Image src={plan} alt={name} name={name} />
                    {userIsVendor && (
                      <>
                        <hr />
                        <p className="px-4 my-4">
                          <span
                            className="text-link text-muted"
                            onClick={() => {
                              setFloorPlan({ _id, name, plan });
                              setShowEditFloorPlansModal(true);
                            }}
                          >
                            Edit Floor Plan
                          </span>
                          <LinkSeparator />
                          <span
                            className="text-link  text-muted"
                            onClick={() => {
                              setFloorPlan({ _id, name, plan });
                              setShowDeleteFloorPlansModal(true);
                            }}
                          >
                            Delete Floor Plan
                          </span>
                        </p>
                      </>
                    )}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            ))}
          </Accordion>
        )}
      </div>

      {userIsVendor && (
        <div className="row">
          <div className="col-12">
            <AddFloorPlans
              className="btn btn-secondary btn-xs btn-wide"
              property={property}
              setToast={setToast}
              setProperty={setProperty}
            />
          </div>
        </div>
      )}
    </>
  );
};
