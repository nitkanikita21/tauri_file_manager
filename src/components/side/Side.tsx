export default function () {
    return (
        <>
            <div class="flex w-60 flex-col px-5">
                <h1 class="mb-2 text-xl font-extrabold">Disks</h1>

                <div class="grid grid-cols-1 gap-2">
                    <div class="card flex flex-row items-center justify-between bg-base-200 p-3">
                        <div class="text-sm">Disk A</div>
                        <div class="text-sm">10%</div>
                        <div
                            class="radial-progress"
                            style={{ "--value": 70, "--size": "1.8rem" }}
                        ></div>
                    </div>
                    <div class="card flex flex-row items-center justify-between bg-base-200 p-3">
                        <div class="text-sm">Disk B</div>
                        <div class="text-sm">10%</div>
                        <div
                            class="radial-progress"
                            style={{ "--value": 23, "--size": "1.8rem" }}
                        ></div>
                    </div>
                    <div class="card flex flex-row items-center justify-between bg-base-200 p-3">
                        <div class="text-sm">Disk C</div>
                        <div class="text-sm">10%</div>
                        <div
                            class="radial-progress"
                            style={{ "--value": 10, "--size": "1.8rem" }}
                        ></div>
                    </div>
                </div>
            </div>
        </>
    );
}
