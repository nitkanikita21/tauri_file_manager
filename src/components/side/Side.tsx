import {
    For,
    Match,
    Switch,
    createEffect,
    createSignal,
    onMount,
} from "solid-js";
import { Disk, fetchDisks } from "../../types/Disk";
import { BsUsbDrive } from "solid-icons/bs";
import { FaRegularHardDrive } from "solid-icons/fa";
import { twMerge } from "tailwind-merge";
import ExecuteItem from "../folder/ExecuteItem";
import { FileType } from "../../types/DirEntry";

export default function () {
    const [disks, setDisks] = createSignal<Disk[]>();

    createEffect(() => {
        console.log("disks", disks());
    });
    onMount(() => {
        fetchDisks().then(setDisks);
    });

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
                                style =
                                    "text-red-600 group-hover:text-error-content transition-colors duration-200";
                            } else if (perc < warningTrashold) {
                                style = "text-yellow-600";
                            }

                            return (
                                <ExecuteItem
                                    abosultePath={disk.mountPoint}
                                    type={FileType.Directory}
                                >
                                    {(handler) => (
                                        <div
                                            onDblClick={handler}
                                            class="hover:point border-1 group flex flex-col rounded-xl border border-base-content px-3 py-2 transition-all duration-200 hover:bg-base-content"
                                        >
                                            <div class="text-xs font-bold transition-colors duration-200 group-hover:text-base-100">
                                                {disk.name}{" "}
                                            </div>
                                            <div class="flex flex-row items-center">
                                                <div class="flex flex-col justify-between">
                                                    <Switch>
                                                        <Match
                                                            when={
                                                                disk.removable
                                                            }
                                                        >
                                                            <BsUsbDrive
                                                                class="transition-colors duration-200 group-hover:fill-base-100"
                                                                size={28}
                                                            />
                                                        </Match>
                                                        <Match
                                                            when={
                                                                !disk.removable
                                                            }
                                                        >
                                                            <FaRegularHardDrive
                                                                class="transition-colors duration-200 group-hover:fill-base-100"
                                                                size={28}
                                                            />
                                                        </Match>
                                                    </Switch>
                                                </div>
                                                <div class="ml-3 flex flex-col">
                                                    <div
                                                        class={twMerge(
                                                            style,
                                                            "text-md font-bold transition-colors duration-200 group-hover:text-error-content",
                                                        )}
                                                    >
                                                        {disk.totalSpaceInBytes
                                                            .sub(
                                                                disk.availableSpaceInBytes,
                                                            )
                                                            .toString()}
                                                    </div>
                                                    <div class="text-xs font-bold transition-colors duration-200 group-hover:text-base-100">
                                                        {disk.totalSpaceInBytes.toString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="font-mono text-xs text-info transition-colors duration-200 group-hover:text-error-content">
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
