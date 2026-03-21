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
import styled from "@emotion/styled";
import { Box } from "@mui/system";
import { Button, Snackbar, Alert } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

// Node components
import ConditionNodeV2 from "../Nodes/ConditionNodeV2";
import TagNode from "../Nodes/TagNode";
import SendInteractiveList from "../Nodes/SendInteractiveList";
import TriggerNode from "../Nodes/TriggerNode";
import SendMessageNode from "../Nodes/SendMessageNode";
import AssignAgentNode from "../Nodes/AssignAgentNode";
import BroadcastListNode from "../Nodes/BroadcastListNode";
import SleepDelayNode from "../Nodes/SleepDelayNode";
import HttpApiCallNode from "../Nodes/HttpApiCallNode";
import SendTemplateNode from "../Nodes/SendTemplateNode";
import SendButtonMessageNode from "../Nodes/SendButtonMessageNode";
import UpdateAttributeNode from "../Nodes/UpdateAttributeNode";
import FlowSidebar from "../Sidebar/FlowSidebar";

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

const nodeTypes = {
  // Triggers
  ON_CHAT_START: TriggerNode,
  LEAD_FROM_CTWA_V2: TriggerNode,
  ON_ABANDONED_CART_WOOCOMMERCE: TriggerNode,
  ON_AGENT_ASSIGN: TriggerNode,
  ON_ATTRIBUTE_CHANGED: TriggerNode,
  ON_NEW_ROW_GOOGLE_SHEET: TriggerNode,
  // Actions
  condition: ConditionNodeV2,
  UPDATE_TAG: TagNode,
  SEND_INTERACTIVE_LIST_MESSAGE: SendInteractiveList,
  SEND_MESSAGE: SendMessageNode,
  ASSIGN_AGENT_V3: AssignAgentNode,
  ADD_TO_BROADCAST_LIST: BroadcastListNode,
  SLEEP_DELAY: SleepDelayNode,
  HTTP_API_CALL: HttpApiCallNode,
  SEND_TEMPLATE_MESSAGE: SendTemplateNode,
  SEND_BUTTON_MESSAGE: SendButtonMessageNode,
  UPDATE_ATTRIBUTE: UpdateAttributeNode,
};

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

// Trigger blockTypes for identification
const TRIGGER_TYPES = new Set([
  "ON_CHAT_START",
  "LEAD_FROM_CTWA_V2",
  "ON_ABANDONED_CART_WOOCOMMERCE",
  "ON_AGENT_ASSIGN",
  "ON_ATTRIBUTE_CHANGED",
  "ON_NEW_ROW_GOOGLE_SHEET",
]);

function BotFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [hasTriggerNode, setHasTriggerNode] = useState(false);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const showSnackbar = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "bezier",
            markerEnd: { type: MarkerType.ArrowClosed },
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

      const isTrigger = nodeData.type === "trigger";

      // Prevent adding a second trigger node
      if (isTrigger && hasTriggerNode) {
        showSnackbar("Only one trigger node is allowed per flow.", "warning");
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `${nodeData.data.blockType}-${Date.now()}`,
        type: nodeData.data.blockType,
        position,
        data: { ...nodeData.data },
      };

      if (isTrigger) {
        setHasTriggerNode(true);
      }

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, hasTriggerNode, showSnackbar]
  );

  // Handle node deletion — track trigger removal
  const handleNodesChange = useCallback(
    (changes) => {
      changes.forEach((change) => {
        if (change.type === "remove") {
          const removedNode = nodes.find((n) => n.id === change.id);
          if (removedNode && TRIGGER_TYPES.has(removedNode.type)) {
            setHasTriggerNode(false);
          }
        }
      });
      onNodesChange(changes);
    },
    [nodes, onNodesChange]
  );

  // Validate flow before save
  const validateFlow = useCallback(() => {
    const errors = [];

    // Must have at least one trigger
    const triggerCount = nodes.filter((n) => TRIGGER_TYPES.has(n.type)).length;
    if (triggerCount === 0) {
      errors.push("Flow must have at least one trigger node.");
    }
    if (triggerCount > 1) {
      errors.push("Flow can only have one trigger node.");
    }

    // Check for disconnected nodes (nodes with no edges)
    if (nodes.length > 1) {
      const connectedNodeIds = new Set();
      edges.forEach((e) => {
        connectedNodeIds.add(e.source);
        connectedNodeIds.add(e.target);
      });
      const disconnected = nodes.filter((n) => !connectedNodeIds.has(n.id));
      if (disconnected.length > 0) {
        errors.push(`${disconnected.length} node(s) are not connected.`);
      }
    }

    return errors;
  }, [nodes, edges]);

  // Save flow
  const handleSave = useCallback(() => {
    const errors = validateFlow();
    if (errors.length > 0) {
      showSnackbar(errors.join(" "), "warning");
    }

    // Build Spring Boot-ready payload
    const payload = {
      name: "Bot Flow",
      enabled: true,
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: { ...node.data },
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        sourceHandle: edge.sourceHandle || null,
        target: edge.target,
        targetHandle: edge.targetHandle || null,
      })),
    };

    // Remove non-serializable fields (icons, functions) from node data
    payload.nodes.forEach((node) => {
      delete node.data.icon;
      delete node.data.duplicateNode;
    });

    localStorage.setItem("botFlowData", JSON.stringify(payload));
    console.log("Bot flow saved:", payload);
    showSnackbar("Flow saved successfully!");
  }, [nodes, edges, validateFlow, showSnackbar]);

  // Restore flow from localStorage
  const handleRestore = useCallback(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("botFlowData"));
      if (saved && saved.nodes) {
        setNodes(saved.nodes);
        setEdges(saved.edges || []);
        const hasTrigger = saved.nodes.some((n) => TRIGGER_TYPES.has(n.type));
        setHasTriggerNode(hasTrigger);
        showSnackbar("Flow restored!", "info");
      }
    } catch (err) {
      console.error("Failed to restore flow:", err);
    }
  }, [setNodes, setEdges, showSnackbar]);

  return (
    <FlowContainer>
      <FlowSidebar />
      <CanvasContainer ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onDrop={onDrop}
          onInit={setReactFlowInstance}
          onDragOver={onDragOver}
          fitView
          deleteKeyCode={["Backspace", "Delete"]}
          proOptions={{ hideAttribution: true }}
        >
          <Controls />
          <Background />
        </ReactFlow>

        {/* Top-right action buttons */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 10,
            display: "flex",
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            size="small"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Save
          </Button>
          <Button variant="outlined" size="small" onClick={handleRestore}>
            Restore
          </Button>
        </Box>
      </CanvasContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </FlowContainer>
  );
}

export default BotFlow;
