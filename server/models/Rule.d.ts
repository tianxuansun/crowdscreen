declare module 'Rule' {
  export interface Rule {
    type: 'keyword' | 'regex' | 'threshold';
    config: any;
    name?: string;
    enabled: boolean;
    score: number;
  }
  export default Rule;
}