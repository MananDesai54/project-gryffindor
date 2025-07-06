export enum HistoryMessageType {
  Ai = "ai",
  Human = "human",
}

export type MessageHistory = {
  type: HistoryMessageType;
  data: {
    content: string;
  };
};
