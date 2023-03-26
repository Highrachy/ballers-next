import { WelcomeHero } from 'pages/user/dashboard';
import React from 'react';
import { Placeholder as RPlaceHolder } from 'react-bootstrap';
import BackendPage from './BackendPage';

const Placeholder = () => {
  return (
    <div className="content-page">
      <WelcomeHero title="Loading" subtitle="Please wait..." />
      <div className="container-fluid">
        <RPlaceHolder as="p" animation="glow">
          <RPlaceHolder xs={6} size="lg" />
          <RPlaceHolder xs={8} />
          <RPlaceHolder xs={7} />
        </RPlaceHolder>
      </div>
    </div>
  );
};

export default Placeholder;
