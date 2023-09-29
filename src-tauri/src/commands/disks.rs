use crate::{
    file_manager::{Disk, FileManager},
    infallible::Infallible,
};

#[tauri::command]
pub fn get_disks() -> Result<Vec<Disk>, Infallible> {
    Ok(FileManager::get_disks())
}
