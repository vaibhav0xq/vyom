export type CapsuleVisibility = "private" | "link";

export type Capsule = {
  id: string;
  title: string;
  message: string;
  recipient?: string;
  unlockAt: number;
  visibility: CapsuleVisibility;
  createdAt: number;
};

export type CreateCapsuleInput = {
  title: string;
  message: string;
  recipient?: string;
  unlockAt: number;
  visibility: CapsuleVisibility;
};
