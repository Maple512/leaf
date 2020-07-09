import { ModelCommon } from '../models';

export class ListResultDto<T>{
  items?: T[];

  constructor(initialValues: Partial<ListResultDto<T>> = {}) {
    for (const key in initialValues) {
      if (initialValues.hasOwnProperty(key)) {
        this[key] = initialValues[key];
      }
    }
  }
}

export class PagedResultDto<T>
  extends ListResultDto<T>{

  totalCount?: number;

  constructor(initialValues: Partial<PagedResultDto<T>> = {}) {
    super(initialValues);
  }
}

export class LimitedResultRequestDto {
  maxResultCount = 10;

  constructor(initialValues: Partial<LimitedResultRequestDto> = {}) {
    for (const key in initialValues) {
      if (initialValues.hasOwnProperty(key)) {
        this[key] = initialValues[key];
      }
    }
  }
}

export class PagedResultRequestDto
  extends LimitedResultRequestDto {

  skipCount?: number;

  constructor(initialValues: Partial<PagedResultRequestDto> = {}) {
    super(initialValues);
  }
}

export class EntityDto<TKey = string>{
  id?: TKey;

  constructor(initialValues: Partial<EntityDto<TKey>> = {}) {
    for (const key in initialValues) {
      if (initialValues.hasOwnProperty(key)) {
        this[key] = initialValues[key];
      }
    }
  }
}

export class CreationAuditedEntityDto<TKey = string>
  extends EntityDto<TKey>{

  creationTime?: string | Date;
  creatorId?: string;

  constructor(initialValues: Partial<CreationAuditedEntityDto<TKey>> = {}) {
    super(initialValues);
  }
}

export class AuditedEntityDto<TKey = string>
  extends CreationAuditedEntityDto<TKey> {

  lastModificationTime?: string | Date;
  lastModifierId?: string;

  constructor(initialValues: Partial<AuditedEntityDto<TKey>> = {}) {
    super(initialValues);
  }
}

export class AuditedEntityWithUserDto<TUser, TKey = string>
  extends AuditedEntityDto<TKey> {

  creator?: TUser;
  lastModifier?: TUser;

  constructor(initialValues: Partial<AuditedEntityWithUserDto<TUser, TKey>> = {}) {
    super(initialValues);
  }
}

export class FullAuditedEntityDto<TKey = string>
  extends AuditedEntityDto<TKey> {
  isDeleted?: boolean;
  deleterId?: string;
  deletionTime?: Date | string;

  constructor(initialValues: Partial<FullAuditedEntityDto<TKey>> = {}) {
    super(initialValues);
  }
}

export class FullAuditedEntityWithUserDto<TUser, TKey = string>
  extends FullAuditedEntityDto<TKey> {

  creator?: TUser;
  lastModifier?: TUser;
  deleter?: TUser;

  constructor(initialValues: Partial<FullAuditedEntityWithUserDto<TUser, TKey>> = {}) {
    super(initialValues);
  }
}

export class ExtensibleObject {
  extraProperties: ModelCommon.Dictionary<any>;

  constructor(initialValues: Partial<ExtensibleObject> = {}) {
    for (const key in initialValues) {
      if (initialValues.hasOwnProperty(key)) {
        this[key] = initialValues[key];
      }
    }
  }
}

export class ExtensibleEntityDto<TKey = string>
  extends ExtensibleObject {
  id: TKey;

  constructor(initialValues: Partial<ExtensibleEntityDto<TKey>> = {}) {
    super(initialValues);
  }
}

export class ExtensibleCreationAuditedEntityDto<TKey = string>
  extends ExtensibleEntityDto<TKey> {

  creationTime: Date | string;
  creatorId?: string;

  constructor(initialValues: Partial<ExtensibleCreationAuditedEntityDto<TKey>> = {}) {
    super(initialValues);
  }
}

export class ExtensibleAuditedEntityDto<TKey = string>
  extends ExtensibleCreationAuditedEntityDto<TKey> {

  lastModificationTime?: Date | string;
  lastModifierId?: string;

  constructor(initialValues: Partial<ExtensibleAuditedEntityDto<TKey>> = {}) {
    super(initialValues);
  }
}

export class ExtensibleAuditedEntityWithUserDto<TKey = string, TUser = any>
  extends ExtensibleAuditedEntityDto<TKey> {

  creator: TUser;
  lastModifier: TUser;

  constructor(initialValues: Partial<ExtensibleAuditedEntityWithUserDto<TKey>> = {}) {
    super(initialValues);
  }
}

export class ExtensibleCreationAuditedEntityWithUserDto<TKey = string, TUser = any>
  extends ExtensibleCreationAuditedEntityDto<TKey> {

  creator: TUser;

  constructor(
    initialValues: Partial<ExtensibleCreationAuditedEntityWithUserDto<TKey>> = {},
  ) {
    super(initialValues);
  }
}

export class ExtensibleFullAuditedEntityDto<TKey = string>
  extends ExtensibleAuditedEntityDto<TKey> {

  isDeleted: boolean;
  deleterId?: string;
  deletionTime: Date | string;

  constructor(initialValues: Partial<ExtensibleFullAuditedEntityDto<TKey>> = {}) {
    super(initialValues);
  }
}

export class ExtensibleFullAuditedEntityWithUserDto<TKey = string, TUser = any>
  extends ExtensibleFullAuditedEntityDto<TKey> {

  creator: TUser;
  lastModifier: TUser;
  deleter: TUser;

  constructor(initialValues: Partial<ExtensibleFullAuditedEntityWithUserDto<TKey>> = {}) {
    super(initialValues);
  }
}
