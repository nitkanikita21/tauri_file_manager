import PathInput from "../explorer/PathInput";
import WindowControl from "./WindowControl";
import { VsFolder } from "solid-icons/vs";

export default function () {
    return (
        <>
            <div
                data-tauri-drag-region
                class="grid min-h-fit grid-cols-4 bg-base-100 p-0"
            >
                <div
                    data-tauri-drag-region
                    class="flex h-full items-center pl-5"
                >
                    <VsFolder size={22} />
                </div>

                <PathInput class="col-span-2 w-full py-1" />
                <div
                    data-tauri-drag-region
                    class="flex h-full flex-row-reverse"
                >
                    <WindowControl />
                </div>
            </div>
        </>
    );
}
