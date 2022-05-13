export const hexToRgb = (hex) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  // return rgb array
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
};
export const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// get darker color from hex
export const getDarkerColor = (hex) => {
  // return null if hex is not valid color
  if (!hex || !hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)) return null;
  // convert hex to rgb
  console.log(hex);
  const rgb = hexToRgb(hex);
  // get darker color
  const darker = rgb.map((c) => (c >= 50 ? c - 50 : 0));
  console.log(darker);
  // convert rgb to hex
  const hexDarker = rgbToHex(...darker);
  console.log(hexDarker);
  return hexDarker;
};
