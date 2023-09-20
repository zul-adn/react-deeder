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
import ConditionalNode from "./components/Nodes/Conditional";
import ConditionlMessage from "./components/Nodes/ConditionalMessage";
import ConditionlOptions from "./components/Nodes/conditionalOptions";
import ConditionlOptionsNo from "./components/Nodes/conditionalOptionsNo";

import "./App.css";

const nodeTypes = {
  textUpdater: TextUpdaterNode,
  conditionalNode: ConditionalNode,
  conditionalMsg: ConditionlMessage,
  conditionalOptions: ConditionlOptions,
  conditionalOptionsNo: ConditionlOptionsNo,
};

const initialNodes = [
  // {
  //   id: "1",
  //   type: "input",
  //   data: { label: "input node" },
  //   position: { x: 250, y: 5 },
  // },
];

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

      if (nodeData.type === "conditionalMsg") {
        conditionalFlow();
        return;
      }

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const conditionalFlow = () => {
    const newNode = [
      {
        id: "main-condition",
        type: "conditionalMsg",
        data: { label: "Input Node" },
        position: { x: 0, y: 0 },
      },
      {
        id: "cond-yes",
        type: "conditionalOptions",
        data: { label: "yes" },
        position: { x: -100, y: 0 },
      },
      {
        id: "cond-no",
        type: "conditionalOptionsNo",
        data: { label: "no" },
        position: { x: 200, y: 0 },
      },
      {
        id: "cond-opt-yes",
        type: "textUpdater",
        data: { label: "Input Node" },
        position: { x: -200, y: 100 },
      },
      {
        id: "cond-opt-no",
        type: "textUpdater",
        data: { label: "Input Node" },
        position: { x: 100, y: 100 },
      },
    ];

    const newEdges = [
      {
        id: "1",
        source: "main-condition",
        target: "cond-yes",
        animated: true,
        type: "step",
      },
      {
        id: "2",
        source: "cond-yes",
        target: "cond-opt-yes",
        animated: true,
        type: "step",
      },
      {
        id: "2",
        source: "main-condition",
        target: "cond-no",
        animated: true,
        type: "step",
        sourceHandle: "c",
      },
      {
        id: "3",
        source: "cond-no",
        target: "cond-opt-no",
        animated: true,
        type: "step",
        sourceHandle: "c",
      },
    ];
    setNodes((nds) => nds.concat(newNode));
    setEdges((edg) => edg.concat(newEdges));
    //setNodes((nds) => [...nds, nodes]);
  };

  const dbClickNodes = (e, object) => {
    // console.log(object);
    console.log(e);
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
            nodeTypes={nodeTypes}
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
