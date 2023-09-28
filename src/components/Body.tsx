import { invoke } from "@tauri-apps/api";
import { For, createEffect, createSignal, useContext } from "solid-js";
import { DirEntry, FileSize, FileType } from "../types/DirEntry";
import FolderItem from "./FolderItem";
import {
    FilesContext,
    FilesList,
    useFilesList,
} from "../contexts/FilesProvider";

export default function () {
    // const [files, setFiles] = createSignal<DirEntry[]>([]);
    const [files, reload] = useContext(FilesContext)!;

    createEffect(() => {
        console.log(files());
    });

    return (
        <>
            <div class="h-full w-full overflow-y-scroll overflow-x-auto bg-base-100">
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
