"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createCapsule as createStoredCapsule,
  deleteCapsule as deleteStoredCapsule,
  getCapsuleById,
  getCapsulesForVault,
} from "@/lib/capsules";
import type { CapsuleSummary, CreateCapsuleInput } from "@/types/capsule";

export function useCapsules(ownerWallet?: string | null) {
  const [capsules, setCapsules] = useState<CapsuleSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    async function loadCapsules() {
      setIsLoading(true);
      try {
        setCapsules(await getCapsulesForVault(ownerWallet));
      } catch {
        setCapsules([]);
      }
      setIsLoading(false);
    }

    void loadCapsules();
  }, [ownerWallet]);

  useEffect(() => {
    const handle = window.setTimeout(refresh, 0);
    return () => window.clearTimeout(handle);
  }, [refresh]);

  const createCapsule = useCallback(
    async (data: CreateCapsuleInput) => {
      const capsule = await createStoredCapsule(data);
      refresh();
      return capsule;
    },
    [refresh],
  );

  const deleteCapsule = useCallback(
    async (id: string) => {
      await deleteStoredCapsule(id);
      refresh();
    },
    [refresh],
  );

  return {
    capsules,
    createCapsule,
    deleteCapsule,
    getCapsuleById,
    isLoading,
    refresh,
  };
}
