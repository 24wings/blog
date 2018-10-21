---
title: 架构设计与实现进度
tag: 3.系统架构
date: 2016-10-10
---

# 1. 前端

## 1.1 ui组件
- [ ] 自定义组件模板

**基本类型**
ui 组件命名规范
>field+``lazy``+组件显示类型+``ref可选``+``many可选`` +ui框架

- [x] field-number-zorro
- [x] field-boolean-zorro 
- [x] field-date-zorro
- [x] field-password-zorro
- [x] field-picture-zorro
- [x] field-select-zorro
- [x] field-string-zorro
- [ ] field-radio-zorro

**复数类型**
- [x] field-date-array-zorro popover-show
- [ ] field-picture-many-zorro
- [ ] field-select-many-zorro
- [ ] field-check-many-zorro
- [ ] field-number-array-zorro
- [ ] field-string-array-zorro

**引用类型**
- [x] field-ref-table-zorro
- [x] field-ref-tree-zorro
- [ ] field-select-ref-zorro  popover-show
- [ ] field-radio-ref-one-zorro  popover-show
- [x] field-lazy-select-ref-one-zorro popover-show

**复数引用类型**
- [x] field-ref-table-many-zorro
- [x] field-ref-tree-many-zorro
- [ ] field-select-ref-many-zorro popover-show
- [ ] field-lazy-select-ref-many-zorro popover-show

**主面板**

* [ ] 汇总栏
* [ ] 自定义分页数量 (10条,30条,50条,100条)
* [ ] reuse-tab 复用标签页

**操作栏**
- [ ] 详情显示 Info



>部分组件部分需要对元数据进行修改,以添加新特性

## 1.2.数据校验(Check),数据适配(Adapter)
**校验**
- [x] 校验
    - [x] $gt
    - [x] $ngt
    - [x] $like
    - [x] $nlt
    - [x] $lt
    - [x] regex
    - [x] maxLength
    - [x] minLength
    - [ ] $in
    - [ ] $start
    - [ ] $end     
- [ ] Or校验
> 目前只支持层层校验，不支持某条件符合,其他条件不符合通过校验方式(Or校验)

**正则**
- [ ] 邮箱
- [ ] 敏感字符(如空白字符)
- [x] 手机号
- [ ] 身份证号
- [ ] 银行卡号
- [ ] ....

**数据转换Adapter/Transform**
- [x] read 
- [x] write
- [x] formatter
- [x] parser
> read/write 分别从服务器读写数据 会改变写入服务器的值,或服务器到组件中的值
>formatter,parser本质上只是显示的变更,不影响值




> 正则部分

**生命周期**
> 生命周期与组件事件应用在不同的场景,生命周期主要用于拦截操作和附加操作.组件事件主要用于完全自定义行为,例如保存会员,利用生命周期检查会员的总金额是否等于余额+存款,只需在生命周期中校验,校验成功则自动保存会员,而例如当创建前需要全权管理的时候使用事件,通常是自定义事件
* [ ]  ``beforeCreate:()=>{ok:boolean,errMsg:string}``
* [x]  ``afterCreateSuccess:(data)=>any``
* [ ]  ``afterCreateFail:(errMsg)=>any``
---
* [ ] ``beforeQuery:(metaCom:MetaCom,queryObject)=>any``
* [x] ``afterQuerySuccess:(metaCom:MetaCom,queryObject)=>any``
* [ ] ``afterQueryFail:(metaCom:MetaCom,queryObject)=>any``
---
* [ ] ``beforeUpdate:(metaCom:MetaCom,beforeObject, updateObject)=>{ok:boolean,errorMsg:string}``
* [ ] ``afterUpdateSuccess:(metaCom:MetaCom,beforeObject,updateObject)=>``
* [ ] ``afterUpdateFail:(metaCom:MetaCom,updateObject)=>any``
---
* [ ] ``beforeDelete:(metaCom:MetaCom,dataItem:any)=>{ok:boolean,errorMsg}``
* [ ] ``afterDeleteSuccess:(metaCom:MetaCom,dataItem:any)=>{ok:boolean,errorMsg}``
* [ ] ``afterDeleteFail:(metaCom:MetaCom,dataItem)=>any``


## 1.3事件

- [x] EditorEvent
- [ ] EditorCancelCreateEvent
- [ ] EditorShowCreateEvent
- [ ] EditorCreateSuccessEvent
- [x] EditorCancelUpdateEvent
- [x] EditorShowUpdateEvent
- [ ] EditorUpdateSuccessEvent
---
- [ ] QueryEvent
- [ ] BeforeQueryEvent
- [ ] AfterQuerySuccessEvent
---
- [ ] DeleteEvent
- [ ] BeforeDeleteEvent
- [ ] AfterDeleteSuccessEvent
---
- [x] CustomEvent

---
组件内部事件
- [x] CheckDataAction
- [x] CheckManyDataAction
- [x] CheckOneDataAction
- [x] FlowToActionEvent

----



> 自定义事件通常是自定义操作产生的事件


## 1.4 自定义
- [x] 自定义编辑器
- [x] 自定义工具条
- [x] 自定义操作
- [ ] 自定义主面板
- [ ]  自定义html
- [x] 动态加载组件
- [x] 组件注册工厂

---

- [ ] 组件规范
    - [x] StringComSpec
    - [x] SelectComSpec
    - [x] NumberComSPec
    - [x] RefComSpec
    - [ ] RefManySpec

## 1.6 项目结构 
- [x] 多项目,并行,开发,切换，演示
- [x] 模块复用


* app
    * projects 
        - hk 航空项目
            - bulit-in 内置数据
            - entity 实体
            - enums 枚举
            - meta 元数据
            - pages 页面
            - hk.module.ts  
        - xfd_fk 新发地饭卡
            - bulit-in  内置数据
            - entity
            - enums
            - meta
            - pages
            - xfd_fk.module.ts


## 1.7 数据策略
- [x] OnlineDataStrategy
- [x] IndexedDbStrategy
- [ ] LocalStorateStrategy
- [ ] SessionStrategy
- [ ] CookieStrategy
- [ ] WebSqlStrategy
- [ ] OnelineLazyCacheStrategy
- [ ] CustomStrategy


## 1.8 元数据查询 
- [ ] 元数据查询
- [ ] 元数据同步
## 1.9 消息工厂
* [ ] 消息注册工厂


# 2.后端
- [x] 单表增删改查 stq
    - [x] $like
    - [x] $gt
    - [x] $lt
    - [x] $eq
    - [ ] $ngt
    - [ ] $nlt
    - [ ] $in
    - [ ] $start
    - [ ] $end
- [ ] 数据同步
- [ ] jpql,支持OnetoOne属性查询 如  ``select m from Member m  where m.user.status  = "Active"``
- [ ] 汇总
- [ ] 排序(多字段排)
- [x] 权限功能点检查 
- [x] Api权限检查(Custom Action 权限检查)
- [ ] 消息工厂与消息展示

```java
// 权限功能点附加在实体上
@Power(create=100,query=101,update=102,delete=103)
@Entity()
public class User{

}


// api权限功能点
@ApiPower(power=104)
@PostMapping("/api/custom-action")
public customAction(@RequestBody User user){

}


```







#3. 工作流&数据权限&文档
