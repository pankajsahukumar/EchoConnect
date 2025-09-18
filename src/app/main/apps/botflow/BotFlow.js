import { useCallback, useRef } from "react";
import { useEffect, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Panel,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';
import { useReactFlow } from 'reactflow';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import FlowSidebar from './components/Sidebar/FlowSidebar';
import TriggerFactory from './components/Triggers/TriggerFactory';
import ActionFactory from './components/Actions/ActionFactory';
import NodeConfigPanel from './components/NodeConfig/NodeConfigPanel';

// Sample initial configuration based on the required structure
const initialConfig = {
  nodes: [
    {
      id: 'trigger-1',
      type: 'trigger',
      data: {
        label: 'On Chat Start',
        id: 'on-chat-start',
        blockType: 'ON_CHAT_START',
        keywords: [
          { text: 'hello', partialMatch: true },
        ],
        freshStart: false,
      },
      position: { x: 250, y: 50 },
    },
    {
      id: 'action-1',
      type: 'action',
      data: {
        label: 'Add/Remove Tag',
        id: 'add-remove-tag',
        blockType: 'UPDATE_TAG',
        mode: 'add',
        tags: ['new_lead'],
      },
      position: { x: 250, y: 200 },
    },
    {
      id: 'action-2',
      type: 'action',
      data: {
        label: 'Send Interactive Message',
        id: 'interactive-message',
        blockType: 'SEND_INTERACTIVE_MESSAGE',
        header: 'Welcome',
        body: 'Thank you for contacting us. How can we help you today?',
        footer: 'Select an option below',
        listButton: 'View Options',
        sections: [
          {
            title: 'Services',
            items: [
              { id: '1', title: 'Product Information' },
              { id: '2', title: 'Pricing' },
            ],
          },
          {
            title: 'Support',
            items: [
              { id: '3', title: 'Technical Help' },
              { id: '4', title: 'Speak to an Agent' },
            ],
          },
        ],
      },
      position: { x: 250, y: 350 },
    },
  ],
  edges: [
    { id: 'e1-2', source: 'trigger-1', target: 'action-1' },
    { id: 'e2-3', source: 'action-1', target: 'action-2' },
  ],
};

const initialNodes = [];
const initialEdges = [];

const nodeTypes = {
  trigger: TriggerFactory,
  action: ActionFactory,
};

const FlowContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100%',
  width: '100%',
  overflow: 'hidden',
}));

const CanvasContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  height: '100%',
  position: 'relative',
}));

const TopBar = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  zIndex: 10,
  padding: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));
