export const generateNameColumn = (nameColumn) => {
  return nameColumn.match(/\w+/g)
}

export const generateIdFromHandle = (arrHandle) => {
  let _arr = arrHandle
    .replaceAll('-', '_')
    .match(/\w+/g)
    .map((item) => item.replaceAll('_', '-'))

  return _arr.toString()
}
