---
title: 一式两用:Typescript联合类型与java链式操作
tags: 3.系统架构
---
:smile

系统架构的起点

**Typescript联合类型**
联合类型的资料请先查看下面资料
``typescript``允许定义[联合类型] (Union Types)和 [交叉类型](Intersection Types)联合类型在以下场景具有非常高的灵活性
* 操作符(数据校验操作符,数据查询操作符)
* 元数据编写解析
联合类型能够让我们写出非常精简的代码
举个例子,当我们去校验一个数据的合法性的时候，如长度不小于2不大于4,且遵循某种正则,如果编写一次性的代码会是像下面这样
```typescript
function check(str:string){
    let regex=new Regexp("[A-z]")
    if(str.length<2){
        alert("字符串长度不小于2");
        return false;
    }
    if(str.length>4){
         alert("字符串长度不大于4");
         return false
    }
    if(regex.test(str)){
         alert("数据不合法")
         return false;
    }
    return true;
}

```
以上代码是一次性的,系统充斥着这样的代码不容易维护,也不便于在整个系统的维度中复用,管理这些冗余代码。
我们利用联合类型将这些代码进行封装成 ``ValidateService``

从而将上述代码封装为一行代码

```typescript
// 返回 {ok:boolean,errMsg:string}
validateService.valid(str,{maxLength:4,minLength:2,regex:/[A-Z]/});
```



1. 我们先定义 ``验证操作符``
```typescript
export class Valid {
    key?: string;
    required?: boolean = true;
    regexp?: RegExp;
    minLength?: number;
    maxLength?: number;
    $gt?: number | Date;
    $lt?: number | Date;
    $ngt?: number | Date;
    $nlt?: number | Date;
}
```
2. 实现验证service 
```typescript
import { Injectable } from '@angular/core';
import { Valid } from '../../share_platform/framework/util/meta/Valid';



@Injectable()
export class ValidService {
    phone = /1[3-9]\d{9}/g
    constructor() { }

    required(val: any) {
        return !(val == null || val == undefined || val == '');
    }

    minLength(val: any, min: number) {
        return (val as string).length >= min
    }
    maxLength(val: any, max: number) {
        return (val as string).length <= max;
    }
    /**可以比较日期和数字 */
    $lt(val: number | Date, $lt: number | Date) {
        return val < $lt
    }
    $gt(val: number, $gt: number | Date) {
        return val > $gt
    }
    $ngt(val: number, $ngt: number | Date) {
        return val <= $ngt
    }
    $nlt(val: number, $nlt: number | Date) {
        return val >= $nlt;

    }

    valid(val: any, valid: Valid): { ok: boolean, msg?: string } {
        if (valid.required) {
            if (!this.required(val)) {
                console.warn(val, valid, '必填')

                return { ok: false, msg: valid.key + "必填" }
            }
        }
        if (valid.regexp) {
            console.log(valid, valid.regexp, val, valid.regexp.test(val))
            debugger;
            if (!valid.regexp.test(val)) {
                return { ok: false, msg: valid.key + '格式错误' }
            }
        }
        if (valid.minLength) {
            if (!this.minLength(val, valid.minLength)) return { ok: false, msg: valid.key + '最少' + valid.minLength + '个字符' }
        }
        if (valid.maxLength) {
            if (!this.maxLength(val, valid.maxLength)) return { ok: false, msg: valid.key + '最多' + valid.maxLength + '个字符' }
        }
        if (valid.$gt) {
            if (!this.$gt(val, valid.$gt)) return { ok: false, msg: valid.key + '必须大于' + valid.$gt }
        }
        if (valid.$lt) {
            if (!this.$lt(val, valid.$gt)) return { ok: false, msg: valid.key + '必须小于' + valid.$lt }
        }
        if (valid.$ngt) {
            if (!this.$lt(val, valid.$ngt)) return { ok: false, msg: valid.key + '必须不大于' + valid.$ngt }
        }
        if (valid.$nlt) {
            if (!this.$lt(val, valid.$gt)) return { ok: false, msg: valid.key + '必须不小于' + valid.$nlt }
        }



        return { ok: true }
    }
    customCheck(val: any, func: Function) {
        return func(val);
    }

}


```
> 1. 以上代码在Typescript是以联合类型模式,在java中可以写成链式操作,课后作业也是将数据的验证操作在java端写成链式操作
> 2. 如何快速运行,检测自己代码的准确性,验证自己的猜想
## java链式操作
在java中没有联合类型,但是可以通过链式操作来将多行代码合并为一行代码
举一个常用的场景的例子

