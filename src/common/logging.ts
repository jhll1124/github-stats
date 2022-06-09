const logging = {
  _verbose: 0,

  // deno-lint-ignore no-explicit-any
  log(...args: any[]) {
    console.log(0, ...args);
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

  setVerbose(verbose: number) {
    this._verbose = verbose;
  },
};

export default logging;
