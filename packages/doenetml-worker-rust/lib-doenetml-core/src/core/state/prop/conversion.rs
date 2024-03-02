pub trait TryFromProp<T>: Sized {
    type Error;

    fn try_from_prop(value: &T) -> Result<Self, Self::Error>;
}

pub trait TryToProp<T> {
    type Error;

    fn try_to_prop(&self) -> Result<T, Self::Error>;
}

impl<T, U> TryToProp<U> for T
where
    U: TryFromProp<T>,
{
    type Error = U::Error;

    fn try_to_prop(&self) -> Result<U, Self::Error> {
        U::try_from_prop(self)
    }
}
