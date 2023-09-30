import { fs, path } from "@tauri-apps/api"
import { BaseDirectory } from "@tauri-apps/api/fs"
import { createMemo, createResource, createSignal } from "solid-js"

export interface Translation {
    "disks.disks": string
    "files.name": string
    "files.createdAt": string
    "files.modifiedAt": string
    "files.size": string
}

export const [localeId, setLocaleId] = createSignal("en-US")
export const [locale] = createResource<Translation, string>(localeId, async (source, { }) => {
    let fallbackLocaleId = "en-US";
    let localeId = source
    if (!(await fs.exists(`locales`, { dir: BaseDirectory.AppConfig }))) {
        await fs.createDir("locales", { dir: BaseDirectory.AppConfig })
    }
    if (!(await fs.exists(`locales/${localeId}.json`, { dir: BaseDirectory.AppConfig }))) {
        localeId = fallbackLocaleId
        await fs.writeTextFile(`locales/${localeId}.json`, await fs.readTextFile(`locales/${localeId}.json`, { dir: BaseDirectory.Resource }), { dir: BaseDirectory.AppConfig })
    }
    return JSON.parse(await fs.readTextFile(`locales/${localeId}.json`, { dir: BaseDirectory.AppConfig })) as Translation
})