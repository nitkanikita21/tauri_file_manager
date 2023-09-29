use core::fmt;
use std::error::Error;

#[derive(serde::Serialize, Debug, Clone, Copy)]
pub enum Infallible {}

impl fmt::Display for Infallible {
    fn fmt(&self, _: &mut fmt::Formatter<'_>) -> fmt::Result {
        match *self {}
    }
}

impl Error for Infallible {}
