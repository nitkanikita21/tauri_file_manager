use std::path::{Path, PathBuf};

use crate::file_manager::{FileInfo, FileManager};

#[tauri::command(async)]
pub fn get_files(path: PathBuf) -> Result<Vec<FileInfo>, String> {
    FileManager::get_files(path).map_err(|err| err.to_string())
}

#[tauri::command]
pub fn get_cwd_path() -> Result<PathBuf, String> {
    std::env::current_dir().map_err(|err| err.to_string())
}

#[tauri::command]
#[inline(always)]
pub fn get_parent(path: &Path) -> Option<&Path> {
    path.parent()
}

#[tauri::command]
pub fn open_file(path: PathBuf, by_program: Option<String>) -> Result<(), String> {
    if let Some(by) = by_program {
        open::with(path, by)
    } else {
        open::that(path)
    }
    .map_err(|err| err.to_string())
}
