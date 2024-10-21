import { useState } from "react";
import { List, ActionPanel, Action, Icon } from "@raycast/api";
import { Collection, Link } from "../types/linkwarden";
import { LinkItem } from "./LinkItem";

interface CollectionItemProps {
  collection: Collection;
  fetchLinks: (collectionId: number) => Promise<Link[]>;
  fetchSubCollections: (parentId: number) => Promise<Collection[]>;
  level: number;
}

export function CollectionItem({ collection, fetchLinks, fetchSubCollections, level }: CollectionItemProps) {
  const [links, setLinks] = useState<Link[]>([]);
  const [subCollections, setSubCollections] = useState<Collection[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [, setIsLoading] = useState(false);

  async function handleExpand() {
    setIsExpanded(!isExpanded);
    if (!isExpanded && links.length === 0) {
      setIsLoading(true);
      const [fetchedLinks, fetchedSubCollections] = await Promise.all([
        fetchLinks(collection.id),
        fetchSubCollections(collection.id),
      ]);
      setLinks(fetchedLinks.sort((a, b) => a.name.localeCompare(b.name)));
      setSubCollections(fetchedSubCollections.sort((a, b) => a.name.localeCompare(b.name)));
      setIsLoading(false);
    }
  }

  const getIndent = (level: number) => {
    if (level === 0) return "";
    return "│".repeat(level - 1) + "├─ ";
  };

  const indent = getIndent(level);

  return (
    <>
      <List.Item
        title={`${indent}${collection.name}`}
        subtitle={`${collection._count.links} links`}
        // icon={isExpanded ? Icon.ChevronRight : Icon.ChevronDown}
        actions={
          <ActionPanel>
            <Action title={isExpanded ? "Collapse" : "Expand"} onAction={handleExpand} />
          </ActionPanel>
        }
      />
      {isExpanded && (
        <>
          {subCollections.map((subCollection) => (
            <CollectionItem
              key={subCollection.id}
              collection={subCollection}
              fetchLinks={fetchLinks}
              fetchSubCollections={fetchSubCollections}
              level={level + 1}
            />
          ))}
          {links.map((link) => (
            <LinkItem key={link.id} link={link} level={level + 1} description={link.description} />
          ))}
        </>
      )}
    </>
  );
}
