export interface ReaderPage {
  page: number;
  content: string;
}

export interface ReaderContent {
  book_id: number;
  title: string;
  author: string;
  format: string;
  pages: ReaderPage[];
}

export interface ReaderContentResponse {
  data: ReaderContent;
}
