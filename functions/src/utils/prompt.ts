import {OPEN_AI_GPT_PROMPT_GENERATE_MODULE_TEMPLATE} from "../conf/GptConstants";

export function preparaPrompt(paramReplace: Array<{ search_for: string, replace_to: string }>, prompt: string = OPEN_AI_GPT_PROMPT_GENERATE_MODULE_TEMPLATE) {
  let newPrompt = prompt;
  paramReplace.forEach((x) => {
    newPrompt = newPrompt.replace(x.search_for, x.replace_to);
  });

  return newPrompt.replace("\"", "");
}
