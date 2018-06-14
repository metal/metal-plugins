/**
 * This script is used to link all binaries that are missing in one of node_modules from
 * a package in monorepo creating a symlink to node_modules/.bin folder from the workspace root.
 * https://github.com/yarnpkg/yarn/issues/4503
 */
const {readdir, access} = require('fs');
const {promisify} = require('util');
const {resolve} = require('path');
const shell = require('shelljs');
const {map} = require('ramda');

const asyncReaddir = promisify(readdir);
const asyncAccess = promisify(access);

const packagesDir = resolve(__dirname, '../packages');
const rootDir = resolve(__dirname, '../');

function linkBinaries(_package, nodeModulePath) {
	console.log('linking binaries in ', _package);
	shell.mkdir(nodeModulePath);
	shell.exec(`ln -s ${rootDir}/node_modules/.bin ${nodeModulePath}/.bin`);
}

async function perform() {
	const packages = await asyncReaddir(packagesDir);

	const result = map(async _package => {
		const nodeModulePath = resolve(
			packagesDir,
			`./${_package}`,
			'./node_modules'
		);
		try {
			return await asyncAccess(nodeModulePath);
		} catch (e) {
			if (e.code === 'ENOENT') {
				linkBinaries(_package, nodeModulePath);
				return;
			}
			throw e;
		}
	}, packages);
	return Promise.all(result);
}

const successHandler = () => {
	console.log('Binaries linked !');
	process.exit(0);
};

const errorHandler = err => {
	console.error(err);
	process.exit(1);
};

perform().then(successHandler, errorHandler);
