import Body from "./components/Body";
import Navbar from "./components/window/Navbar";

export default function () {
    return (
        <div class="h-screen max-h-screen flex flex-col">
            <Navbar />
            <Body />
        </div>
    );
}
