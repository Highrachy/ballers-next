import { useState } from 'react';
import ExitIntentModal from './ExitIndentModal';
import useExitIntent from './useExitIntent';

const ExitIntentProvider = ({ property = null, enabled = true }) => {
  const [showModal, setShowModal] = useState(false);
  const [exitReason, setExitReason] = useState(null);

  useExitIntent({
    enabled,
    onExit: (reason) => {
      setExitReason(reason);
      setShowModal(true);
    },
  });

  return (
    <ExitIntentModal
      show={showModal}
      onHide={() => setShowModal(false)}
      property={property}
      exitReason={exitReason}
    />
  );
};

export default ExitIntentProvider;
