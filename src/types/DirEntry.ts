export class FileSize {
    constructor(public readonly bytes: number) {}

    get kib(): number {
        return this.bytes / 1024;
    }
    get mib(): number {
        return this.kib / 1024;
    }
    get gib(): number {
        return this.mib / 1024;
    }
    get tib(): number {
        return this.gib / 1024;
    }
}

export enum FileType {
    File = "File",
    Directory = "Directory",
    Symlink = "Symlink",
}

export interface File {
    type: FileType.File;
    name: string;
    path: string;
    size: FileSize;
    createdAt: Date;
    modifiedAt: Date;
    lastAccessed: Date;
}
export interface Directory {
    type: FileType.Directory;
    name: string;
    path: string;
    createdAt: Date;
    modifiedAt: Date;
    lastAccessed: Date;
}
export interface Symlink {
    type: FileType.Symlink;
    name: string;
    path: string;
}
export type DirEntry = File | Directory | Symlink;
