import { Params } from '@angular/router';
import { V1Pod } from '@kubernetes/client-node';
import { Status, BackendResponse } from 'kubeflow';

export interface VWABackendResponse extends BackendResponse {
  secrets?: PVCResponseObject[];
  //pvcs?: PVCResponseObject[];

  pods?: V1Pod[];
}

export interface PVCResponseObject {

  capacity: string; //deprecated
  class: string; //deprecated
  modes: string[]; //deprecated


  status: Status; //deprecated
  notebooks: string[]; //deprecated


  // secrets related
  name: string;
  namespace: string;
  type: string;
  age: {
    uptime: string;
    timestamp: string;
  };
  keys: string[];
}

export interface PVCProcessedObject extends PVCResponseObject {
  deleteAction?: string;
  editAction?: string;
  ageValue?: string;
  ageTooltip?: string;
  link: {
    text: string;
    url: string;
    queryParams?: Params | null;
  };
}

export interface SecretPostObject {
  name: string;
  secretType: string;
  secretData: {'key': string, 'data': string}[]
}

export interface PVCPostObject {
  name: string;
  type: string;
  size: string | number;
  class: string;
  mode: string;
  snapshot: string;
}
