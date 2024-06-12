import axios, {AxiosResponse} from "axios";
import {IOpenAIGPT} from "../interfaces/service/IGenAI";
import {TOpenAIGPTRequest, TOpenAIGPTResponse} from "../type/TOpenAIGPT";
import {OPEN_AI_GPT_EXAMPLES, OPEN_AI_GPT_PROMPT_GENERATE_MODULE_TEMPLATE, OPEN_AI_GPT_URL, OPEN_AI_KEY, OPEN_AI_MODEL, OPEN_AI_GPT_COSTS} from "../conf/GptConstants";
import firebaseAdmin from "../conf/FirebaseAdmin";

export class OpenAIGPTservice implements IOpenAIGPT {
  async fetch(question: string, prompt: string = OPEN_AI_GPT_PROMPT_GENERATE_MODULE_TEMPLATE): Promise<TOpenAIGPTResponse | Error> {
    const gptBody: TOpenAIGPTRequest = {
      model: OPEN_AI_MODEL,
      messages: [
        {role: "system", content: prompt},
        ...OPEN_AI_GPT_EXAMPLES,
        {role: "user", content: question},
      ],
      max_tokens: 4096,
    };

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPEN_AI_KEY}`,
    };

    try {
      const fetchGPT: AxiosResponse = await axios.post(OPEN_AI_GPT_URL, gptBody, {headers: {...headers}});

      // Caso a propriedade esteja presente no objeto, então é suficiente para sabermos que a requisição funcionou
      if (!("choices" in fetchGPT.data)) throw new Error("Houve um erro desconhecido. #1000");
      const gpt = fetchGPT.data;

      // Guardando no Firestore os tokens gerados
      const inputCost = (gpt.usage.prompt_tokens * OPEN_AI_GPT_COSTS[OPEN_AI_MODEL].input) / 1000; // INPUT * CUSTO DO MODELO A CADA 1000
      const outputCost = (gpt.usage.completion_tokens * OPEN_AI_GPT_COSTS[OPEN_AI_MODEL].output) / 1000; // OUTPUT * CUSTO DO MODELO A CADA 1000

      firebaseAdmin.firestore().collection("token").add({
        ...gpt.usage,
        gpt_response: gpt.choices[0].message.content,
        model: gpt.model,
        id: gpt.id,
        input_cost: inputCost,
        output_cost: outputCost,
        total_cost: inputCost + outputCost,
      });

      return fetchGPT.data as TOpenAIGPTResponse;
    } catch (err) {
      return Error(err instanceof Error ? err.message : "Erro desconhecido");
    }
  }
}
