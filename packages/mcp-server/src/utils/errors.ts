export function formatError(err: unknown): string {
  if (err instanceof Error) {
    const axiosErr = err as Error & { response?: { data?: { error?: string; message?: string } } };
    if (axiosErr.response?.data?.error) return axiosErr.response.data.error;
    if (axiosErr.response?.data?.message) return axiosErr.response.data.message;
    return err.message;
  }
  return String(err);
}
