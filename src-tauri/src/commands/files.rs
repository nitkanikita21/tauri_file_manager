use std::path::PathBuf;

use crate::{
    file_manager::{FileInfo, FileManager},
    infallible::Infallible,
};

#[tauri::command]
pub fn get_files(path: PathBuf) -> Result<Vec<FileInfo>, String> {
    FileManager::get_files(path).map_err(|err| err.to_string())
}

#[tauri::command]
pub fn get_cwd_path() -> Result<PathBuf, String> {
    std::env::current_dir().map_err(|err| err.to_string())
}

#[tauri::command]
pub fn get_parent(path: PathBuf) -> Result<Option<PathBuf>, Infallible> {
    Ok(path.parent().map(ToOwned::to_owned))
}

#[tauri::command(rename_all = "camelCase")]
pub fn open_file(path: PathBuf, by_program: Option<String>) -> Result<(), String> {
    if let Some(by) = by_program {
        open::with(path, by).map_err(|err| err.to_string())?
    } else {
        open::that(path).map_err(|err| err.to_string())?
    }
    Ok(())
}
