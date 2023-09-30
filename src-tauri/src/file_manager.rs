use std::{
    cmp::Ordering,
    fs, io,
    path::{Path, PathBuf},
    sync::Mutex,
    time::SystemTime,
};

use sysinfo::{DiskExt, System, SystemExt};

#[derive(Clone, PartialEq, Eq, serde::Serialize)]
#[serde(tag = "type")]
pub enum FileInfo {
    #[serde(rename_all = "camelCase")]
    File {
        name: String,
        path: PathBuf,
        size: u64,
        #[serde(with = "humantime_serde")]
        created_at: SystemTime,
        #[serde(with = "humantime_serde")]
        modified_at: SystemTime,
        #[serde(with = "humantime_serde")]
        last_accessed: SystemTime,
    },
    #[serde(rename_all = "camelCase")]
    Directory {
        name: String,
        path: PathBuf,
        #[serde(with = "humantime_serde")]
        created_at: SystemTime,
        #[serde(with = "humantime_serde")]
        modified_at: SystemTime,
        #[serde(with = "humantime_serde")]
        last_accessed: SystemTime,
    },
    Symlink {
        name: String,
        path: PathBuf,
        #[serde(rename = "camelCase")]
        link_type: SymlinkType,
    },
}

#[derive(Clone, PartialEq, Eq, serde::Serialize)]
pub enum SymlinkType {
    File,
    Directory,
    Unknown,
}

impl TryFrom<std::fs::DirEntry> for FileInfo {
    type Error = io::Error;

    fn try_from(value: std::fs::DirEntry) -> Result<Self, Self::Error> {
        let file_type = value.file_type()?;
        let name = value.file_name().to_string_lossy().into_owned();
        let path = value.path();
        let file_info = if file_type.is_file() {
            Self::File {
                name,
                path,
                size: value.metadata()?.len(),
                created_at: value.metadata()?.created()?,
                modified_at: value.metadata()?.modified()?,
                last_accessed: value.metadata()?.accessed()?,
            }
        } else if file_type.is_dir() {
            Self::Directory {
                name,
                path,
                created_at: value.metadata()?.created()?,
                modified_at: value.metadata()?.modified()?,
                last_accessed: value.metadata()?.accessed()?,
            }
        } else if file_type.is_symlink() {
            let mut leads_to = dbg!(fs::read_link(path)?);
            while leads_to.is_symlink() {
                leads_to = dbg!(fs::read_link(leads_to)?);
            }
            let leads_to = dbg!(leads_to);
            let link_type = if leads_to.is_file() {
                SymlinkType::File
            } else if leads_to.is_dir() {
                SymlinkType::Directory
            } else {
                SymlinkType::Unknown
            };
            Self::Symlink {
                name,
                path: leads_to,
                link_type,
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

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Disk {
    name: String,
    mount_point: PathBuf,
    available_space_in_bytes: u64,
    total_space_in_bytes: u64,
    removable: bool,
}

impl From<&sysinfo::Disk> for Disk {
    fn from(disk: &sysinfo::Disk) -> Self {
        Self {
            mount_point: disk.mount_point().to_path_buf(),
            available_space_in_bytes: disk.available_space(),
            total_space_in_bytes: disk.total_space(),
            removable: disk.is_removable(),
            name: disk.name().to_string_lossy().into_owned(),
        }
    }
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

    #[inline(always)]
    pub fn get_files(path: impl AsRef<Path>) -> io::Result<Vec<FileInfo>> {
        Self::_get_files(path.as_ref())
    }

    fn _get_files(path: &Path) -> io::Result<Vec<FileInfo>> {
        let mut files: Vec<FileInfo> = fs::read_dir(path)?
            .map(|entry| FileInfo::try_from(entry?).map_err(Into::into))
            .collect::<io::Result<_>>()?;
        files.sort_unstable();
        Ok(files)
    }

    pub fn get_disks(&self) -> Vec<Disk> {
        let mut sys = self.system_info.lock().unwrap();
        sys.refresh_disks();
        sys.disks().iter().map(Disk::from).collect()
    }
}
