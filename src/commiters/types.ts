export interface Commiter {
  (param: { path: string; content: string }): Promise<void>;
}
