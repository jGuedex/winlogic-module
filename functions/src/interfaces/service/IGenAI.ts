import {TOpenAIGPTResponse} from "../../type/TOpenAIGPT";
import {ILargeLanguageModel} from "./ILargeLanguageModel";

export type IOpenAIGPT = ILargeLanguageModel<TOpenAIGPTResponse, Error>;

