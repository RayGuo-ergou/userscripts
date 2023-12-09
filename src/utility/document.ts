export function findElementsByXPath(xpath: string, contextNode: Node = document) {
  const result = document.evaluate(
    xpath,
    contextNode,
    null,
    XPathResult.ANY_TYPE,
    null,
  )
  const nodes = []
  let node = result.iterateNext()

  while (node) {
    nodes.push(node)
    node = result.iterateNext()
  }

  return nodes
}
