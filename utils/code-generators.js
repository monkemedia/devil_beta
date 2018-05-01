export const slug = () => {
  function s4 () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

export const sku = () => {
  function s4 () {
    return Math.floor((1 + Math.random()) * 0x100)
      .toString(16)
      .substring(1)
  }
  return s4() + s4() + s4() + s4() + s4()
}
