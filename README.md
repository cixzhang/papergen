
Papergen
========

Generates pages given a page module and module options for
specific page size.


TODO
----

* Page module and example
* Book module and example
* Imposition configuration
* Reader spreads vs Printer spreads
* SVG to PDF
* page numbers, page number positions

Page Module
-----------

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

* **size**: Size of the page
* **margin**: Size of the margin within each page
* **color**: Default text color

### render

Render method should take a receivePage method which will return the next available page as an SVGElement.
The page module can call this method multiple times to render more than 1 page, for example, rendering
a spread. Render can also take in inputs as a dictionary in the second parameter. The input dictionary
will contain the keys defined in the inputs section and their user defined values.


### example

```
// page.js

import Page from papergen;

module.exports = Page({
  name: 'Grid',
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
node page.js

> Grid
> ----
> Produces a grid filled page.
>
>   --size       String     Paper size: Size of the page (ex. A5, B6, Letter) or dimensions in cms (ex. 20x40)
>   --margin     Number     Page margin: Size of the margin within each page. (unit: mm)
>   --color      String     Default color: Default text color.
>   --grid_size  Number     Grid Size: The size of each square in the grid. (unit: mm, initial: 5)
```

Usage
-----

```
# This will generate a 2mm grid in `page.svg`

papergen --page=page.js --size=A6 --margin=3mm --grid_size=2 > page.svg

# Or

node page.js --size=A6 --margin=3mm --grid_size=2 > page.svg
```

