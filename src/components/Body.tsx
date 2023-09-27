import { invoke } from "@tauri-apps/api";
import { For, createEffect, createSignal } from "solid-js";
import { DirEntry, FileType } from "../types/DirEntry";
import FolderItem from "./FolderItem";

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
    const [files, setFiles] = createSignal<DirEntry[]>([])

    createEffect(() => {
        invoke<DirEntry[]>("get_files")
            .then(files => {
                setFiles(files.sort(compareDirEntries))
            })
            .catch(console.error);
    });
    createEffect(() => {
        console.log(files());
    })

    return (
        <>
            <div class="w-full bg-base-100 overflow-y-scroll h-full">
                <table class="table table-xs w-full table-pin-rows">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* data.map((v, i) => {
                            return <FolderItem data={v} key={i} />
                        }) */}
                        <For each={files()} fallback={<></>}>
                            {item => <FolderItem data={item} />}
                        </For>
                    </tbody>
                </table>
            </div>
        </>
    );
}
