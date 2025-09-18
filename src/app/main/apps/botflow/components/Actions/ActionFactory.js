import React from 'react';
import AddRemoveTags from './AddRemoveTags';
import AddToBroadcastLists from './AddToBroadcastLists';
import AssignAgent from './AssignAgent';
import SendMessage from './SendMessage';
import SendInteractiveMessage from './SendInteractiveMessage';

/**
 * ActionFactory component that renders the appropriate action component based on the action type
 * @param {Object} props - Component props
 * @param {Object} props.data - The action data from botConfiguration.json
 * @param {string} props.nodeId - The node ID in the ReactFlow graph
 * @returns {React.ReactElement} The appropriate action component
 */
const ActionFactory = ({ data, nodeId }) => {
  // Extract the blockType from the data
  const { blockType } = data;

  // Render the appropriate action component based on the blockType
  switch (blockType) {
    case 'UPDATE_TAG':
      return <AddRemoveTags data={data} nodeId={nodeId} />;
    case 'ADD_TO_BROADCAST_LIST':
      return <AddToBroadcastLists data={data} nodeId={nodeId} />;
    case 'ASSIGN_AGENT_V3':
      return <AssignAgent data={data} nodeId={nodeId} />;
    case 'SEND_MESSAGE':
      return <SendMessage data={data} nodeId={nodeId} />;
    case 'SEND_INTERACTIVE_MESSAGE':
      return <SendInteractiveMessage data={data} nodeId={nodeId} />;
    case 'ADD_REMOVE_TAGS': // For backward compatibility
      return <AddRemoveTags data={{...data, blockType: 'UPDATE_TAG'}} nodeId={nodeId} />;
    case 'ADD_TO_BROADCAST_LISTS': // For backward compatibility
      return <AddToBroadcastLists data={{...data, blockType: 'ADD_TO_BROADCAST_LIST'}} nodeId={nodeId} />;
    case 'ASSIGN_AGENT': // For backward compatibility
      return <AssignAgent data={{...data, blockType: 'ASSIGN_AGENT_V3'}} nodeId={nodeId} />;
    default:
      return (
        <div className="p-4 border border-red-300 bg-red-50 rounded">
          <p className="text-red-500">Unknown action type: {blockType}</p>
        </div>
      );
  }
};

export default ActionFactory;