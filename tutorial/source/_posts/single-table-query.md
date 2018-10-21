---
title: 元数据单表查询
date: 2018-09-03 14:09:10
tags: 4.快速上手
---

single table query 单表查询 STQ 实现原理

| 通常web需要一些简单查询,如
```sql
select * from user where age>20;
```
当我使用nodejs sequlize 时候可以表示为 
```typescript
userModel.find({where:{age:{$lt>20}}})
```
如果能够前端自动执行类似sequelize的代码,即可减少后台的工作量和减少无必要的接口.


基于如此目标: 我们开始设计如下类型

* QueryCondition  用于生成where 查询条件
* PageParameter  分页参数
* QueryParameter  总体查询参数
* QueryObject 查询对象

代码如下




```typescript
// service层
export class CommonService{
   commonApi= {
     singleTableQuery: "/api/stq/query"
  };
singleTableQuery(className: EntityEnum, queryObject: QueryObject | QueryObject[]) {
    let queryParameter = this.getQueryParameter(queryObject);
    return this.http.Post(this.commonApi.singleTableQuery, queryParameter, { params: { className } });
  }
    
 getQueryParameter(queryObject: QueryObject | QueryObject[], pageParameter?: PageParameter): QueryParameter {
    let conditions: QueryCondition[] = [];
    if (Array.isArray(queryObject)) {
      conditions = QueryObject.Or(queryObject)
    } else {
      conditions = QueryObject.toQueryContions(Object.assign(queryObject, new QueryObject()));
    }
    console.log(conditions)
    return { queryConditions: conditions, pageParameter: pageParameter ? pageParameter : new PageParameter(), queryAttributes: [] }
  }

}



```

```typescript
// /share-platform/framework/util/index.ts
import { QueryAttribute } from "app/share_platform/framework/util";

export class QueryParameter {
    queryConditions?: IQueryCondition[];
    pageParameter?: PageParameter;
    queryAttributes: QueryAttribute[] = [];
}

export class QueryCondition {

    constructor(public field: string,
        public compare: string,
        public value: any,
        public andOr: "and" | "or") { }
}

export class PageParameter {
    constructor(
        public pageIndex: number = 0,
        public pageSize: number = 0,
        public sortField?: string,
        public sortByAsc?: true
    ) { }
}
export class QueryField {
    $in?: any[];
    /** 大于 */
    $gt?: number | string | Date;
    /** 小于 */
    $lt?: number | string | Date;
    /** :  前后统配 */
    $like?: string;
    /** l: 前通配*/
    $likeStart?: string;
    /** :l 后通配*/
    $likeEnd?: string;
    /** 不等于 */
    $notEq?: string | number;

}

export class QueryObject {
    [key: string]: string | number | QueryField;
    static toQueryContions = (queryObject: QueryObject): QueryCondition[] => {
        let conditions: QueryCondition[] = []
        for (let key in queryObject) {
            if (key != "toQueryParameter") {
                let value = queryObject[key];
                let type: string;
                if (typeof value == "string") {
                    type = "string"
                }
                if (typeof value == "number") {
                    type = "number"
                }
                if (Array.isArray(value)) {
                    throw new Error("不支持数组");
                }

                if (typeof value == "object") {
                    type = "object";
                }
                if (value instanceof Date) {
                    type = "date"
                }

                switch (type) {
                    case "string":
                    case "number":
                    case "date":
                        conditions.push(new QueryCondition(key, "=", value, "and"))
                        break;

                    default:
                        for (let op in value as QueryField) {
                            let field = value[op];
                            switch (op) {
                                case "$lt":
                                    conditions.push(new QueryCondition(key, "<", field, "and"))
                                    break;
                                case "$gt":
                                    conditions.push(new QueryCondition(key, ">", field, "and"));
                                    break;
                                case "$notEq":
                                    conditions.push(new QueryCondition(key, "!=", field, "and"));
                                    break;
                                case "$like":
                                    conditions.push(new QueryCondition(key, ":", field, "and"));
                                    break;
                                case "$likeStart":
                                    conditions.push(new QueryCondition(key, "l:", field, "and"));
                                    break;
                                case "$likeEnd":
                                    conditions.push(new QueryCondition(key, ":l", field, "and"));
                                    break;
                                default:
                                    break;
                            }

                        }
                        break;
                }
            }
        }
        return conditions;
    }
    /** or 并联查询 */
    static Or(queryObjects: QueryObject[]) {
        let conditions = []
        for (let obj of queryObjects) {
            let queryConditions = QueryObject.toQueryContions(Object.assign(obj, new QueryObject()));
            queryConditions[queryConditions.length - 1].andOr = "or"
            conditions.push(...queryConditions);
        }
        return conditions;
    }
}
```
元数据字段
```typescript
// /share-platform/util/entity.enum.ts
export enum EntityEnum {
    Market = "com.fastsun.framework.entity.rbac.Market"
}
```


# 进阶 元数据系统
更多的时候我们希望能够直接生成ui管理界面
```typescript

export function Prop(value?: MetaField) {
    let defaultMetaField = { id: 1, recno: 0, isShow: false, alias: '222', objectCode: '', isQuery: true };
    if (value) value = Object.assign(defaultMetaField, value)
    else value = <MetaField>defaultMetaField;

    return (target: any, propKey: string) => {
        if (value) {
            value.fieldName = propKey;
            let type = Reflect.getMetadata('design:type', target, propKey);

            switch (type) {
                case Number:
                    value.fieldType = "number";
                    break;
                case String:
                    value.fieldType = "string";
                    break;
                case Date:
                    value.fieldType = "date";
                    break;
                case Boolean:
                    value.fieldType = "boolean";
                    break;
                default:
                    value.fieldType = "unknow";
            }
            // console.log(value, type.toString(), type.name)

        }
        let keys = Reflect.getMetadata(keysKey, target);
        if (!keys) {
            keys = [value]
        } else {
            keys.push(value);
        }
        Reflect.defineMetadata(keysKey, keys, target);
    }
}

export function getProp(target: any) {
    return Reflect.getMetadata(keysKey, target);
}

```
元数据类型
```typescript
import { MetaObject } from '../../entity/rbac/MetaObject';
const metaKey = Symbol("metaId");


/**
 * 用于单表查询的装饰器
 * 
 * @param value 
 */
export function MetaEntity(value?: MetaObject) {
    let defaultMetaObject: MetaObject = { isCelledit: false, } as any;
    if (value) value = Object.assign(defaultMetaObject, value);
    else value = <MetaObject>defaultMetaObject;
    return (target: any) => {
        if (value) value.objectName = target.name;
        Reflect.defineMetadata(metaKey, value, target)
        return target;
    }
}
export function getMetaEntity(target: any): MetaObject {
    return Reflect.getMetadata(metaKey, target)
} 
```