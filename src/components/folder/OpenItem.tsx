import { JSX, mergeProps } from "solid-js";
import { setPath } from "../../stores/filesStore";
import { FileType, SymlinkType } from "../../types/DirEntry";
import { invoke } from "@tauri-apps/api";

export default function (props: {
    children: (open: () => void) => JSX.Element;
    absolutePath: string;
    disabled?: boolean;
    type: FileType;
    linkType?: SymlinkType;
}) {
    let _props = mergeProps({ disabled: false }, props);

    function open() {
        if (!_props.disabled) {
            switch (_props.type) {
                case FileType.Directory:
                    setPath(_props.absolutePath);
                    break;
                case FileType.File:
                    invoke("open_file", { path: _props.absolutePath });
                    break;
                case FileType.Symlink:
                    switch (_props.linkType) {
                        case SymlinkType.Directory:
                            setPath(_props.absolutePath);
                            break;
                        case SymlinkType.File:
                            invoke("open_file", { path: _props.absolutePath });
                            break;
                    }
            }
        }
    }

    return _props.children(open);
}
