use crate::SYSTEM_INFO;
use sysinfo::{NetworkExt, NetworksExt, ProcessExt, System, SystemExt, DiskExt};


#[tauri::command]
pub async fn get_disks() -> Result<(), String> {
    for disk in SYSTEM_INFO.lock().await.disks() {
        println!("{:?}", disk.mount_point())
    }

    Ok(())
}
