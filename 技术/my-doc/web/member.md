# 会员系统




## 会员卡正常的业务流程

以下是常用的业务场景
>备注: 用户特指手机app的商户
* 用户在柜台办理会员
* 用户在柜台开卡
* 用户在app中开通钱包
* 用户在app中加入团队成为副卡


```puml
title 用户在柜台办理会员
actor 用户
用户 -> 柜台:办理会员
柜台-> 用户:请报下你的手机号,收到的验证码
柜台 -> 梭日web系统: 1.登记手机号成为移动app用户(或根据手机号提取移动用户信息)\n2.查询会员信息(或添加会员信息)
梭日web系统 ->柜台 : 办理成功


```
```puml
title 用户在柜台开卡
actor 用户
用户 -> 柜台 :开卡
柜台->用户:请报下手机号,收到验证码
柜台->梭日web系统:1.登记手机号或注册\n2.查询或添加会员信息\n3.开卡

```

```puml
actor 用户
title 用户在app中开通钱包
用户 --> 开通钱包: 添加会员,添加主卡

```
```puml
title 用户在app中加入团队成为副卡
actor 老板
actor 员工
老板 ->员工:生成邀请二维码,发送给员工
员工->系统:请求加入团队,成功,
```
员工未开卡状态,受到邀请
* 自动开卡(如果没有必填的一些信息)
* 员工已经是老板(主卡)了或者员工(已经分配了卡了)

### 实体类图

```puml
class Customer {
    customerId
    mobi
    password
}

class Member {
    memberId
    customerId 
    payPassword

}
class Card{
    cardId
    customerId
    memberId
}

Customer <|-right- Member
Card -left-|> Member
Card -left-|> Customer

```

## Customer移动端用户
|字段|类型|注释|附加|
|---|---|---|---|
|name|varchar|会员姓名|非空|
|customerId|int|消费者id|主键自增|
|mobi|varchar|手机号|非空,唯一|
|password|varchar|密码|非空|
|passwordHash|varchar(200)|密码hash||
|avatar|varchar|头像|||
|createdAt|Datetime|注册时间||
|status|varchar|状态|'active'|'disabled',默认'active'|
|signupMethod|varchar|注册途径|'web'\|'app',非空|
## 会员开户Member
会员的基本信息
member
|字段|类型|注释|附加|
|---|---|---|---|
|customerId|int|用户id||
|memberId|int|客户id|主键自增|
|address|varchar|地址||
|idcard|varchar|身份证号|非空,唯一|
|idcardImageUrl|varchar|身份证照片||
|mainCardNo|varchar|会员主卡号||
|payPassword|varchar|支付密码|非空，长度大于等于6位|
|payPasswordHash|varchar(200)|支付密码hash|
|createdAt|Datetime|创建时间|非空,默认当前时间|
|status|varchar|状态|'unactive'\|'active'\| 'frozen'\|'disabled' 默认 unactive|
|agentEpId|int|经办人的id,若是app端的用户操作则为null|
|balance|double|账户余额|默认0|
|frozenMoney|double|冻结金额||

* 身份证号码唯一.手机号唯一,返回前端错误信息,“该手机号已经被占用”,"改该身份证已被使用"
* 会员状态
  * unactive 未激活，登陆提示等待激活
  * active 激活
  * frozen 冻结 无法取款，提现,支付，其他业务正常
  * disabled 所有业务都无法使用


## 会员卡MemberCard
member_card
|字段|类型|注释|附加|
|---|---|---|---|
|memberId|int|会员id|非空|
|createdAt|Datetime|发卡时间|非空|
|cardId|int| 卡号id|主键自增|
|status|varchar|卡片状态|默认active|
|cardType|varchar|卡片类型|'master'\|'second'|
|customerId|int |app用户id|非空|
|cardNo|varchar|卡号|唯一主键非空|
|status|varchar|卡状态|'active'\|'unactive'\||
* 每个会员卡对应会员用户和app用户
* 每张会员卡不存储任何金额。金额存放在会员上
* 一个团队最多有一张主卡多张从卡




## 账户日志
customer_log

|字段|类型|注释|附加|
|---|---|---|---|
|customerId|int|用户id|非空|
|logId|int||主键自增|
|message|varchar|消息内容|
|type|varcgar|日志类型|'success'\|'error'\|'warning'|

## 会员日志
member_log
|字段|类型|注释|附加|
|---|---|---|---|
|logId|int||主键自增|
|memberId|int|会员id|非空|
|message|varchar|消息||
|type|varchar|日志类型|'create'\|'disabled'\|'undisabled'\|'frozen'\|'unfrozen'\|'change-password'|


##  OssFile
|字段|类型|注释|附加|
|---|---|---|---|---|
|ossFileId|int||主键自增|
|url|varchar|地址|非空|


## 开卡日志
member_log
|字段|类型|注释|附加|
|---|---|---|---|
|logId|int||主键自增|
|card_id|int|卡号id|非空|
|message|varchar|消息||
|type|varchar|日志类型|'create'\|'recharge'\|'take-money'\|'replacement-card'|

# Api列表

|api|方法|?|body|备注|
|---|---|---|---|---|
|/api/customer/query|Post||{mktId, dateRange?, keyword?, customerType?}|查询系统用户,会员|
|/api/customer/check-customer-exist|Get|phone||检查手机号是否已经注册,短信提示前调用|
|/api/customer/send-auth-code|Get|phone&mktId||获取验证码|
|/api/customer/web-create|Post||{customer:Customer, authcode}|添加用户, 短信通知手机,市场余额扣费|
|/api/upload-image/|Post||{base64:string}|上传图片,入库,返回地址,通用|
/api/member/create|post||Member|创建会员|
|/api/member/update|Post||Member|更新会员|
|/api/customer/detail|Get|customerId||用户详情|
|/api/customer/change-password|password||{newPassword,customerId}|修改用户密码
|/api/member/detail|Get|customerId?或会员拉取信息|会员详情,根据用户|
|/api/member/frozen|Get|memberId,||冻结会员|
|/api/member/unfrozen|Get|memberId||解冻会员|
|/api/member/disabled|Get|memberId||禁用会员||
|/api/member/undisabled|Get|memberId||恢复会员|
|/api/member/destory|Get|memberId||销户,写日志|
|/api/card/create|Post||Card|开卡,区分开卡的是主卡还是从卡,写日志|
|/api/card/replacement|Post||{card,newcardNo}|补卡|
|/api/card/recharge/|Post|{money,mainCard}||充值，写入卡的充值日志 'recharge'|
|/api/card/take-money|Post||{money,mainCard}|取款,写入取款日志||



# 问题

1. 同一个手机号在不同的市场下是多个用户吗,多个会员账户,多个主卡吗?
>  一个手机号在a市场有a用户,同样在b市场可以注册成为b市场的用户,手机号和marketId联合主键

2. 修改密码,充值,取款等特殊操作需要额外的手续,证明文件或说申请流程吗
>

