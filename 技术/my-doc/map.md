# 开发纵览



|类型|||||
|---|---|--|---|---|
|静态|用例图|类图|对象图|组件图|
|动态|活动图|泳道图|时序图|状态图|

**以下是typescript版本前端例子,java同样**



<center><span style="color:red;background:red;width:15px;height:15px;display:inline-block;border-radius:50%;"></span> 红色重构/复用
<span style="color:red;background:yellow;width:15px;height:15px;display:inline-block;border-radius:50%;"></span> 黄色进行中
<span style="color:red;background:lightblue;width:15px;height:15px;display:inline-block;border-radius:50%;"></span> 浅蓝色已完成
</center>

## <center>web dev</center>





## <center>web user</center>



## <center>app </center>

### 登陆注册模块
```puml
start
partition 登陆注册{
:选择批发市场;
:登陆页面;
if(登陆页面) then (登陆请求)
:登陆请求;
note right #lightblue
customer登陆请求
endnote
elseif (注册按钮) then(进入注册页面)
:验证手机页面;
note right #lightblue
* 发送customer手机注册验证码
* 验证手机验证码
endnote
:完善customer信息页面;
noteright #lightblue
* 提交注册customer的信息
endnote
stop
else 
:验证手机页面;
noteright #lightblue
* 发送customer忘记密码验证码
* 验证手机验证码
endnote
:忘记密码页面;
noteright #lightblue
* 修改密码
endnote
stop
endif
}
:首页;
noteright #lightblue
* 拉取今日概览信息(买家,卖家的今日统计)
endnote
  


```
### 个人中心模块
```puml
start
partition 个人中心 {
if(我的) then(个人中心模块)
:个人中心首页;
noteright #lightblue
* 拉取customer信息
endnote
if(待处理消息按钮) then(待处理消息页面)
:待处理消息页面;
noteright #lightblue 
* 获取指定多种消息类型
* 下拉刷新消息类型
endnote
elseif(消息管理按钮) then(进入消息管理页面)
:消息管理页面;
noteright #yellow
* 拉取消息种类和消息状态
* 更新消息设置
endnote
elseif(修改密码按钮) then(进入修改密码页面)
:修改密码页面;
noteright #red
* 修改密码
endnote
elseif(修改手机按钮) then(修改手机页面)
:验证密码页面;
noteright #yellow
* 验证密码
endnote
:验证手机页面;
noteright #red
* 发送customer手机验证码
* 验证手机验证码
endnote
:修改手机;
noteright #yellow
修改手机
endnote
else (成员管理按钮)  
:成员管理页面;
noteright #yellow
* 列表团队成员
* 退出团队
endnote
if(收到的邀请按钮) then(进入收到邀请页面)
:收到邀请页面;
noteright #yellow
* 邀请列表
* 邀请详情(打开邀请)
endnote
:邀请详情;
noteright #yellow
* 同意/拒绝邀请
endnote
else(+按钮)
:进入手机搜索自由人;
noteright #yellow
* 手机搜索自由人
* 邀请自由人加入团队
endnote
endif
stop
endif
endif
stop



}





```
## 我的钱包
```puml
partition 钱包 
:钱包首页;
noteright #yellow
* 拉取会员状态
endnote
if(是否实名认证) then(没有实名认证)
:实名认证协议页面;
:实名认证基本信息页面;
noteright #yellow
* 实名认证手机验证码
endnote
:支付密码;
noteright #yellow
* 提交会员实名认证信息
* 验证手机验证码
endnote
elseif (实名认证中) then
:耐心等待页面;

else (实名认证成功)
:我的钱包页面;
noteright #yellow
* 拉取钱包现金
endnote
if(支付按钮) then(进入支付页面)
:支付扫码页面;
noteright #yellow
* 二维码扫描订单
* 支付订单请求
endnote

elseif(线上转账) then(进入线上转账)
:线上转账页面;
:选取好友商户;
noteright #yellow
* 拉取好友商户
* 转账申请
endnote
endif
endif
}
stop
```
* 拉取市场其他商户

###  我是卖家

