use std::{
    cmp::Ordering,
    fs, io,
    path::{Path, PathBuf},
    sync::Mutex,
    time::SystemTime,
};

use sysinfo::{DiskExt, System, SystemExt};

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
        let file_info = if file_type.is_file() {
            Self::File {
                name: value.file_name().to_string_lossy().into_owned(),
                path: value.path(),
                size: value.metadata()?.len(),
                created_at: value.metadata()?.created()?,
                modified_at: value.metadata()?.modified()?,
                last_accessed: value.metadata()?.accessed()?,
            }
        } else if file_type.is_dir() {
            Self::Directory {
                name: value.file_name().to_string_lossy().into_owned(),
                path: value.path(),
                created_at: value.metadata()?.created()?,
                modified_at: value.metadata()?.modified()?,
                last_accessed: value.metadata()?.accessed()?,
            }
        } else if file_type.is_symlink() {
            Self::Symlink {
                name: value.file_name().to_string_lossy().into_owned(),
                path: value.path(),
            }
        } else {
            unreachable!()
        };
        Ok(file_info)
    }
}

impl PartialOrd for FileInfo {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        let ordering = match (self, other) {
            (Self::Directory { .. }, Self::File { .. })
            | (Self::Directory { .. }, Self::Symlink { .. })
            | (Self::File { .. }, Self::Symlink { .. }) => Ordering::Less,
            (Self::File { .. }, Self::Directory { .. })
            | (Self::Symlink { .. }, Self::Directory { .. })
            | (Self::Symlink { .. }, Self::File { .. }) => Ordering::Greater,
            (Self::Directory { name: lhs, .. }, Self::Directory { name: rhs, .. })
            | (Self::File { name: lhs, .. }, Self::File { name: rhs, .. })
            | (Self::Symlink { name: lhs, .. }, Self::Symlink { name: rhs, .. }) => lhs.cmp(rhs),
        };
        Some(ordering)
    }
}

impl Ord for FileInfo {
    #[inline(always)]
    fn cmp(&self, other: &Self) -> Ordering {
        unsafe { self.partial_cmp(other).unwrap_unchecked() }
    }
}

#[derive(Clone, PartialEq, Eq, Hash, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Disk {
    name: String,
    mount_point: PathBuf,
    available_space_in_bytes: u64,
    total_space_in_bytes: u64,
    removable: bool,
}

#[derive(Debug)]
pub struct FileManager {
    system_info: Mutex<System>,
}

impl Default for FileManager {
    #[inline(always)]
    fn default() -> Self {
        Self::new()
    }
}

impl FileManager {
    pub fn new() -> Self {
        Self {
            system_info: Mutex::new(System::new_all()),
        }
    }

    pub fn get_files(path: impl AsRef<Path>) -> io::Result<Vec<FileInfo>> {
        let mut files: Vec<FileInfo> = fs::read_dir(path)?
            .map(|entry| FileInfo::try_from(entry?).map_err(Into::into))
            .collect::<io::Result<_>>()?;
        files.sort_unstable();
        Ok(files)
    }

    pub fn get_disks(&self) -> Vec<Disk> {
        let mut sys = self.system_info.lock().unwrap();
        sys.refresh_disks();
        sys.disks()
            .iter()
            .map(|disk| Disk {
                mount_point: disk.mount_point().to_path_buf(),
                available_space_in_bytes: disk.available_space(),
                total_space_in_bytes: disk.total_space(),
                removable: disk.is_removable(),
                name: disk.name().to_string_lossy().into_owned(),
            })
            .collect()
    }
}
