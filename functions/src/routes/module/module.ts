import {Router as expressRouter} from "express";
import {TAPIResponse} from "../../type/TAPI";
import {TTalkToLLM} from "../../type/TLargeLanguageModel";
import {ModuleServices} from "../../service/moduleServices";
import {ExternalAPI} from "../../service/externalAPI";

const route = expressRouter();

route.post("/module/question", async (req, res) => {
  try {
    const gptService = new ModuleServices();

    if (req.method !== "POST") throw new Error("Envie o método POST");

    // Tentando conectar de início à API para prevenir de gerar tokens a toa.
    const externalAPI = new ExternalAPI();
    const tryAPI = await externalAPI.get("dynamic-modules/module/forMenu");
    if (tryAPI instanceof Error) throw new Error(tryAPI.message);

    const body: TTalkToLLM = req.body;
    if (!("question" in body)) throw new Error("Paylod em formato incorreto.");

    const resultFromGPT = await gptService.processUserQuestion(body.question);

    if (resultFromGPT instanceof Error) throw new Error(resultFromGPT.message);

    res.send({
      code: 1,
      message: "Módulo criado com sucesso",
      moduleId: resultFromGPT.module?.idModule,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : err;
    return res.status(400).send(
      {
        code: 0,
        message,
      } as unknown as TAPIResponse
    );
  }
});

export default route;
