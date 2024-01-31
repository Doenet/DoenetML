pub trait TryFromState<T>: Sized {
    type Error;

    fn try_from_state(value: &T) -> Result<Self, Self::Error>;
}

pub trait TryToState<T> {
    type Error;

    fn try_to_state(&self) -> Result<T, Self::Error>;
}

impl<T, U> TryToState<U> for T
where
    U: TryFromState<T>,
{
    type Error = U::Error;

    fn try_to_state(&self) -> Result<U, Self::Error> {
        U::try_from_state(self)
    }
}
