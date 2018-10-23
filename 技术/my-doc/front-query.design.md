# 前端查询1.0

**前端查询1.0设计**

支持的查询


前后端通信通过 ``QueryParameter``对象通信
QueryParameter
* queryCondtions QueryCondition[]
    * 查询条件
* pageParameter PageParameter
    * 分页
```typescript
//基础查询   where mktId=1 and name like '%testName%'
this.findAll({mktId:1,name:{$like:'testName'}} )
//分页   where mktId=1 and name like '%testName%'  skip 20 limit 10 order by mktId desc;
this.findAll({mktId:1,name:{$like:'testName'},new PageParameter({pageIndex:2,pageSize:10,sortField:'mktId',false})} )

//Or查询 where 
this.findAll([{mktId:1,},{name:{$like:'testName'}}]);

```

# 前端查询2.0
* 支持 ``$in``,``$notIn``,
* orderBy 多字段排序 {age:"desc",createTime:"asc"}
* 支持连表多查populate(表名)
* 函数式编程
```typescript
 findAll({}).limit().orderBy().skip().populate("")
 findOne({}).limit().orderBy().skip().populate("")
```






# 前端查询1.0 实现代码

```typescript
export class QueryParameter {
    queryConditions?: IQueryCondition[];
    pageParameter?: PageParameter;

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