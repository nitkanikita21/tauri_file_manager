use crate::{SYSTEM_INFO, file_manager::{Disk, FileManager}, utils::Infallible};
use sysinfo::{NetworkExt, NetworksExt, ProcessExt, System, SystemExt, DiskExt};




#[tauri::command]
pub async fn get_disks() -> Result<Vec<Disk>, Infallible> {
    /* for disk in SYSTEM_INFO.lock().await.disks() {
        println!("{:?}", disk)
    } */

    Ok(FileManager::get_disks().await)
}
