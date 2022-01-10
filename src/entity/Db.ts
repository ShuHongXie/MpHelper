export interface List {
  projectName?: string
  name?: string
  path?: string
  branches?: string[]
  id?: string
  currentBranch?: string
  appid?: string
  outputPath?: string
  privatePath?: string
  robot?: number
  qrcodePath?: string
  done?: boolean
  loading?: boolean
  loadingText?: string
  expireTime?: string
  fullQrcodePath?: string
}
