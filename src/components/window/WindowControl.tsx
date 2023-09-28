import { VsClose, VsChromeMaximize, VsChromeMinimize } from "solid-icons/vs";
import { appWindow } from "@tauri-apps/api/window";

export default function () {
    function minimize() {
        appWindow.minimize();
    }
    function maximizeSwitch() {
        appWindow.toggleMaximize();
    }
    function close() {
        appWindow.close();
    }

    return (
        <>
            <div class="grid h-full w-40 grid-cols-3 gap-0">
                <button
                    class="btn btn-square btn-sm h-full w-full rounded-none border-0 bg-base-100"
                    onClick={minimize}
                >
                    <VsChromeMinimize size={18} />
                </button>
                <button
                    class="btn btn-square btn-sm h-full w-full rounded-none border-0 bg-base-100 "
                    onClick={maximizeSwitch}
                >
                    <VsChromeMaximize size={18} />
                </button>
                <button
                    class="group/btn btn btn-sm h-full w-full rounded-none border-0 bg-base-100 hover:bg-red-700"
                    onClick={close}
                >
                    <VsClose class="group-hover/btn:fill-white" size={18} />
                </button>
            </div>
        </>
    );
}
