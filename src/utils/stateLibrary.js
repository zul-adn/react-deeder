export const getState = ({ target, targetSuccess, targetFail, stateName }) => {
  let obj = {
    initialState: {
      on: {
        SEND: {
          target: target,
        },
      },
    },
    validationNumber: {
      invoke: {
        src: "VALIDATE_PHONE_NUMBER",
        onDone: {
          target: "sendWhatsapp",
        },
        onError: {
          target: "failure",
        },
      },
    },
    sendWhatsApp: {
      invoke: {
        src: "SEND_WA",
        onDone: {
          target: "succes",
        },
        onError: {
          target: "failure",
        },
      },
    },
    success: {
      invoke: {
        src: "SEND_DATA_TO_CRM",
        onDone: {
          target: target,
        },
      },
    },
    failure: {
      invoke: {
        src: "LOG_ERROR",
        onDone: {
          target: target,
        },
      },
    },
    stop: {
      type: "final",
    },
  };

  console.log("stateName", stateName);
  console.log(obj[stateName]);
  return obj[stateName];
};
