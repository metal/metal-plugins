'use strict';

import About from './About';
import Component from 'metal-component';
import Home from './Home';
import Router from '../../src/all/router.js';
import './Image.soy.js';

// Routing from JavaScript -----------------------------------------------------

let Basic = {
	run() {
		Component.render(Router, {
			element: '#main > div',
			fetch: true,
			fetchUrl: '/demos/data.json',
			path: '/demos/basic',
			component: Home,
		});

		Component.render(Router, {
			async: true,
			element: '#main > div',
			path: '/demos/basic/home-page',
			component: () =>
				new Promise(res => {
					setTimeout(() => {
						res(Home);
					}, 1000);
				}),
			data: {
				title: 'Home Page Delayed',
			},
		});

		Component.render(Router, {
			element: '#main > div',
			path: '/demos/basic/about/:name(\\w+)?',
			component: About,
			data: {
				title: 'About',
			},
		});

		Component.render(Router, {
			element: '#main > div',
			path: '/demos/basic/about-delayed',
			component: About,
			data: function() {
				return new Promise(resolve =>
					setTimeout(() => resolve({title: 'About Delayed'}), 2000)
				);
			},
		});

		// Dispatch router to the current browser url ----------------------------------

		Router.router().dispatch();
	},
};

export default Basic;
