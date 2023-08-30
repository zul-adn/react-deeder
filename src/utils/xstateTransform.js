import { getState } from "./stateLibrary";

let states = {
  success: {
    invoke: {
      src: "SEND_DATA_TO_CRM",
      onDone: {
        target: "stop",
      },
    },
  },
  failure: {
    invoke: {
      src: "LOG_ERROR",
      onDone: {
        target: "stop",
      },
    },
  },
  stop: {
    type: "final",
  },
};

export const xstateTransform = ({ nodes, edges }) => {
  console.log(edges);
  console.log(nodes);
  if (edges) {
    edges?.forEach((v) => {
      const source = nodes.find((nd) => nd.id === v.source);
      const target = nodes.find((nd) => nd.id === v.target);
      const state = getState({
        target: target?.data.name,
        targetSuccess: "a",
        targetFail: "a",
        stateName: source?.data.name,
      });
      states[source?.data.name] = state;
    });
  }

  return states;
};
