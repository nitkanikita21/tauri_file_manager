use tauri::State;

use crate::file_manager::{Disk, FileManager};

#[tauri::command]
pub fn get_disks(fm: State<'_, FileManager>) -> Vec<Disk> {
    fm.get_disks()
}
