// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::{Path, PathBuf};

use lazy_static::lazy_static;
use file_manager::FileManager;
use tokio::sync::Mutex;

pub mod commands;
pub mod file_manager;

lazy_static! {
    pub static ref FILE_NAMAGER: Mutex<FileManager> = Mutex::new(FileManager::new());
}

#[tokio::main]
async fn main() {
    let mut pathbuff = PathBuf::new();
    pathbuff.push(r"C:\");
    FILE_NAMAGER.lock().await.set_current_path(Some(pathbuff));

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![commands::files::get_files, commands::files::get_path])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
