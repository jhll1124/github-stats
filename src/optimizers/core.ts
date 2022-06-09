interface Optimizer {
  (input: string): string;
}

export function chain(optimizers: Optimizer[]): Optimizer {
  return (input) =>
    optimizers.reduce((input, optimizer) => optimizer(input), input);
}
