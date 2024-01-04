const pm2 = require("pm2");
const fetch = require("node-fetch");
const WebSocket = require("ws");

restartChecks();
const app_name = "Gabagooler";
const wss = new WebSocket.Server({ port: 777 });

wss.on("connection", ws => {
  console.log(`Client connected!`);

  ws.on("close", () => {
    console.log(`Client disconnected!`);
  });

  ws.on("message", data => {
    if (data.toString().toLowerCase() === "botswitch") {
      botSwitch(() => ws.send("Bot switch successful!"));
    }
  });
});

const botSwitch = _callback => {
  pm2.connect(function (err) {
    if (err) {
      console.error(err);
      process.exit(2);
    }

    pm2.list(async (err, list) => {
      for (i = 0; i < list.length; i++) {
        const name = list?.[i].name;
        if (name === app_name) {
          console.log("Current status is " + list[i].pm2_env.status);
          if (list[i].pm2_env.status === "online") {
            pm2.stop(name, (err, proc) => {
              if (err) {
                console.error(err);
                process.exit(2);
              }
              console.log(proc);
            });
          } else {
            pm2.start(
              {
                name: app_name,
                script: "gabagool_afker.js",
                exec_mode: "fork",
                watch: false,
                autorestart: true,
              },
              (err, proc) => {
                if (err) {
                  console.error(err);
                  process.exit(2);
                }
                console.log(proc);
              }
            );
          }
        }
      }
    });
  });
  _callback();
};

function restartChecks() {
  console.log("Checking bot status...")
  pm2.connect(function (err) {
    if (err) {
      console.error(err);
      process.exit(2);
    }

    pm2.list(async (err, list) => {
      for (i = 0; i < list.length; i++) {
        const name = list?.[i].name;
        if (name === app_name) {
          console.log("Current status is " + list[i].pm2_env.status);
          const data = await fetch("https://api.kami-x.tk/bot");
          const json = await data.json();
          if (list[i].pm2_env.status === "online" && json?.status === 0) {
            console.log("Changing bot status to online...");
            fetch("https://api.kami-x.tk/bot_status", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status: 1 }),
            });
          } else if (
            list[i].pm2_env.status === "stopped" &&
            json?.status === 1
            ) {
            console.log("Changing bot status to offline...");
            fetch("https://api.kami-x.tk/bot_status", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status: 0 }),
            });
          }
        }
      }
      console.log("Bot status check complete!")
    });
  });
}