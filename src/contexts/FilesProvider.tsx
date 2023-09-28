import {
    Accessor,
    Setter,
    createContext,
    createEffect,
    createSignal,
    useContext,
} from "solid-js";
import { JSX } from "solid-js";
import { DirEntry, FileSize, FileType } from "../types/DirEntry";
import { invoke } from "@tauri-apps/api";

function compareDirEntries(a: DirEntry, b: DirEntry): number {
    // First, compare by type
    const typeComparison = compareByType(a.type, b.type);
    if (typeComparison !== 0) {
        return typeComparison;
    }

    // If the types are the same (both directories, both files, or both symlinks),
    // then compare by name.
    return a.name.localeCompare(b.name);
}

function compareByType(typeA: string, typeB: string): number {
    // Assign numerical values to types to determine their sorting order
    const typeOrder: { [key: string]: number } = {
        [FileType.Directory]: 0,
        [FileType.File]: 1,
        [FileType.Symlink]: 2,
    };

    const orderA = typeOrder[typeA];
    const orderB = typeOrder[typeB];

    return orderA - orderB;
}

export type FilesList = [Accessor<DirEntry[]>, Setter<null>];

export const FilesContext = createContext<FilesList>();

export function FilesProvider(props: { children: JSX.Element }) {
    const [state, setState] = createSignal<DirEntry[]>([]);
    const [reloadTrigger, reload] = createSignal<null>(null);
    createEffect(() => {
        reloadTrigger();
        invoke<DirEntry[]>("get_files")
            .then((files) => {
                setState(
                    files.sort(compareDirEntries).map((file) => {
                        if (file.type === FileType.File) {
                            file.size = new FileSize(
                                (file as any).size as number,
                            );
                        }

                        if (
                            file.type === FileType.Directory ||
                            file.type === FileType.File
                        ) {
                            file.createdAt = new Date(file.createdAt);
                            file.modifiedAt = new Date(file.modifiedAt);
                            file.lastAccessed = new Date(file.lastAccessed);

                            return file;
                        } else {
                            return file;
                        }
                    }),
                );
            })
            .catch(console.error);
    });
    const files: FilesList = [state, reload];
    return (
        <FilesContext.Provider value={files}>
            {props.children}
        </FilesContext.Provider>
    );
}

export function useFilesList() {
    return useContext(FilesContext);
}
