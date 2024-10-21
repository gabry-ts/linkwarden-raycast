import { LocalStorage } from "@raycast/api";
import fetch from "node-fetch";
import { LinkwardenSettings, Collection, Link } from "../types/linkwarden";

async function getSettings(): Promise<LinkwardenSettings> {
  const host = await LocalStorage.getItem<string>("linkwarden_host");
  const token = await LocalStorage.getItem<string>("linkwarden_token");

  if (!host || !token) {
    throw new Error("Linkwarden settings are not configured. Please use the 'Manage Settings' command to set them up.");
  }

  return { host, token };
}

async function fetchFromLinkwarden(endpoint: string) {
  const settings = await getSettings();
  const response = await fetch(`${settings.host}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${settings.token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function getCollections(): Promise<Collection[]> {
  const data = await fetchFromLinkwarden("/api/v1/collections");
  return data.response;
}

export async function getLinksForCollection(collectionId: number): Promise<Link[]> {
  const data = await fetchFromLinkwarden(`/api/v1/links?collectionId=${collectionId}`);
  return data.response || [];
}

export async function searchLinks(query: string): Promise<Link[]> {
  const settings = await getSettings();
  const url = new URL(`${settings.host}/api/v1/links`);
  url.searchParams.append("cursor", "0");
  url.searchParams.append("sort", "0");
  url.searchParams.append("searchQueryString", query);
  url.searchParams.append("searchByName", "true");
  url.searchParams.append("searchByUrl", "true");
  url.searchParams.append("searchByDescription", "true");
  url.searchParams.append("searchByTextContent", "false");
  url.searchParams.append("searchByTags", "true");

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${settings.token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.response;
}
