export const mixTwoColors = (
  weight = 50,
  colorOne = '05AB47',
  colorTwo = '2FA8DD'
) => {
  function d2h(d) {
    return d.toString(16)
  } // convert a decimal value to hex
  function h2d(h) {
    return parseInt(h, 16)
  } // convert a hex value to decimal

  weight = typeof weight !== 'undefined' ? weight : 50 // set the weight to 50%, if that argument is omitted

  var color = '#'

  for (var i = 0; i <= 5; i += 2) {
    // loop through each of the 3 hex pairs—red, green, and blue
    var v1 = h2d(colorOne.substr(i, 2)), // extract the current pairs
      v2 = h2d(colorTwo.substr(i, 2)),
      // combine the current pairs from each source color, according to the specified weight
      val = d2h(Math.floor(v2 + (v1 - v2) * (weight / 100.0)))

    while (val.length < 2) {
      val = '0' + val
    } // prepend a '0' if val results in a single digit

    color += val // concatenate val to our new color string
  }

  return color // PROFIT!
}
