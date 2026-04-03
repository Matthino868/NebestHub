const AZURE_OPENAI_ENDPOINT = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
const AZURE_OPENAI_API_KEY = import.meta.env.VITE_AZURE_OPENAI_API_KEY;
const AZURE_OPENAI_DEPLOYMENT = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT;
const AZURE_OPENAI_API_VERSION =
  import.meta.env.VITE_AZURE_OPENAI_API_VERSION ?? "2024-10-21";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface AzureChatResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

interface AzureRequestInfo {
  url: string;
  body: Record<string, unknown>;
  apiKey: string;
}

interface AzureEnvConfig {
  endpoint: string;
  apiKey: string;
  deployment: string;
}

const getConfig = (): AzureEnvConfig => {
  if (!AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_API_KEY || !AZURE_OPENAI_DEPLOYMENT) {
    throw new Error(
      "Azure OpenAI is not configured. Set VITE_AZURE_OPENAI_ENDPOINT, VITE_AZURE_OPENAI_API_KEY and VITE_AZURE_OPENAI_DEPLOYMENT in .env.",
    );
  }

  return {
    endpoint: AZURE_OPENAI_ENDPOINT,
    apiKey: AZURE_OPENAI_API_KEY,
    deployment: AZURE_OPENAI_DEPLOYMENT,
  };
};

const getEndpointUrl = () => {
  const config = getConfig();

  const endpoint = config.endpoint.replace(/\/$/, "");
  const hasOpenAiV1Path = endpoint.includes("/openai/v1");

  if (hasOpenAiV1Path) {
    return {
      url: `${endpoint}/chat/completions`,
      body: {
        model: config.deployment,
      },
      apiKey: config.apiKey,
    } as AzureRequestInfo;
  }

  return {
    url: `${endpoint}/openai/deployments/${config.deployment}/chat/completions?api-version=${AZURE_OPENAI_API_VERSION}`,
    body: {},
    apiKey: config.apiKey,
  } as AzureRequestInfo;
};

export async function createAzureChatCompletion(messages: ChatMessage[]) {
  const requestInfo = getEndpointUrl();

  const response = await fetch(requestInfo.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": requestInfo.apiKey,
    },
    body: JSON.stringify({
      ...requestInfo.body,
      messages,
      temperature: 0.2,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Azure OpenAI request failed (${response.status}): ${errorBody}`);
  }

  const payload = (await response.json()) as AzureChatResponse;
  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Azure OpenAI returned no message content.");
  }

  return content;
}
