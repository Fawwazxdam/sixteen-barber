export type Barber = {
  id: string;
  name: string;
  email: string;
  description?: string;
  image?: string;
  media?: Media[];
  createdAt: string;
};

export type Media = {
  id: string;
  type: "barber";
  referenceId: string;
  url: string;
  filename?: string;
  mimeType?: string;
  size?: number;
  createdAt: string;
};
