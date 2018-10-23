/**
 * 此处为原始代码 
 * 
 * csplit 命令:
 * 切割为多个文件
 * 之所以保留原始代码,易于重构
 * 
 * http://man.linuxde.net/csplit
 * 
 * 
 */
export let app_customer_api = {
    /**
     * 登陆
     * post:
     * body:{phone,password,mktId}
     * return {customer,token}
     */
    login: "/app/customer/login",
    /**
     * 忘记密码
     * post:
     * body:customer
     */
    forgotPassword: '/app/customer/forgot-password',

    /**
     * get
     * ?mktId&customerId
     * 
     */
    customerDetail: '/app/customer/detail',
    /**
     * 验证customer密码是否正确
     * post
     * body:customer
     */
    authPassword: '/app/customer/auth-password',
    /**
     * 修改手机
     * get
     * ?newPone&authcode&mktId&customerId
     */
    modifyPhone: '/app/customer/modify-phone',
    /**
     * post
     * body:Customer,
     * ?mktId
     */
    signup: '/app/customer/signup',
}
export let app_message_api = {
    /**
     * get
     * 该接口可以暂时不要
     */
    settingList: '/app/customer/message/setting-list',
    /**
     * 设置自己的消息
     * get
     * newMsgSetting
     */
    msgManage: '/app/customer/message/manage',
    /**
     * get
     * ?customerId&messageTypes
     */
    msgQuery: '/app/customer/message/query',


}

export let app_team_api =
{
    /**
     * 根据customerId列出team成员
     * get
     * ?memberId&teamId
     */
    teamList: "/app/team/list",
    /**
     * POST
     * body:InviteLog
     */
    inviteCustomer: "/app/team/invite-customer",
    /**
     * 接受加入团队邀请
    GET
    ?inviteLogId&mktId&customerId
     */
    acceptInvite: "/app/team/accept-invite",
    /**
     * 拒绝加入团队邀请
        GET
        ?mktId&inviteLogId&customerId
     */
    refuseInvite: "/app/team/refuse-invite",
    /**
    *
    * get
    * ?mktId&customerId
    *        
     */
    invitelogList: "/app/team/invitelog-list",


    /**
     * 根据手机号查找用户
    *get
    *列出发出去的邀请,时间倒叙排序
     **/
    searchCustomerByPhone: "/app/team/search-customer-by-phone",

    /** 
     * get
     * ?mktId&customerId
    */
    findFreeCustomer: "/app/team/find-free-customer",
    /**
     * exitTeam
     */
    exitTeam: '/app/team/exit',

}

export let app_common_api = {
    marketList: '/app/common/market-list',
    /**
     * get
     * ?phone&authcode&verifyType&mktId
     */
    checkAuthcode: '/app/common/check-authcode',
    /**
     * get
     * ?phone&verifyType&mktId
     */
    sendAuthcode: '/app/common/send-authcode'
}
export let app_analysis_api = {
    /**
     * get
     * ?mktId&memberId
     */
    todayInfo: '/app/analysis/todayInfo',

}


export let app_ProductOrder_api = {


    /**
     * post
     * body:order
     */
    orderCreate: '/app/order/create',
    /**
     * post
     * body:TempOrder
     */
    orderUpload: '/app/order/upload',
    orderDowload: '/app/order/download',
    /**
     * 在线支付订单
     * get
     * ?orderId&memberId&mktId
     */
    onlinePayOrder: '/app/order/online-pay-order',
    /**
     * get
     * 推送订单给指定好友
     * ?orderId&memberId&fromMemberId
     */
    sendOrderToMember: '/app/order/send-order-to-member',
    /**
     * 订单作废
     * get
     * ?orderId&memberId&mktId
     */
    orderDisabled: '/app/order/disabled',
    /**
     * 订单详情
     * 
     * ?orderId&mktId
     * return {order}
     */
    orderDetail: '/app/order/detail',
    /**
     * get
     * ?mktId&memberId
     */
    productList: '/app/product/list',
    /**
     * 列出所有市场分类指定parentId的分类
     * get
     * ?mktId&parentId
     */
    productCatList: '/app/productCat/list',
    /**
     * 赊销申请
     * get
     * ?orderId&fromMemberId&toMebmerId
     */
    debtRequest: '/app/order/debt-request',
    /**
     * 赊账同意
     * get
     * ?orderId&memberId&mktId
     * 
     */
    debtAgree: '/app/order/debt-agree',
    /**
     * 拒绝赊账
     * ?orderId&memberId&mktId
     */
    debtRefuse: '/app/order/debt-refuse',





}


export let app_member_account_api = {
    /**
     * 提交会员实名认证信息
     *   post
     * body:MemberRealnameAuth
     */
    memberRealnameAuthCreate: '/app/member/memberRealnameAuth/create',

    /**
     * get 
     * ?customerId&mktId
     * return {customer,status:}
     */
    memberDetail: '/app/member/memberDetail',
    /**
     * get
     * ?memberId&mktId
     * return {account}
     */
    accountDetail: '/app/member/accountDetail',
    /**
     * 拉取其他商户
     * get
     * ?memberId&mktId
     * return {members}
     * 
     */
    memberFriends: '/app/member/friends',
    /**
     * 转账
   * post
   * body:AccoPayRec
   */
    transferAccount: '/app/order/transferAccount',
    /**
     * 获取收钱信息
     * 1. 链接转为二维码形式等待对方扫
     * 2. 扫后返回对应的api返回收钱参数,如accountName,金额
     * 
     * get
     * ?mktId&accountId
     * return {account,amt}
     */
    recvMoneyInfo: '/app/order/recive-money-info',
    /**
     * 此时用户扫了收钱二维码,将recvMoneyInfo返回的参数作为请求参数参数
     * 
     * post
     * body:AccPayRecv 
     * 
     */
    payMoneyInfo: '/app/order/pay-money',

}
// DayAnalysis