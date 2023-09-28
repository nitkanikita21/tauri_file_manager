use std::{
    ffi::OsString,
    fs::{self, DirEntry, File},
    io,
    path::{Path, PathBuf},
    time::SystemTime,
};

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

fn get_symlink_target() {}

#[derive(Debug, Default)]
pub struct FileManager {
    current_path: Option<PathBuf>,
}
impl FileManager {
    pub fn get_current_path(&self) -> Option<&Path> {
        self.current_path.as_deref()
    }
    pub fn set_current_path(&mut self, path: Option<PathBuf>) {
        self.current_path = path
    }
    pub fn get_files(&self) -> Option<io::Result<Vec<FileInfo>>> {
        self.current_path.as_deref().map(|pass| {
            fs::read_dir(pass)?
                .into_iter()
                .map(|entry| entry?.try_into())
                .collect()
        })
    }

    pub const fn new() -> Self {
        Self { current_path: None }
    }
}
