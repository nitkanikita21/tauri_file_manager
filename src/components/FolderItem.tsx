import { HiSolidFolder, HiSolidLink } from "solid-icons/hi";
import { DirEntry, FileType } from "../types/DirEntry";

export default function (props: { data: DirEntry }) {
    return (
        <tr class="hover:bg-base-200 group">
            <td class="flex flex-row items-center group-hover:fill-neutral-content group-hover:text-neutral-content ">
                {props.data.type === FileType.Directory ? (
                    <HiSolidFolder size={18} class="mr-2" />
                ) : (
                    <></>
                )}
                {props.data.type === FileType.Symlink ? (
                    <HiSolidLink size={18} class="mr-2" />
                ) : (
                    <></>
                )}
                {props.data.name}
            </td>
            <td>{props.data.type}</td>
        </tr>
    );
}
