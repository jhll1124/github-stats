const logging = {
  _verbose: 0,

  // deno-lint-ignore no-explicit-any
  log(...args: any[]) {
    console.log(...args);
  },

  // deno-lint-ignore no-explicit-any
  table(object: Record<string, any>) {
    const flat = Object.fromEntries(
      Object.entries(object).map(([key, value]) => [
        key,
        typeof value === "object" ? value.toString() : value,
      ]),
    );
    console.table(flat);
  },

  // deno-lint-ignore no-explicit-any
  verbose(level: number, ...args: any[]) {
    if (this._verbose >= level) {
      console.error(...args);
    }
  },

  // deno-lint-ignore no-explicit-any
  error(...args: any[]) {
    console.error(...args);
  },

  // deno-lint-ignore no-explicit-any
  exit(...args: any[]): never {
    console.error(...args);
    Deno.exit(1);
  },

  setVerbose(verbose: number) {
    this._verbose = verbose;
  },
};

export default logging;
