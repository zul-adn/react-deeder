import axios from "axios";
import React from "react";
import { v4 as uuidv4 } from "uuid";

export default (props) => {
  const onDragStart = (event, nodeType) => {
    console.log(JSON.stringify(nodeType));
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(nodeType)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  const saveDatas = async () => {
    console.log(props);
    const save = await axios
      .post("https://shiny-gray-hippo.cyclic.cloud/flow", {
        uuid: uuidv4(),
        organization_uuid: uuidv4(),
        flow: JSON.stringify(props.content),
      })
      .then((res) => {
        if (res.status === 201) {
          alert("flow created successfully");
        }
        console.log(res);
      });
  };

  return (
    <aside>
      <div className="description">
        You can drag these nodes to the pane on the right.
      </div>
      <div
        className="dndnode input"
        onDragStart={(event) =>
          onDragStart(event, {
            type: "input",
            label: "Initial State",
            name: "initialState",
          })
        }
        draggable
      >
        Initial state
      </div>
      <div
        className="dndnode input"
        onDragStart={(event) =>
          onDragStart(event, {
            type: "default",
            label: "Send Whatsapp",
            name: "sendWhatsApp",
          })
        }
        draggable
      >
        Send WhatsApp
      </div>
      <div
        className="dndnode"
        onDragStart={(event) =>
          onDragStart(event, {
            type: "selectorNode",
            label: "Conditional Node",
            name: "conditionalState",
          })
        }
        draggable
      >
        Conditional State
      </div>
      <div
        className="dndnode output"
        onDragStart={(event) =>
          onDragStart(event, {
            type: "output",
            label: "Stop State",
            name: "final",
          })
        }
        draggable
      >
        Stop
      </div>
      <button
        style={{
          width: "100%",
          marginTop: 20,
          paddingTop: 10,
          paddingBottom: 10,
        }}
        onClick={() => saveDatas()}
      >
        Save
      </button>
    </aside>
  );
};
