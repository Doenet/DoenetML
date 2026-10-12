//! The binary wire format (`CDST`, little-endian; see
//! `docs/adr/0002-binary-wire-format.md` and `scripts/cdast-encode.mjs`).

use super::{Dast, NodeKind, StringTable};

impl Dast {
    /// Load from the binary wire format (little-endian, see module docs).
    pub fn from_binary(bytes: &[u8]) -> crate::Result<Dast> {
        let bad = |what: &str| crate::Error::WireFormat(what.to_string());
        if bytes.len() < 8 + 6 * 4 || &bytes[0..4] != b"CDST" {
            return Err(bad("missing CDST magic"));
        }
        let mut r = Reader { b: bytes, pos: 4 };
        let version = r.u32();
        if version != 1 && version != 2 {
            return Err(bad("unsupported version"));
        }
        let n_strings = r.u32() as usize;
        let strings_len = r.u32() as usize;
        let n_nodes = r.u32() as usize;
        let n_attrs = r.u32() as usize;
        let n_children = r.u32() as usize;
        let n_path = r.u32() as usize;
        // Version 2 adds per-part index ranges and the index expressions.
        let n_index = if version >= 2 {
            if bytes.len() < r.pos + 4 {
                return Err(bad("truncated"));
            }
            r.u32() as usize
        } else {
            0
        };
        let extra = if version >= 2 {
            n_path * 4 * 2 + n_index * 4 * 2
        } else {
            0
        };
        let need = r.pos
            + (n_strings + 1) * 4
            + strings_len.div_ceil(4) * 4
            + n_nodes.div_ceil(4) * 4
            + n_nodes * 4 * 5
            + n_attrs * 4 * 3
            + n_children * 4
            + n_path * 4
            + extra;
        if bytes.len() < need {
            return Err(bad("truncated"));
        }
        let offsets = r.u32s(n_strings + 1);
        let string_bytes = r.bytes(strings_len).to_vec();
        std::str::from_utf8(&string_bytes).map_err(|_| bad("strings are not UTF-8"))?;
        r.align4();
        let kind = r.bytes(n_nodes).to_vec();
        r.align4();
        let dast = Dast {
            strings: StringTable {
                offsets,
                bytes: string_bytes,
            },
            kind,
            str_: r.u32s(n_nodes),
            a_start: r.u32s(n_nodes),
            a_count: r.u32s(n_nodes),
            c_start: r.u32s(n_nodes),
            c_count: r.u32s(n_nodes),
            attr_name: r.u32s(n_attrs),
            attr_c_start: r.u32s(n_attrs),
            attr_c_count: r.u32s(n_attrs),
            children: r.u32s(n_children),
            path: r.u32s(n_path),
            path_i_start: if version >= 2 {
                r.u32s(n_path)
            } else {
                vec![0; n_path]
            },
            path_i_count: if version >= 2 {
                r.u32s(n_path)
            } else {
                vec![0; n_path]
            },
            idx_c_start: if version >= 2 {
                r.u32s(n_index)
            } else {
                Vec::new()
            },
            idx_c_count: if version >= 2 {
                r.u32s(n_index)
            } else {
                Vec::new()
            },
        };
        // Bounds checks so accessors can index without panicking on bad input.
        let ns = dast.strings.len() as u32;
        if dast.str_.iter().any(|&s| s >= ns)
            || dast.attr_name.iter().any(|&s| s >= ns)
            || dast.path.iter().any(|&s| s >= ns)
        {
            return Err(bad("string index out of range"));
        }
        if dast.children.iter().any(|&c| c as usize >= n_nodes) {
            return Err(bad("child index out of range"));
        }
        for n in 0..n_nodes {
            let (cs, cc) = (dast.c_start[n] as usize, dast.c_count[n] as usize);
            if cs + cc > n_children {
                return Err(bad("child range out of range"));
            }
            let (a, ac) = (dast.a_start[n] as usize, dast.a_count[n] as usize);
            let limit = if dast.kind[n] == NodeKind::Macro as u8 {
                n_path
            } else {
                n_attrs
            };
            if a + ac > limit {
                return Err(bad("attribute or path range out of range"));
            }
        }
        for a in 0..n_attrs {
            if dast.attr_c_start[a] as usize + dast.attr_c_count[a] as usize > n_children {
                return Err(bad("attribute child range out of range"));
            }
        }
        for p in 0..n_path {
            if dast.path_i_start[p] as usize + dast.path_i_count[p] as usize > n_index {
                return Err(bad("path index range out of range"));
            }
        }
        for i in 0..n_index {
            if dast.idx_c_start[i] as usize + dast.idx_c_count[i] as usize > n_children {
                return Err(bad("index child range out of range"));
            }
        }
        Ok(dast)
    }

    /// Serialize to the binary wire format (used by tests and tooling).
    pub fn to_binary(&self) -> Vec<u8> {
        let mut out = Vec::with_capacity(64 + self.strings.bytes.len() + self.len() * 24);
        out.extend_from_slice(b"CDST");
        for v in [
            2u32,
            self.strings.len() as u32,
            self.strings.bytes.len() as u32,
            self.len() as u32,
            self.attr_name.len() as u32,
            self.children.len() as u32,
            self.path.len() as u32,
            self.idx_c_start.len() as u32,
        ] {
            out.extend_from_slice(&v.to_le_bytes());
        }
        let u32s = |out: &mut Vec<u8>, v: &[u32]| {
            for x in v {
                out.extend_from_slice(&x.to_le_bytes())
            }
        };
        u32s(&mut out, &self.strings.offsets);
        out.extend_from_slice(&self.strings.bytes);
        while out.len() % 4 != 0 {
            out.push(0);
        }
        out.extend_from_slice(&self.kind);
        while out.len() % 4 != 0 {
            out.push(0);
        }
        for v in [
            &self.str_,
            &self.a_start,
            &self.a_count,
            &self.c_start,
            &self.c_count,
            &self.attr_name,
            &self.attr_c_start,
            &self.attr_c_count,
            &self.children,
            &self.path,
            &self.path_i_start,
            &self.path_i_count,
            &self.idx_c_start,
            &self.idx_c_count,
        ] {
            u32s(&mut out, v);
        }
        out
    }
}

struct Reader<'a> {
    b: &'a [u8],
    pos: usize,
}

impl<'a> Reader<'a> {
    fn u32(&mut self) -> u32 {
        let v = u32::from_le_bytes(self.b[self.pos..self.pos + 4].try_into().unwrap());
        self.pos += 4;
        v
    }
    fn u32s(&mut self, n: usize) -> Vec<u32> {
        let mut v = Vec::with_capacity(n);
        for chunk in self.b[self.pos..self.pos + n * 4].chunks_exact(4) {
            v.push(u32::from_le_bytes(chunk.try_into().unwrap()));
        }
        self.pos += n * 4;
        v
    }
    fn bytes(&mut self, n: usize) -> &'a [u8] {
        let s = &self.b[self.pos..self.pos + n];
        self.pos += n;
        s
    }
    fn align4(&mut self) {
        self.pos = self.pos.div_ceil(4) * 4;
    }
}
