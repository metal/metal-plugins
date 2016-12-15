'use strict';

import { core, object } from 'metal';
import JSXComponent from 'metal-jsx';

const defaultMapStateToProps = () => ({});
const defaultMapDispatchToProps = dispatch => ({
	dispatch
});
const defaultMergeProps = (stateProps, dispatchProps, parentProps) => {
	return object.mixin({}, stateProps, dispatchProps, parentProps);
};
const wrapActionCreators = actionCreators => {
	return dispatch => Object.keys(actionCreators).reduce(
		(props, key) => {
			props[key] = (...args) => dispatch(actionCreators[key](...args));
			return props;
		},
		{}
	);
};

/**
 * Connects the given `Component` to the flux store it receives, updating it
 * when the store state changes. Also provides helpers for specifying exactly
 * which part of the state the component cares about, as well as abstracting
 * calls to `store.dispatch`.
 * This is based on the similar helper built for React on the react-redux
 * project, which can be accessed here: https://github.com/reactjs/react-redux.
 * @param {function(!Object)=} mapStoreStateToProps An optional function that
 *     receives the current store state and returns an object with the props
 *     data that should be used by the component. If this param isn't given,
 *     the default behavior won't pass any store state data to the component.
 * @param {Object.<string, function>|function(!function())=} mapDispatchToProps
 *     An optional function or object that maps action creators to the store's
 *     `dispatch` function. If it is a function, it receives the store's
 *     `dispatch` function, the component's props, and returns an object with
 *     props data that should be used by the component. If it is an object,
 *     each value is assumed to be an action creator, which will automatically
 *     be wrapped by the `dispatch` function so that they can be invoked
 *     directly. If this param isn't given, the default behavior will be pass
 *     the `dispatch` function itself to the props object.
 * @param {function(!Object, !Object, !Object)=} An optional function that
 *     receives all three original props objects (the one built from store
 *     state, the one build from the dispatch function and the one from the
 *     parent), and merges them. By default a simple merge is done.
 * @param {Object=} options An optional options object. Available options are:
 *       - {boolean} pure: Flag indicating if the component is a "pure"
 *         component. That means that it only depends on the specified store
 *         state and the props received from the parent. If "true", this data
 *         will be shallowly compared on `shouldUpdate`. Defaults to "true".
 * @return {!function(!Function)} A function that should be called with a
 *     component constructor, and returns another component constructor that
 *     wraps it, adding to it the helper behaviors provided by this module.
 */
function connect(mapStoreStateToProps, mapDispatchToProps, mergeProps, options = {}) {
	const shouldSubscribe = !!mapStoreStateToProps;
	mapStoreStateToProps = mapStoreStateToProps || defaultMapStateToProps;
	mergeProps = mergeProps || defaultMergeProps;
	const {pure = true} = options;

	const mapDispatchIsFunc = core.isFunction(mapDispatchToProps);
	if (!mapDispatchIsFunc && core.isObject(mapDispatchToProps)) {
		mapDispatchToProps = wrapActionCreators(mapDispatchToProps);
	} else if (!mapDispatchIsFunc) {
		mapDispatchToProps = defaultMapDispatchToProps;
	}

	const mapStateDependsOnProps = mapStoreStateToProps.length !== 1;
	const mapDispatchDependsOnProps = mapDispatchToProps.length !== 1;

	return function(WrappedComponent) {
		class Connect extends JSXComponent {
			/**
			 * @inheritDoc
			 */
			constructor(opt_props, opt_parentElement) {
				super(opt_props, opt_parentElement);
				this.hasStorePropsChanged_ = false;
				this.hasOwnPropsChanged_ = false;
			}

			/**
			 * Lifecycle. Unsubscribes from the store's state changes.
			 */
			detached() {
				if (this.unsubscribeStore_) {
					this.unsubscribeStore_();
					this.unsubscribeStore_ = null;
				}
			}

			/**
			 * Returns the full props data that should be passed to the wrapped
			 * component.
			 * @return {!object}
			 * @protected
			 */
			getChildProps_() {
				this.storeProps_ = this.getStoreProps_(this.state.storeState);

				return object.mixin(
					mergeProps(
						this.storeProps_,
						this.getDispatchProps_(),
						this.props
					),
					{
						ref: 'child'
					}
				);
			}

			/**
			 * Returns the wrapped dispatch props that should be passed to the
			 * wrapped component.
			 * @return {!object}
			 * @protected
			 */
			getDispatchProps_() {
				if (!this.wasRendered ||
					(mapDispatchDependsOnProps && this.hasOwnPropsChanged_)) {
					this.dispatchProps_ = mapDispatchToProps(
						this.getStore().dispatch,
						this.props
					);
				}
				return this.dispatchProps_;
			}

			/**
			 * Gets the redux store currently being used by this component.
			 * @return {!Object}
			 */
			getStore() {
				const store = this.props.store || this.context.store;
				if (!store) {
					throw new Error(
						'Could not find "store" either in "context" or "props". Either ' +
						'pass your component inside "Provider" or explicitly pass the ' +
						'store via props to this component.'
					);
				}
				return store;
			}

			/**
			 * Returns the props data built from the store state, that should be
			 * passed to the wrapped component.
			 * @param {bool} storeState
			 * @return {!object}
			 * @protected
			 */
			getStoreProps_(storeState) {
				let {storeProps_} = this;
				if (!this.wasRendered ||
					storeState !== this.state.storeState ||
					(mapStateDependsOnProps && this.hasOwnPropsChanged_)) {
					storeProps_ = mapStoreStateToProps(storeState, this.props);
				}
				return storeProps_;
			}

			/**
			 * Handles a store state change. Make sure to only update the wrapped
			 * component if at least one of its props data changed.
			 * @protected
			 */
			handleStoreChange_() {
				const storeState = this.getStore().getState();

				const {storeProps_} = this;
				const newStoreProps = this.getStoreProps_(storeState);

				if (newStoreProps && !object.shallowEqual(storeProps_, newStoreProps)) {
					this.hasStorePropsChanged_ = true;
					this.storeProps_ = newStoreProps;
				}

				this.state.storeState = storeState;
			}

			/**
			 * Lifecycle. Runs when props values have changed.
			 * @param {!Object} prevVal
			 * @protected
			 */
			propsChanged(prevVal) {
				if (pure) {
					this.hasOwnPropsChanged_ = !object.shallowEqual(prevVal, this.props);
				}
			}

			/**
			 * Renders the wrapped component with the appropriate data.
			 */
			render() {
				if (shouldSubscribe && !this.unsubscribeStore_) {
					this.unsubscribeStore_ = this.getStore().subscribe(
						this.handleStoreChange_.bind(this)
					);
				}

				return <WrappedComponent {...this.getChildProps_()} />;
			}

			/**
			 * Lifecycle. Resets the flags indicating that data has changed.
			 */
			rendered() {
				this.hasStorePropsChanged_ = false;
				this.hasOwnPropsChanged_ = false;
			}

			/**
			 * Checks if the component should be rerendered. If the component is
			 * "pure" then it shouldn't be updated if its data hasn't changed.
			 * @return {boolean}
			 */
			shouldUpdate() {
				return !pure || this.hasStorePropsChanged_ || this.hasOwnPropsChanged_;
			}
		}
		Connect.STATE = {
			storeState: {
				valueFn: function() {
					return this.getStore().getState();
				}
			}
		};
		return Connect;
	};
}

export default connect;
