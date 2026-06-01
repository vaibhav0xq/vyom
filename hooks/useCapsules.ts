"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createCapsule as createStoredCapsule,
  deleteCapsule as deleteStoredCapsule,
  getCapsuleById,
  getCapsules,
} from "@/lib/capsules";
import type { Capsule, CreateCapsuleInput } from "@/types/capsule";

export function useCapsules() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    async function loadCapsules() {
      try {
        setCapsules(await getCapsules());
      } catch {
        setCapsules([]);
      }
      setIsLoading(false);
    }

    void loadCapsules();
  }, []);

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
