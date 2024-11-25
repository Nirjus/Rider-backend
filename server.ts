import App from "./app";
import { backendPort } from "./secret";

App.listen(backendPort, () => {
  console.log("Server is running on http://localhost:" + backendPort);
});
