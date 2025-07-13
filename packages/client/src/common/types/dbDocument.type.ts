export interface IdDocument {
  _id: string;
}

export interface DbDocument extends IdDocument {
  createdAt: Date;
  modifiedAt: Date;
  creator: string;
}
