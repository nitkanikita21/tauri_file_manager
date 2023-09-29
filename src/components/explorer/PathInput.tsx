import {
    VsArrowUp,
    VsArrowLeft,
    VsArrowRight,
    VsRefresh,
} from "solid-icons/vs";
import { twMerge, ClassNameValue } from "tailwind-merge";
import filesStore, { reload, setPath } from "../../stores/filesStore";
import { onCleanup, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api";

export default function (props: { class: ClassNameValue }) {
    const timer = setInterval(reload, 3000); // reload file list every 1 second
    onCleanup(() => clearInterval(timer));

    onMount(()=>{
        invoke<string>("get_cwd_path").then(setPath)
    })

    function goToParent() {
        invoke<string>("get_parent", { path: filesStore.path }).then(
            (parentPath) => setPath(parentPath),
        );
    }

    return (
        <div class={twMerge("join", props.class)}>
            <button class="btn btn-outline join-item btn-sm">
                <VsArrowLeft />
            </button>
            <button class="btn btn-outline join-item btn-sm">
                <VsArrowRight />
            </button>
            <button
                onClick={goToParent}
                class="btn btn-outline join-item btn-sm"
            >
                <VsArrowUp />
            </button>
            <input
                type="text"
                placeholder="Type command or path here"
                class="input join-item input-bordered input-sm w-full border-base-content"
                value={filesStore.path}
                onChange={(e) => {
                    setPath(e.target.value);
                }}
            />
            <button class="btn btn-outline join-item btn-sm" onClick={reload}>
                <VsRefresh />
            </button>
        </div>
    );
}
