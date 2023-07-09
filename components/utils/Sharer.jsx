import React from 'react';
import PropTypes from 'prop-types';
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share';

const CONTENT_BODY = `Hi there! Join Ballers today -- the easiest way to become a Landlord`;

const Sharer = ({
  shareUrl,
  content,
  contentBody,
  width = 48,
  className = 'text-center',
}) => (
  <ul className={`list-unstyled list-inline sharer__icons ${className} mt-4`}>
    <li>
      <FacebookShareButton quote={content} url={shareUrl}>
        <FacebookIcon round width={width} />
      </FacebookShareButton>
    </li>
    <li>
      <TwitterShareButton title={contentBody || CONTENT_BODY} url={shareUrl}>
        <TwitterIcon round width={width} />
      </TwitterShareButton>
    </li>
    {/* <li>
      <LinkedinShareButton source={shareUrl} summary={content} title="Ballers">
        <LinkedinIcon round width={width} />
      </LinkedinShareButton>
    </li> */}
    <li>
      <WhatsappShareButton separator=":: " title={content} url={shareUrl}>
        <WhatsappIcon round width={width} />
      </WhatsappShareButton>
    </li>
    <li>
      <EmailShareButton
        body={content}
        subject={`Hey Friend! Check out Ballers ${shareUrl}`}
      >
        <EmailIcon round width={width} />
      </EmailShareButton>
    </li>
  </ul>
);

Sharer.propTypes = {
  content: PropTypes.string,
  shareUrl: PropTypes.string,
  contentBody: PropTypes.string,
};

Sharer.defaultProps = {
  content: CONTENT_BODY,
  shareUrl: 'https://ballers.ng',
  contentBody: null,
};

export default Sharer;
