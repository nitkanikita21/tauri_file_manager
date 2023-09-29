// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use lazy_static::lazy_static;
use sysinfo::{NetworkExt, NetworksExt, ProcessExt, System, SystemExt};
use tokio::sync::Mutex;

pub mod commands;
pub mod file_manager;
pub mod utils;

lazy_static! {
    pub static ref SYSTEM_INFO: Mutex<System> = Mutex::new(System::new_all());
}

#[tokio::main]
async fn main() {
    SYSTEM_INFO.lock().await.refresh_disks_list();

    tauri::Builder::default()
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