```puml
title 我是卖家
start
partition 商品管理 {
if(商品管理按钮) then(进入商品管理页面)
:商品管理页面;
noteright 
* 列出所有商品
endnote
elseif(添加商品按钮) then(进入添加商品页面)
:添加商品页面;
noteright 
* 列出所有顶级市场分类
* 列出指定分类的下级所有分类
endnote
elseif(编辑商品按钮) then(进入商品详情页面)
:商品详情页面;
noteright #yellow
* 获取商品详情
* 更新商品信息
endnote
endif
}

partition 交易开单 {
start
:交易开单页面;
noteright
* 订单上传
* 订单下载
* 拉取(或本地storage读取)快捷商品键
endnote
if (全部商品) then(进入全部商品)
:全部商品;
noteright
* 拉取全部商品以及分类
endnote
elseif(订单生成) then(订单生成)
:订单生成;
noteright
* 订单生成并返回二维码链接
* 前端生成二维码
* 订单挂起
endnote
:在线支付;
noteright #red
* 列出商户好友
* 订单推送支付(在线支付)
* 线下支付
endnote
else(赊销)
:赊销申请;
noteright
* 赊销申请
* 拉取赊销申请
* 赊销同意/拒绝
* 商户赊销金额
* 订单转赊销订单申请
endnote

endif
}
partition 我的还款 {

}
```

* 是否有商户好友关联手机号,当手机号修改时候是否会影响

### 买家模块

# 赊账模块

|表名|含义|
|---|---|
|AccountPayRecvLog| 收支记录表|
|UnPayOrder|赊账订单|


还款方式
* 线上账户
* 线下
```puml
(订单A)<<交易订单>>
note right
* 卖方名字(冗余)
* 买方名字(冗余)
* 卖方id
* 买方id
endnote

(订单项目A1)-->(订单A)
(订单项目A2)-->(订单A)
(订单项目A3)-->(订单A)

(线上支付确认A)<<交易支付确认>>

(订单项目B1)-->(订单B)
(订单项目B2)-->(订单B)
(订单项目B3)-->(订单B)
(订单B)<<赊账订单>>
(支出记录B2)<<还款支出记录>>
(支出记录B1)<<还款支出记录>>

(支出记录A1)<<交易支出记录>>
(支出记录A3)<<交易支出记录>>
(支出记录B3)<<还款支出记录>>

(线上支付确认B)<<赊账支付确认>>


(申请线下还款支出记录)<<申请线下支出记录>>

note right
老板线下支付
endnote
(订单A)<-- (支出记录A1)
(订单B)<-- (支出记录B1)
(订单B)<-- (支出记录B2)
(支出记录B2)<--(申请线下还款支出记录)
(申请线下还款支出记录) <-- 会员A
(支出记录B1)<--会员A
会员B-up-> (支出记录A1)
会员B-up->(线上支付确认A)
线上支付确认A-up->(支出记录A3)
支出记录A3 -up->(订单A)
会员A -up->(线上支付确认B)
(线上支付确认B)-up->(支出记录B3)
(支出记录B3)-up->订单B

```

1.  申请线下交易记录和申请线下还款记录  是否可以融为一张表 线下申请支出记录表
2. 交易支出记录和还款支出记录是否可以融为一张表, 是否可以融为一张表 ,支出记录
3. 交易订单和赊账订单是否可以融为一张表,订单表.
4. 缺少交易的现金


