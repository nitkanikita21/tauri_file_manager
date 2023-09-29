// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;

use lazy_static::lazy_static;
use sysinfo::{System, SystemExt};

pub mod commands;
pub mod file_manager;
pub mod infallible;

lazy_static! {
    pub static ref SYSTEM_INFO: Mutex<System> = {
        let mut system = System::new_all();
        system.refresh_disks_list();
        Mutex::new(system)
    };
}

#[tokio::main]
async fn main() {
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
