import { invoke } from "@tauri-apps/api";
import {
    For,
    Match,
    Show,
    Switch,
    createEffect,
    createSignal,
    onCleanup,
    onMount,
} from "solid-js";
import GoToFolder from "../folder/ExecuteItem";
import { Disk, fetchDisks } from "../../types/Disk";
import { BsUsbDrive } from "solid-icons/bs";
import { FaRegularHardDrive } from 'solid-icons/fa'
import { twMerge } from "tailwind-merge";
import ExecuteItem from "../folder/ExecuteItem";
import { FileType } from "../../types/DirEntry";

export default function () {
    const [disks, setDisks] = createSignal<Disk[]>();

    /* const timer = setInterval(() => {
        fetchDisks().then(setDisks);
    }, 2000);
    onCleanup(() => clearInterval(timer)); */

    createEffect(() => {
        console.log("disks", disks());
    });
    onMount(() => {
        fetchDisks().then(setDisks);
    })

    {
        /* <div
                                onDblClick={onDblClick}
                                class="card flex flex-row items-center justify-between bg-base-200 p-3"
                            >
                                <div class="text-sm">Disk A</div>
                                <div class="text-sm">10%</div>
                                <div
                                    class="radial-progress"
                                    style={{
                                        "--value": 70,
                                        "--size": "1.8rem",
                                    }}
                                ></div>
                            </div> */
    }

    return (
        <>
            <div class="flex min-w-fit max-w-7xl flex-col px-5">
                <h1 class="mb-2 text-xl font-extrabold">Storages</h1>

                <div class="grid grid-cols-1 gap-2 overflow-y-auto">
                    <For each={disks()} fallback={<></>}>
                        {(disk) => {
                            let dangerTrashold = 1 - 0.65;
                            let warningTrashold = 1 - 0.35;

                            let style = "text-green-600";
                            let perc =
                                disk.availableSpaceInBytes.bytes /
                                disk.totalSpaceInBytes.bytes;
                            if (perc < dangerTrashold) {
                                style = "text-red-600 group-hover:text-error-content transition-colors duration-200";
                            } else if (perc < warningTrashold) {
                                style = "text-yellow-600";
                            }

                            return (
                                <ExecuteItem abosultePath={disk.mountPoint} type={FileType.Directory}>
                                    {(handler) => (
                                        <div
                                            onDblClick={handler}
                                            class="group transition-all duration-200 hover:point hover:bg-base-content border-1 flex flex-col rounded-xl border border-base-content px-3 py-2"
                                        >
                                            <div class="text-xs font-bold group-hover:text-base-100 transition-colors duration-200">
                                                {disk.name}{" "}
                                                {/* <span class="ml-0.5 font-mono text-accent group-hover:text-error-content transition-colors duration-200">
                                                        {disk.mountPoint}
                                                    </span> */}
                                            </div>
                                            <div class="flex flex-row items-center">
                                                <div class="flex flex-col justify-between">
                                                    <Switch>
                                                        <Match when={disk.removable}>
                                                            <BsUsbDrive
                                                                class="group-hover:fill-base-100 transition-colors duration-200"
                                                                size={28}
                                                            />
                                                        </Match>
                                                        <Match when={!disk.removable}>
                                                            <FaRegularHardDrive
                                                                class="group-hover:fill-base-100 transition-colors duration-200"
                                                                size={28}
                                                            />
                                                        </Match>
                                                    </Switch>
                                                </div>
                                                <div class="ml-3 flex flex-col">
                                                    <div
                                                        class={twMerge(
                                                            style,
                                                            "text-md font-bold group-hover:text-error-content transition-colors duration-200",
                                                        )}
                                                    >
                                                        {disk.totalSpaceInBytes.sub(disk.availableSpaceInBytes).toString()}
                                                    </div>
                                                    <div class="text-xs font-bold group-hover:text-base-100 transition-colors duration-200">
                                                        {disk.totalSpaceInBytes.toString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="text-xs font-mono text-info group-hover:text-error-content transition-colors duration-200">
                                                {disk.mountPoint}
                                            </div>
                                        </div>
                                    )}
                                </ExecuteItem>
                            );
                        }}
                    </For>
                </div>
            </div>
        </>
    );
}
