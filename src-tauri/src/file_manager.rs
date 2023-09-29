use std::{
    fs, io,
    path::{Path, PathBuf},
    time::SystemTime,
};
use sysinfo::{DiskExt, SystemExt};

use crate::SYSTEM_INFO;

#[derive(Clone, PartialEq, Eq, Hash, serde::Serialize, serde::Deserialize)]
#[serde(tag = "type")]
pub enum FileInfo {
    File {
        name: String,
        path: PathBuf,
        size: u64,
        #[serde(with = "humantime_serde", rename = "createdAt")]
        created_at: SystemTime,
        #[serde(with = "humantime_serde", rename = "modifiedAt")]
        modified_at: SystemTime,
        #[serde(with = "humantime_serde", rename = "lastAccessed")]
        last_accessed: SystemTime,
    },
    Directory {
        name: String,
        path: PathBuf,
        #[serde(with = "humantime_serde", rename = "createdAt")]
        created_at: SystemTime,
        #[serde(with = "humantime_serde", rename = "modifiedAt")]
        modified_at: SystemTime,
        #[serde(with = "humantime_serde", rename = "lastAccessed")]
        last_accessed: SystemTime,
    },
    Symlink {
        name: String,
        path: PathBuf,
    },
}

impl TryFrom<std::fs::DirEntry> for FileInfo {
    type Error = io::Error;
    fn try_from(value: std::fs::DirEntry) -> Result<Self, Self::Error> {
        let file_type = value.file_type()?;
        if file_type.is_file() {
            Ok(Self::File {
                name: value.file_name().to_string_lossy().into_owned(),
                path: value.path(),
                size: value.metadata()?.len(),
                created_at: value.metadata()?.created()?,
                modified_at: value.metadata()?.modified()?,
                last_accessed: value.metadata()?.accessed()?,
            })
        } else if file_type.is_dir() {
            Ok(Self::Directory {
                name: value.file_name().to_string_lossy().into_owned(),
                path: value.path(),
                created_at: value.metadata()?.created()?,
                modified_at: value.metadata()?.modified()?,
                last_accessed: value.metadata()?.accessed()?,
            })
        } else if file_type.is_symlink() {
            Ok(Self::Symlink {
                name: value.file_name().to_string_lossy().into_owned(),
                path: value.path(),
            })
        } else {
            unreachable!()
        }
    }
}

#[derive(Clone, PartialEq, Eq, Hash, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Disk {
    name: String,
    mount_point: PathBuf,
    available_space_in_bytes: u64,
    total_space_in_bytes: u64,
    removable: bool
}

#[derive(Debug)]
pub struct FileManager;

impl FileManager {
    pub fn get_files(path: impl AsRef<Path>) -> io::Result<Vec<FileInfo>> {
        fs::read_dir(path)?
            .into_iter()
            .map(|entry| FileInfo::try_from(entry?).map_err(Into::into))
            .collect()
    }

    pub async fn get_disks() -> Vec<Disk> {
        let mut sys = SYSTEM_INFO.lock().await;
        sys.refresh_disks();
        sys.disks().iter().map(|disk| {
            Disk {
                mount_point: disk.mount_point().to_path_buf(),
                available_space_in_bytes: disk.available_space(),
                total_space_in_bytes: disk.total_space(),
                removable: disk.is_removable(),
                name: disk.name().to_string_lossy().into_owned()
            }
        }).collect()
    }
}
