import { createOpenAI } from "@ai-sdk/openai";
import { customProvider, gateway } from "ai";
import { isTestEnvironment } from "../constants";
import { titleModel } from "./models";

const litellm = createOpenAI({
  baseURL: process.env.XCALIBER_LITELLM_URL,
  apiKey: process.env.XCALIBER_LITELLM_API_KEY,
});

export const myProvider = isTestEnvironment
  ? (() => {
      const { chatModel, titleModel } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "title-model": titleModel,
        },
      });
    })()
  : null;

export function getLanguageModel(modelId: string) {
  if (isTestEnvironment && myProvider) {
    return myProvider.languageModel(modelId);
  }

  return gateway.languageModel(modelId);
}

export function getTitleModel() {
  if (isTestEnvironment && myProvider) {
    return myProvider.languageModel("title-model");
  }
  return litellm.chat(titleModel.id);
}
