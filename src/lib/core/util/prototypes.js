/*
 WARNING: These are some handy prototype functions for String and Array, extending of native prototypes is a bad practice
*/

String.prototype.toProperCase = function () {
  return this.replace(/([^\W_]+[^\s-]*) */g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

String.prototype.toPlural = function () {
  return this.replace(/((?:\D|^)1 .+?)s/g, '$1');
};

String.prototype.replaceAll = function (search, replacement) {
  return this.replace(RegExp(search, "gi"), replacement);
};

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.remove = function (element) {
  const index = this.indexOf(element);
  if (index !== -1) this.splice(index, 1);
  return this;
};
