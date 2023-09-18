import { useCallback } from "react";
import { Handle, Position } from "reactflow";

const handleStyle = { left: 10 };

function ConditionalOptions({ data, isConnectable }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div
      style={{
        border: "1px solid black",
        padding: 10,
        borderRadius: 5,
        // backgroundColor: "#2ecc71",
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
        <span style={{ fontSize: 10, paddingRight: 10, paddingLeft: 10 }}>
          No
        </span>
        {/* <label htmlFor="text" style={{ marginBottom: 5, fontSize: 12 }}>
          Conditional Message
        </label>
        <textarea
          onChange={onChange}
          style={{ fontSize: 8 }}
          rows={5}
          cols={30}
        /> */}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
      />
      {/* <Handle
        type="source"
        position={Position.Right}
        id="c"
        isConnectable={isConnectable}
      /> */}
    </div>
  );
}

export default ConditionalOptions;