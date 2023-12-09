export const findElementsByXPath = (
  xpath: string,
  contextNode: Node = document,
) => {
  const result = document.evaluate(
    xpath,
    contextNode,
    null,
    XPathResult.ANY_TYPE,
    null,
  )
  const nodes: Node[] = []
  let node: Node | null
  while ((node = result.iterateNext())) {
    nodes.push(node)
  }
  return nodes
}
