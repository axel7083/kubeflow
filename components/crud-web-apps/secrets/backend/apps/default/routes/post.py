from flask import request

from kubeflow.kubeflow.crud_backend import api, decorators, logging

from ...common import form
from . import bp

log = logging.getLogger(__name__)


@bp.route("/api/namespaces/<namespace>/secrets", methods=["POST"])
@decorators.request_is_json_type
@decorators.required_body_params("name", "type", "data")
def post_secret(namespace):
    body = request.get_json()
    log.info("Received body: %s", body)

    secret = form.secret_from_dict(body, namespace)

    log.info("Creating Secret '%s'...", secret)
    api.create_secret(secret, namespace)
    log.info("Successfully created Secret %s/%s", namespace, secret.metadata.name)

    return api.success_response("message", "Secret created successfully.")
