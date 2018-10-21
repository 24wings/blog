---
title: angular 管道与万用管道
---
在系统中我们经常遇到一些数据实体的状态或者类型需要显示
如用户的状态,订单的状态
在数据库中存储的经常是
* ``Active``
* ``Submit``
之类的值,我们可能在angular中写出如下代码去维护状态的显示
```html
<ng-container [ngSwitch]="user.status">
    <span *ngSwitchCase="'Active'">激活</span>
    <span *ngSwitchCase="'Submit'">提交</span>
    <span *ngSwitchDefault>未认证</span>
    </ng-container>
```
如果一个系统不同的地方出现多次,如用户信息页显示用户状态 用户头像下显示用户状态,用户管理页显示用户状态.
* 修改系统的用户状态的文字显示就需要到三处不同的地方修改,而真正情况下，你可能忘记了用户,
* 如果修改系统的用户状态的值如``Active`` 改为 ``Enable``
* 如果


```typescript
import * as _ from 'reflect-metadata';
const enumAlias = Symbol('alias');
enum UserType {
    Member = "Member",
    Vip = "Vip"
}

export function setAlias(obj: Object, mappers: { value: string, alias: string }[]) {
    Reflect.defineMetadata(enumAlias, mappers, obj)
}
export function getAlias(obj: Object): { value: string, alias: string } {
    return Reflect.getMetadata(enumAlias, obj) ? Reflect.getMetadata(enumAlias, obj) : []
}
setAlias(UserType, [{ alias: "会员", value: UserType.Member }])
let alias = getAlias(UserType);
console.log(alias);
```
