import {
    RecoilState,
    SetterOrUpdater,
    useSetRecoilState as _useSetRecoilState,
    useRecoilCallback as _useRecoilCallback,
    CallbackInterface,
} from "recoil";
import { ComponentInfo, mainSlice, useAppDispatch } from ".";

type SetRecoilState<T> = SetterOrUpdater<T>;

/**
 * Compat layer to use Redux instead of Recoil to set state.
 */
export const useSetRecoilState = <T>(args: RecoilState<T>) => {
    const _setter = _useSetRecoilState(args);

    const setter: SetRecoilState<T> = (newValue: T | ((prevValue: T) => T)) => {
        //console.log("Asked to update Recoil state", args, newValue);

        // XXX: Right now this is using Recoil under the hood
        _setter(newValue);
    };
    return setter;
};

/**
 * Compat layer to use Redux instead of Recoil to set state.
 */
export function useRecoilCallback<Args extends ReadonlyArray<unknown>, Return>(
    fn: (int: CallbackInterface) => (...args: Args) => Return,
): (...args: Args) => Return {
    const dispatch = useAppDispatch();

    const _peekCallback = _useRecoilCallback(
        ({ snapshot: _snapshot, set: _set }) => {
            // Wrap the _snapshot and _set calls
            // We are not including everything that is needed, only what is used in DoenetML
            return fn({
                snapshot: _snapshot,
                set: (
                    recoilValue: RecoilState<ComponentInfo>,
                    valOrUpdater:
                        | ComponentInfo
                        | ((currVal: ComponentInfo) => ComponentInfo),
                ) => {
                    //console.log(
                    //    "Asked* to set value",
                    //    recoilValue,
                    //    valOrUpdater,
                    //    _snapshot,
                    //);
                    let value = valOrUpdater;
                    if (typeof valOrUpdater === "function") {
                        value = valOrUpdater(
                            _snapshot.getLoadable(recoilValue).contents,
                        );
                    }

                    dispatch(
                        mainSlice.actions.setComponentInfo({
                            key: recoilValue.key,
                            componentInfo: value as ComponentInfo,
                        }),
                    );

                    // XXX: Right now this is using Recoil under the hood
                    _set(recoilValue, valOrUpdater);
                },
            } as CallbackInterface);
        },
    );
    return (...args: Args) => {
        //console.log("Creating updater for Recoil state", args);
        return _peekCallback(...args);
    };
}
