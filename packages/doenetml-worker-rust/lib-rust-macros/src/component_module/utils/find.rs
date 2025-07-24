use quote::format_ident;
use syn::{
    ItemEnum,
    ItemMod,
    //   visit::{visit_item_enum, visit_item_mod, Visit},
    parse_quote,
    visit_mut::{VisitMut, visit_item_enum_mut, visit_item_mod_mut},
};

struct EnumVisitor {
    pub enums: Option<ItemEnum>,
    pub name: &'static str,
}

impl VisitMut for EnumVisitor {
    fn visit_item_enum_mut(&mut self, found_enum: &mut ItemEnum) {
        if found_enum.ident == self.name {
            self.enums = Some(found_enum.clone());

            // Remove the enum from the module
            // TODO: This is a bit of a hack. We replace the enum with an empty enum of a dummy name.
            // There should be a better way to remove the enum from the module.
            let dummy_name =
                format_ident!("__{}_WasConsumedByMacro_IgnoreThisRemanent__", self.name);

            *found_enum = parse_quote!(
                #[allow(unused, non_camel_case_types)]
                enum #dummy_name {}
            );
        } else {
            visit_item_enum_mut(self, found_enum);
        }
    }
}

/// Finds the first enum named `name` in the module and removes them from the module,
/// returning the found enum.
pub fn extract_enum_in_module(module: &mut ItemMod, name: &'static str) -> Option<ItemEnum> {
    let mut visitor = EnumVisitor { enums: None, name };
    visit_item_mod_mut(&mut visitor, module);
    visitor.enums
}

//struct StructVisitor {
//    pub structs: Vec<ItemStruct>,
//}
//
//impl<'ast> Visit<'ast> for StructVisitor {
//    fn visit_item_struct(&mut self, i: &'ast syn::ItemStruct) {
//        self.structs.push(i.clone());
//        visit_item_struct(self, i);
//    }
//}
//
///// Find all structs that are listed in the module.
//pub fn find_structs_in_module(module: &syn::ItemMod) -> Vec<syn::ItemStruct> {
//    let mut visitor = StructVisitor { structs: vec![] };
//   visit_item_mod(&mut visitor, &module);
//    visitor.structs
//}

#[cfg(test)]
mod test {
    use super::*;
    use quote::quote;

    #[test]
    fn test_extract_enum_in_module_removes_enums() {
        let mut module = syn::parse2(quote! {
            mod test {
                pub enum Bla {
                    ABC
                }
                pub enum Test {
                    XYZ
                }
            }
        })
        .unwrap();

        let found_enum = extract_enum_in_module(&mut module, "Test").unwrap();
        assert_eq!(&found_enum.ident, "Test");

        // It's been removed from the tree
        let found_enum = extract_enum_in_module(&mut module, "Test");
        assert!(found_enum.is_none());

        // The enum `Bla` should still be in the module
        let found_enum = extract_enum_in_module(&mut module, "Bla");
        assert_eq!(found_enum.unwrap().ident, "Bla");
    }
}
