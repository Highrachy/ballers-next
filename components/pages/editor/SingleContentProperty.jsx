import React from 'react';
import PropTypes from 'prop-types';
import BackendPage from 'components/layout/BackendPage';
import { Card } from 'react-bootstrap';
import Axios from 'axios';
import { BASE_API_URL } from 'utils/constants';
import Toast, { useToast } from 'components/utils/Toast';
import { getTokenFromStore } from 'utils/localStorage';
import LoadItems from 'components/utils/LoadingItems';
import NoContent from 'components/utils/NoContent';
import { PropertyIcon } from 'components/utils/Icons';
import { getError, moneyFormatInNaira } from 'utils/helpers';
import TopTitle from 'components/utils/TopTitle';
import Link from 'next/link';
import { Line } from 'react-chartjs-2';
import Map from 'components/common/Map';

const SingleContentProperty = ({ id }) => {
  const [toast, setToast] = useToast();
  const [contentProperty, setContentProperty] = React.useState(null);
  React.useEffect(() => {
    Axios.get(`${BASE_API_URL}/area/${id}`, {
      headers: {
        Authorization: getTokenFromStore(),
      },
    })
      .then(function (response) {
        const { status, data } = response;
        // handle success
        if (status === 200) {
          setContentProperty(data.area);
        }
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
      });
  }, [id, setToast]);
  return (
    <BackendPage>
      <Toast {...toast} showToastOnly />
      <TopTitle
        buttonText="New Content Property"
        href={`/editor/content-property/new`}
      >
        {contentProperty && contentProperty.area ? (
          <>
            Content Properties for{' '}
            <span className="text-secondary">
              {contentProperty.area}, {contentProperty.state}{' '}
            </span>
          </>
        ) : (
          <>Loading Content Property Information</>
        )}{' '}
      </TopTitle>
      <AllContentProperty contentProperty={contentProperty || []} />
    </BackendPage>
  );
};

const ContentPropertyGraph = ({ properties }) => {
  console.log('properties', properties);
  let datasets = [];
  const output = properties.reduce((acc, property) => {
    if (!acc[property.houseType]) {
      acc[property.houseType] = [];
    }
    acc[property.houseType].push(property.price);
    return acc;
  }, {});

  const dynamicColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return [`rgba(${r},${g},${b},1)`, `rgba(${r},${g},${b},0.05)`];
  };

  for (const label in output) {
    const color = dynamicColor();
    const arr = output[label];
    datasets.push({
      label,
      data: [
        Math.min(...arr),
        arr.reduce((a, b) => a + b, 0) / arr.length,
        Math.max(...arr),
      ],
      fill: true,
      backgroundColor: color[1],
      borderColor: color[0],
    });
  }

  const data = {
    labels: ['Minimum Price', 'Average Price', 'Maximum Price'],
    datasets,
  };

  return (
    <div className="container-fluid">
      <Card className="card-container h-100">
        <Line data={data} />
      </Card>
    </div>
  );
};

const ContentPropertyMap = ({ latitude, longitude }) =>
  latitude && longitude ? (
    <div className="container-fluid">
      <Card className="card-container h-100">
        <div style={{ height: '35rem' }}>
          <Map
            coordinates={{
              lat: latitude,
              lng: longitude,
            }}
            zoom={15}
          />
        </div>
      </Card>
    </div>
  ) : (
    <></>
  );

const AllContentProperty = ({ contentProperty, toast }) => (
  <LoadItems
    Icon={<PropertyIcon />}
    items={contentProperty && contentProperty.linkedProperties}
    loadingText="Loading your Content Property"
    noContent={
      <NoContent
        Icon={<PropertyIcon />}
        isButton
        text="No Content Property found"
      />
    }
  >
    <ContentPropertyGraph
      properties={contentProperty && contentProperty.linkedProperties}
    />
    <ContentPropertyRowList
      toast={toast}
      contentProperty={
        (contentProperty && contentProperty.linkedProperties) || []
      }
    />
    <ContentPropertyMap {...contentProperty} />
  </LoadItems>
);

const ContentPropertyRowList = ({ contentProperty }) => {
  const [toast, setToast] = useToast();
  return (
    <div className="container-fluid">
      <Toast {...toast} showToastOnly />
      <Card className="mt-4">
        <div className="table-responsive">
          <table className="table table-border table-hover">
            <thead>
              <tr>
                <th>S/N</th>
                <th>House Type</th>
                <th>Price</th>
                <th>Category</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {contentProperty.map((property, index) => (
                <ContentPropertyRow
                  key={index}
                  setToast={setToast}
                  number={index + 1}
                  {...property}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

ContentPropertyRowList.propTypes = {
  contentProperty: PropTypes.array.isRequired,
};

const ContentPropertyRow = ({
  _id,
  category,
  number,
  houseType,
  price,
  website,
  link,
}) => {
  const linkAnchor = link ? <a href={link}>{website || link}</a> : null;
  return (
    <tr>
      <td>{number}</td>
      <td>
        {houseType}
        <br />
        <small>{linkAnchor || website}</small>
      </td>
      <td>{moneyFormatInNaira(price)}</td>
      <td>{category}</td>
      <td>
        <Link
          className="btn btn-sm btn-danger"
          href={`/editor/content-property/edit/${_id}`}
        >
          Edit Property
        </Link>
      </td>
    </tr>
  );
};

export default SingleContentProperty;
