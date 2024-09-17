import React from 'react';
import BackendPage from '@/components/layout/BackendPage';
import {
  BlogIcon,
  EditNoteIcon,
  ReportedContentIcon,
} from '@/components/utils/Icons';
import Toast, { useToast } from '@/components/utils/Toast';
import { API_ENDPOINT } from 'utils/URL';
import { useGetQuery } from '@/hooks/useQuery';
import WelcomeHero from '@/components/common/WelcomeHero';
import Widget from '@/components/dashboard/Widget';

const Dashboard = () => {
  const [toast] = useToast();

  const [dashboardQuery] = useGetQuery({
    axiosOptions: {},
    name: 'dashboard',
    endpoint: API_ENDPOINT.getDashboardInfo(),
    refresh: true,
  });

  const result = dashboardQuery?.data || {};

  return (
    <BackendPage>
      <Toast {...toast} showToastOnly />
      <WelcomeHero subtitle="Welcome to the Editorial Dashboard" />
      <EditorOverview result={result} />
    </BackendPage>
  );
};

const EditorOverview = ({ result }) => {
  const { widgets } = result;

  const widgetLists = [
    {
      name: 'Blog Posts',
      color: 'secondary',
      Icon: <BlogIcon />,
      value: widgets?.blogCount || 0,
      link: 'blog',
    },
    {
      name: 'Community Topics',
      color: 'success',
      Icon: <EditNoteIcon />,
      value: widgets?.communityCount || 0,
      fullLink: '/community',
    },
    {
      name: 'Reported Contents',
      color: 'danger',
      Icon: <ReportedContentIcon />,
      value: 0,
      link: '#',
    },
  ];

  return (
    <div className="container-fluid py-0 mt-n6">
      <div className="row g-4">
        {widgetLists.map((widget, index) => (
          <Widget
            key={index}
            {...widget}
            role="editor"
            className="col-6 col-md-6 col-lg-4 col-xl-3"
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
