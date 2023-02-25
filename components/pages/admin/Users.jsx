import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import {
  DASHBOARD_PAGE,
  USER_TYPES,
  ENTITY_SHORTCODE,
  VENDOR_IDENTIFICATION_TYPE,
  VENDOR_INFO_STATUS,
} from 'utils/constants';
import Link from 'next/link';
import Humanize from 'humanize-plus';
import PaginatedContent from 'components/common/PaginatedContent';
import { Form, Formik } from 'formik';
import Select from 'components/forms/Select';
import UserCard from 'components/common/UserCard';
import BackendPage from 'components/layout/BackendPage';
import { UserIcon } from 'components/utils/Icons';
import { API_ENDPOINT } from 'utils/URL';
import {
  booleanOptions,
  formatFilterBoolean,
  formatFilterString,
  objectToOptions,
  valuesToOptions,
} from 'utils/helpers';
import Input from 'components/forms/Input';
import Button from 'components/forms/Button';
import {
  DisplayFormikState,
  processFilterValues,
} from 'components/forms/form-helper';
import { CertifyIcon } from 'components/utils/Icons';
import { SuccessIcon } from 'components/utils/Icons';
import { InfoIcon } from 'components/utils/Icons';
import { BanIcon } from 'components/utils/Icons';
import { getVerifiedProgress } from '../vendor/setup/AccountSetup';
import { ApprovedIcon } from 'components/utils/Icons';
import DatePicker from 'components/forms/DatePicker';
import { formatFilterDate } from 'utils/date-helpers';
import Tooltip from 'components/common/Tooltip';

const Users = () => (
  <BackendPage>
    <PaginatedContent
      endpoint={API_ENDPOINT.getAllUsers()}
      initialFilter={{
        sortBy: 'createdAt',
        sortDirection: 'desc',
      }}
      pageName="User"
      DataComponent={UsersRowList}
      FilterComponent={FilterForm}
      PageIcon={<UserIcon />}
      queryName="user"
    />
  </BackendPage>
);

