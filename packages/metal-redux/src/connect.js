'use strict';

import { core, object } from 'metal';
import Component from 'metal-component';
import IncrementalDomRenderer from 'metal-incremental-dom';

const defaultMapStateToProps = () => ({});
const defaultMapDispatchToProps = dispatch => ({ dispatch });
const defaultMergeConfig = (stateConfig, dispatchConfig, parentConfig) => {
	return object.mixin({}, stateConfig, dispatchConfig, parentConfig);
};
const wrapActionCreators = actionCreators => {
	return dispatch => Object.keys(actionCreators).reduce(
		(config, key) => {
			config[key] = (...args) => dispatch(actionCreators[key](...args));
			return config;
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
 * @param {function(!Object)=} mapStoreStateToConfig An optional function that
 *     receives the current store state and returns an object with the config
 *     data that should be used by the component. If this param isn't given,
 *     the default behavior won't pass any store state data to the component.
 * @param {Object.<string, function>|function(!function())=} mapDispatchToConfig
 *     An optional function or object that maps action creators to the store's
 *     `dispatch` function. If it is a function, it receives the store's `dispatch`
 *     function and returns an object with config data that should be used by the
 *     component. If it is an object, each value is assumed to be an action creator,
 *     which will automaitcally be wrapped by the `dispatch` function so that they
 *     can be invoked directly. If this param isn't given, the default behavior will
 *     pass the `dispatch` function itself to the config object.
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
	mergeConfig = mergeConfig || defaultMergeConfig;
	var { pure = true } = options;

	var mapDispatchIsFunc = core.isFunction(mapDispatchToConfig);
	if (!mapDispatchIsFunc && core.isObject(mapDispatchToConfig)) {
		mapDispatchToConfig = wrapActionCreators(mapDispatchToConfig);
	} else if (!mapDispatchIsFunc) {
		mapDispatchToConfig = defaultMapDispatchToProps;
	}

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
					this.config
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
				this.storeState = storeState;
				if (!object.shallowEqual(prevStoreConfig, storeConfig)) {
					this.hasStoreConfigChanged_ = true;
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

				var args = [WrappedComponent, null, []];
				this.addToArray_(args, this.getChildConfig_());
				IncrementalDOM.elementVoid.apply(null, args);
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
		Connect.RENDERER = IncrementalDomRenderer;
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
