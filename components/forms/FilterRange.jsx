import React from 'react';
import Switch from './Switch';

const FilterRange = ({ Field, name, label, options, values }) => (
  <>
    {values?.range?.[name] ? (
      <>
        <Field label={`${label} (From)`} name={`${name}[0]`} {...options} />
        <Field label={`${label} (To)`} name={`${name}[1]`} {...options} />
      </>
    ) : (
      <Field label={label} name={name} {...options} />
    )}
    <div className="mt-n2 mb-4 form-tiny">
      <Switch
        label={`Use ${label} Range`}
        name={`range[${name}]`}
        optional
        labelClassName="text-muted"
      />
    </div>
  </>
);

export default FilterRange;
