import { invoke } from "@tauri-apps/api";
import { createEffect, createSignal, onCleanup, useContext } from "solid-js";
import {
    VsArrowUp,
    VsArrowLeft,
    VsArrowRight,
    VsRefresh,
} from "solid-icons/vs";
import { twMerge, ClassNameValue } from "tailwind-merge";
import { FilesContext } from "../../contexts/FilesProvider";

export default function (props: { class: ClassNameValue }) {
    const [files, reload] = useContext(FilesContext)!;
    const [path, setPath] = createSignal<string>("");

    createEffect(() => {
        invoke<string>("get_path").then((v) => setPath(v));
    });
    
    function onChange() {
        invoke("set_path", { path: path() })
        .then(reload)
    }

    let timer = setInterval(() => reload(null), 1000);
    onCleanup(() => clearInterval(timer));

    return (
        <div class={twMerge("join", props.class)}>
            <button class="btn btn-outline join-item btn-sm">
                <VsArrowLeft />
            </button>
            <button class="btn btn-outline join-item btn-sm">
                <VsArrowRight />
            </button>
            <button class="btn btn-outline join-item btn-sm">
                <VsArrowUp />
            </button>
            <input
                type="text"
                placeholder="Type command or path here"
                class="input join-item input-bordered input-sm w-full border-base-content"
                value={path()}
                onChange={(e) => {
                    setPath(e.target.value)
                    onChange()
                }}
            />
            <button class="btn btn-outline join-item btn-sm" onClick={reload}>
                <VsRefresh />
            </button>
        </div>
    );
}
