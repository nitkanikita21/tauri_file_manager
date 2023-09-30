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
import OpenItem from "../folder/OpenItem";
import { FileType } from "../../types/DirEntry";

const dangerThreshold = 0.35;
const warningThreshold = 0.65;

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
                    <For each={disks()}>
                        {(disk) => {
                            let percentage =
                                disk.availableSpaceInBytes.bytes /
                                disk.totalSpaceInBytes.bytes;
                            let className: string;
                            switch (true) {
                                case percentage < dangerThreshold:
                                    className = "text-error";
                                    break;
                                case percentage < warningThreshold:
                                    className = "text-warning";
                                    break;
                                default:
                                    className = "text-success";
                                    break;
                            }

                            return (
                                <OpenItem
                                    absolutePath={disk.mountPoint}
                                    type={FileType.Directory}
                                >
                                    {(open) => (
                                        <div
                                            onClick={open}
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
                                                            className,
                                                            "text-md font-bold transition-colors duration-200 group-hover:text-primary-content",
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
                                </OpenItem>
                            );
                        }}
                    </For>
                </div>
            </div>
        </>
    );
}
