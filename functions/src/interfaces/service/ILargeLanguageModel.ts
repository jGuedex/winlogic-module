export interface ILargeLanguageModel<T, U> {
    fetch(question: string, prompt: string): Promise<T | U>
}
