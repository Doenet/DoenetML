Y Y N | Y Y N fn mark_stale(&self)
Y Y N | Y Y N fn set_as_resolved(&self)
Y Y Y | Y Y Y fn get_freshness(&self) -> Freshness
Y ? N | Y Y N fn mark_fresh(&self)
Y Y Y | Y Y Y fn came_from_default(&self) -> bool
? Y N | ? Y N fn set_value_to_requested_value(&self)
? ? Y | ? Y Y fn check_if_changed_since_last_viewed(&self) -> bool
? ? Y | ? Y Y fn record_viewed(&mut self)


StateVarMethods
StateVarMutMethods

StateVarTypedMethods
StateVarTypedMutMethods

StateVarUntypedMethods
StateVarUntypedMutMethods



Y Y Y | _ _ _ fn create_new_read_only_view(&self) -> StateVarReadOnlyViewEnum
Y Y Y | _ _ _ fn get(&self) -> StateVarValue
Y ? ? | _ _ _ fn set_requested_value(&self, requested_val: StateVarValue) 
Y N N | _ _ _ fn default(&self) -> StateVarValue

_ _ _ | Y Y Y fn create_new_read_only_view(&self) -> StateVarReadOnlyView<T>
_ _ _ | ? Y Y fn get_value_record_viewed<'a>(&'a mut self) -> impl Deref<Target = T> + 'a
_ _ _ | Y Y Y fn get<'a>(&'a self) -> impl Deref<Target = T> + 'a
_ _ _ | ? Y Y fn try_get_last_value<'a>(&'a self) -> Option<impl Deref<Target = T> + 'a>
_ _ _ | Y Y N fn set_value(&self, new_val: T)
_ _ _ | Y Y N fn set_value_from_default(&self, new_val: T, came_from_default: bool)
_ _ _ | Y Y Y fn set_requested_value(&self, requested_val: T)
_ _ _ | ? Y Y fn get_requested_value<'a>(&'a self) -> impl Deref<Target = T> + 'a 
_ _ _ | Y N N fn default(&self) -> T



Move these bookkeeping variables to inner so that they can be viewed anywhere
(Too confusing why they are just on the full state variable, especially since folks might not know what that means.)
Y N N | Y N N fn get_name(&self) -> &'static str
Y N N | Y N N fn get_for_renderer(&self) -> bool
Y N N | Y N N fn get_is_public(&self) -> bool

Y N N | Y N N fn check_if_any_dependency_changed_since_last_viewed(&self) -> bool
Y N N | Y N N fn record_all_dependencies_viewed(&mut self)

Specific to the full state variables (typing independent)
Y N N | Y N N fn return_dependency_instructions(&self, extending: Option<&ExtendSource>) -> Vec<DependencyInstruction>
Y N N | Y N N fn save_dependencies(&mut self, dependencies: &Vec<DependenciesCreatedForInstruction>)
Y N N | Y N N fn calculate_state_var_from_dependencies_and_mark_fresh(&self)
Y N N | Y N N fn invert(
  &self,
  is_direct_change_from_action: bool,
) -> Result<Vec<DependencyValueUpdateRequest>, ()> 


N Y N | ? Y ? fn new_with_value(sv_val: StateVarValue, came_from_default: bool) -> Self

_ _ _ | ? Y ? fn new_with_value(val: T, came_from_default: bool) -> Self

pub struct TextInputRenderState {
  pub id: usize,

  pub immediate_value: String,
}

pub enum TextInputAction {
  UpdateImmediateValue,
  UpdateValue,
}