export type CapsuleVisibility = "private" | "link";
export type CapsuleAccessType = "link" | "wallet";

export type Capsule = {
  id: string;
  title: string;
  message: string;
  recipient?: string;
  ownerWallet?: string;
  unlockAt: number;
  accessType: CapsuleAccessType;
  visibility?: CapsuleVisibility;
  createdAt: number;
};

export type CapsuleSummary = Omit<Capsule, "message">;

export type CreateCapsuleInput = {
  title: string;
  message: string;
  recipient?: string;
  ownerWallet?: string;
  unlockAt: number;
  accessType: CapsuleAccessType;
  visibility?: CapsuleVisibility;
};
