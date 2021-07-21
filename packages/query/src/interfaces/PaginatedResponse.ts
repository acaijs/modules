// Interfaces
import ModelContent from "./ModelContent";

export default interface PaginatedResponse<ModelConfig = Record<string, ModelContent>> {
	data: ModelConfig[];

	page: number;
	perPage: number;

	totalPages: number;
	totalItems: number;
}