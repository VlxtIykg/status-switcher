const fetch = require("node-fetch");
const WebSocket = require("ws");
const formData = 19;
(async () => {
  const ws = new WebSocket("ws://websockets.kami-x.tk");
  ws.addEventListener("open", () => {
    console.log("connected");

    ws.send("Connection established.");
  });

  ws.addEventListener("message", event => {
    console.log(event.data);
  });
})();
