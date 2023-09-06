import axios from "axios";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { xstateTransform } from "../../utils/xstateTransform";
import Modal from "react-modal";
import { useMachine } from "@xstate/react";
import { machine } from "../../xstate";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "30vw",
  },
};

export default (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [flowName, setFlowName] = React.useState("no name");
  const [datas, setDatas] = React.useState([]);
  const [wa, setWA] = useState("");
  const [msg, setMsg] = useState("");
  const [type, setType] = React.useState("");
  const [dataToShow, setDataToShow] = useState("");
  const [state, send] = useMachine(machine);

  React.useEffect(() => {
    loadDatas();
  }, []);

  function openModal(type) {
    setType(type);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const onDragStart = (event, nodeType) => {
    console.log(JSON.stringify(nodeType));
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(nodeType)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  const saveDatas = async () => {
    setIsOpen(false);
    setIsLoading(true);
    const xstate = await xstateTransform(props);
    const save = await axios
      .post("https://shiny-gray-hippo.cyclic.cloud/flow", {
        uuid: uuidv4(),
        organization_uuid: uuidv4(),
        flow: JSON.stringify(xstate),
        nodes: JSON.stringify(props.nodes),
        edges: JSON.stringify(props.edges),
        name: flowName,
      })
      .then((res) => {
        if (res.status === 201) {
          setIsLoading(false);
          alert("flow created successfully");
          loadDatas();
        }
      });
  };

  const loadDatas = async () => {
    await axios
      .get("https://shiny-gray-hippo.cyclic.cloud/flow")
      .then((res) => {
        console.log("data", res);
        setDatas(res.data);
      });
  };

  const runXstate = async () => {
    console.log("RUN");
    setIsOpen(false);
    send({
      type: "SEND",
      body: {
        name: msg,
        phoneNumber: wa,
      },
    });

    // await axios
    //   .post(
    //     "https://5nugdpmqcyk7nedh2ofrzu72he0puqtk.lambda-url.eu-central-1.on.aws/ ",
    //     {
    //       name: msg,
    //       phoneNumber: wa,
    //     }
    //   )
    //   .then((res) => {
    //     console.log(res);
    //   });
  };

  return (
    <aside style={{ backgroundColor: "rgba(1,1,1,0.2)" }}>
      <div style={{ marginBottom: 10 }}>
        <h3>Flow list</h3>
        {datas &&
          datas.map((data, i) => (
            <div
              style={{
                borderWidth: 1,
                borderColor: "grey",
                padding: 2,
                display: "flex",
                flexDirection: "row",
                // justifyContent: "center",
                alignItems: "center",
              }}
              key={i}
            >
              {data.name}
              <div
                style={{
                  padding: 5,
                  backgroundColor: "grey",
                  borderRadius: 5,
                  marginLeft: 5,
                  color: "white",
                }}
                onClick={() => {
                  openModal("state");
                  setDataToShow(data.flow);
                }}
              >
                show
              </div>
              <div
                style={{
                  padding: 5,
                  backgroundColor: "grey",
                  borderRadius: 5,
                  marginLeft: 5,
                  color: "white",
                }}
                onClick={() =>
                  props.onLoad({ nodes: data.nodes, edges: data.edges })
                }
              >
                load
              </div>
              <div
                style={{
                  padding: 5,
                  backgroundColor: "grey",
                  borderRadius: 5,
                  marginLeft: 5,
                  color: "white",
                }}
                onClick={() => openModal("wa")}
              >
                run
              </div>
            </div>
          ))}
      </div>
      <div
        style={{
          border: "1px solid black",
          borderWidth: 1,
          borderColor: "grey",
          marginBottom: 5,
          // width: "100%",
        }}
      ></div>
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
            label: "Validation Number",
            name: "validationNumber",
          })
        }
        draggable
      >
        ValidationNumber
      </div>
      <div
        className="dndnode output"
        onDragStart={(event) =>
          onDragStart(event, {
            type: "output",
            label: "Stop State",
            name: "stop",
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
        onClick={() => openModal("inputText")}
      >
        {isLoading ? "Loading....." : "Save"}
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        <h2>Flow Name</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {type !== "state" && type !== "wa" && (
            <div>
              <input
                type="text"
                onChange={(e) => setFlowName(e.target.value)}
                style={{ padding: 8, width: "100%" }}
                placeholder="Name of flow"
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#0984e3",
                  width: "100%",
                  marginTop: 5,
                  padding: 8,
                  borderRadius: 5,
                  color: "white",
                }}
                onClick={() => saveDatas()}
              >
                Save
              </div>
            </div>
          )}

          {type === "state" && <div>{dataToShow}</div>}

          {type === "wa" && (
            <>
              <input
                type="text"
                onChange={(e) => setWA(e.target.value)}
                style={{ padding: 8, width: "100%", marginBottom: 5 }}
                placeholder="WhatsApp Number"
              />
              <input
                type="text"
                onChange={(e) => setMsg(e.target.value)}
                style={{ padding: 8, width: "100%" }}
                placeholder="Messages"
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#0984e3",
                  width: "100%",
                  marginTop: 5,
                  padding: 8,
                  borderRadius: 5,
                  color: "white",
                }}
                onClick={() => runXstate()}
              >
                Save
              </div>
            </>
          )}
        </div>
      </Modal>
    </aside>
  );
};
