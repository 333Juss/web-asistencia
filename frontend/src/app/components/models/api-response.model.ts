export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    errors?: ValidationError[];
    timestamp?: Date;
}

export interface ValidationError {
    field: string;
    message: string;
    rejectedValue?: any;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    first: boolean;
    last: boolean;
}

export interface PageRequest {
    page: number;
    size: number;
    sort?: string[];
}

export interface FilterRequest extends PageRequest {
    search?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    [key: string]: any;
}