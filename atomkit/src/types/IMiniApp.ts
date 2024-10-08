export interface IMiniApp {
  initialize(): void;
  communicate(data: any): void; // Sends data or messages to the shell or other miniapps
}
