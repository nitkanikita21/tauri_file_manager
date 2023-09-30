import { invoke } from "@tauri-apps/api";
import { For, createEffect, createSignal } from "solid-js";
import { DirEntry, FileSize, FileType } from "../types/DirEntry";
import FolderItem from "./FolderItem";
import filesStore from "../stores/filesStore";
import { fallbackLocaleId, locale, setLocaleId } from "../stores/translationStore";

export default function () {
    const [files, setFiles] = createSignal<DirEntry[]>([]);
    setLocaleId(fallbackLocaleId)

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
                            <th>{locale()?.["files.name"]}</th>
                            <th>{locale()?.["files.createdAt"]}</th>
                            <th>{locale()?.["files.modifiedAt"]}</th>
                            <th>{locale()?.["files.size"]}</th>
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
