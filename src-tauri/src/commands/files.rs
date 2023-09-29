use std::path::PathBuf;


use crate::{file_manager::{FileInfo, FileManager}, utils::Infallible};

#[tauri::command]
pub async fn get_files(path: PathBuf) -> Result<Vec<FileInfo>, String> {
    FileManager::get_files(path).map_err(|err| err.to_string())
}

#[tauri::command]
pub async fn get_cwd_path() -> Result<PathBuf, String> {
    std::env::current_dir()
        .map_err(|err| err.to_string())
}

#[tauri::command]
pub async fn get_parent(path: PathBuf) -> Result<Option<PathBuf>, Infallible> {
    Ok(path.parent().map(ToOwned::to_owned))
}

#[tauri::command]
pub fn open_file(path: PathBuf, byProgram: Option<String>) -> Result<(), String> {
    if let Some(by) = byProgram {
        open::with(path, by).map_err(|err| err.to_string())?
    } else {
        open::that(path).map_err(|err| err.to_string())?
    }
    Ok(())
}