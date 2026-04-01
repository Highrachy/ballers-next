import { useState } from 'react';
import ExitIntentModal from './ExitIndentModal';
import useExitIntent from './useExitIntent';

const ExitIntentProvider = ({ property = null, enabled = true }) => {
  const [showModal, setShowModal] = useState(false);
  console.log('loaded exit intent provider with property:', property);

  useExitIntent({
    enabled,
    onExit: () => setShowModal(true),
  });

  return (
    <ExitIntentModal
      show={showModal}
      onHide={() => setShowModal(false)}
      property={property}
    />
  );
};

export default ExitIntentProvider;
