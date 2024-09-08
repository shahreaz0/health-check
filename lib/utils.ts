export function cleanPath(pathname: string) {
  // Step 1: Replace multiple consecutive slashes with a single slash
  let cleanedPath = pathname.replace(/\/{2,}/g, "/")

  // Step 2: Remove trailing slash at the end (if it's not the root '/')
  if (cleanedPath !== "/") {
    cleanedPath = cleanedPath.replace(/\/$/, "")
  }

  return cleanedPath
}

export function parseJson(json: string) {
  let output: object

  try {
    output = JSON.parse(json)
  } catch (_error) {
    output = {}
  }
}
