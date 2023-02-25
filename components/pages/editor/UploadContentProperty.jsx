import React from 'react';
import BackendPage from 'components/layout/BackendPage';
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
import { uploadContentPropertySchema } from 'components/forms/schemas/propertySchema';
import { getError, valuesToOptions } from 'utils/helpers';
import Select from 'components/forms/Select';
import { Link, navigate } from '@reach/router';
import { ReactExcel, readFile, generateObjects } from '@ramonak/react-excel';

const UploadContentProperty = () => (
  <BackendPage>
    <div className="container-fluid">
      <UploadContentPropertyForm />
    </div>
  </BackendPage>
);

const UploadContentPropertyForm = () => {
  const [toast, setToast] = useToast();

  const [initialData, setInitialData] = React.useState(undefined);
  const [currentSheet, setCurrentSheet] = React.useState({});

  const handleUpload = (event) => {
    const file = event.target.files[0];
    //read excel file
    readFile(file)
      .then((readedData) => {
        setInitialData(readedData);
        console.log(readedData, ',readedData');
      })
      .catch((error) => console.error(error));
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={setInitialValues(uploadContentPropertySchema)}
      onSubmit={(values, actions) => {
        // check if data has been uploaded
        if (!initialData) {
          setToast({
            message: 'You need to upload a valid Excel File',
          });
        }

        const result = generateObjects(currentSheet);

        if (result.length === 0) {
          setToast({
            message: 'No infomation found',
          });
        }

        delete values.state;

        let output = [];
        let promises = [];
        for (let i = 0; i < result.length; i++) {
          let payload = { ...result[i], areaId: values.areaId };

          if (!payload.website) delete payload.website;
          if (!payload.link) delete payload.link;

          promises.push(
            Axios.post(`${BASE_API_URL}/content-property/add`, payload, {
              headers: { Authorization: getTokenFromStore() },
            }).then(function (response) {
              output.push(response);
            })
          );
        }

        Promise.all(promises)
          .then(() => {
            navigate(`/editor/content-property/area/${values.areaId}`);

            actions.setSubmitting(false);
            actions.resetForm();
          })
          .catch(function (error) {
            setToast({
              message: getError(error),
            });
            actions.setSubmitting(false);
          });
      }}
      validationSchema={createSchema(uploadContentPropertySchema)}
    >
      {({ isSubmitting, handleSubmit, ...props }) => (
        <Form>
          <Toast {...toast} />
          <PropertyInfoForm
            {...props}
            initialData={initialData}
            setCurrentSheet={setCurrentSheet}
            handleUpload={handleUpload}
          />

          <Button
            className="btn-secondary mt-4"
            loading={isSubmitting}
            onClick={handleSubmit}
          >
            Add New Content Property
          </Button>
          <DisplayFormikState {...props} showAll />
        </Form>
      )}
    </Formik>
  );
};

const UploadExcelFile = ({ initialData, setCurrentSheet, handleUpload }) => (
  <>
    {initialData && (
      <ReactExcel
        initialData={initialData}
        onSheetUpdate={(currentSheet) => setCurrentSheet(currentSheet)}
        activeSheetClassName="d-none"
        reactExcelClassName="react-excel"
      />
    )}
    <div className="form-group">
      <div className="custom-file">
        <input
          type="file"
          accept=".xlsx"
          className="custom-file-input"
          id="inputGroupFile01"
          aria-describedby="inputGroupFileAddon01"
          onChange={handleUpload}
        />
        <label className="custom-file-label" htmlFor="inputGroupFile01">
          Upload an Excel File (.xlsx)
        </label>
      </div>
    </div>
  </>
);

const PropertyInfoForm = ({
  values,
  id,
  defaultPlaceholder,
  initialData,
  setCurrentSheet,
  handleUpload,
}) => {
  const state = values.state;
  const placeHolder = {
    state: 'Select State',
    area: 'Select Area',
    ...defaultPlaceholder,
  };

  // State
  const [states, setState] = React.useState([]);
  React.useEffect(() => {
    Axios.get(`${BASE_API_URL}/area/states`, {
      headers: { Authorization: getTokenFromStore() },
    })
      .then(function (response) {
        const { status, data } = response;
        if (status === 200) {
          setState(valuesToOptions(data.states));
        }
      })
      .catch(function (error) {
        // console.log('error', error.response);
      });
  }, []);

  // Area
  const [areaPlaceholder, setAreaPlaceholder] = React.useState(null);
  const [areas, setArea] = React.useState([]);

  React.useEffect(() => {
    if (!state) return;

    setAreaPlaceholder('Loading Area');
    Axios.get(`${BASE_API_URL}/area/state/${state}`, {
      headers: { Authorization: getTokenFromStore() },
    })
      .then(function (response) {
        const { status, data } = response;
        if (status === 200) {
          const output = data.areas.map(({ area, _id }) => ({
            label: area,
            value: _id,
          }));

          setArea(output);
          setAreaPlaceholder('Select Area');
        }
      })
      .catch(function (error) {
        // console.log('error', error.response);
      });
  }, [state]);

  return (
    <Card className="card-container">
      <section className="row">
        <div className="col-md-10 px-4">
          <h5 className="mb-2">{id ? 'Edit' : 'Add a new'} Content Property</h5>
          <p className="text-muted small mb-3">
            <a
              href="https://docs.google.com/spreadsheets/d/10n8SohrFDqgTvquuiMLf2_1jZFHEc-zQUeL1mkMWbi0/edit#gid=0"
              target="_blank"
              className=""
              rel="noopener noreferrer"
            >
              View Recommended Excel template
            </a>
          </p>
          <p className="text-muted small mb-5">
            If the property state or area is not in the dropdown, you can{' '}
            <Link href="/editor/area/new">add a new one here</Link>
          </p>

          <div className="form-row">
            <Select
              formGroupClassName="col-md-6"
              label="State"
              name="state"
              options={states}
              placeholder={placeHolder.state}
            />
            <Select
              formGroupClassName="col-md-6"
              label="Area"
              name="areaId"
              options={areas}
              placeholder={areaPlaceholder || placeHolder.area}
            />
          </div>

          <UploadExcelFile
            initialData={initialData}
            setCurrentSheet={setCurrentSheet}
            handleUpload={handleUpload}
          />
        </div>
      </section>
    </Card>
  );
};

export default UploadContentProperty;
