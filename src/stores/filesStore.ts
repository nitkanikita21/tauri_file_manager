import { createStore } from "solid-js/store";

export interface Store {
    path: string;
    reload: boolean;
}

const [filesStore, setFilesStore] = createStore<Store>({
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
