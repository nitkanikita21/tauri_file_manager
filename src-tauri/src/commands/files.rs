use std::{ffi::OsString, path::PathBuf};

use crate::{file_manager::FileInfo, FILE_NAMAGER};

#[tauri::command]
pub async fn get_files() -> Result<Option<Vec<FileInfo>>, String> {
    match FILE_NAMAGER.lock().await.get_files() {
        Some(files) => Ok(Some(files.map_err(|err| err.to_string())?)),
        None => Ok(None),
    }
}

#[tauri::command]
pub async fn get_path() -> Result<Option<PathBuf>, String> {
    Ok(FILE_NAMAGER.lock().await.get_current_path().map(ToOwned::to_owned))
}

#[tauri::command(rename_all = "snake_case")]
pub async fn set_path(path: Option<String>) {
    let mut fm = FILE_NAMAGER.lock().await;
    if let Some(p) = path {
        fm.set_current_path(Some(PathBuf::from(p)))
    } else {
        fm.set_current_path(None)
    }
}