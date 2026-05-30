export interface Employee {
    id: number;
    user_id?: number;
    full_name?: string;
    company_id: number;
    department_id?: number | null;
    email: string;
    mobile?: string;
    address?: string;
    title?: string;
    hire_date?: string | null;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
    days_employed?: number;
}
