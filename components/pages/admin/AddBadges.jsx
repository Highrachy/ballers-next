import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { Card } from 'react-bootstrap';
import Toast, { useToast } from 'components/utils/Toast';
import Axios from 'axios';
import Input from 'components/forms/Input';
import {
  setInitialValues,
  DisplayFormikState,
} from 'components/forms/form-helper';
import Button from 'components/forms/Button';
import { Formik, Form } from 'formik';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import { BASE_API_URL, USER_TYPES } from 'utils/constants';
import { getTokenFromStore } from 'utils/localStorage';
import { addBadgesSchema } from 'components/forms/schemas/badgesSchema';
import {
  getError,
  objectToOptions,
  statusIsSuccessful,
  // valuesToOptions,
} from 'utils/helpers';
import { navigate } from '@reach/router';
import Upload from 'components/utils/Upload';
import { setQueryCache } from 'hooks/useQuery';
import ImagePlaceholder from 'assets/img/placeholder/image.png';
import Label from 'components/forms/Label';
import Select from 'components/forms/Select';
import { refreshQuery } from 'hooks/useQuery';

const AddBadges = ({ id }) => (
  <BackendPage>
    <div className="container-fluid">
      {id ? <BadgesForm id={id} /> : <BadgesForm />}
    </div>
  </BackendPage>
);
const BadgesForm = ({ badge }) => {
  const [toast, setToast] = useToast();
  const [image, setImage] = React.useState('');

  return (
    <Formik
      enableReinitialize={true}
      initialValues={setInitialValues(addBadgesSchema, {
        name: badge?.name,
      })}
      onSubmit={(values, actions) => {
        const payload = {
          ...values,
          image: image || badge?.image,
        };

        console.log(`payload`, payload);

        Axios({
          method: badge?._id ? 'put' : 'post',
          url: `${BASE_API_URL}/badge`,
          data: badge?._id ? { ...payload, _id: badge?._id } : payload,
          headers: { Authorization: getTokenFromStore() },
        })
          .then(function (response) {
            const { status, data } = response;
            if (statusIsSuccessful(status)) {
              setToast({
                type: 'success',
                message: `Your badge has been successfully ${
                  badge?._id ? 'updated' : 'added'
                }`,
              });
              setQueryCache(['badge', data.badge._id], data.badge);
              refreshQuery('badge', true);
              navigate('/admin/badges');
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
      validationSchema={createSchema(addBadgesSchema)}
    >
      {({ isSubmitting, handleSubmit, ...props }) => (
        <Form>
          <Toast {...toast} showToastOnly />

          <Card className="card-container">
            <section className="row">
              <div className="col-md-10 px-4">
                <h5>Add New Badge</h5>
                <Input label="Name" name="name" placeholder="Name" />
                <Select
                  label="Assign Badge to"
                  name="assignedRole"
                  options={objectToOptions({ all: -1, ...USER_TYPES })}
                />
                {/* <Select
                  label="Badge Colour"
                  name="icon.color"
                  options={valuesToOptions(['green', 'yellow', 'red', 'blue'])}
                /> */}
                <div className="my-4">
                  <Label text="Badge Image" name="badges-image" />
                  <Upload
                    afterUpload={(image) => setImage(image)}
                    changeText={`Update Badges Image`}
                    defaultImage={ImagePlaceholder}
                    imgOptions={{ className: 'mb-3' }}
                    name="badges-image"
                    oldImage={badge?.image}
                    uploadText={`Upload Badges Image`}
                  />
                </div>

                <Button
                  className="btn-secondary mt-4"
                  loading={isSubmitting}
                  onClick={handleSubmit}
                >
                  {badge?._id ? 'Update' : 'Add'} Badge
                </Button>
                <DisplayFormikState {...props} showAll />
              </div>
            </section>
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export default AddBadges;
