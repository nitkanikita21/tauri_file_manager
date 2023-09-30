import { fs } from "@tauri-apps/api";
import { BaseDirectory } from "@tauri-apps/api/fs";
import { createResource, createSignal } from "solid-js";

export interface Translation {
    "path.placeholder": string
    "disks.disks": string;
    "files.name": string;
    "files.createdAt": string;
    "files.modifiedAt": string;
    "files.size": string;
}

export const fallbackLocaleId = "en-US";
const fallbackLocalePath = `locales/${fallbackLocaleId}.json`;

export const [localeId, setLocaleId] = createSignal(fallbackLocaleId);

export const [locale] = createResource<Translation, string>(
    localeId,
    async (localeId, {}) => {
        const localeDirExists = await fs.exists("locales", {
            dir: BaseDirectory.AppConfig,
        });
        if (!localeDirExists) {
            await fs.createDir("locales", { dir: BaseDirectory.AppConfig });
        }

        const localePath = `locales/${localeId}.json`;
        const localeExists = await fs.exists(localePath, {
            dir: BaseDirectory.AppConfig,
        });

        let localeJson: string;
        if (localeExists) {
            localeJson = await fs.readTextFile(localePath, {
                dir: BaseDirectory.AppConfig,
            });
        } else {
            localeJson = await fs.readTextFile(fallbackLocalePath, {
                dir: BaseDirectory.Resource,
            });
            // write fallback locale into the specified locale file
            await fs.writeTextFile(localePath, localeJson, {
                dir: BaseDirectory.AppConfig,
            });
        }

        return JSON.parse(localeJson) as Translation;
    },
);