通常我们前后端约定一种api通信风格
如下面的这种风格
```java
public class Res implements Serializable {
    // 操作是否成功
    private Boolean ok;
    // 状态码
    private Integer status;
    // 返回给前端的数据集
    private Map<String, Object> data = new HashMap<String, Object>();
    // 错误信息
    private String errMsg;
     Res(Boolean ok, Integer status, Map<String, Object> data, String errMsg) {
        this.ok = ok;
        this.status = status;
        if (data != null) {
            this.data = data;
        }
        this.errMsg = errMsg;
    }


    /**
     * @return the data
     */
    public Map<String, Object> getData() {
        return data;
    }

    /**
     * @return the errMsg
     */
    public String getErrMsg() {
        return errMsg;
    }

    /**
     * @return the status
     */
    public Integer getStatus() {
        return status;
    }

    /**
     * @param data the data to set
     */
    public void setData(Map<String, Object> data) {
        this.data = data;
    }

    /**
     * @param errMsg the errMsg to set
     */
    public void setErrMsg(String errMsg) {
        this.errMsg = errMsg;
    }

    /**
     * @param status the status to set
     */
    public void setStatus(Integer status) {
        this.status = status;
    }

    /**
     * @return the ok
     */
    public Boolean getOk() {
        return ok;
    }

    /**
     * @param ok the ok to set
     */
    public void setOk(Boolean ok) {
        this.ok = ok;
    }

}
```


在一般的api 接口中我们这样写;

```java

@RequestMapping("/order/findOrderDetail")
public findOrderById(@RequestParam Integer orderId){
    Order order = entityManager.get(Order).findById(orderId);
    if(order!=null){
    List<OrderDetail> orderDetails = entityManager.get(OrderDetail).find({id:orderId});
    Res res = new Res(true,200,null,null);
    res.getData().put("order",order);
    res.getData().put("orderDetails",orderDetails);
    return res;
    }else{
       return  new Res(false,404,null,"订单没有找到")
    }    
}

```
上述的代码可以通过改写为链式编程封装为一行代码
```java
    Res res = new Res(true,200,null,null);
    res.getData().put("order",order);
    res.getData().put("orderDetails",orderDetails);
    return res;
```


即每次put操作都会返回对象本身则可以无限put并且可以直接返回前端Res

```java
package com.fastsun.framework.bean.http;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

public class Res implements Serializable {
    private Boolean ok;
    private Integer status;
    private Map<String, Object> data = new HashMap<String, Object>();
    private String errMsg;


    public static Res success(Map<String, Object> data) {
        return new Res(true, 200, data, null);
    }

    public static Res success() {
        return new Res(true, 200, null, null);
    }

    public Res put(String key, Object value) {
        this.data.put(key, value);
        return this;
    }

    public static Res error(Integer status, String errorMsg) {
        return new Res(false, status, null, errorMsg);
    }

    Res(Boolean ok, Integer status, Map<String, Object> data, String errMsg) {
        this.ok = ok;
        this.status = status;
        if (data != null) {
            this.data = data;
        }
        this.errMsg = errMsg;
    }


    /**
     * @return the data
     */
    public Map<String, Object> getData() {
        return data;
    }

    /**
     * @return the errMsg
     */
    public String getErrMsg() {
        return errMsg;
    }

    /**
     * @return the status
     */
    public Integer getStatus() {
        return status;
    }

    /**
     * @param data the data to set
     */
    public void setData(Map<String, Object> data) {
        this.data = data;
    }

    /**
     * @param errMsg the errMsg to set
     */
    public void setErrMsg(String errMsg) {
        this.errMsg = errMsg;
    }

    /**
     * @param status the status to set
     */
    public void setStatus(Integer status) {
        this.status = status;
    }

    /**
     * @return the ok
     */
    public Boolean getOk() {
        return ok;
    }

    /**
     * @param ok the ok to set
     */
    public void setOk(Boolean ok) {
        this.ok = ok;
    }

}
```
封装前后代码对比

```java
// 封装前
@RequestMapping("/order/findOrderDetail")
public findOrderById(@RequestParam Integer orderId){
    Order order = entityManager.get(Order).findById(orderId);
    if(order!=null){
    List<OrderDetail> orderDetails = entityManager.get(OrderDetail).find({id:orderId});
    Res res = new Res(true,200,null,null);
    res.getData().put("order",order);
    res.getData().put("orderDetails",orderDetails);
    return res;
    }else{
       return  new Res(false,404,null,"订单没有找到")
    }    
}

// 封装后
@RequestMapping("/order/findOrderDetail")
public findOrderById(@RequestParam Integer orderId){
    Order order = entityManager.get(Order).findById(orderId);
    if(order!=null){
    List<OrderDetail> orderDetails = entityManager.get(OrderDetail).find({id:orderId});
    return new Res(true,200,null,null).put("order",order).put("orderDetails",orderDetails);
    }else{
       return  new Res(false,404,null,"订单没有找到")
    }    
}
```

以上的链式操作只是小试牛刀,虽然前端可以使用链式操作，这个场景前端的意义不大

接下来要使用封装查询操作符
在做管理系统的时候，遇到大量的简单的单表的增删改查,此时如果一个个进行编写,浪费人力,也难以维护




我们约定一套简单查询操作符
主要有以下
**查询条件方面**
* like  相似统配   
* gt 大于
* lt 小于
* eq 等于

**分页方面**
* pageIndex  当前查询页面的下标
* pageSize 每页数据数量
* pageable 分页能力

