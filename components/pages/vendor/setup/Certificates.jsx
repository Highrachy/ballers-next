import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { Card } from 'react-bootstrap';
import Toast, { useToast, AlertToast } from 'components/utils/Toast';
import Axios from 'axios';
import Button from 'components/forms/Button';
import {
  BASE_API_URL,
  INDIVIDUAL_IDENTIFICATION_TYPE,
  VENDOR_IDENTIFICATION_TYPE,
} from 'utils/constants';
import { getTokenFromStore } from 'utils/localStorage';
import { UserContext } from 'context/UserContext';
import { getError, statusIsSuccessful, valuesToOptions } from 'utils/helpers';
import {
  setInitialValues,
  DisplayFormikState,
} from 'components/forms/form-helper';
import { Formik, Form } from 'formik';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import { certificateSchema } from 'components/forms/schemas/vendorSchema';
import Select from 'components/forms/Select';
import { VerificationComments } from './AccountSetup';
import Upload from 'components/utils/Upload';
import { OnlineImage } from 'components/utils/Image';
import { FileIcon } from 'components/utils/Icons';
import { Loading } from 'components/utils/LoadingItems';

const Certificates = () => (
  <BackendPage>
    <div className="container-fluid">
      <CertificatesForm />
    </div>
  </BackendPage>
);

export const CertificatesForm = ({ moveToNextStep, setStepToast }) => {
  const [toast, setToast] = useToast();
  const [taxDocument, setTaxDocument] = React.useState(null);
  const [certificateDocument, setCertificateDocument] = React.useState(null);
  const { userDispatch, userState } = React.useContext(UserContext);

  const entity = userState.vendor?.entity;
  const isIndividual =
    entity &&
    VENDOR_IDENTIFICATION_TYPE[entity] &&
    VENDOR_IDENTIFICATION_TYPE[entity] ===
      VENDOR_IDENTIFICATION_TYPE.Individual;
  const type = isIndividual ? '' : VENDOR_IDENTIFICATION_TYPE[entity];

  if (!userState._id) {
    return <Loading Icon={<FileIcon />} text="Loading Information" />;
  }

  return (
    <Formik
      enableReinitialize={true}
      initialValues={setInitialValues(certificateSchema, { type })}
      onSubmit={(values, actions) => {
        let payload = {
          vendor: {
            taxCertificate: taxDocument || userState.vendor?.taxCertificate,
          },
        };

        if (certificateDocument) {
          payload.vendor.identification = {
            type: values.type,
            url: certificateDocument,
          };
        }

        Axios.put(`${BASE_API_URL}/user/vendor/update`, payload, {
          headers: { Authorization: getTokenFromStore() },
        })
          .then(function (response) {
            const { status, data } = response;
            if (statusIsSuccessful(status)) {
              userDispatch({
                type: 'user-profile-update',
                user: data.user,
              });

              const successMessage = {
                type: 'success',
                message: `Your certificates has been successfully saved`,
              };
              setToast(successMessage);
              setStepToast(successMessage);
              actions.setSubmitting(false);
              moveToNextStep();
            }
          })
          .catch(function (error) {
            setToast({
              message: getError(error),
            });
            actions.setSubmitting(false);
          });
      }}
      validationSchema={createSchema(certificateSchema)}
    >
      {({ isSubmitting, handleSubmit, ...props }) => (
        <Form>
          <Toast {...toast} />
          <Card className="card-container">
            <section className="row">
              <div className="col-12 px-4">
                <VerificationComments step="4" />
                {entity ? (
                  <>
                    <UploadDocument
                      key="0"
                      name="certificate"
                      defaultImage={`/img/placeholder/document.png`}
                      document={
                        certificateDocument ||
                        userState.vendor?.identification?.url
                      }
                      setDocument={setCertificateDocument}
                      title={`${type ? type : 'Company Identification'}`}
                    >
                      {isIndividual && (
                        <Select
                          label="Identification Type"
                          name="type"
                          options={valuesToOptions(
                            INDIVIDUAL_IDENTIFICATION_TYPE
                          )}
                          placeholder="Select Identfication Type"
                        />
                      )}
                    </UploadDocument>

                    <UploadDocument
                      key="1"
                      name="tax"
                      defaultImage={`/img/placeholder/image.png`}
                      document={taxDocument || userState.vendor?.taxCertificate}
                      setDocument={setTaxDocument}
                      title="Tax Certificate"
                    />

                    <DisplayFormikState {...props} showAll />

                    <Button
                      className="btn-secondary my-4"
                      loading={isSubmitting}
                      onClick={handleSubmit}
                      diasabled={!(taxDocument || certificateDocument)}
                    >
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <AlertToast
                    type="danger"
                    message="You need to complete your Company Information in Step 1 to
                  know the required documents"
                  />
                )}
              </div>
            </section>
          </Card>
          <DisplayFormikState {...props} showAll hide />
        </Form>
      )}
    </Formik>
  );
};

const UploadDocument = ({
  children,
  title,
  document,
  defaultImage,
  name,
  setDocument,
}) => {
  return (
    <section className="row mt-5 border-bottom">
      <div className="col-md-10 px-4 pb-5">
        <h5 className="mb-4">Upload {title}</h5>
        <Upload
          afterUpload={(docs) => setDocument(docs)}
          allowPdf
          changeText={`Change ${title}`}
          maxFileSize={2_000_000}
          name={name}
          uploadText={`Upload ${title}`}
        >
          {children}
          <OnlineImage
            bordered
            name={`${name}_uploaded_document`}
            src={document}
            defaultImage={defaultImage}
            alt="uploaded document"
            className="mb-3"
          />
        </Upload>
      </div>
    </section>
  );
};

export default Certificates;
