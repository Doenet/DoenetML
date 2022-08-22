use evalexpr::{build_operator_tree, HashMapContext, ContextWithMutableVariables};

use crate::{component::ObjectName};


#[derive(Debug, Clone, PartialEq)]
pub struct MathExpression {
    pub tree: evalexpr::Node, // Expression
    pub variable_prefix: String, // Expression prefix
    pub external_variables_count: usize,
}


impl MathExpression {
    pub fn new(object_names: &Vec<ObjectName>) -> Self {

        let string_index_sources_concatted = object_names.iter()
        .filter_map(|obj| {
            if let ObjectName::String(str_obj) = obj {
                Some(str_obj.as_str())
            } else {
                None
            }
        })
        .collect::<Vec<&str>>()
        .join(" ");

        let mut variable_prefix = String::from("var");
        loop {
            if !string_index_sources_concatted.contains(&variable_prefix) {
                break;
            } else {
                variable_prefix.push('#');
            }
        };

        let mut expression_string = String::new();
        let mut var_postfix_counter = 0;

        for object_name in object_names {
            match object_name {
                ObjectName::String(str_obj) => {
                    expression_string.push_str(&str_obj);
                },
                ObjectName::Component(_) => {
                    let var_name = &format!("{}{}", variable_prefix, var_postfix_counter);

                    expression_string.push_str(&var_name);
                    // variable_components.push(comp_name_obj);
                    // sample_expr_context.set_value(var_name.into(), 0.into()).unwrap();

                    var_postfix_counter += 1;
                }
            }
        }

        // log_debug!("Building expression tree from '{}'", expression_string);

        let tree = build_operator_tree(&expression_string).unwrap();
        let external_variables_count = var_postfix_counter;

        MathExpression { tree, variable_prefix, external_variables_count }

        // log_debug!("Expression tree {:#?} \nwith variables {:#?}", expression, variable_components);
    }



    pub fn can_evaluate_to_number(&self) -> bool {

        let mut sample_context = HashMapContext::new();
        for i in 0..self.external_variables_count {
            let var_name = format!("{}{}", self.variable_prefix, i);
            sample_context.set_value(var_name.into(), 0.into()).unwrap();
        }

        match self.tree.eval_with_context(&sample_context) {
            Ok(_) => true,
            Err(_) => false
        }
    }

    // pub fn evaluate_number_with_values(&self, values: &Vec<StateVarValue>) -> f64 {
        
    // }

}



impl From<f64> for MathExpression {
    fn from(input: f64) -> Self {
        MathExpression {
            tree: build_operator_tree(&input.to_string()).unwrap(),
            variable_prefix: String::new(),
            external_variables_count: 0,
        }
    }
}







impl serde::Serialize for MathExpression {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
        where
            S: serde::Serializer {

        let expr_as_string = self.tree.to_string();
        expr_as_string.serialize(serializer)
    }
}
