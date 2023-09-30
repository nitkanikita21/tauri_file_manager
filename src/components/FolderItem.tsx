import { VsFileSymlinkFile, VsFileSymlinkDirectory } from "solid-icons/vs";
import { VsFile, VsFolder, VsTrash } from "solid-icons/vs";
import {
    DirEntry,
    Directory,
    File,
    FileType,
    Symlink,
    SymlinkType,
} from "../types/DirEntry";
import { Match, Show, Switch } from "solid-js";
import OpenItem from "./folder/OpenItem";

export default function (props: { data: DirEntry }) {
    return (
        <OpenItem
            type={props.data.type}
            absolutePath={props.data.path}
            linkType={(props.data as Symlink).linkType}
        >
            {(open) => (
                <tr class="group p-0 hover:bg-base-200">
                    <td
                        onDblClick={open}
                        class="flex h-full min-w-max flex-row items-center group-hover:fill-neutral-content group-hover:text-neutral-content"
                    >
                        <Switch>
                            <Match
                                when={props.data.type === FileType.Directory}
                            >
                                <VsFolder size={24} class="mr-2" />
                            </Match>
                            <Match when={props.data.type === FileType.Symlink}>
                                <Switch>
                                    <Match
                                        when={
                                            (props.data as Symlink).linkType ===
                                                SymlinkType.File ||
                                            (props.data as Symlink).linkType ===
                                                SymlinkType.Unknown
                                        }
                                    >
                                        <VsFileSymlinkFile
                                            size={24}
                                            class="mr-2"
                                        />
                                    </Match>
                                    <Match
                                        when={
                                            (props.data as Symlink).linkType ===
                                            SymlinkType.Directory
                                        }
                                    >
                                        <VsFileSymlinkDirectory
                                            size={24}
                                            class="mr-2"
                                        />
                                    </Match>
                                </Switch>
                            </Match>
                            <Match when={props.data.type === FileType.File}>
                                <VsFile size={24} class="mr-2" />
                            </Match>
                        </Switch>
                        {props.data.name}
                    </td>
                    <td class="w-32 min-w-max">
                        <Show
                            when={
                                props.data.type === FileType.Directory ||
                                props.data.type === FileType.File
                            }
                        >
                            {(
                                props.data as File | Directory
                            ).createdAt.toLocaleString()}
                        </Show>
                    </td>
                    <td class="w-32 min-w-max">
                        <Show
                            when={
                                props.data.type === FileType.Directory ||
                                props.data.type === FileType.File
                            }
                        >
                            {(
                                props.data as File | Directory
                            ).modifiedAt.toLocaleString()}
                        </Show>
                    </td>
                    <td class="text-right font-mono">
                        <Show when={props.data.type == FileType.File}>
                            {(props.data as File).size.toString()}
                        </Show>
                    </td>
                    <td class="invisible flex h-8 min-w-max flex-row p-0 group-hover:visible">
                        <VsTrash
                            size={24}
                            class="m-0 self-center rounded-md fill-error p-0.5 hover:bg-base-300"
                        />
                    </td>
                </tr>
            )}
        </OpenItem>
    );
}
