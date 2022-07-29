import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import Toast, { useToast } from 'components/utils/Toast';
import { MessageIcon } from 'components/utils/Icons';
import { useGetQuery } from 'hooks/useQuery';
import { API_ENDPOINT } from 'utils/URL';
import { ContentLoader } from 'components/utils/LoadingItems';
import CardTableSection from 'components/common/CardTableSection';
import BadgePlaceholderImage from 'assets/img/placeholder/property.png';
import Image from 'components/utils/Image';
import Humanize from 'humanize-plus';
import { DASHBOARD_PAGE } from 'utils/constants';
import UserCard from 'components/common/UserCard';
import { BadgesIcon } from 'components/utils/Icons';
const pageOptions = {
  key: 'badge',
  pageName: 'Enquiries',
};

const SingleBadge = ({ id }) => {
  const [toast, setToast] = useToast();
  const [badgeQuery, badge] = useGetQuery({
    key: pageOptions.key,
    name: [pageOptions.key, id],
    setToast,
    endpoint: API_ENDPOINT.getOneBadge(id),
    refresh: true,
  });

  return (
    <BackendPage>
      <ContentLoader
        hasContent={!!badge}
        Icon={<MessageIcon />}
        query={badgeQuery}
        name={pageOptions.pageName}
        toast={toast}
      >
        <BadgeDetail badge={badge} toast={toast} />
      </ContentLoader>
    </BackendPage>
  );
};

const BadgeDetail = ({ badge, toast }) => (
  <div className="container-fluid">
    <Toast {...toast} />
    <div className="mt-5 mb-3">
      <h3>{badge.name}</h3>
    </div>
    <CardTableSection name="Badge Details">
      <tr>
        <td>
          <strong>Name</strong>
        </td>
        <td>{badge.name}</td>
      </tr>
      <tr>
        <td>
          <strong>Role</strong>
        </td>
        <td>
          {Humanize.titleCase(DASHBOARD_PAGE[badge?.assignedRole] || 'All')}
        </td>
      </tr>
      <tr>
        <td>
          <strong>Image</strong>
        </td>
        <td>
          {badge?.image ? (
            <Image
              src={badge?.image}
              name={`badge ${badge?._id}`}
              width="80"
              alt="badge"
              defaultImage={BadgePlaceholderImage}
            />
          ) : (
            <div className="icon-xl">
              <BadgesIcon />
            </div>
          )}
        </td>
      </tr>
    </CardTableSection>
    {badge?.assignedUsers?.length > 0 && (
      <CardTableSection name="Assigned Users">
        <tr>
          <td>
            <div className="row">
              {badge?.assignedUsers?.map((user) => (
                <div className="col py-4 border-bottom">
                  <UserCard user={user} />
                </div>
              ))}{' '}
            </div>
          </td>
        </tr>
      </CardTableSection>
    )}
  </div>
);

export default SingleBadge;
