import React from 'react';
import Sharer from 'components/utils/Sharer';
import Modal from 'components/common/Modal';
import Button from '../forms/Button';
import { useRouter } from 'next/router';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ClipboardTick, DocumentCopy } from 'iconsax-react';
import { FaShareAlt } from 'react-icons/fa';

const SharerModal = ({ url, title = 'Share Page', iconWidth = 64 }) => {
  const [showDetailsModal, setShowDetailsModal] = React.useState(false);
  const { asPath } = useRouter();
  const [copied, setCopied] = React.useState(false);
  const URL =
    url || `${process.env.NEXT_PUBLIC_HOST || 'https://ballers.ng'}${asPath}`;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCopied(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <>
      <Button color="primary-light" onClick={() => setShowDetailsModal(true)}>
        <FaShareAlt /> &nbsp; Share
      </Button>
      <Modal
        title={title}
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        showFooter={false}
      >
        <section>
          <p className="text-dark text-md">Copy URL and share with friends</p>
          {copied && (
            <div className="mb-3 text-xs text-success">
              Your link has been successfully copied!
            </div>
          )}

          <div className="input-group my-3">
            <input
              type="text"
              className="form-control text-sm"
              value={URL}
              aria-label="Recipient's username"
              aria-describedby="copy-text"
              disabled
            />
            <CopyToClipboard text={URL} onCopy={() => setCopied(true)}>
              {copied ? (
                <span
                  className="input-group-text text-success disabled"
                  id="copy-text"
                >
                  <ClipboardTick />
                </span>
              ) : (
                <span className="input-group-text btn btn-light" id="copy-text">
                  <DocumentCopy />
                </span>
              )}
            </CopyToClipboard>
          </div>

          <CopyToClipboard text={URL} onCopy={() => setCopied(true)}>
            <Button color="secondary-light" className="btn-xs">
              {copied ? 'Copied' : 'Copy Text'}
            </Button>
          </CopyToClipboard>

          <div className="share">
            <h6 className="mb-0 mt-5">Share via</h6>
            <Sharer
              shareUrl={`${
                process.env.NEXT_PUBLIC_HOST || 'ballers.ng/'
              }${asPath}`}
              content={'This property will be shared on social media networks'}
              contentBody={
                'This property will be shared on social media networks'
              }
              className=""
              width={iconWidth}
            />
          </div>
        </section>
      </Modal>
    </>
  );
};

export default SharerModal;
