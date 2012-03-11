OVERVIEW
--------

Gravity.js is a development tool that simplifies working on complex JS projects.

Often when deploying JS components, you want to compile a multitude of source
files down to a single build result.  The benefits of doing this include faster
performance from the client perspective (due to fewer http hits to load
scripts), and potentially simpler integration by the developer integrating your
component. Gravity was specifically designed to ease this process.

In your code project, define a JSON file called `gravity.map`:

	{
		"final.js": [
			"src/1.js",
			"src/2.js",
			...
		]
	}

This tells gravity that you want a build product called `final.js`, and that it
should be the result of concatenating various source files (or even other build
products) together.


INSTALLING FROM CODESCRIPTS
---------------------------

The gravity project can just be cloned and run using node:

	node path/to/gravity.js <command> <dir> <args>

However, it's nicer to use when aliased to just `gravity`:

	gravity <command> <dir> <args>

The easiest way to achieve this is to install the codescripts collection:
https://github-ca.corp.zynga.com/ccampbell/codescripts


BASIC COMMANDS
--------------

During development, then, you can run gravity as a local server that will
perform on-the-fly concatenation of your source.  In your project dir, run:

	gravity serve .

The server should find an available local port to attach to, and will announce
itself:

	Gravity server running on http://127.0.0.1:1337/

Now you can visit http://127.0.0.1:1337/final.js to see the results.  Edit a
source file, then refresh the page to see the change instantly!

Come build time, run a command like this:

	gravity build . <outdir>

Gravity will take only your build targets and put them into `<outdir>`.

If you just want to see a specific build target, you can do this:

	gravity get . final.js


USING TEMPORARY BUILD PRODUCTS
------------------------------

Temporary build products are indicated with a tilde (~) at the beginning of the
build target name.  They are not part of the final build result, but they can be
used as inputs to final build products.

Use gravity to create localized components.  Assuming you've got localized
strings in individual files under a `strings` dir, you can define
locale-specific build targets that make use of an intermediary build target
containing all of the business logic / UI code, etc.

	{
		"~engine.js": [
			"src/utils.js",
			"src/controller.js",
			"src/ui.js",
			"src/api.js",
			"src/glue.js",
			...
		],

		"engine-en_US.js": [
			"strings/en_US.js",
			"~engine.js"
		],

		"engine-es_ES.js": [
			"strings/es_ES.js",
			"~engine.js"
		],

		...
	}

In the above example, `~engine.js` is a temporary build product, meaning it will
not be placed into `<outdir>` or served up at a URL.  However, it defines a
common constituent to the final build products (`engine-<locale>.js`).

Now, with a minimum of fuss, you have nice tight bundles of localized JS
goodness.


USING LITERALS
--------------

Literals are strings that get put into the build product verbatim, rather than
referring to a source file or url.  Literals always begin with an equals sign
(which is omitted from the result).

They are useful for inserting one-liner comments or scoping functions, etc.

	{
		"encapsulated.js": [
			"=// Encapsulate some assorted modules",
			"=(function () {",
			"src/1.js",
			"src/2.js",
			...
			"=}());"
		]
	}


CONVERTING CSS TO JS
--------------------

You can include a CSS file in your composition of a JS file.  If you do, the CSS
will be converted to JavaScript using the style.add() notation:
https://github-ca.corp.zynga.com/ccampbell/style

	{
		"ui.js": {
			"widgets.css",
			"widgets.js"
		}
	}