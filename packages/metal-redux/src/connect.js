'use strict';

import { object } from 'metal';
import Component from 'metal-component';
import IncrementalDomRenderer from 'metal-incremental-dom';

const defaultMapStateToProps = () => ({});
const defaultMapDispatchToProps = dispatch => ({ dispatch });
const defaultMergeConfig = (stateConfig, dispatchConfig, parentConfig) => {
	return object.mixin({}, stateConfig, dispatchConfig, parentConfig);
};

/**
 * Connects the given `Component` to the flux store it receives, updating it
 * when the store state changes. Also provides helpers for specifying exactly
 * which part of the state the component cares about, as well as abstracting
 * calls to `store.dispatch`.
 * This is based on the similar helper built for React on the react-redux
 * project, which can be accessed here: https://github.com/reactjs/react-redux.
 * @param {function(!Object)=} mapStoreStateToConfig An optional function that
 *     receives the current store state and returns an object with the config
 *     data that should be used by the component. If this param isn't given,
 *     the default behavior won't pass any store state data to the component.
 * @param {function(!function())=} mapDispatchToConfig An optional function that
 *     receives the store's `dispatch` function and returns an object with
 *     config data that should be used by the component. If this param isn't
 *     given, the default behavior will pass the `dispatch` function itself to
 *     the config object.
 * @param {function(!Object, !Object, !Object)=} An optional function that
 *     recevies all three original config objects (the one built from store
 *     state, the one build from the dispatch function and the one from the
 *     parent), and merges them. By default a simple merge is done.
 * @param {Object=} options An optional options object. Available options are:
 *       - {boolean} pure: Flag indicating if the component is a "pure"
 *         component. That means that it only depends on the specified store
 *         state and the config received from the parent. If "true", this data
 *         will be shallowly compared on `shouldUpdate`. Defaults to "true".
 * @return {!function(!Function)} A function that should be called with a
 *     component constructor, and returns another component constructor that
 *     wraps it, adding to it the helper behaviors provided by this module.
 */
function connect(mapStoreStateToConfig, mapDispatchToConfig, mergeConfig, options = {}) {
	var shouldSubscribe = !!mapStoreStateToConfig;
	mapStoreStateToConfig = mapStoreStateToConfig || defaultMapStateToProps;
	mapDispatchToConfig = mapDispatchToConfig || defaultMapDispatchToProps;
	mergeConfig = mergeConfig || defaultMergeConfig;
	var { pure = true } = options;

	return function(WrappedComponent) {
		class Connect extends Component {
			/**
			 * @inheritDoc
			 */
			constructor(opt_config, opt_parentElement) {
				super(opt_config, opt_parentElement);
				this.hasStoreConfigChanged_ = false;
				this.hasOwnConfigChanged_ = false;
			}

			/**
			 * Lifecycle. Subscribes to the store's state changes.
			 */
			attached() {
				if (shouldSubscribe) {
					this.unsubscribeStore_ = this.getStore().subscribe(
						this.handleStoreChange_.bind(this)
					);
				}
			}

			/**
			 * Lifecycle. Runs when a new config value has been set.
			 * @param {!Object} newVal
			 * @param {!Object} prevVal
			 * @protected
			 */
			configChanged(newVal, prevVal) {
				if (pure) {
					this.hasOwnConfigChanged_ = !object.shallowEqual(prevVal, newVal);
				}
			}

			/**
			 * Overrides the default renderer creation.
			 * @return {!ConnectRenderer}
			 * @override
			 */
			createRenderer() {
				return new ConnectRenderer(this, WrappedComponent);
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
			 * Returns the full config data that should be passed to the wrapped
			 * component.
			 * @param {!Object}
			 * @protected
			 */
			getChildConfig_() {
				return object.mixin(
					mergeConfig(
						this.config,
						this.getStoreConfig_(this.storeState),
						mapDispatchToConfig(this.getStore().dispatch)
					),
					{
						ref: 'child'
					}
				);
			}

			/**
			 * Gets the redux store currently being used by this component.
			 * @return {!Object}
			 */
			getStore() {
				var store = this.config.store || this.context.store;
				if (!store) {
					throw new Error(
						'Could not find "store" either in "context" or "config". Either ' +
						'your component inside "Provider" or explicitly pass the store ' +
						'via config to this component.'
					);
				}
				return store;
			}

			/**
			 * Returns the config data built from the store state, that should be
			 * passed to the wrapped component.
			 * @param {!Object}
			 * @protected
			 */
			getStoreConfig_(storeState) {
				this.storeConfig_ = mapStoreStateToConfig(
					storeState,
					this.components.child ? this.components.child.config : {}
				);
				return this.storeConfig_;
			}

			/**
			 * Handles a store state change. Make sure to only update the wrapped
			 * component if at least one of its config data changed.
			 * @protected
			 */
			handleStoreChange_() {
				var storeState = this.getStore().getState();
				var prevStoreConfig = this.storeConfig_;
				var storeConfig = this.getStoreConfig_(storeState);
				if (object.shallowEqual(prevStoreConfig, storeConfig)) {
					return;
				}
				this.hasStoreConfigChanged_ = true;
				this.storeState = storeState;
			}

			/**
			 * Lifecycle. Resets the flags indicating that data has changed.
			 */
			rendered() {
				this.hasStoreConfigChanged_ = false;
				this.hasOwnConfigChanged_ = false;
			}

			/**
			 * Checks if the component should be rerendered. If the component is
			 * "pure" then it shouldn't be updated if its data hasn't changed.
			 * @return {boolean}
			 */
			shouldUpdate() {
				return !pure || this.hasStoreConfigChanged_ || this.hasOwnConfigChanged_;
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

/**
 * The renderer used by the components returned by `connect`.
 */
class ConnectRenderer extends IncrementalDomRenderer {
	/**
	 * @inheritDoc
	 */
	constructor(comp, childCtor) {
			super(comp);
			this.childCtor_ = childCtor;
	}

	/**
	 * Adds the given config object to the specified array, so they can be passed
	 * as arguments to incremental dom calls.
	 * @param {!Array}
	 * @param {!Object}
	 * @protected
	 */
	addToArray_(arr, config) {
		var keys = Object.keys(config);
		for (var i = 0; i < keys.length; i++) {
			arr.push(keys[i], config[keys[i]]);
		}
	}

	/**
	 * Overrides the default method from `IncrementalDomRenderer` to render the
	 * wrapped component with the appropriate data.
	 */
	renderIncDom() {
		var args = [this.childCtor_, null, []];
		this.addToArray_(args, this.component_.getChildConfig_());
		IncrementalDOM.elementVoid.apply(null, args);
	}
}

export default connect;
