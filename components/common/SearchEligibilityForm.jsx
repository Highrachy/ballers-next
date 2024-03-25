import React, { useState } from 'react';
import Select from 'react-select';
import { customStyles } from '../forms/Select';
import { valuesToOptions } from '@/utils/helpers';
import contentProperty from '@/data/contentProperty';
import NumberFormat from 'react-number-format';
import Button from '../forms/Button';
import { useRouter } from 'next/router';
import { BiError } from 'react-icons/bi';

const SearchEligibilityForm = ({ initialValues, afterSave = () => {} }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    location: initialValues?.location || '',
    houseType: initialValues?.houseType || '',
    initialPayment: initialValues?.initialPayment || '',
    monthlyPayment: initialValues?.monthlyPayment || '',
    budget: initialValues?.budget || 'Any',
  });
  const [errors, setErrors] = useState({
    initialPayment: '',
    monthlyPayment: '',
  });

  // Define steps, fields, and their corresponding error messages
  const formSteps = {
    1: {
      field: 'location',
      error: '',
      helpText:
        'Begin your journey to homeownership by selecting your dream location',
    },
    2: {
      field: 'houseType',
      error: '',
      helpText: 'Choose the type of home that suits your lifestyle',
    },
    3: {
      field: 'initialPayment',
      error: errors.initialPayment,
      helpText: 'Determine the amount you can contribute as down payment.',
    },
    4: {
      field: 'monthlyPayment',
      error: errors.monthlyPayment,
      helpText:
        'Enter your total monthly income, including salary and other sources.',
    },
    // 5: {
    //   field: 'budget',
    //   error: '',
    //   helpText: 'Select your maximum budget for purchasing a home.',
    // },
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleBlur = (field) => {
    // Define minimum amounts
    const minInitialPayment = 1_000_000; // 1 million
    const minMonthlyPayment = 100_000;

    // Validate and set errors on blur
    switch (field) {
      case 'initialPayment':
        if (formData.initialPayment < minInitialPayment) {
          setErrors({
            ...errors,
            initialPayment: 'Initial payment must be at least 1 million Naira',
          });
        } else {
          setErrors({ ...errors, initialPayment: '' });
        }
        break;
      case 'monthlyPayment':
        if (formData.monthlyPayment < minMonthlyPayment) {
          setErrors({
            ...errors,
            monthlyPayment:
              'Monthly payment must be greater than 100,000 Naira',
          });
        } else {
          setErrors({ ...errors, monthlyPayment: '' });
        }
        break;
      default:
        break;
    }
  };

  const router = useRouter();

  const handleSubmit = () => {
    // Perform submission logic here

    // Construct the query parameters
    const queryParams = {
      location: formData.location,
      houseType: formData.houseType,
      initialPayment: formData.initialPayment,
      monthlyPayment: formData.monthlyPayment,
      // budget: formData.budget,
    };

    afterSave();

    // Redirect to the eligibility result page with query parameters
    router.push({
      pathname: '/eligibility-result',
      query: queryParams,
    });
  };

  const renderStepContent = () => {
    const { field } = formSteps[step];

    switch (step) {
      case 1:
        return (
          <Select
            options={Object.keys(contentProperty)
              .map((location) => ({
                label: `${location}, ${contentProperty[location].state}`,
                value: location,
              }))
              .sort((a, b) => a.label.localeCompare(b.label))}
            styles={customStyles()}
            placeholder="Select Location"
            instanceId="location"
            value={
              formData.location
                ? { value: formData.location, label: formData.location }
                : null
            }
            onChange={(selectedOption) =>
              handleChange('location', selectedOption.value)
            }
          />
        );
      case 2:
        return (
          <Select
            options={valuesToOptions(
              Object.keys(contentProperty[formData.location]?.houseType || {})
            )}
            styles={customStyles()}
            placeholder="Select House Type"
            instanceId="houseType"
            value={
              formData.houseType
                ? { value: formData.houseType, label: formData.houseType }
                : null
            }
            onChange={(selectedOption) =>
              handleChange('houseType', selectedOption.value)
            }
          />
        );
      case 3:
        return (
          <NumberFormat
            className="form-control"
            placeholder="Initial Payment (Minimum 1 Million Naira)"
            value={formData.initialPayment}
            thousandSeparator={true}
            prefix={'₦ '}
            onBlur={() => handleBlur('initialPayment')}
            onValueChange={(values) => {
              handleChange('initialPayment', values.value);
            }}
          />
        );
      case 4:
        return (
          <NumberFormat
            className="form-control"
            placeholder="Monthly Income"
            value={formData.monthlyPayment}
            thousandSeparator={true}
            prefix={'₦ '}
            onBlur={() => handleBlur('monthlyPayment')}
            onValueChange={(values) => {
              handleChange('monthlyPayment', values.value);
            }}
          />
        );
      // case 5:
      //   return (
      //     <Select
      //       options={valuesToOptions([
      //         'Any',
      //         '1 Million - 50 Million Naira',
      //         '51 Million - 100 Million Naira',
      //         '100 Million - 200 Million Naira',
      //         'Above 200 Million Naira',
      //       ])}
      //       styles={customStyles()}
      //       placeholder="Select Budget"
      //       instanceId="budget"
      //       value={
      //         formData.budget
      //           ? { value: formData.budget, label: formData.budget }
      //           : null
      //       }
      //       onChange={(selectedOption) =>
      //         handleChange('budget', selectedOption.value)
      //       }
      //     />
      //   );
      default:
        return null;
    }
  };

  const renderNavigationButtons = () => {
    const isCurrentFieldSet = () => {
      return formData[formSteps[step].field] !== '' && !formSteps[step].error;
    };

    return (
      <>
        {step > 1 && (
          <Button color="light" className="me-2" onClick={handlePreviousStep}>
            Previous
          </Button>
        )}
        {step < 4 && (
          <Button
            color="secondary"
            onClick={handleNextStep}
            wide
            disabled={!isCurrentFieldSet()}
          >
            Next
          </Button>
        )}
        {step === 4 && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleSubmit}
            disabled={!isCurrentFieldSet()}
          >
            Confirm
          </button>
        )}
      </>
    );
  };

  return (
    <>
      <div className="mb-3">
        <p className="text-md text-soft mb-2">
          {step > 1 && <span className="fw-semibold">Step {step} of 4: </span>}
          {formSteps[step].helpText}
        </p>
      </div>

      <div className="input-group search-property-form">
        <div className="select-holder">
          {renderStepContent()}
          {formSteps[step].error && (
            <div className="error-message text-md mt-2 text-danger">
              <BiError /> {formSteps[step].error}
            </div>
          )}
        </div>
        {renderNavigationButtons()}
      </div>
    </>
  );
};

export default SearchEligibilityForm;
