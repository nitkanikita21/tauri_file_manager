import { JSX, children, createSignal, mergeProps, onCleanup } from "solid-js";
import filesStore, { setPath } from "../../stores/filesStore";
import { FileType } from "../../types/DirEntry";
import { invoke } from "@tauri-apps/api";

export default function (props: {
    children: (onDblClick: () => void) => JSX.Element;
    abosultePath: string;
    disabled?: boolean;
    type: FileType;
}) {
    let _props = mergeProps({ disabled: false }, props);

    function click() {
        if (!_props.disabled) {
            switch (_props.type) {
                case FileType.Directory:
                    setPath(_props.abosultePath);
                    break;
                case FileType.File:
                    invoke("open_file", { path: _props.abosultePath });
                    break;
            }
        }
    }

    return _props.children(click);
}
