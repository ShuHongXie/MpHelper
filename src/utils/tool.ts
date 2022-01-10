// 拷贝
export const copy = function (elm: Node) {
  const range = document.createRange()
  range.selectNode(elm as Node)
  ;(window as any).getSelection().removeAllRanges() // 移除剪切板中内容
  ;(window as any).getSelection().addRange(range) // 添加新的内容到剪切板
  document.execCommand('copy')
  ;(window as any).getSelection().removeAllRanges()
}
