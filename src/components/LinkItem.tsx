import { List, ActionPanel, Action, Image, Icon } from "@raycast/api";
import { Link } from "../types/linkwarden";

interface LinkItemProps {
  link: Link;
  level?: number;
  description: string;
}

export function LinkItem({ link, level, description }: LinkItemProps) {
  const getIndent = (level: number) => {
    if (level === 0) return "";
    return "│".repeat(level - 1) + "└─";
  };

  const indent = level ? getIndent(level) : "";

  return (
    <List.Item
      title={`${indent}${link.name}`}
      // icon={Icon.Link}
      subtitle={description}
      accessories={[{ text: new URL(link.url).hostname }]}
      actions={
        <ActionPanel>
          <Action.OpenInBrowser url={link.url} />
          <Action.CopyToClipboard content={link.url} title="Copy URL" />
        </ActionPanel>
      }
    />
  );
}
