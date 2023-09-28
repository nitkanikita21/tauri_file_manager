import { HiSolidFolder, HiSolidLink } from "solid-icons/hi";
import { VsFileSymlinkFile } from "solid-icons/vs";
import { VsFile, VsFolder, VsTrash, VsEdit } from "solid-icons/vs";
import { DirEntry, FileType } from "../types/DirEntry";
import { Match, Switch } from "solid-js";

export default function (props: { data: DirEntry }) {
    return (
        <tr class="group p-0 hover:bg-base-200">
            <td class="flex h-full flex-row items-center group-hover:fill-neutral-content group-hover:text-neutral-content min-w-max">
                <Switch>
                    <Match when={props.data.type === FileType.Directory}>
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
                {props.data.type == FileType.Directory ||
                props.data.type == FileType.File ? (
                    props.data.createdAt.toLocaleString()
                ) : (
                    <></>
                )}
            </td>
            <td class="w-32 min-w-max">
                {props.data.type == FileType.Directory ||
                props.data.type == FileType.File ? (
                    props.data.modifiedAt.toLocaleString()
                ) : (
                    <></>
                )}
            </td>
            <td class="">
                {props.data.type == FileType.File ? (
                    props.data.size.bytes
                ) : (
                    <></>
                )}
            </td>
            <td class="invisible flex h-8 flex-row p-0 group-hover:visible min-w-max">
                <VsTrash
                    size={24}
                    class="m-0 self-center rounded-md fill-error p-0.5 hover:bg-base-300"
                />
            </td>
        </tr>
    );
}
