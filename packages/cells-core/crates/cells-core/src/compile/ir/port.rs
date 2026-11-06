//! Ports: an element's cells as the compile names them ([`Port`]), the
//! type sealing gives each ([`PortType`]), and what the check finds of
//! each ([`PortAttrs`]).

/// A port of an element's wiring: one of its public props, a coordinate of
/// one of its list's points, or a hidden port its planner made. Ports are
/// numbered in that order: the table's props, then two per point of the
/// list, then the hidden ports. Obtained only from the type's table or the
/// wiring, never from a number.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, PartialOrd, Ord)]
pub(crate) struct Port(u8);

impl Port {
    /// The port at position `i` of its element's wiring: a table prop by
    /// its position, which only `component!` and the wiring make.
    #[doc(hidden)]
    pub(crate) const fn table(i: usize) -> Port {
        assert!(i < 256, "fewer than 256 ports per element");
        Port(i as u8)
    }

    /// The port's position among its element's, which the build numbers
    /// its slot by.
    pub(crate) const fn index(self) -> usize {
        self.0 as usize
    }
}

/// What a port's cell holds: a number (a boolean or an index among them),
/// a string id, or a handle in the symbolic engine. `Num` is the bottom:
/// what a port is until something it reads says otherwise.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Default)]
pub enum PortType {
    #[default]
    Num,
    Text,
    Math,
}

impl PortType {
    /// The least type above both: `Num` yields to either, and a text port
    /// read where a math is expected is refused before this is asked.
    pub(crate) fn join(self, other: PortType) -> PortType {
        match (self, other) {
            (PortType::Num, t) | (t, PortType::Num) => t,
            (PortType::Math, _) | (_, PortType::Math) => PortType::Math,
            (PortType::Text, PortType::Text) => PortType::Text,
        }
    }

    /// The value type a cell of this port holds.
    pub fn value_type(self) -> crate::program::ValueType {
        match self {
            PortType::Num => crate::program::ValueType::Number,
            PortType::Text => crate::program::ValueType::Text,
            PortType::Math => crate::program::ValueType::Math,
        }
    }
}

/// What the check found of a port, which every build reads (ADR 0036): a
/// bit per fact, the same in every instance of the port's template slot.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub(crate) struct PortAttrs(u8);

impl PortAttrs {
    /// A given value a student's action can write: essential, where any
    /// other given value is a constant (ADR 0018). With the classing off,
    /// every port.
    pub(crate) const WRITABLE: PortAttrs = PortAttrs(1);
    /// The document computes its cell (ADR 0019).
    pub(crate) const LIVE: PortAttrs = PortAttrs(1 << 1);
    /// A counted value: a build counts it from the structure it stamped (a
    /// collect's count), so it is a derived cell, never a constant (ADR
    /// 0028).
    pub(crate) const COUNTED: PortAttrs = PortAttrs(1 << 2);
    /// A document constant: its constant is the same in every instance.
    /// Every other constant is a scope constant (ADR 0028).
    pub(crate) const DOCUMENT_CONSTANT: PortAttrs = PortAttrs(1 << 3);
    /// A value no tick changes (ADR 0037): a constant leaf, a scope leaf,
    /// a given value no student's action can write, or an operator, alias
    /// or vector output over such values, read only through stable
    /// references; never a counted value, nor held by a flag that is not
    /// one. What a load-time choice may read.
    pub(crate) const CONSTANT: PortAttrs = PortAttrs(1 << 4);

    /// Whether it has every fact of `a`.
    pub(crate) fn has(self, a: PortAttrs) -> bool {
        self.0 & a.0 == a.0
    }
}

impl std::ops::BitOrAssign for PortAttrs {
    fn bitor_assign(&mut self, a: PortAttrs) {
        self.0 |= a.0;
    }
}
