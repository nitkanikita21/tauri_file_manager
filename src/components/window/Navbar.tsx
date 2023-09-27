import PathInput from "../explorer/PathInput";
import WindowControl from "./WindowControl";

export default function () {
    return (
        <>
            <div
                data-tauri-drag-region
                class="grid min-h-fit grid-cols-3 bg-base-100 p-0"
            >
                <div data-tauri-drag-region class="flex h-full items-center">
                    <button class="btn btn-sm text-sm normal-case ">NFM</button>
                </div>
                
                <PathInput class="py-1 " />
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
