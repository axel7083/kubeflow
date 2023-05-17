import { Injectable } from '@angular/core';
import { BackendService, SnackBarService } from 'kubeflow';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {PVCResponseObject, VWABackendResponse, PVCPostObject, SecretPostObject} from '../types';
import { V1PersistentVolumeClaim, V1Pod } from '@kubernetes/client-node';

@Injectable({
  providedIn: 'root',
})
export class VWABackendService extends BackendService {
  constructor(public http: HttpClient, public snackBar: SnackBarService) {
    super(http, snackBar);
  }

  private getNamespacedSecrets(
    namespace: string,
  ): Observable<PVCResponseObject[]> {
    const url = `api/namespaces/${namespace}/secrets`;

    return this.http.get<VWABackendResponse>(url).pipe(
      catchError(error => this.handleError(error)),
      map((resp: VWABackendResponse) => resp.secrets),
    );
  }

  private getPVCsAllNamespaces(
    namespaces: string[],
  ): Observable<PVCResponseObject[]> {
    return this.getObjectsAllNamespaces(
      this.getNamespacedSecrets.bind(this),
      namespaces,
    );
  }

  public getSecrets(ns: string | string[]): Observable<PVCResponseObject[]> {
    if (!Array.isArray(ns)) {
      return this.getNamespacedSecrets(ns);
    }

    return this.getPVCsAllNamespaces(ns);
  }

  // TODO: to update later
  public getPodsUsingPVC(pvc: V1PersistentVolumeClaim): Observable<V1Pod[]> {
    const namespace = pvc.metadata.namespace;
    const pvcName = pvc.metadata.name;
    const url = `api/namespaces/${namespace}/pvcs/${pvcName}/pods`;

    return this.http.get<VWABackendResponse>(url).pipe(
      catchError(error => this.handleError(error)),
      map((resp: VWABackendResponse) => resp.pods),
    );
  }

  public createSecret(namespace: string, secret: SecretPostObject) {
    const url = `api/namespaces/${namespace}/secrets`;

    return this.http
      .post<VWABackendResponse>(url, secret)
      .pipe(catchError(error => this.handleError(error)));
  }

  // DELETE
  public deletePVC(namespace: string, secret: string) {
    const url = `api/namespaces/${namespace}/secrets/${secret}`;

    return this.http
      .delete<VWABackendResponse>(url)
      .pipe(catchError(error => this.handleError(error, false)));
  }
}
