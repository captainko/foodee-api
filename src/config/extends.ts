export { };

declare global {
  // tslint:disable-next-line: interface-name
  interface Array<T> {
    to(key: ToSomething, something: any): T[];
    toJSONFor(something: any): T[];
    toThumbnailFor(something: any): T[];
  }
}

type ToSomething = "toThumbnailFor" | "toJSONFor";

// Array
Array.prototype.to = function(this: any[], key, something) {
  const length = this.length; let i = 0;
  while (i < length) {
    this[i] = this[i++][key](something);
  }
  return this;
};

Array.prototype.toThumbnailFor = function(this: any[], something) {
  return this.to("toThumbnailFor", something);
};

Array.prototype.toJSONFor = function(this: any[], something) {
  return this.to("toJSONFor", something);
};

// ~Array