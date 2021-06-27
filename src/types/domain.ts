import type { PaginatedMeta } from './api.js';
import type { HistoryEntry } from './entities.js';

export type PaginatedHistoryEntries = PaginatedResponse<{
  historyEntries: HistoryEntry[];
}>;

type PaginatedResponse<Items> = Items & {
  pagination: Pagination<PaginatedResponse<Items>>;
};

type Pagination<Response> = PaginatedMeta & {
  getPrevPage(): Promise<Response>;
  getCurrentPage(): Promise<Response>;
  getNextPage(): Promise<Response>;
};
