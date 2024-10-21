export interface LinkwardenSettings {
  host: string;
  token: string;
}

export interface Collection {
  id: number;
  name: string;
  description: string;
  color: string;
  parentId: number | null;
  isPublic: boolean;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
  parent: Collection | null;
  members: any[];
  _count: {
    links: number;
  };
}

export interface Link {
  id: number;
  name: string;
  type: string;
  description: string;
  collectionId: number;
  url: string;
  textContent: string;
  preview: string;
  image: string;
  pdf: string;
  readable: string;
  monolith: string;
  lastPreserved: Date;
  importDate: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: any[];
  collection: Collection;
  pinnedBy: any[];
}
