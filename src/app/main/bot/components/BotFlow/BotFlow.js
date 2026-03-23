import { useCallback, useRef, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import ConditionNode from "../Nodes/ConditionNode";
import styled from "@emotion/styled";
import { Box } from "@mui/system";
import ConditionNodeV2 from "../Nodes/ConditionNodeV2";
import TagNode from "../Nodes/TagNode";
import FlowSidebar from "../Sidebar/FlowSidebar";
import { Button } from "@mui/material";
import SendInteractiveList from "../Nodes/SendInteractiveList";

const FlowContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "100%",
  width: "100%",
  overflow: "hidden",
}));

const CanvasContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  height: "100%",
  position: "relative",
}));

const nodeTypes = { condition: ConditionNodeV2,UPDATE_TAG:TagNode,SEND_INTERACTIVE_LIST_MESSAGE:SendInteractiveList };

const initialNodes = [
  
];

const initialEdges = [
  // {
  //   id: "e1-true-2",
  //   source: "1",
  //   sourceHandle: "true",
  //   target: "2",
  //   type: "bezier", // or 'default', 'bezier'
  //   markerEnd: {
  //     type: MarkerType.ArrowClosed,
  //   },
  // },
];

function BotFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [hasTriggerNode, setHasTriggerNode] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [configPanelOpen, setConfigPanelOpen] = useState(false);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "bezier",
            markerEnd: {
              type: MarkerType.ArrowClosed
            }
          },
          eds
        )
      ),
    [setEdges]
  );
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const nodeData = JSON.parse(
        event.dataTransfer.getData("application/reactflow")
      );

      // Check if trying to add a second trigger node
      if (nodeData.type === "trigger" && hasTriggerNode) {
        // Prevent adding a second trigger node
        return;
      }
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      // Create a new node
      const newNode = {
        id: `${nodeData.type}-${nodeData.data.id}-${Date.now()}`,
        type: nodeData.data.blockType,
        position,
        data: {
          ...nodeData.data
        },
      };
      if (nodeData.type === "trigger") {
        setHasTriggerNode(true);
      }

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, hasTriggerNode]
  );
  return (
    <FlowContainer>
      <Button onClick={()=>{
        localStorage.setItem('botFlowData',JSON.stringify({nodes,edges}));
        console.log('Bot flow data saved to localStorage',nodes,edges);
      }}>Save Data</Button>
      <FlowSidebar />
      <CanvasContainer ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onDrop={onDrop}
          onInit={setReactFlowInstance}
          onDragOver={onDragOver}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </CanvasContainer>
    </FlowContainer>
  );
}

export default BotFlow;
