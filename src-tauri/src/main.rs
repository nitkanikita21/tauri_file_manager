// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use file_manager::FileManager;

pub mod commands;
pub mod file_manager;

fn main() {
    tauri::Builder::default()
        .manage(FileManager::default())
        .invoke_handler(tauri::generate_handler![
            commands::files::get_files,
            commands::files::get_cwd_path,
            commands::files::get_parent,
            commands::files::open_file,
            commands::disks::get_disks
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
