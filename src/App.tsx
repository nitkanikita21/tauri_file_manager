import Body from "./components/Body";
import Side from "./components/side/Side";
import Navbar from "./components/window/Navbar";

export default function () {
    return (
        <div class="flex h-screen max-h-screen select-none flex-col">
            <Navbar />
            <div class="flex flex-row overflow-clip">
                <Side />
                <Body />
            </div>
        </div>
    );
}
