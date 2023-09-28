import Body from "./components/Body";
import Side from "./components/side/Side";
import Navbar from "./components/window/Navbar";
import { FilesProvider } from "./contexts/FilesProvider";

export default function () {
    return (
        <div class="flex h-screen max-h-screen flex-col select-none">
            <FilesProvider>
                <Navbar />
                <div class="flex flex-row overflow-clip">
                    <Side />
                    <Body />
                </div>
            </FilesProvider>
        </div>
    );
}
