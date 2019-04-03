declare module "reading-time" {
  interface Stats {
    text: string;
    words: number;
  }

  export default (text: string) => Stats;
}
