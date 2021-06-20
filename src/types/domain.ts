import { PaginatedMeta } from './api';
import { HistoryEntry } from './entities';

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
