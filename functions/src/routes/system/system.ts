import {Router as expressRouter} from "express";
import {SystemService} from "../../service/systemService";

const route = expressRouter();

route.get("/", (req, res) => {
  res.send({status: "ok"});
});

route.get("/system/costs", async (req, res) => {
  const systemService = new SystemService();
  const costs = await systemService.getTotalCosts();

  res.send(costs);
});

export default route;
