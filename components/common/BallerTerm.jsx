import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

/**
 * Shows the word “BALLer” (or any children) with a dotted underline.
 * Hover / focus reveals a tooltip that explains what a BALLer is.
 */
export default function BallerTerm({ children = 'BALLer' }) {
  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip id="baller-tooltip">
          A <strong>BALLer</strong> is anyone who is ready to Become a Landlord
          through the BALL platform.
        </Tooltip>
      }
    >
      <span className="baller-term">{children}</span>
    </OverlayTrigger>
  );
}
