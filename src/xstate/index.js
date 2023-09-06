import { createMachine } from "xstate";

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBU4BcDqBBAdAYwEMAbIjAgMSIHsB3AYgGUBRAOQBEBtABgF1FQADlVgBLNCKoA7fiAAeiAIwB2AGw4AzEoAsATiUBWLSoUAmHepVKANCACeirupw6XrlSfXqt+heoC+fjaosJi4AG7EIhAE4lIsAK4AtgBGYABOdBBSYDgikmFUANY5waE4EURRMRKSCSnpCHkFhLGS3DztMkKirTLyCPoAHGqDJoO+g9pcWtMqNvYIHlo4g57q+ioq6oM++voBQejY5ZHRrXWpGelpVGk4AkQxAGa3iTilxxVV50mXjflUFo1dqdJAgbpiGp9RBDEZjCZTGZGeaIHQKDRrLwqHQmBTTLRKA4gD64WBgSQQDAACxisAIAgEmWyuQBxXeR1J5MpNLQdIZ-2a1SkIN4XWEkKk0IQeJUy0cvi4XGUSm06hRi0sOE2m0m43UXD0OiJJJwZIp1Np9MZ11u90eaBeaTeJrN3Mt-KagKFbV4oME4t6YP6Mrl6gVSpVqvVJhMXC12tGKg2mh2xo5pvieDwcFgTMkOU9bJdmezsFgAq9rRFfDBEMDoGD+kVOH0SlGTf0MfUOiT0c12pUuoVhrTIWOTwIIiI8TSYDzBdZJXTE6nM7AFaBwt9otrAahQcUTbjrfbXE7Hh7+nVMoxmMmBJVKgCgRAkioEDgMhJYp6+4biAAWjmOxAP0ZxXHMHRFRmWNBiNF8TUIEgyEoWgfwlaQDwQLQTGvaYcF0CD3E8bxTFHMovjOGoLnSdD6zkRAxjjLg218FQzw8QZBmRECEHGHBFUEvYlGUbjDHI45XQtXkrTov8GL4pQ43Y8xhlUfUcKvXjcTjTFNBMJSjBwiTSRLHM5MlLDTC8AjuO8OCDK4JMFGjLQnAUbUcW4rxtg8EycBXadZwszD-2lEwfBWLhcUGFjhlxfQ1V4-jVjWOCzwUZQe38kIqAEEKpWUNycCU9Qxm0TsvD0a9MoIiDYzcntYsGZ8-CAA */
    id: "TestWA",
    initial: "callWaFlow",
    states: {
      callWaFlow: {
        on: {
          SEND: {
            target: "validationNumber",
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
      sendWhatsapp: {
        invoke: {
          src: "SEND_WA",
          onDone: {
            target: "success",
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
    },
    context: { invalidPhoneNumber: true },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },

  {
    actions: {},
    services: {
      VALIDATE_PHONE_NUMBER: (context, event) => {
        if (event.type) {
          context.body = event.body;
        }
        console.log(context.body.phoneNumber);
        if (context.body.phoneNumber === "1234567890") {
          context.invalidPhoneNumber = false;
        }
        console.log("NEXT TO : SEND WHATSAPP");
        return Promise.resolve("Success");
      },
      SEND_WA: (context, event) => {
        if (context.invalidPhoneNumber === true) {
          return Promise.reject("Error");
        }
        return Promise.resolve("Success");
      },
      LOG_ERROR: (context, event) => {
        return Promise.resolve("Success");
      },
      SEND_DATA_TO_CRM: (context, event) => {
        return Promise.resolve("Success");
      },
    },
    guards: {},
    delays: {},
  }
);

// const services = interpret(machine).start();
// services.onTransition((states) => console.log(states.value));

// services.send({
//   type: "SEND",
//   body: {
//     name: "Zul",
//     phoneNumber: "123456789",
//   },
// });
