from .. import authz
from . import v1_core


def get_secret(namespace, name, auth=True):
    if auth:
        authz.ensure_authorized("get", "", "v1", "secrets", namespace)

    return v1_core.read_namespaced_secret(name, namespace)


def get_secret_keys(namespace: str, name: str, auth=True):
    if auth:
        authz.ensure_authorized("get", "", "v1", "secrets", namespace)

    secret = v1_core.read_namespaced_secret(name, namespace)
    return secret.data.keys()


def create_secret(namespace, secret, auth=True):
    if auth:
        authz.ensure_authorized("create", "", "v1", "secrets", namespace)

    return v1_core.create_namespaced_secret(namespace, secret)


def list_secrets(namespace):
    authz.ensure_authorized(
        "list", "", "v1", "secrets", namespace
    )
    return v1_core.list_namespaced_secret(namespace)


def delete_secret(namespace: str, name: str, auth=True):
    if auth:
        authz.ensure_authorized("delete", "", "v1", "secrets", namespace)

    return v1_core.delete_namespaced_secret(name, namespace)
