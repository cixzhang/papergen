
Papergen
========

Generates pages given a page module and module options.

Page Module
-----------

A page module should contain a `page.js` which should export an object
describing the page's inputs and render method. The render method should
return an svg element.


### inputs

Inputs should be a list of objects with the following properties:

* **id**: Identifier for this input option. Must only contain lowercase letters, \_, or -.
* **type**: One of [number, string, boolean, seed]. The `seed` type can be used to receive a random number.
* **name**: Optional, human readable name.
* **description**: Optional, long form description.
* **initial**: Optional, initial value

For number types, these additional properties can be used:

* **min**: minimum number
* **max**: maximum number
* **step**: step value
* **unit**: string describing the unit


### example

```
// page.js

import Page from papergen;

module.exports = Page({
  name: 'Grid',
  description: 'Produces a grid filled page.',
  inputs: [
    {
      id: 'size',
      name: 'Grid Size',
      description: 'The size of each square in the grid.',
      type: 'number',
      initial: 5,
      min: 1,
      max: 10,
      unit: 'mm',
  ]
});

```

To validate your page module, you can run the `page.js` file:

```
node page.js

> Grid
> ----
> Produces a grid filled page.
>
>   --size  Number     Grid Size: The size of each square in the grid. (unit: mm, initial: 5)
```

Usage
-----

```
# This will generate a 2mm grid in `page.svg`

papergen --paper-size=A6 --paper-margin=3mm --page=/path/to/grid/page.js --size=2 > page.svg
```

