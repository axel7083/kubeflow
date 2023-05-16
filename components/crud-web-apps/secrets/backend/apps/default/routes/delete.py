from kubeflow.kubeflow.crud_backend import api, logging

from . import bp

log = logging.getLogger(__name__)


@bp.route("/api/namespaces/<namespace>/secrets/<secret>", methods=["DELETE"])
def delete_pvc(secret, namespace):
    """
    Delete a PVC only if it is not used from any Pod
    """
    # TODO: check for pod / pipelines using the secrets

    log.info("Deleting Secret %s/%s...", namespace, secret)
    api.delete_secret(secret, namespace)
    log.info("Successfully deleted Secret %s/%s", namespace, secret)

    return api.success_response("message",
                                "Secret %s successfully deleted." % secret)
