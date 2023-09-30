import { invoke } from "@tauri-apps/api";
import { For, createEffect, createSignal } from "solid-js";
import { DirEntry, FileSize, FileType } from "../types/DirEntry";
import FolderItem from "./FolderItem";
import filesStore from "../stores/filesStore";

export default function () {
    const [files, setFiles] = createSignal<DirEntry[]>([]);

    createEffect(() => {
        invoke<DirEntry[]>("get_files", { path: filesStore.path })
            .then((files) => {
                setFiles(
                    files.map((file) => {
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
                            <th>Created At</th>
                            <th>Modified At</th>
                            <th>Size</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <For each={files()} fallback={<></>}>
                            {(item) => <FolderItem data={item} />}
                        </For>
                    </tbody>
                </table>
            </div>
        </>
    );
}
