import { invoke } from "@tauri-apps/api";
import { FileSize } from "./DirEntry";

export interface Disk {
    name: string;
    mountPoint: string;
    availableSpaceInBytes: FileSize;
    totalSpaceInBytes: FileSize;
    removable: boolean;
}

export async function fetchDisks(): Promise<Disk[]> {
    return (await invoke<Disk[]>("get_disks")).map((disk) => {
        disk.availableSpaceInBytes = new FileSize(
            (disk as any).availableSpaceInBytes as number,
        );
        disk.totalSpaceInBytes = new FileSize(
            (disk as any).totalSpaceInBytes as number,
        );
        return disk;
    });
}
