export interface CreateSyllabus {
    board: string;
    class: number;
    subject: string;
    academic_year: number;
    syllabus_description: string;
    topics: Topic[];
    createdOn: string
}

export interface Topic {
    title: string;
    description: string;
    subtopics: SubTopic[];
}

export interface SubTopic {
    title: string;
    description: string;
}