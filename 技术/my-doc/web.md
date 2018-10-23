# 业务基础平台

----
html版本

* 业务基础平台
  * [框架设计_html](./service_base/1.1.design.html)
  * [动态视图_html](./service_base/1.2.dynamic.html)
  * [项目结构](./service_base/1.3.project-struct.html)
  * [集成测试](./service_base/1.5.test.html)
  * [菜单设计](./service_base/1.6.menu-design.html)
  * [通用查询模态框设计](./service_base/1.7.common-search-modal.html)

* [ ]  [会员](./web/member.html)
* [ ] [市场账户](./web/市场账户.md)
* [ ] [综合收费](./web/综合收费.html)
* [ ] [交易结算](./web/交易结算.md)

----

* [ ] 会员系统
  * [ ] 会员开户
  * [ ] 会员销户
  * [ ] 会员开卡
  * [ ] 会员冻结/解冻
  * [ ] 会员禁用/恢复
  * [ ] 会员补卡
  * [ ] 会员充值
  * [ ] 会员取款
  * [ ] 会员改密
  * [ ] 会员账户收支
  * [ ] 会员账户纵览
* [ ] [市场账户](./web/市场账户.html)
* [ ] [综合收费]()
  * [ ] 应收清单
  * [ ] 柜台收费
  * [ ] 收费记录
  * [ ] 欠费查询
* [ ] [交易结算](./web/交易结算.html)

app
* [ ] [会员注册](./app/会员注册.html)
* [ ] 会员钱包
* [ ] 卖家板块
* [ ] 买家板块
* [ ] 新闻咨讯

模块依赖关系
---

```puml
node 会员账户{
  interface 会员开卡
  interface 会员销户
  interface 会员冻结/解冻
  interface 会员禁用/恢复
  interface 会员补卡
  interface 会员取款
  interface 会员改密
  interface 会员账户收支
  interface 会员账户纵览
}

node 综合收费 {
  interface 应收清单
  interface 柜台收费
  interface 收费记录
  interface 欠费查询
}

node 交易结算{
  interface 交易费率
  interface 柜台交易
  interface 交易记录
  interface 交易退货
}
会员开卡 <.down. 综合收费
会员开卡 <.up. 交易结算
package app {
  node 会员注册 {
  }
  node 会员钱包{
    
  }
  node 卖家板块{

  }
  node 买家板块{

  }
  node 新闻模块{

  }
  

}
买家板块..> 卖家板块
买家板块 ..>会员钱包
买家板块 ..>会员注册
会员钱包 ..>会员注册
卖家板块 ..>会员钱包
交易结算 .right.>卖家板块

```

开发路线
---
```puml
title 开发路线图
actor 张想生
actor 严胜
actor 小鱼
rectangle 会员账户{
[会员开户]-->[会员销户]
[会员销户]->[会员开卡]
[会员开卡]->[会员解冻/冻结]
[会员解冻/冻结]->[会员禁用/解禁]
}

rectangle 综合收费{
  [应收清单]->[柜台收费]
  [柜台收费]->[收费记录]
  [收费记录]->[欠费查询]
}



rectangle 交易结算{
[交易费率]->[柜台交易]
[柜台交易]-->[交易记录]
[交易记录]->[交易退货]
}

rectangle app{
rectangle 会员注册{

}
rectangle 会员钱包{

}
rectangle 买家板块{

}
rectangle 卖家板块{

}
rectangle 新闻板块{
}
会员注册->会员钱包
会员钱包->买家板块
买家板块->卖家板块
}




小鱼-->会员账户
严胜 -->app
张想生-->综合收费
欠费查询 -->交易费率
欠费查询-->卖家板块:欠费查询完成,卖家板块需要完成。以便于进行交易板块功能


```

---
markdown版本

* 业务基础平台
  * [框架设计_md](./service_base/1.1.design.md)
  * [动态视图](./service_base/1.2.dynamic.htmmdl)
  * [项目结构](./service_base/1.3.project-struct.md)
  * [集成测试](./service_base/1.5.test.md)
  * [菜单设计](./service_base/1.6.menu-design.md)
  * [通用查询模态框设计](./service_base/1.7.common-search-modal.md)