```puml
title 订单/赊欠订单 的实体
class Account{
    accountId
    accountType #账户类型:会员账户,市场账户
    name
    createTime
    status

}

class AccountRecvPay<收支记录>{
      recvPayId:integer
      accountId:integer
      accountName:string
      toAccountId:integer
      toAccountName:string
      io:int #-1为支出,1为收入
      amt:BigDecimal
      createTime:Date
      orderId:integer
      subjectId:intege #科目id
      orderType:string  #订单类型
      beforeAccountAmt: BigDecimal
      afterAccoumtAmt:BigDecimal
      beforeToAccountAmt: BigDecimal
      afterToAccoumtAmt:BigDecimal
      fromConfirmPaymentLogId 
      paymentType:string #支付方式:线上账户,(支付宝,微信,保留),线上确认支付,线下
}

 class Order<交易订单>{
      title:string  订单标题
      orderId: integer
      orderNo:string #订单号
      buyerId: integer #创建者id
      sellerId: integer #卖方id
      createTime: Date #交易时间
      status:string #订单状态
      totalAmt:BigDecimal #总计
      orderType:string #交易订单bizOrder或赊账订单paymentOrder
      finishTime:Date #关闭/完结时间
}
class OrderItem{
    name
    categoryId
    categoryArrStr
    valuetionType #计价方式
    weightPrice#计重单价
    piecePrice#计件单价
    count#小结
}

class ConfirmPaymentLog<请求确认还款记录>{
    confrmPaymentLogId:number
    orderId: integer
    isConfirm:boolean
    createTime:Date
    isDelete:boolean #
    accountPayrecvId:number # 同意后生成的支出id
    paymentWay:string  #还款方式 线下现金
    orderType:string  #还款类型 交易订单或赊账还款
}
class ConfirmOnlineOrder<确认线上订单>{
    confirmOnlineOrderId:number
    orderId: integer
    isConfirm:boolean
    createTime:Date
    isDelete:boolean #
    accountPayrecvId:number # 同意后生成的支出id
    paymentWay:string  #还款方式 线下现金
    orderType:string  #还款类型 交易订单或赊账还款
    status:string #'active','confrm','refuse','delete'
}

Order <-- AccountRecvPay
ConfirmPaymentLog <-up->AccountRecvPay
ConfirmPaymentLog -up->Order
Account-left>AccountRecvPay
OrderItem -left-|>Order
ConfirmOnlineOrder-->Order
ConfirmOnlineOrder..>AccountRecvPay:有可能产生收支


```
```puml
title 订单状态图

交易订单完成:订单状态:完成\n支付类型:线上\n订单类型:交易订单
交易订单线上支付订单挂起:订单状态:挂起,\n支付类型:线上账户\n订单类型:交易订单
交易订单失败:订单状态:失败\n支付类型:线上\n订单类型:交易订单\n订单失败原因:挂起取消,线上确认拒绝
赊账订单:订单状态:代付款\n支付类型:赊欠\n订单类型:赊欠订单
赊账订单挂起:订单状态:挂起\n支付类型:赊欠\n订单类型:赊欠订单
赊账订单失败:订单状态:订单失败\n支付类型:赊账\n订单类型:交易订单\n订单失败原因:挂起取消,线上确认拒绝
赊账订单未还清:订单状态:未还清\n支付类型:赊账\n订单类型:赊欠订单
赊账订单已还清:订单状态:完成\n支付类型:赊账\n订单状态:赊欠订单

[*]-->交易订单线上支付:线上支付
交易订单线上支付-->交易订单线上支付订单挂起:挂起
交易订单线上支付:订单状态:待付款\n支付类型:线上账户\n订单类型:交易订单
交易订单线上支付订单挂起-->交易订单完成:付款
交易订单线上支付-->交易订单完成:线上支付确认通过
交易订单线上支付订单挂起-down->交易订单失败
交易订单线上支付-right->交易订单失败:线上支付确认拒绝
[*] --> 赊账订单
赊账订单-->赊账订单挂起:订单挂起
赊账订单挂起-->赊账订单失败:挂起拒绝支付
赊账订单挂起-->赊账订单未还清
赊账订单未还清-->赊账订单已还清:多次不同类型的还款
赊账订单-->赊账订单失败:线上支付确认拒绝
赊账订单-->赊账订单未还清:线上支付确认通过
```
**订单的支付类型为:**
* 线上
* 赊账


**每一笔收支分为不同类型:**
* 支付宝
* 微信
* 线上账户转账  
    * 来源于钱包线上账户转账
* 线上账户同意转账
    * 来源于交易中的线上支付
* 线下还款申请同意
    * 来源于赊账的线下还款
* 线下还款

订单失败的原因

交易订单



```puml
(订单)
(商户支出)-->订单
(商户收入)-->订单
(市场支出税收A)-->订单
(市场支出税收B)-->订单
```


系统纬度的用例
```puml
actor 商户
(商户)-->(赊账)
(商户)-->(手机开单)
(商户)-->(智能交易)
(商户)-->(伙计开单)
市场-->(收费管理)
市场-->(交易统计)
```