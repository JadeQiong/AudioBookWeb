// custom.d.ts
declare module '*.mp3' {
  const src: string;
  export default src;
}

declare module '*wav' {
  const src: string;
  export default src;
}

// Define the book type
interface Book {
  title: string;
  image: string;
  category: string;
}