const UsersRowList = ({ results, offset }) => {
  return (
    <div className="container-fluid">
      <Card>
        <div className="table-responsive">
          <table className="table table-border table-hover">
            <thead>
              <tr>
                <th>S/N</th>
                <th>User Info</th>
                <th>Phone</th>
                <th>Role</th>
                <th className="text-center">Onboarding</th>
                <th className="text-center">Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {results.map((user, index) => (
                <UsersRow key={index} number={offset + index + 1} {...user} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

UsersRowList.propTypes = {
  results: PropTypes.array.isRequired,
};

const UsersRow = ({ number, ...user }) => {
  const isVendor = user?.role === USER_TYPES.vendor;
  const status = getUserStatus(user);

  return (
    <tr>
      <td>{number}</td>
      <td>
        <UserCard user={user} />
      </td>
      <td>
        <span className="block-text-small">{user?.phone}</span>
        <span className="block-text-small">{user?.phone2 || '-'}</span>
      </td>
      <td>
        <strong className="block-text-small font-bold">
          {Humanize.titleCase(DASHBOARD_PAGE[user?.role])}
        </strong>
        <span className="block-text-smaller">
          {isVendor ? ENTITY_SHORTCODE[user?.vendor?.entity || 'None'] : '-'}
        </span>
      </td>
      <td className="text-center">
        {isVendor ? `${getVerifiedProgress(user)}%` : '-'}
      </td>
      <td className="text-center">
        <Tooltip text={status.tooltip}>
          <span className={`${status.className} icon-md`}>{status.Icon}</span>
        </Tooltip>
      </td>
      <td>
        <Link
          className="btn btn-xs btn-wide btn-secondary"
          href={`/admin/user/${user?._id}`}
        >
          View
        </Link>
      </td>
    </tr>
  );
};

export const getUserStatus = (user) => {
  const userStatus = {
    activated: {
      className: 'text-success',
      Icon: <SuccessIcon />,
      tooltip: 'Activated Account',
    },
    banned: {
      className: 'text-danger',
      Icon: <BanIcon />,
      tooltip: 'Banned User',
    },
    pending: {
      className: 'text-muted',
      Icon: <InfoIcon />,
      tooltip: 'Awaiting Account Activation',
    },
    certified: {
      className: 'text-warning',
      Icon: <CertifyIcon />,
      tooltip: 'Certified Vendor',
    },
    verified: {
      className: 'text-info icon-md2',
      Icon: <ApprovedIcon />,
      tooltip: 'Verified Vendor',
    },
  };

  if (user?.banned?.status) {
    return userStatus.banned;
  }

  if (!user?.vendor?.certified && user?.vendor?.verified) {
    return userStatus.verified;
  }
  if (user?.vendor?.certified) {
    return userStatus.certified;
  }
  if (user?.activated) {
    return userStatus.activated;
  }
  return userStatus.pending;
};

const FilterForm = ({ setFilterTerms }) => {
  return (
    <Formik
      initialValues={{}}
      onSubmit={(values, actions) => {
        console.log(`values`, values);
        const payload = processFilterValues({
          ...values,
          createdAt: formatFilterDate(values?.createdAt?.value),
        });
        console.log(`payload`, payload);
        setFilterTerms(payload, {
          firstName: formatFilterString('First Name', values.firstName),
          lastName: formatFilterString('Last Name', values.lastName),
          email: formatFilterString('Email', values.email),
          phone: formatFilterString('Phone', values.phone),
          phone2: formatFilterString('Phone 2', values.phone2),
          role: formatFilterString(
            'Role',
            Object.keys(USER_TYPES)[values.role]
          ),
          activated: formatFilterBoolean('Activated', values.activated),
          banned: formatFilterBoolean('Banned', values.banned),

          redanNumber: formatFilterString('Redan Number', values.redanNumber),
          companyName: formatFilterString('Company Name', values.companyName),
          entity: formatFilterString('Last Name', values.entity),
          verified: formatFilterBoolean('Verified', values.verified),
          certified: formatFilterBoolean('Certified', values.certified),
          bankDetailsStatus: formatFilterString(
            'Bank Details Status',
            values.bankDetailsStatus
          ),
          companyInfoStatus: formatFilterString(
            'Company Info Status',
            values.companyInfoStatus
          ),
          directorInfoStatus: formatFilterString(
            'Director Info Status',
            values.directorInfoStatus
          ),
          documentUploadStatus: formatFilterString(
            'Document Upload Status',
            values.documentUploadStatus
          ),
        });
      }}
    >
      {({ isSubmitting, handleSubmit, ...props }) => (
        <Form>
          <section>
            <Input label="First Name" name="firstName" />
            <Input label="Last Name" name="lastName" />
            <Input type="email" label="Email" name="email" />
            <Input label="Phone Number" name="phone" />
            <Input label="Phone Number 2" name="phone2" />

            <Select
              label="User Type"
              name="role"
              options={objectToOptions(USER_TYPES)}
            />
            <DatePicker
              label="Created at"
              name="createdAt"
              placeholder="Created At"
            />

            {false && (
              <>
                <Select
                  label="Activated User Account"
                  name="activated"
                  options={booleanOptions()}
                />

                <Select
                  label="Banned"
                  name="banned"
                  options={booleanOptions()}
                />

                <h6 className="mt-5">Vendor Filters</h6>

                <Input label="Company Name" name="companyName" />
                <Input label="Redan Number" name="redanNumber" />

                <Select
                  label="Entity"
                  name="entity"
                  options={valuesToOptions(
                    Object.keys(VENDOR_IDENTIFICATION_TYPE)
                  )}
                />

                <Select
                  label="Verified Vendor"
                  name="verified"
                  options={booleanOptions()}
                />

                <Select
                  label="Certified Vendor"
                  name="certified"
                  options={booleanOptions()}
                />

                <Select
                  label="Bank Details Status"
                  name="bankDetailsStatus"
                  options={valuesToOptions(VENDOR_INFO_STATUS)}
                  placeholder="Bank Status"
                />

                <Select
                  label="Company Info Status"
                  name="companyInfoStatus"
                  options={valuesToOptions(VENDOR_INFO_STATUS)}
                  placeholder="Company Info Status"
                />

                <Select
                  label="Director Info Status"
                  name="directorInfoStatus"
                  options={valuesToOptions(VENDOR_INFO_STATUS)}
                  placeholder="Director Info Status"
                />

                <Select
                  label="Document Upload Status"
                  name="documentUploadStatus"
                  options={valuesToOptions(VENDOR_INFO_STATUS)}
                />
              </>
            )}
          </section>
          <DisplayFormikState {...props} showAll />
          <Button
            className="btn-secondary mt-4"
            loading={isSubmitting}
            onClick={handleSubmit}
          >
            Filter Users
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default Users;
