export interface RegisterRequest {
    first_name: string;
    last_name: string;
    birth_date: string;
    doc_type: string;
    doc_number: string;
    email: string;
    phone: string;
    password: string;
    accepted_terms: boolean;
}
