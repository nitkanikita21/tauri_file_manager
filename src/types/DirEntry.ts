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

    toString(): string {
        switch (true) {
            case this.tib > 1:
                return `${Math.round(this.tib * 100) / 100} TiB`;
            case this.gib > 1:
                return `${Math.round(this.gib * 100) / 100} GiB`;
            case this.mib > 1:
                return `${Math.round(this.mib * 100) / 100} MiB`;
            case this.kib > 1:
                return `${Math.round(this.kib * 100) / 100} KiB`;
            default:
                return `${this.bytes} B`;
        }
    }

    sub(fileSize: FileSize): FileSize {
        return new FileSize(this.bytes - fileSize.bytes);
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
