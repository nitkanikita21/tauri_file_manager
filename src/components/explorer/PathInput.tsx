import { invoke } from "@tauri-apps/api";
import { createEffect, createSignal } from "solid-js";
import { VsArrowUp } from 'solid-icons/vs'
import { twMerge, ClassNameValue } from 'tailwind-merge'


export default function (props: {
    class: ClassNameValue
}) {
    const [path, setPath] = createSignal<string>("");

    createEffect(() => {
        invoke<string>("get_path").then((v) => setPath(v));
    });
    {/* <input
        type="text"
        placeholder="Type command or path here"
        class="input input-bordered input-sm min-w-full"
        value={path()}
    /> */}

    return (

        <div class={twMerge("join", props.class)}>
            <button class="join-item btn btn-outline btn-sm">
                <VsArrowUp />
            </button>
            <input
                type="text"
                placeholder="Type command or path here"
                class="input input-bordered input-sm join-item"
                value={path()}
            />
        </div>
    );
}
