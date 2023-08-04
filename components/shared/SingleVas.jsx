import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import Toast, { useToast } from 'components/utils/Toast';
import {
  moneyFormatInNaira,
  statusIsSuccessful,
  manualWait,
  getError,
} from 'utils/helpers';
import { MessageIcon } from 'components/utils/Icons';
import { refreshQuery, useGetQuery } from 'hooks/useQuery';
import { API_ENDPOINT } from 'utils/URL';
import { ContentLoader } from 'components/utils/LoadingItems';
import CardTableSection from 'components/common/CardTableSection';
import { BASE_API_URL, MODEL } from 'utils/constants';
import { Form, Formik } from 'formik';
import Select from '../forms/Select';
import Button from '../forms/Button';
import { DisplayFormikState, setInitialValues } from '../forms/form-helper';
import Modal from '../common/Modal';
import { useCurrentRole } from '@/hooks/useUser';
import { useRouter } from 'next/router';
import { vasRequestSchema } from '../forms/schemas/vasSchema';
import { getTokenFromStore } from '@/utils/localStorage';
import { createSchema } from '../forms/schemas/schema-helpers';
import axios from 'axios';

const pageOptions = {
  key: 'vas',
  pageName: 'vas',
};

const SingleVas = ({ id }) => {
  const [toast, setToast] = useToast();
  const [vasQuery, vas] = useGetQuery({
    key: pageOptions.key,
    name: [pageOptions.key, id],
    setToast,
    endpoint: API_ENDPOINT.getOneVas(id),
    refresh: true,
  });

  return (
    <BackendPage>
      <ContentLoader
        hasContent={!!vas}
        Icon={<MessageIcon />}
        query={vasQuery}
        name={pageOptions.pageName}
        toast={toast}
      >
        <VasDetail vas={vas} toast={toast} setToast={setToast} />
      </ContentLoader>
    </BackendPage>
  );
};

const VasDetail = ({ vas, toast, setToast }) => {
  const [showVasForm, setShowVasForm] = React.useState(false);
  return (
    <div className="container-fluid">
      <Toast {...toast} />
      <div className="mt-5 mb-3">
        {/* <h3>{vasRequest?.vasInfo?.name} Request</h3> */}
      </div>
      <CardTableSection name={'Service Information'}>
        <tr>
          <td>
            <strong>Name</strong>
          </td>
          <td>{vas.name}</td>
        </tr>
        <tr>
          <td>
            <strong>Price</strong>
          </td>
          <td>{moneyFormatInNaira(vas.price)}</td>
        </tr>
        <tr>
          <td>
            <strong>Description</strong>
          </td>
          <td>{vas?.description}</td>
        </tr>
      </CardTableSection>

      <Button
        onClick={() => setShowVasForm(true)}
        className="btn btn-secondary my-3"
      >
        Order for Service
      </Button>

      <Modal
        title="Services"
        show={showVasForm}
        onHide={() => setShowVasForm(false)}
        showFooter={false}
      >
        <OrderSingleVasForm vas={vas} hideForm={() => {}} setToast={setToast} />
      </Modal>
    </div>
  );
};

export const OrderSingleVasForm = ({ hideForm, setToast, vas, propertyId }) => {
  const userType = useCurrentRole().name;
  const router = useRouter();
  return (
    <section className="row">
      <div className="col-md-10">
        <Formik
          initialValues={setInitialValues({})}
          onSubmit={(_, actions) => {
            const payload = {
              vasId: vas?._id,
              propertyId,
            };

            axios
              .post(`${BASE_API_URL}/vas/request`, payload, {
                headers: { Authorization: getTokenFromStore() },
              })
              .then(function (response) {
                const { status } = response;
                if (statusIsSuccessful(status)) {
                  setToast({
                    type: 'success',
                    message: `Your Service has been successfully requested.`,
                  });
                  hideForm();
                  actions.setSubmitting(false);
                  actions.resetForm();
                  manualWait(() => router.push(`/${userType}/service`), 1000);
                }
              })
              .catch(function (error) {
                setToast({
                  message: getError(error),
                });
                actions.setSubmitting(false);
              });
          }}
          validationSchema={createSchema({})}
        >
          {({ isSubmitting, handleSubmit, ...props }) => {
            return (
              <Form>
                <>
                  <h3 className="header-smaller">{vas?.name}</h3>
                  <h5 className="text-secondary">
                    {moneyFormatInNaira(vas?.price)}
                  </h5>
                  <p>{vas?.description}</p>
                </>
                <Button
                  className="btn-secondary mt-4"
                  loading={isSubmitting}
                  onClick={handleSubmit}
                >
                  Proceed
                </Button>
                <DisplayFormikState {...props} showAll />
              </Form>
            );
          }}
        </Formik>
      </div>
    </section>
  );
};

export default SingleVas;
