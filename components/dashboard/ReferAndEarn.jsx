import { ReferIcon } from '../utils/Icons';
import { InfoBox } from './InfoBox';

export const ReferAndEarn = () => (
  <div className="container-fluid py-0">
    <InfoBox
      title="Refer a friend, and BALL together!"
      Icon={<ReferIcon />}
      linkHref="/user/referrals"
      linkText="Refer and Earn"
    >
      Invite your friends to join BALL and you can ball together! <br />
      <span className="d-none d-md-inline">
        Share the love and achieve your homeownership goals with BALL!
      </span>
    </InfoBox>
  </div>
);

export default ReferAndEarn;
