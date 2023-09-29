import { HiSolidFolder, HiSolidLink } from "solid-icons/hi";
import { VsFileSymlinkFile } from "solid-icons/vs";
import { VsFile, VsFolder, VsTrash, VsEdit } from "solid-icons/vs";
import { DirEntry, Directory, File, FileType } from "../types/DirEntry";
import { Match, Show, Switch } from "solid-js";
import ExecuteItem from "./folder/ExecuteItem";

export default function (props: { data: DirEntry }) {
    return (
        <ExecuteItem
            type={props.data.type}
            abosultePath={props.data.path}
        >
            {(handler) => (
                <tr class="group p-0 hover:bg-base-200">
                    <td
                        onDblClick={handler}
                        class="flex h-full min-w-max flex-row items-center group-hover:fill-neutral-content group-hover:text-neutral-content"
                    >
                        <Switch>
                            <Match
                                when={props.data.type === FileType.Directory}
                            >
                                <VsFolder size={24} class="mr-2" />
                            </Match>
                            <Match when={props.data.type === FileType.Symlink}>
                                <VsFileSymlinkFile size={24} class="mr-2" />
                            </Match>
                            <Match when={props.data.type === FileType.File}>
                                <VsFile size={24} class="mr-2" />
                            </Match>
                        </Switch>
                        {props.data.name}
                    </td>
                    {/* <td>{props.data.type}</td> */}
                    <td class="w-32 min-w-max">
                        <Show
                            when={
                                props.data.type == FileType.Directory ||
                                props.data.type == FileType.File
                            }
                        >
                            <div>
                                {(
                                    props.data as File | Directory
                                ).createdAt.toLocaleString()}
                            </div>
                        </Show>
                    </td>
                    <td class="w-32 min-w-max">
                        <Show
                            when={
                                props.data.type == FileType.Directory ||
                                props.data.type == FileType.File
                            }
                        >
                            <div>
                                {(
                                    props.data as File | Directory
                                ).modifiedAt.toLocaleString()}
                            </div>
                        </Show>
                    </td>
                    <td class="text-right font-mono">
                        <Show when={props.data.type == FileType.File}>
                            <div>{(props.data as File).size.toString()}</div>
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
        </ExecuteItem>
    );
}
