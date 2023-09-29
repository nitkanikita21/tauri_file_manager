import { invoke } from "@tauri-apps/api";
import { For, createEffect, createSignal } from "solid-js";
import { DirEntry, FileSize, FileType } from "../types/DirEntry";
import FolderItem from "./FolderItem";
import filesStore from "../stores/filesStore";

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

export default function () {
    const [files, setFiles] = createSignal<DirEntry[]>([]);

    createEffect(() => {
        filesStore.reload;
        invoke<DirEntry[]>("get_files", { path: filesStore.path })
            .then((files) => {
                setFiles(
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

    return (
        <>
            <div class="h-full w-full overflow-x-auto overflow-y-scroll bg-base-100">
                <table class="table table-pin-rows table-xs w-full">
                    <thead>
                        <tr>
                            <th>Name</th>
                            {/* <th>Type</th> */}
                            <th>Created At</th>
                            <th>Modified At</th>
                            <th>Size</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* data.map((v, i) => {
                            return <FolderItem data={v} key={i} />
                        }) */}
                        <For each={files()} fallback={<></>}>
                            {(item) => <FolderItem data={item} />}
                        </For>
                    </tbody>
                </table>
            </div>
        </>
    );
}
