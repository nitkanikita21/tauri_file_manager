// The property name used inside the `import.meta.hot.data` object to store the
const disposers = "appDisposers";

// note: I couldn't figure out how to do this in one step
const IMH = import.meta.hot;
type tIMH = typeof IMH;

export function addDisposer(importMetaHot: tIMH, disposer: CallableFunction) {
    if (!importMetaHot || !importMetaHot.data) return;
    const D = importMetaHot.data;
    if (!D[disposers]) D[disposers] = [];
    D[disposers].push(disposer);
}

export function disposeAll(importMetaHot: tIMH): void {
    if (!importMetaHot || !importMetaHot.data) return;
    const Ds = importMetaHot.data[disposers] as CallableFunction[];
    if (Ds) Ds.forEach((d) => d());
}
