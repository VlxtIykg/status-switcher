const fetch = require("node-fetch");
const formData = 19;
(async () => {
const response = await fetch("http://api.kami-x.tk/bot_status", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  //mode: "cors",
  body: JSON.stringify({
    id: 1,
    status: 7,
  }),
});

	const data = await response.json();
	console.log(data);

})();
