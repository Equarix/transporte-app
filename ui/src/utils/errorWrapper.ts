export async function errorWrapper<T>(
  fn: () => Promise<T>,
): Promise<[unknown | null, T | null]> {
  try {
    const response = await fn();
    return [null, response];
  } catch (error) {
    console.error(error);
    return [error, null];
  }
}
