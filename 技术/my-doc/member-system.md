

会员系统

```puml
(*) --> 登陆注册
if "开通钱包" then
-down->[成功] 开通会员
登陆注册-down-> if "接受会员邀请" then
-down->[接受] 成为员工
登陆注册 -right-> "游客"

```
```puml






actor 会员
actor 员工
会员 --> 员工

```