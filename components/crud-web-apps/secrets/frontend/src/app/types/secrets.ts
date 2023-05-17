
type KubernetesTypeDataType = {
  [type: string]: string[]
}

export const KubernetesTypeData: KubernetesTypeDataType = {
  'Opaque': [], // special case
  'kubernetes.io/dockerconfigjson': ['.dockerconfigjson'],
  'kubernetes.io/basic-auth': ['username', 'password'],
  'kubernetes.io/ssh-auth': ['ssh-privatekey'],
  'kubernetes.io/tls': ['tls.crt', 'tls.key'],
  // Add more Kubernetes types and their data types here
};

