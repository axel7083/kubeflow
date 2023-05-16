from kubeflow.kubeflow.crud_backend import api, logging

from ...common import utils
from . import bp

log = logging.getLogger(__name__)


@bp.route("/api/namespaces/<namespace>/secrets")
def get_secrets(namespace):
    # Return the list of Secrets
    secrets = api.list_secrets(namespace).items

    content = []
    for secret in secrets:
        secret_as_dict = secret.to_dict()
        metadata = secret_as_dict.get('metadata', {})

        content.append({
            'name': metadata.get('name'),
            'namespace': metadata.get('namespace'),
            'type': secret_as_dict.get('type'),
            'age': metadata.get('creation_timestamp'),
            'keys': list(secret_as_dict.get('data', {}).keys()) + list(secret_as_dict.get('stringData', {}).keys())
        })

    return api.success_response("secrets", content)

"""
@bp.route("/api/namespaces/<namespace>/secrets/<secret_name>")
def get_secret_keys(namespace, secret_name):
    secret = api.get_secret_keys(secret_name, namespace)
    return api.success_response("secret", api.serialize(secret))


@bp.route("/api/namespaces/<namespace>/pvcs/<pvc_name>/pods")
def get_pvc_pods(namespace, pvc_name):
    pods = utils.get_pods_using_pvc(pvc_name, namespace)

    return api.success_response("pods", api.serialize(pods))


@bp.route("/api/namespaces/<namespace>/pvcs/<pvc_name>/events")
def get_pvc_events(namespace, pvc_name):
    events = api.list_pvc_events(namespace, pvc_name).items

    return api.success_response("events", api.serialize(events))
"""
