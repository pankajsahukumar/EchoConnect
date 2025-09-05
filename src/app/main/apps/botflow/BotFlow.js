import { useCallback } from "react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';

import 'reactflow/dist/style.css';
import { TextUpdaterNode } from "./components/nodes/TextUpdateNode";

const initialNodes = [
  {
    id: 'n1',
    data: { label: 'Node 1' },
    position: { x: 0, y: 0 },
    type: 'input',
  },
  {
    id: 'n2',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
  },
  {
    id: 'n3',
    data: { label: 'Node 2' },
    position: { x: 200, y: 200 },
    type: 'textUpdater',
  },
];
const initialEdges = [];
const nodeTypes = {
  textUpdater: TextUpdaterNode,
};
/**
 * =============================================================
 *  MESSAGE RENDERING + HOVER ACTIONS + QUOTED REPLY SUPPORT
 *  Supports WhatsApp Business API types: text, image, audio, video,
 *  document, location, contacts, interactive (button/list), template
 * =============================================================
 */


export default function BotFlow(props) {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
 
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
    const onConnect = useCallback(
      (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
      [],
    );
    console.log("getting rerendered");
  return (
    <>
     <ReactFlow nodes={nodes} edges={edges}  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange} onConnect={onConnect}   nodeTypes={nodeTypes} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </>
  );
}
