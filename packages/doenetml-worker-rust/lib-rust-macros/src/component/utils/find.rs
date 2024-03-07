use syn::{
    visit::{visit_item_enum, visit_item_mod, visit_item_struct, Visit},
    ItemEnum, ItemMod, ItemStruct,
};

struct EnumVisitor {
    pub enums: Vec<ItemEnum>,
}

impl<'ast> Visit<'ast> for EnumVisitor {
    fn visit_item_enum(&mut self, i: &'ast ItemEnum) {
        self.enums.push(i.clone());
        visit_item_enum(self, i);
    }
}

/// Find all enums that are listed in the module.
pub fn find_enums_in_module(module: &ItemMod) -> Vec<ItemEnum> {
    let mut visitor = EnumVisitor { enums: vec![] };
    visit_item_mod(&mut visitor, module);
    visitor.enums
}

struct StructVisitor {
    pub structs: Vec<ItemStruct>,
}

impl<'ast> Visit<'ast> for StructVisitor {
    fn visit_item_struct(&mut self, i: &'ast syn::ItemStruct) {
        self.structs.push(i.clone());
        visit_item_struct(self, i);
    }
}

///// Find all structs that are listed in the module.
//pub fn find_structs_in_module(module: &syn::ItemMod) -> Vec<syn::ItemStruct> {
//    let mut visitor = StructVisitor { structs: vec![] };
//   visit_item_mod(&mut visitor, &module);
//    visitor.structs
//}
