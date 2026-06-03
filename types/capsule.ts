export type CapsuleVisibility = "private" | "link";
export type CapsuleAccessType = "link" | "wallet";

export type Capsule = {
  id: string;
  title: string;
  message: string;
  recipient?: string;
  unlockAt: number;
  accessType: CapsuleAccessType;
  visibility?: CapsuleVisibility;
  createdAt: number;
};

export type CreateCapsuleInput = {
  title: string;
  message: string;
  recipient?: string;
  unlockAt: number;
  accessType: CapsuleAccessType;
  visibility?: CapsuleVisibility;
};
