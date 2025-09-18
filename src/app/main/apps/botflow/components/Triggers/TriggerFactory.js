import React from 'react';
import LeadFromCTWA from './LeadFromCTWA';
import OnChatStart from './OnChatStart';
import OnAbandonedCart from './OnAbandonedCart';
import OnAgentAssign from './OnAgentAssign';
import OnAttributeChanged from './OnAttributeChanged';
import OnNewRowGoogleSheet from './OnNewRowGoogleSheet';

/**
 * TriggerFactory component for rendering the appropriate trigger component based on blockType
 * @param {Object} props - Component props
 * @param {Object} props.data - The trigger data from botConfiguration.json
 * @param {string} props.nodeId - The node ID in the ReactFlow graph
 * @returns {React.ReactElement} The appropriate trigger component
 */
const TriggerFactory = ({ data, nodeId }) => {
  const blockType = data?.blockType || '';

  // Render the appropriate trigger component based on blockType
  switch (blockType) {
    case 'LEAD_FROM_CTWA':
    case 'LEAD_FROM_CTWA_V2': // Add support for V2 version
    case 'CALL_TO_WHATSAPP_MESSAGE_RECEIVED': // Add support for CTWA message received
      return <LeadFromCTWA data={data} nodeId={nodeId} />;
    case 'ON_CHAT_START':
      return <OnChatStart data={data} nodeId={nodeId} />;
    case 'ON_ABANDONED_CART_WOOCOMMERCE':
      return <OnAbandonedCart data={data} nodeId={nodeId} />;
    case 'ON_AGENT_ASSIGN':
      return <OnAgentAssign data={data} nodeId={nodeId} />;
    case 'ON_ATTRIBUTE_CHANGED':
      return <OnAttributeChanged data={data} nodeId={nodeId} />;
    case 'ON_NEW_ROW_GOOGLE_SHEET':
      return <OnNewRowGoogleSheet data={data} nodeId={nodeId} />;
    default:
      console.log('Unknown trigger type:', blockType);
      return (
        <div>
          <p>Unknown trigger type: {blockType}</p>
        </div>
      );
  }
};

export default TriggerFactory;