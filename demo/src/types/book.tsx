export interface Book {
  _id?: string;
  title: string;
  cover_url: string;
  category: string;
  author: string;
  audio?: any;
  audioSrc?: string; // Path to the audio file
  status?: string;
}
