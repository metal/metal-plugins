'use strict';

import { object } from 'metal';
import Component from 'metal-component';
import IncrementalDomRenderer from 'metal-incremental-dom';

const defaultMapStateToProps = () => ({});
const defaultMapDispatchToProps = dispatch => ({ dispatch });

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
 * @return {!function(!Function)} A function that should be called with a
 *     component constructor, and returns another component constructor that
 *     wraps it, adding to it the helper behaviors provided by this module.
 */
function connect(mapStoreStateToConfig, mapDispatchToConfig) {
	mapStoreStateToConfig = mapStoreStateToConfig || defaultMapStateToProps;
	mapDispatchToConfig = mapDispatchToConfig || defaultMapDispatchToProps;

	return function(WrappedComponent) {
		class Connect extends Component {
			/**
			 * Lifecycle. Subscribes to the store's state changes.
			 */
			attached() {
				this.unsubscribeStore_ = this.getStore().subscribe(
					this.handleStoreChange_.bind(this)
				);
			}

			/**
			 * Lifecycle. Unsubscribes from the store's state changes.
			 */
			detached() {
				this.unsubscribeStore_();
				this.unsubscribeStore_ = null;
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
			 * Returns the full config data that should be passed to the wrapped
			 * component.
			 * @param {!Object}
			 * @protected
			 */
			getChildConfig_() {
				return object.mixin(
					{},
					this.config,
					this.getChildStoreStateConfig_(this.storeState),
					mapDispatchToConfig(this.getStore().dispatch)
				);
			}

			/**
			 * Returns the config data built from the store state, that should be
			 * passed to the wrapped component.
			 * @param {!Object}
			 * @protected
			 */
			getChildStoreStateConfig_(storeState) {
				this.childConfig_ = mapStoreStateToConfig(storeState);
				return this.childConfig_;
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
			 * Handles a store state change. Make sure to only update the wrapped
			 * component if at least one of its config data changed.
			 * @protected
			 */
			handleStoreChange_() {
				var storeState = this.getStore().getState();
				var prevChildConfig = this.childConfig_;
				var childConfig = this.getChildStoreStateConfig_(storeState);
				if (object.shallowEqual(prevChildConfig, childConfig)) {
					return;
				}
				this.storeState = storeState;
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
