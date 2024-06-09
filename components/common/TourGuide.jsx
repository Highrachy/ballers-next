import React, { useState, useContext, useEffect } from 'react';
import ReactJoyride, { STATUS } from 'react-joyride';
import axios from 'axios';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/UserContext';
import { getError, statusIsSuccessful } from '@/utils/helpers';
import colorTokens from 'style-dictionary/build/color.tokens';
import { BASE_API_URL } from '@/utils/constants';

const TourGuide = ({ steps }) => {
  const { userState, userDispatch } = useContext(UserContext);
  const router = useRouter();
  const { tour } = router.query;
  const [runTour, setRunTour] = useState(false);

  const showTour = !!userState?.additionalInfo?.showTour;

  useEffect(() => {
    setRunTour(tour === 'true' ? true : showTour);
  }, [showTour, tour]);

  const handleJoyrideCallback = (data) => {
    const { status, type } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      axios
        .put(`${BASE_API_URL}/user/hide-tour`, { userId: userState?._id })
        .then((response) => {
          const { status } = response;
          if (statusIsSuccessful(status)) {
            userDispatch({
              user: {
                additionalInfo: {
                  ...userState.additionalInfo,
                  showTour: false,
                },
              },
              type: 'hide-tour',
            });
          }
        })
        .catch((error) => {
          console.log('getError', getError(error));
        });
    }
  };

  console.log('runTour', runTour);
  console.log('{tour, showTour}', { tour, showTour });

  if (!runTour) return null;

  return (
    <ReactJoyride
      steps={steps}
      showProgress
      showSkipButton
      spotlightClicks={false}
      continuous
      callback={handleJoyrideCallback}
      styles={{
        buttonSkip: {
          color: colorTokens.danger[600],
        },
        buttonBack: {
          color: colorTokens.gray[600],
        },
        buttonNext: {
          background: colorTokens.secondary[400],
          padding: '1rem 1.5rem',
        },
        tooltipContainer: {
          padding: '1rem 2rem 0',
        },
      }}
    />
  );
};

export default TourGuide;
