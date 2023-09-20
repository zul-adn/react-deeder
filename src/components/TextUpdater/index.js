import { useCallback } from "react";
import { Handle, Position } from "reactflow";

const handleStyle = { left: 10 };

function TextUpdaterNode({ data, isConnectable }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
    data.msg = evt.target.value;
    console.log(data);
  }, []);

  return (
    <div
      style={{
        border: "1px solid black",
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#2ecc71",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <label htmlFor="text" style={{ marginBottom: 5, fontSize: 12 }}>
          Message
        </label>
        <textarea
          onChange={onChange}
          style={{ fontSize: 8 }}
          rows={5}
          cols={30}
        />
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default TextUpdaterNode;