export default function BotFlow(props) {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [enabled, setEnabled] = useState(false);
  const [hasTriggerNode, setHasTriggerNode] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [configPanelOpen, setConfigPanelOpen] = useState(false);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
 
  const onNodesChange = useCallback(
    (changes) => {
      // Filter out remove changes if they would remove the last trigger node
      const filteredChanges = changes.filter(change => {
        if (change.type === 'remove') {
          const nodeToRemove = nodes.find(node => node.id === change.id);
          if (nodeToRemove?.type === 'trigger' && hasTriggerNode) {
            // Allow removal of trigger node
            setHasTriggerNode(false);
            return true;
          }
          return true;
        }
        return true;
      });
      
      setNodes((nds) => applyNodeChanges(filteredChanges, nds));
    },
    [nodes, hasTriggerNode],
  );
  
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
  
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const nodeData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
      
      // Check if trying to add a second trigger node
      if (nodeData.type === 'trigger' && hasTriggerNode) {
        // Prevent adding a second trigger node
        return;
      }

      // Get position from drop coordinates
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Create a new node
      const newNode = {
        id: `${nodeData.type}-${nodeData.data.id}-${Date.now()}`,
        type: nodeData.type,
        position,
        data: { 
          ...nodeData.data,
          blockType: nodeData.blockType || nodeData.data.blockType
        },
      };

      // Update hasTriggerNode state if adding a trigger node
      if (nodeData.type === 'trigger') {
        setHasTriggerNode(true);
      }

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, hasTriggerNode],
  );

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      
      // Convert to the required JSON structure
      const botConfig = {
        nodes: flow.nodes.map(node => {
          // Extract the necessary data based on node type and blockType
          if (node.type === 'trigger') {
            const blockType = node.data.blockType || 'ON_CHAT_START';
            let nodeType = 'trigger';
            let nodeId = '';
            
            // Determine node ID based on blockType
            switch(blockType) {
              case 'ON_CHAT_START':
                nodeId = 'on-chat-start';
                break;
              case 'LEAD_FROM_CTWA':
              case 'LEAD_FROM_CTWA_V2':
              case 'CALL_TO_WHATSAPP_MESSAGE_RECEIVED':
                nodeId = 'lead-from-ctwa';
                break;
              case 'ON_ABANDONED_CART_WOOCOMMERCE':
                nodeId = 'on-abandoned-cart';
                break;
              case 'ON_AGENT_ASSIGN':
                nodeId = 'on-agent-assign';
                break;
              case 'ON_ATTRIBUTE_CHANGED':
                nodeId = 'on-attribute-changed';
                break;
              case 'ON_NEW_ROW_GOOGLE_SHEET':
                nodeId = 'on-new-row-google-sheet';
                break;
              default:
                nodeId = 'on-chat-start';
            }
            
            return {
              id: node.id,
              type: nodeType,
              data: {
                id: nodeId,
                blockType: blockType,
                keywords: node.data.keywords || [],
                freshStart: node.data.freshStart || false,
                // Add other trigger-specific properties based on blockType
                ...(blockType === 'ON_ATTRIBUTE_CHANGED' && {
                  attribute: node.data.attribute || '',
                  value: node.data.value || ''
                }),
                ...(blockType === 'ON_ABANDONED_CART_WOOCOMMERCE' && {
                  timer: node.data.timer || 30
                }),
                ...(blockType === 'ON_NEW_ROW_GOOGLE_SHEET' && {
                  sheetId: node.data.sheetId || '',
                  sheetName: node.data.sheetName || ''
                })
              }
            };
          } else if (node.type === 'action') {
            const blockType = node.data.blockType || '';
            let nodeType = '';
            
            // Determine node type based on blockType
            switch(blockType) {
              case 'ADD_REMOVE_TAGS':
              case 'UPDATE_TAG':
                nodeType = 'addTag';
                return {
                  id: node.id,
                  type: nodeType,
                  data: {
                    mode: node.data.mode || 'add',
                    tags: node.data.tags || [],
                    blockType: 'UPDATE_TAG'
                  }
                };
              case 'SEND_INTERACTIVE_MESSAGE':
                nodeType = 'interactiveMessage';
                return {
                  id: node.id,
                  type: nodeType,
                  data: {
                    header: node.data.header || '',
                    body: node.data.body || '',
                    footer: node.data.footer || '',
                    listButton: node.data.listButton || '',
                    sections: node.data.sections || [],
                    blockType: 'SEND_INTERACTIVE_MESSAGE'
                  }
                };
              case 'SEND_MESSAGE':
                nodeType = 'sendMessage';
                return {
                  id: node.id,
                  type: nodeType,
                  data: {
                    messageType: node.data.messageType || 'text',
                    text: node.data.text || '',
                    mediaUrl: node.data.mediaUrl || ''
                  }
                };
              case 'ASSIGN_AGENT':
              case 'ASSIGN_AGENT_V3':
                nodeType = 'assignAgent';
                return {
                  id: node.id,
                  type: nodeType,
                  data: {
                    agentId: node.data.agentId || '',
                    blockType: 'ASSIGN_AGENT_V3'
                  }
                };
              case 'ADD_TO_BROADCAST_LISTS':
              case 'ADD_TO_BROADCAST_LIST':
                nodeType = 'addToBroadcastList';
                return {
                  id: node.id,
                  type: nodeType,
                  data: {
                    lists: node.data.lists || [],
                    blockType: 'ADD_TO_BROADCAST_LIST'
                  }
                };
              default:
                // Fallback for unknown action types
                return node;
            }
          }
          return node;
        }),
        edges: flow.edges
      };
      
      // Save to localStorage for now (in a real app, this would be sent to the server)
      localStorage.setItem('botflow', JSON.stringify(flow));
      localStorage.setItem('botConfiguration', JSON.stringify(botConfig));
      console.log('Flow saved:', botConfig);
      
      // In a real application, you would send this to your backend
      // axios.post('/api/botflow/save', botConfig);
    }
  }, [reactFlowInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      // Try to load from localStorage first
      const flow = JSON.parse(localStorage.getItem('botflow'));
      
      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        
        // Check if there's a trigger node in the restored flow
        const hasTrigger = flow.nodes.some(node => node.type === 'trigger');
        setHasTriggerNode(hasTrigger);
      } else {
        // If no saved flow, use the initial configuration
        setNodes(initialConfig.nodes || []);
        setEdges(initialConfig.edges || []);
        
        // Check if there's a trigger node in the initial config
        const hasTrigger = initialConfig.nodes.some(node => node.type === 'trigger');
        setHasTriggerNode(hasTrigger);
      }
      
      // In a real application, you would fetch from your backend
      // try {
      //   const response = await axios.get('/api/botflow/config');
      //   const config = response.data;
      //   // Process the config and set nodes/edges
      // } catch (error) {
      //   console.error('Failed to load configuration:', error);
      //   // Fall back to initial config
      // }
    };

    restoreFlow();
  }, [setNodes, setEdges]);
  
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setConfigPanelOpen(true);
  }, []);
  
  // Function to duplicate a node
  const duplicateNode = useCallback((nodeId) => {
    const nodeToClone = nodes.find(node => node.id === nodeId);
    if (!nodeToClone) return;
    
    // Create a new node with the same data but a new ID
    const newNode = {
      ...nodeToClone,
      id: crypto.randomUUID(),
      position: {
        x: nodeToClone.position.x + 50,
        y: nodeToClone.position.y + 50,
      },
      data: {
        ...nodeToClone.data,
      }
    };
    
    // Add the new node to the flow
    setNodes((nds) => nds.concat(newNode));
  }, [nodes]);
  
  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    setConfigPanelOpen(false);
    setSelectedNode(null);
  }, []);

  const closeConfigPanel = useCallback(() => {
    setConfigPanelOpen(false);
    setSelectedNode(null);
  }, []);
  
  const updateNodeData = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      })
    );
  }, []);
  
  // Pass duplicateNode function to node data
  useEffect(() => {
    setNodes((nds) => 
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          duplicateNode: () => duplicateNode(node.id)
        }
      }))
    );
  }, [duplicateNode]);

  // Load saved flow on component mount
  useEffect(() => {
    onRestore();
  }, [onRestore]);

  // Load bot configurations from localStorage
  const loadBotConfigurations = useCallback(() => {
    try {
      const botConfig = JSON.parse(localStorage.getItem('botConfiguration'));
      if (botConfig && botConfig.nodes) {
        // Clear existing nodes
        setNodes([]);
        setEdges([]);
        
        // Map configuration nodes to ReactFlow nodes
        const flowNodes = botConfig.nodes.map(node => {
          let nodeType, nodeData;
          
          if (node.type === 'trigger') {
            nodeType = 'trigger';
            const blockType = node.data.id === 'on-chat-start' ? 'ON_CHAT_START' : 
                             node.data.id === 'lead-from-ctwa' ? 'LEAD_FROM_CTWA' :
                             node.data.id === 'on-abandoned-cart' ? 'ON_ABANDONED_CART_WOOCOMMERCE' :
                             node.data.id === 'on-agent-assign' ? 'ON_AGENT_ASSIGN' :
                             node.data.id === 'on-attribute-changed' ? 'ON_ATTRIBUTE_CHANGED' :
                             node.data.id === 'on-new-row-google-sheet' ? 'ON_NEW_ROW_GOOGLE_SHEET' : 'ON_CHAT_START';
            nodeData = {
              label: node.data.id === 'on-chat-start' ? 'On Chat Start' : 
                     node.data.id === 'lead-from-ctwa' ? 'Lead From CTWA' :
                     node.data.id === 'on-abandoned-cart' ? 'On Abandoned Cart' :
                     node.data.id === 'on-agent-assign' ? 'On Agent Assign' :
                     node.data.id === 'on-attribute-changed' ? 'On Attribute Changed' :
                     node.data.id === 'on-new-row-google-sheet' ? 'On New Row Google Sheet' : 'On Chat Start',
              id: node.data.id,
              blockType: blockType,
              keywords: node.data.keywords || [],
              freshStart: node.data.freshStart || false
            };
          } else if (node.type === 'addTag' || node.type === 'add-remove-tag') {
            nodeType = 'action';
            nodeData = {
              label: 'Add/Remove Tag',
              id: 'add-remove-tag',
              blockType: 'UPDATE_TAG', // Changed from ADD_REMOVE_TAGS to UPDATE_TAG
              mode: node.data.mode || 'add',
              tags: node.data.tags || []
            };
          } else if (node.type === 'interactiveMessage' || node.type === 'send-interactive-message') {
            nodeType = 'action';
            nodeData = {
              label: 'Send Interactive Message',
              id: 'interactive-message',
              blockType: 'SEND_INTERACTIVE_MESSAGE',
              header: node.data.header || '',
              body: node.data.body || '',
              footer: node.data.footer || '',
              listButton: node.data.listButton || '',
              sections: node.data.sections || []
            };
          } else if (node.type === 'sendMessage' || node.type === 'send-message') {
            nodeType = 'action';
            nodeData = {
              label: 'Send Message',
              id: 'send-message',
              blockType: 'SEND_MESSAGE',
              messageType: node.data.messageType || 'text',
              text: node.data.text || '',
              mediaUrl: node.data.mediaUrl || ''
            };
          } else if (node.type === 'assignAgent') {
            nodeType = 'action';
            nodeData = {
              label: 'Assign Agent',
              id: 'assign-agent',
              blockType: 'ASSIGN_AGENT_V3', // Changed from ASSIGN_AGENT to ASSIGN_AGENT_V3
              agentId: node.data.agentId || ''
            };
          } else if (node.type === 'addToBroadcastLists') {
            nodeType = 'action';
            nodeData = {
              label: 'Add To Broadcast Lists',
              id: 'add-to-broadcast-lists',
              blockType: 'ADD_TO_BROADCAST_LIST', // Changed from ADD_TO_BROADCAST_LISTS to ADD_TO_BROADCAST_LIST
              lists: node.data.lists || []
            };
          }
          
          return {
            id: node.id,
            type: nodeType,
            data: nodeData,
            position: node.position || { x: 100, y: 100 }
          };
        });
        
        // Set nodes and edges
        setNodes(flowNodes);
        if (botConfig.edges) {
          setEdges(botConfig.edges);
        }
        
        // Check if there's a trigger node
        const hasTrigger = flowNodes.some(node => node.type === 'trigger');
        setHasTriggerNode(hasTrigger);
      }
    } catch (error) {
      console.error('Failed to load bot configurations:', error);
    }
  }, []);
  
  return (
    <FlowContainer>
      <FlowSidebar />
      <CanvasContainer ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          deleteKeyCode={['Backspace', 'Delete']}
          nodesDraggable={true}
          elementsSelectable={true}
          nodesConnectable={true}
          proOptions={{ hideAttribution: true }}
        >
          <Background />
          <Controls />
          <Panel position="top-right">
            <TopBar>
              <FormControlLabel
                control={
                  <Switch
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    color="success"
                  />
                }
                label={enabled ? "Enabled" : "Disabled"}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={onSave}
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<PlayArrowIcon />}
                disabled={!hasTriggerNode}
              >
                Test Flow
              </Button>
              <Button
                variant="contained"
                color="info"
                onClick={loadBotConfigurations}
              >
                Load Config
              </Button>
            </TopBar>
          </Panel>
        </ReactFlow>
      </CanvasContainer>
    </FlowContainer>
  );
}
