type TOpenAIRoles = "system" | "assistant" | "user"

type TOpenAIUsage = {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
}

export type TOpenAIGPTMessages = {
    role: TOpenAIRoles
    content: string
}

type TOpenAIGPTChoices = {
    index: number
    message: TOpenAIGPTMessages
    logprobs: string | null
    finish_reason: string
}

export type TOpenAIGPTRequest = {
    model: string
    messages: TOpenAIGPTMessages[]
    max_tokens: number
}

export type TOpenAIGPTResponse = {
    id: string
    object: string
    created: Date
    model: string
    choices: TOpenAIGPTChoices[]
    usage: TOpenAIUsage
    system_fingerprint: string
}
