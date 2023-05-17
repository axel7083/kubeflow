import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl,
  ValidatorFn,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  NamespaceService,
  getExistingNameValidator,
  dns1035Validator,
  getNameError,
  DIALOG_RESP,
} from 'kubeflow';
import { VWABackendService } from 'src/app/services/backend.service';
import {PVCPostObject, KubernetesTypeData, SecretPostObject} from 'src/app/types';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-form-default',
  templateUrl: './form-default.component.html',
  styleUrls: ['./form-default.component.scss'],
})
export class FormDefaultComponent implements OnInit, OnDestroy {
  openPanel = new Set();

  public TYPE_EMPTY = 'empty';

  public subs = new Subscription();
  public formCtrl: FormGroup;
  public blockSubmit = false;

  public currNamespace = '';
  public existingSecretsNames = new Set<string>();
  public secretTypes: string[] = Object.keys(KubernetesTypeData);

  get fieldsArray(): FormArray {
    return this.formCtrl.get('secretData') as FormArray
  }

  constructor(
    public ns: NamespaceService,
    public fb: FormBuilder,
    public backend: VWABackendService,
    public dialog: MatDialogRef<FormDefaultComponent>,
  ) {
    this.formCtrl = this.fb.group({
      name: ['', [Validators.required]],
      namespace: ['', [Validators.required]],
      secretType: ['Opaque', [Validators.required]],
      secretData: new FormArray([]),
    });
  }

  ngOnInit() {
    this.formCtrl.controls.namespace.disable();

    this.subs.add(
      this.ns.getSelectedNamespace().subscribe(ns => {
        this.currNamespace = ns;
        this.formCtrl.controls.namespace.setValue(ns);

        this.backend.getSecrets(ns).subscribe(pvcs => {
          this.existingSecretsNames.clear();
          pvcs.forEach(pvc => this.existingSecretsNames.add(pvc.name));
        });
      }),
    );

    this.formCtrl.get('secretType').valueChanges.subscribe((value: string) => {
      // Callback logic when the "type" field changes
      this.typeFieldChanged(value);
    });
  }

  typeFieldChanged(value: string) {
    if (!(value in KubernetesTypeData)) {
      console.warn("Something went wrong. typeFieldChanged received " + value)
    }

    this.fieldsArray.clear();


    if(value !== "Opaque") {
      this.fieldsArray.setValue(KubernetesTypeData[value].map((key) => {
        return new FormGroup({
          key: new FormControl(key, Validators.required),
          data: new FormControl('', Validators.required),
        });
      }))
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  public onSubmit() {
    const secret: SecretPostObject = JSON.parse(JSON.stringify(this.formCtrl.value));
    console.log("secrets", secret);

    this.blockSubmit = true;
    this.backend.createSecret(this.currNamespace, secret).subscribe(
      result => {
        this.dialog.close(DIALOG_RESP.ACCEPT);
      },
      error => {
        this.blockSubmit = false;
      },
    );
  }

  public addNewSecretField() {
    this.fieldsArray.push(
      this.createNewSecretField()
    )
  }

  onDelete(id: number, event: PointerEvent) {
    event.stopPropagation();
    this.fieldsArray.removeAt(id);
    this.openPanel.clear();
  }

  private createNewSecretField(): FormGroup {
    return new FormGroup({
      key: new FormControl('', Validators.required),
      data: new FormControl('', Validators.required),
    });
  }

  public onCancel() {
    this.dialog.close(DIALOG_RESP.CANCEL);
  }

  public isOpaque() {
    return this.formCtrl.get('secretType').value === "Opaque";
  }

  public getFieldName(group: FormGroup) {
      return group.get('key').value || "Secret field"
  }
}
