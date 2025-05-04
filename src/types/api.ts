export type Questions = Question[]

export type Question = {
    id: number,
    question: string,
    description: string,
    answers: Answers,
    multiple_correct_answers: string,
    correct_answers: Answers,
    correct_answer: string|null,
    explanation: string,
    tip: string|null,
    tags: Tag[],
    category: string
    difficulty: string
}

type Answers = {
    [key: string]: string|null
}

type Tag = {
    name: string
}