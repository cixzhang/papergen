
const MM_PER_INCH = 25.4;
const PPI = 72;

const A0 = [841, 1189];
const B0 = [1000, 1414];
const C0 = [9197, 1297];

const computeIsoSize = (dim0, size) => {
  const ratio = dim0[0] / dim0[1];
  if (size === 0) return dim0;

  return [
    Math.floor(Math.pow(ratio, size) * dim0[0]),
    Math.floor(Math.pow(ratio, size - 1) * dim0[0]),
  ];
}

const isSquare = (width, height) => (width === height);
const isPortrait = (width, height) => (width > height);
const isLandscape = (width, height) => (height > width);

const toLandscape = (dimensions) => {
  if (isLandscape(...dimensions)) return dimensions;
  return [dimensions[1], dimensions[0]];
};

const toPortrait = (dimensions) => {
  if (isPortrait(...dimensions)) return dimensions;
  return [dimensions[1], dimensions[0]];
};

const toPixels = (dimensions, ppi) => {
  if (!ppi) ppi = PPI;
  return dimensions.map(v => MM_PER_INCH * ppi * v);
};

const sizeMap = {
  'Half Letter': [140, 216],
  'Letter': [216, 279],
  'Legal': [216, 356],
  'Junior Legal': [127, 203],
  'Tabloid': [279, 432],
  'Ledger': [279, 432],
};

// Compute ISO A, B, C sizes into sizeMap
for (let i = 0; i < 11; i++) {
  sizeMap['A'+i] = computeIsoSize(A0, i);
  sizeMap['B'+i] = computeIsoSize(B0, i);
  sizeMap['C'+i] = computeIsoSize(C0, i);
};


module.exports = {
  sizeMap,
  isSquare,
  isPortrait,
  isLandscape,
  toLandscale,
  toPortrait,
  toPixels,
};

