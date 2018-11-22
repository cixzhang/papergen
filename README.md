
Papergen
========

[![Build Status](https://travis-ci.org/cixzhang/papergen.svg?branch=master)](https://travis-ci.org/cixzhang/papergen)

Generates pages given a page module and module options for
specific page size.

Usage
-----

Generate PDF for a page:

```
papergen /path/to/page.js -o page.pdf --additionalPageOptions
```

Generate PDF for a booklet:

```
papergen /path/to/booklet.js -o book.pdf
```

Writing a custom Page Module
----------------------------

A page module should contain a `page.js` which should export an object
describing the page's name, description, inputs and render method.

### name

The name of your page module. This is displayed in the help section.

### description

A long description of your page module. This is displayed in the help section.

### inputs

Inputs should be a list of objects with the following properties:

* **key**: Identifier for this input option. Must only contain letters, \_, or -.
* **type**: One of [number, string, boolean, seed]. The `seed` type can be used to receive a random number.
* **name**: Optional, human readable name.
* **description**: Optional, long form description.
* **initial**: Optional, initial value

For number types, these additional properties can be used:

* **min**: minimum number
* **max**: maximum number
* **step**: step value
* **unit**: string describing the unit

By default, papergen will support the following options which cannot be overwritten:

* **pageSize**: Size of the page
* **landscape**: Whether the page will be rendered in landscape
* **portrait**: Similar to landscape, but for portrait. Only one of landscape or portrait will be used.
* **ppi**: Pixels per inch

### render

The render method receives 2 parameters: **el** and **options**. Options are the values of the
inputs. The el is an HTML element that you'll insert other elements into to draw the page.

### example

```
// page.js

import Page from papergen;

module.exports = Page({
  name: 'Grid',
  filename: __filename,
  description: 'Produces a grid filled page.',
  inputs: [
    {
      key: 'grid_size',
      name: 'Grid Size',
      description: 'The size of each square in the grid.',
      type: 'number',
      initial: 5,
      min: 1,
      max: 10,
      unit: 'mm',
    },
  ],
  render: (receivePage, { size, margin, color, grid_size }) => {
    var pageSVG = receivePage();

    // Render method.
  },
});

```

To validate your page module, you can run the `page.js` file:

```
node /path/to/page.js
```

If everything's good, nothing will be printed, otherwise, we print the errors.

TODO
----

* Imposition configuration
* Reader spreads vs Printer spreads
* page numbers, page number positions
