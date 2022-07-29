import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { API_ENDPOINT } from 'utils/URL';
import { useCurrentRole } from 'hooks/useUser';
import { VAS_TYPE } from 'utils/constants';
import { useGetQuery } from 'hooks/useQuery';
import { useToast } from 'components/utils/Toast';
import { ContentLoader } from 'components/utils/LoadingItems';
import { VasIcon } from 'components/utils/Icons';
import { ProcessVasForm } from '../user/ProcessVas';
import { Card } from 'react-bootstrap';
// import { Link } from '@reach/router';
import { VasRequestsList } from './VasRequests';
import Button from 'components/forms/Button';
import Modal from 'components/common/Modal';

const PersonalizedVas = () => {
  const [toast, setToast] = useToast();
  const [showVasForm, setShowVasForm] = React.useState(false);

  // const userType = useCurrentRole().name;
  const isUser = useCurrentRole().isUser;
  const axiosOptionsForUserVas = {
    params: {
      limit: 0,
      type: isUser ? VAS_TYPE.USER : VAS_TYPE.VENDOR,
      sortBy: 'name',
      sortDirection: 'desc',
    },
  };
  const [vasQuery] = useGetQuery({
    axiosOptions: axiosOptionsForUserVas,
    key: 'vas',
    name: 'vas',
    setToast,
    endpoint: API_ENDPOINT.getAllVas(),
    refresh: true,
  });

  return (
    <BackendPage>
      <ContentLoader
        hasContent={!!vasQuery.data?.result}
        Icon={<VasIcon />}
        query={vasQuery}
        name="Services"
        toast={toast}
      >
        <section className="container-fluid">
          <h4>Services</h4>
          <Card className="card-container">
            <div className="row">
              <div className="col-sm-12 mt-2">
                <h5 className="header-smaller">Personalized Services</h5>

                <ul>
                  {vasQuery?.data?.result?.map((vas) => (
                    <li key={vas.id}>{vas.name}</li>
                  ))}
                </ul>

                <Button
                  onClick={() => setShowVasForm(true)}
                  className="btn btn-secondary my-3"
                >
                  Order for Service
                </Button>
              </div>
            </div>
          </Card>

          <div className="mt-5">
            <VasRequestsList />
          </div>

          <Modal
            title="Services"
            show={showVasForm}
            onHide={() => setShowVasForm(false)}
            showFooter={false}
          >
            <ProcessVasForm
              hideForm={() => {}}
              setToast={setToast}
              vasInfo={vasQuery?.data?.result || []}
            />
          </Modal>
        </section>
      </ContentLoader>
    </BackendPage>
  );
};

export default PersonalizedVas;
