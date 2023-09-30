import { createStore } from "solid-js/store";

export interface FilesStore {
    path: string;
    reload: boolean;
}

const [filesStore, setFilesStore] = createStore<FilesStore>({
    path: "",
    reload: false,
});

export default filesStore;

export function reload() {
    setFilesStore("reload", !filesStore.reload);
}

export function setPath(path: string) {
    setFilesStore("path", path);
}
