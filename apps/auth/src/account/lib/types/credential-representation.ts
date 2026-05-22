export interface CredentialRepresentation {
  id: string
  type: string
  userLabel: string
  createdDate: number
  secretData: string
  credentialData: string
  priority: number
  value: string
  temporary: boolean
  /** @deprecated */ device: string
  /** @deprecated */ hashedSaltedValue: string
  /** @deprecated */ salt: string
  /** @deprecated */ hashIterations: number
  /** @deprecated */ counter: number
  /** @deprecated */ algorithm: string
  /** @deprecated */ digits: number
  /** @deprecated */ period: number
  /** @deprecated */ config: { [index: string]: string[] }
}
