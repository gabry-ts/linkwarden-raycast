import { useState } from "react";
import { Collection, Link } from "../types/linkwarden";
import { getCollections, getLinksForCollection, searchLinks } from "../services/linkwardenAPI";

export function useLinkwarden() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function fetchCollections(parentId?: number): Promise<Collection[]> {
    setIsLoading(true);
    try {
      const collections = await getCollections();
      if (parentId !== undefined) {
        return collections.filter((c) => c.parentId === parentId);
      }
      return collections;
    } catch (e) {
      setError(e as Error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchLinks(collectionId: number): Promise<Link[]> {
    setIsLoading(true);
    try {
      return await getLinksForCollection(collectionId);
    } catch (e) {
      setError(e as Error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }

  async function performSearch(query: string): Promise<Link[]> {
    setIsLoading(true);
    try {
      return await searchLinks(query);
    } catch (e) {
      setError(e as Error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }

  return { performSearch, fetchCollections, fetchLinks, isLoading, error };
}
