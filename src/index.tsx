import React, { useState, useEffect } from "react";
import { List, ActionPanel, Action, showToast, Toast } from "@raycast/api";
import { useLinkwarden } from "./hooks/useLinkwarden";
import { CollectionItem } from "./components/CollectionItem";
import { LinkItem } from "./components/LinkItem";
import { Collection, Link } from "./types/linkwarden";

export default function Command() {
  const { fetchCollections, fetchLinks, performSearch, isLoading, error } = useLinkwarden();
  const [rootCollections, setRootCollections] = useState<Collection[]>([]);
  const [searchResults, setSearchResults] = useState<Link[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    async function loadRootCollections() {
      try {
        const collections = await fetchCollections();
        const roots = collections.filter((c) => c.parentId === null);
        setRootCollections(roots);
      } catch (e) {
        showToast({
          style: Toast.Style.Failure,
          title: "Error loading collections",
          message: (e as Error).message,
        });
      }
    }
    loadRootCollections();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchText) {
        const results = await performSearch(searchText);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  if (error) {
    return (
      <List>
        <List.EmptyView
          title="Error"
          description={error.message}
          actions={
            <ActionPanel>
              <Action.Open title="Open Settings" target="raycast://extensions/yourextensionid/settings" />
            </ActionPanel>
          }
        />
      </List>
    );
  }

  return (
    <List isLoading={isLoading} onSearchTextChange={setSearchText} searchBarPlaceholder="Search links...">
      {searchText
        ? searchResults.map((link) => <LinkItem key={link.id} link={link} description={link.collection.name} />)
        : rootCollections.map((collection) => (
            <CollectionItem
              key={collection.id}
              collection={collection}
              fetchLinks={fetchLinks}
              fetchSubCollections={fetchCollections}
              level={0}
            />
          ))}
    </List>
  );
}
