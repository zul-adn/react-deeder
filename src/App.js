import React, { useState, useRef, useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
} from "reactflow";
import "reactflow/dist/style.css";

import Sidebar from "./components/Sidebar";
import TextUpdaterNode from "./components/TextUpdater";

import "./App.css";

const initialNodes = [
  // {
  //   id: "1",
  //   type: "input",
  //   data: { label: "input node" },
  //   position: { x: 250, y: 5 },
  // },
];

const nodeTypes = { textUpdater: TextUpdaterNode };

let id = 0;
const getId = () => `${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const props = event.dataTransfer.getData("application/reactflow");
      const nodeData = JSON.parse(props);

      // console.log("e", event.dataTransfer).getData();
      console.log("type", JSON.parse(props));
      console.log(reactFlowBounds);

      // check if the dropped element is valid
      if (typeof nodeData.type === "undefined" || !nodeData.type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type: nodeData.type,
        position,
        data: { label: `${nodeData.label}`, name: nodeData.name },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const dbClickNodes = (e, object) => {
    console.log(object);
  };

  const onLoad = useCallback(
    (e) => {
      const restoreFlow = async () => {
        setNodes(JSON.parse(e.nodes) || []);
        setEdges(JSON.parse(e.edges) || []);
      };
      restoreFlow();
    },
    [setNodes, setEdges]
  );

  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            onNodeDoubleClick={dbClickNodes}
          >
            <Controls />
          </ReactFlow>
        </div>

        <Sidebar nodes={nodes} edges={edges} onLoad={(v) => onLoad(v)} />
      </ReactFlowProvider>
    </div>
  );
};

export default DnDFlow;