查询对象实体
```java
package com.fastsun.framework.bean.http;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class QueryParam implements Serializable {
    private List<QueryCondition> queryConditions = new ArrayList<QueryCondition>();
    private PageParam pageParam = new PageParam();

    public PageParam getPageParam() {
        return pageParam;
    }

    public List<QueryCondition> getQueryConditions() {
        return queryConditions;
    }

    public void setPageParam(PageParam pageParam) {
        this.pageParam = pageParam;
    }
    /**
     * @param queryConditions the queryConditions to set
     */
    public void setQueryConditions(List<QueryCondition> queryConditions) {
        this.queryConditions = queryConditions;
    }
}


```
查询条件
```java
package com.fastsun.framework.bean.http;

public class QueryCondition {
    private String field;
    private String compare;
    private Object value;
    private String andOr;
    public QueryCondition(String field, String compare, Object value, String andOr) {
        this.field = field;
        this.compare = compare;
        this.value = value;
        this.andOr = andOr;
    }
    public String getAndOr() {
        return andOr;
    }
    public String getCompare() {
        return compare;
    }
    public String getField() {
        return field;
    }
    public Object getValue() {
        return value;
    }
    public void setAndOr(String andOr) {
        this.andOr = andOr;
    }
    public void setCompare(String compare) {
        this.compare = compare;
    }
    public void setField(String field) {
        this.field = field;
    }
    public void setValue(Object value) {
        this.value = value;
    }
}
```
分页
```java
package com.fastsun.framework.bean.http;

public class PageParam {
    private Integer pageIndex = 0;
    private Integer pageSize = 10;
    /** 是否进行分页 */
    private Boolean pageable = true;

    public Boolean getPageable() {
        return pageable;
    }

    public Integer getPageIndex() {
        return pageIndex;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageable(Boolean pageable) {
        this.pageable = pageable;
    }

    public void setPageIndex(Integer pageIndex) {
        this.pageIndex = pageIndex;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

}
```



基于以上代码我们在后台直接使用java进行查询的时候

```java
public Res findMemberLike(@RequestParam String keyword,@RequestParam Integer age){
    QueryParam  queryParam= new QueryParam();
    queryParam.getQueryConditions().put("name","like",keyword,"and");
    queryParam.getQueryCondtions().put("age",">",age,"and");
    PageParam pageParam = new PageParam();
    queryParam.getPageParam().setPageIndex(0);
    queryParam.getPageParam().setPageSize(10);
    queryParam.getPageParam().setPageable(true);
    this.entityQuery.query(queryParam,Member);
}
```
将上述代码用链式重写,将会融为下述一行代码
```java
return this.entity.query(Q.page(0,10).$like("name",keyword).$gt("age",age), Member);
```
伪代码如下

以上所有代码无需变动,增加链式工具类Q即可

```java
package com.fastsun;

import java.util.List;

import com.fastsun.framework.bean.*;
import com.fastsun.framework.bean.http.*;

import org.apache.commons.lang.StringUtils;

public class Q {
    private QueryParam queryParam = new QueryParam();

    public Q $like(String field, Object value) {
        this.queryParam.getQueryConditions().add(new QueryCondition(field, "like", value, "and"));
        return this;
    }

    public Q $in(String field, String value) {
        this.queryParam.getQueryConditions().add(new QueryCondition(field, "in", value, "and"));
        return this;
    }

    public Q $eq(String field, Integer value) {
        this.queryParam.getQueryConditions().add(new QueryCondition(field, "=", value, "and"));
        return this;
    }

    public Q $eq(String field, String value) {
        this.queryParam.getQueryConditions().add(new QueryCondition(field, "=", value, "and"));
        return this;
    }

    public Q or(String field, Object value) {
        this.queryParam.getQueryConditions().add(new QueryCondition(field, "like", value, "and"));
        return this;
    }

    public static Q page(Integer pageIndex, Integer pageSize) {
        Q query = new Q();
        PageParam pageParam = new PageParam();
        pageParam.setPageIndex(pageIndex);
        pageParam.setPageSize(pageSize);
        pageParam.setPageable(true);
        query.queryParam.setPageParam(pageParam);
        return query;
    }

    public static Q all() {
        Q query = new Q();
        PageParam pageParam = new PageParam();
        pageParam.setPageable(false);
        query.queryParam.setPageParam(pageParam);
        return query;
    }

    public static Q one() {
        Q query = new Q();
        PageParam pageParam = new PageParam();
        pageParam.setPageIndex(0);
        pageParam.setPageSize(1);
        pageParam.setPageable(true);
        query.queryParam.setPageParam(pageParam);
        return query;
    }

    public QueryParam getQueryParam() {
        return queryParam;
    }

    public void setQueryParam(QueryParam queryParam) {
        this.queryParam = queryParam;
    }
}
```
> 备注:这一部分可以放在前端运行，用前端链式操作,课后作业 ,在前端实现这一套链式查询语音


前端可以利用联合类型写出更简单的语法，如

```
query({name:{$like:keyword},age:{$gt:age} });

```
> 课后习题,前端实现 query查询联合类型




[联合类型]: https://www.tslang.cn/docs/handbook/advanced-types.html
[交叉类型]: https://www.tslang.cn/docs/handbook/advanced-types.html