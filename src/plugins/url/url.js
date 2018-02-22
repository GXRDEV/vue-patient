/* *******************************************==system==******************************************* */
/**
 * 得到大科室和其下的标准科室
 */
export const GAINBIGDEPARTMENTS = 'system/gainBigDepartments'
/**
 * 获取分享参数
 */
export const GAINSHAREPARAMS = 'system/share/params'
/**
 * 图片上传http://123.57.8.246:8090
 */
export const UPLOADFILENEW = 'system/file/upload'
/**
 * 获取开通城市数据（定位）
 */
export const GAINOPENCITYS = 'system/city/list'
/**
 * 获取标准科室数据
 */
export const GAINSTANDDEPS = 'system/standard/list'
/**
 * 获取附近医院
 */
export const GAINNEARHOSES = 'system/hos/list'
/**
 * 根据医院 id 获取医院名称
 */
export const GAINHOSNAME = 'system/hos/getName'
/**
 * 获取系统暖意
 */
export const GAINSYSWARMS = 'system/warm/list'
/**
 * 获取医生专家开通的服务
 */
export const GAINFILTERSERS = 'system/server/list'
/**
 * 获取首页轮播图片数据
 */
export const GAINMAINPICS = 'system/pics'
/**
 * 获取媒体文件 base64
 */
export const GAINMEDIABASE64 = 'system/media/base64'
/**
 * 获取微信上传返回地址id
 */
export const GAINMEDIAINFO = 'system/media/info'
/**
 * 根据经纬度得到所在地区的名称和编码
 */
export const GAINLOCATIONINFO = 'system/location/info'
/**
 * 拉取openid获取code
 */
export const GAINOPENIDBYCODE = 'system/wx/openid/get'
/**
 * 得到行政区划，可联动，可所有
 */
export const GAINSYSAREA = 'system/area/list'
/**
 * 底部我的医生 判断是否有最新消息
 */
export const HASNEWMSG = 'system/hasNewMsg'
/**
 * 根据专家科室获取标准科室
 */
export const GETSTANDARDDEPBYDOCTORDEP = 'system/standar/getByDepId'
/**
 * 获取健康资讯tab栏数据
 */
export const GAINPLATHEALTHTYPES = 'system/health/types'
/**
 * 获取健康资讯数据
 */
export const HEALTHINFORMATION = 'system/health/information'
/**
 * 获取系统疾病
 */
export const GAINSYSTEMDISEASE = 'system/disease/list'
/**
 * 获取系统标签
 */
export const GAINSYSTAGS = 'system/tag/list'
/**
 * 获取邀请码
 */
export const GETCODE = 'system/code/get'
/**
 * 获取系统业务字典
 */
export const GETDICTIONARY = 'system/dictionary/list/'
/**
 * 获取期望日期
 */
export const LOADWISHTIME = 'system/loadwishtime'
/**
 * 根据医院加载科室
 */
export const GETBYHOSID = 'system/departs/getByhosId'
/**
 * 加载专家级别及价格
 */
export const LOADLEVELS = 'system/loadlevels'
/**
 * 远程会诊下单专家列表
 */
export const LOADEXPERTS = 'system/loadexperts'

/* *******************************************==user==******************************************* */
/**
 * 获取家庭成员列表
 */
export const GAINFAMILIES = 'user/family/list'
/**
 * 获取家庭成员信息
 */
export const GAINFAMILERINFO = 'user/family/info'
/**
 * 获取家庭成员就诊记录
 */
export const GAINFAMRECORDS = 'user/family/record/list'
/**
 * 新增家庭成员就诊记录
 */
export const ADNEWRECORD = 'user/family/record/add'
/**
 * 新增或编辑家庭成员
 */
export const SAVEORUPDATEFAMILER = 'user/family/saveOrUpdate'
/**
 * 删除家庭成员
 */
export const DELFAMILER = 'user/family/delete'
/**
 * 获取家庭成员就诊记录详情
 */
export const GAINRECORDINFO = 'user/family/record/info'
/**
 * 删除家庭成员就诊记录
 */
export const DELETERECORD = 'user/family/record/delete'
/**
 * 订单中家庭成员病例信息
 */
export const GAINFAMILYCASEINFO = 'user/family/case/info'
/**
 * 拉取微信的基本信息
 */
export const GAINPERSONINFO = 'user/info'
/**
 * 判断当前微信号是否绑定电话
 */
export const TELLBIND = 'user/isbind'
/**
 * 获取我的心意列表
 */
export const MYWARMS = 'user/warm/list'
/**
 * 获取资料库
 */
export const LOADHISTORYCASES = 'user/family/case/history'
/**
 * 通过caseid获取资料详情
 */
export const LOADCASEINFO = 'user/case/info'
/**
 * 保存补充病例
 */
export const RESETCASE = 'user/case/reset'
/**
 * 提交用户反馈信息
 */
export const SUBMITUSERADVICE = 'user/advice/submit'
/**
 * 修改用户密码
 */
export const MODIFYUSERPASSWARD = 'user/pass/update'
/**
 * 发送验证码
 */
export const GAINVERYCODE = 'user/code/get'
/**
 * 验证手机号
 */
export const TELLCODENEW = 'user/code/ifbind'
/**
 * 我关注的医生列表
 */
export const GETUSERATTENTEDDOCTOR = 'user/doc/attent/list'
/**
 * 查看医生时候被关注
 */
export const QUERYATTENTDOCTOR = 'user/doc/isAttent'
/**
 * 对医生进行关注
 */
export const ATTENTDOCTOR = 'user/doc/attent'
/**
 * 取消对医生的关注
 */
export const DELATTENTDOCTOR = 'user/doc/delAttent'
/**
 * 我的评价列表
 */
export const QUERYESTIMATE = 'user/evalua/list'
/**
 * 完善资料
 */
export const COMPLETEUSERINFO = 'user/info/complete'
/**
 * 个人中心首次完善资料，送优惠券
 */
export const MAINCOMPLETEINFO = 'user/info/mainComplete'

/**
 * 评价
 */
export const SAVEESTIMATE = 'user/evalua/add'
/**
 * 优惠券
 */
export const COUPONLIST = 'user/coupon/list'
/**
 * 我的消息
 */
export const MYMESSAGELIST = 'user/message/list'
/**
 * 送心意
 */
export const SUBUSERWARM = 'user/warm/submit'
/**
 * 判断是否可以报道
 */
export const TELLREPORT = 'user/family/tellreport'
/**
 * 获取我的医生
 */
export const MYDOCTORS = 'user/mine/doctors'
/**
 * 编辑用户基本信息
 */
export const MODIFYUSERINFO = 'user/update'
/**
 * 交易记录
 */
export const GAINUSERBILLS = 'user/bill/list'
/**
 * 我的订单
 */
export const MYORDERS = 'user/order/list'
/**
 * 感兴趣科室提交
 */
export const INTERESTDEPANDDISEASE = 'user/info/depAndDis'
/**
 * 关注医生团队
 */
export const ATTENTDOCTORTEAM = 'user/docteam/attent'
/**
 * 查看医生团队是否被关注
 */
export const QUERYATTENTDOCTORTEAM = 'user/docteam/isAttent'
/**
 * 取消关注医生团队
 */
export const DELDOCTORTEAM = 'user/docteam/delDoctorTeam'
/**
 * 用户感兴趣的科室及疾病
 */
export const GAINUSERINTERESTS = 'user/info/depAndDis/interests'
/**
 * 送心意时优惠券
 */
export const GETCOUPON = 'user/coupon/available'
/**
 * 送心意时优惠券
 */
export const GAINWARMTIME = 'user/warm/time'
/**
 * 获取评价医生
 */
export const DOCS = 'user/evalua/docs'
/**
 * 我的签约医生
 */
export const MYPRIVATEDOCS = 'user/private/list'
/**
 * 获取签约患者数据
 */
export const SIGNATORY = 'user/private/users'
/**
 * 解除VIP
 */
export const RELIEVE = 'user/private/relieve'
/**
 * 获取系统消息列表
 */
export const GETSYSTEMLIST = 'user/message/system/list'
/**
 * 判断系统消息是否已读
 */
export const SYSTEMREADED = 'user/system/message/readed'
/**
 * 稍后完善触发生成系统消息
 */
export const WAITTOCOMPLETE = 'user/waitToComplete'
/**
 * 获取抢红包中奖记录列表
 */
export const GETREDPACKETLIST = 'system/redpacket/list'
/**
 * 判断是否领取过红包
 */
export const ISGETREDPACKET = 'system/redpacket/grap'

/* *******************************************==order==******************************************* */
/**
 * 获取快速问诊信息和推送医生列表
 */
export const GAINFASTDOCSEL = 'order/fast/docdatas'
/**
 * 取消快速问诊
 */
export const CANCELFAST = 'order/fast/cancel'
/**
 * 确认医生，向他提问，支付返回支付参数
 */
export const CONFIRMDOC = 'order/fast/confirm'
/**
 * 绑定订单
 */
export const BINDORDERBYCODE = 'order/bind'
/**
 * 获取视频会诊订单信息
 */
export const GAINVEDIOINFO = 'order/vedio/info'
/**
 * 最近咨询
 */
export const NEWLYADVICES = 'order/advices'
/**
 * 完成与取消订单操作
 */
export const COMPLETEDORDER = 'order/status/update'
/**
 * 获取团队复诊意见
 */
export const GAINREVISITINFO = 'order/revisit'
/**
 * 订单基本信息
 */
export const GAINSIMPLEORDERINFO = 'order/info'
/**
 * 获取快速问诊数据
 */
export const QUERYFASTCOUNT = 'order/ongoing'
/**
 * 患者报道
 */
export const PATIENTREPORT = 'order/report/submit'
/**
 * 患者问诊提交
 */
export const SUBMITORDER = 'order/submit'
/**
 * 订单支付
 */
export const ORDERPAY = 'order/pay'
/**
 * 订单支付
 */
export const UPDATECHATORDER = 'order/fast/update'
/**
 * 订单支付
 */
export const GOTOPAY = 'order/continue'
/**
 * 远程会诊下单支付
 */
export const SUBREMOTECASE = 'order/subremotecase'
/**
 * 远程入口提交图文或者电话
 */
export const SUBONLINEORDER = 'order/subonlineorder'

/* *******************************************==doctor==******************************************* */
/**
 * 获取医生数据
 */
export const GAINDOCTORS = 'doctor/list'
/**
 * 获取医生评价数据
 */
export const GAINAPPRAISES = 'doctor/appraises'
/**
 * 获取服务价格
 */
export const DOCSERVICEINFO = 'doctor/serviceInfos'
/**
 * 获取医生出诊时间
 */
export const GAINVISITTIMES = 'doctor/time/list'
/**
 * 获取医生基本信息
 */
export const GAINDOCBASEINFO = 'doctor/docinfo'
/**
 * 获取医生基本信息
 */
export const DOCMAIN = 'doctor/main'
/**
 *心意墙
 */
export const WARMWALL = 'doctor/warm/list'
/**
 * 获取医生动态
 */
export const GAINDOCTORNOTIFYS = 'doctor/notify/list'
/**
 * 获取医生所属医生团队数据
 */
export const GAINDOCBELONGTEAMS = 'doctor/belongTeams'
/**
 * 家庭医生或团队vip提交
 */
export const PRIVATESUBMIT = 'doctor/private/submit'

/* *******************************************==docteam==******************************************* */
/**
 * 获取医生团队数据
 */
export const GAINDOCTEAMS = 'docteam/list'
/**
 * 获取团队成员数据
 */
export const GAINTEAMMEMBERS = 'docteam/member/list'
/**
 * 获取医生团队基本信息
 */
export const GAINTEAMBASICINFO = 'docteam/info'
/**
 * 获取医生团队基本信息
 */
export const GAINTEAMBASICINFOWITHERWEIMA = 'docteam/baseinfo'
/**
 * 获取医生或团队vip服务
 */
export const VIPSERVER = 'doctor/private/server/list'

/* *******************************************==im==******************************************* */
/**
 * 患者报到中的单聊参数获取
 */
export const GAINIMTOKEND2PSINGLE = 'im/tonken/single'
/**
 * 订单聊天中的群聊参数获取
 */
export const GAINIMTOKEND2PGROUP = 'im/tonken/group'
/**
 * 获取聊天记录
 */
export const GAINCHATDATAS = 'im/chat/list'
/**
 * 保存聊天记录
 */
export const SAVEMESSAGE = 'im/chat/add'
/**
 * 获取未读消息数量
 */
export const GAINUNREADMSGCOUNT = 'im/chat/unRead'
/**
 * 获取推送消息数据
 */
export const GAINSYSTEMPUSHINFODATAS = 'im/chat/push/list'
/**
 * 更新消息的状态
 */
export const UPDATESYSTEMPUSHINFOREAD = 'im/chat/push/update'
/**
 * 更新消息状态
 */
export const MODIFYMSGTOREADED = 'im/chat/readed'
/**
 * 全部消息更新为已读
 */
export const UPDATESYSTEMPUSHINFOREADALL = 'im/chat/push/update/all'
/**
 * 清除全部消息
 */
export const DELALLMESSAGE = 'im/chat/push/update/del'
/**
 * 获取安卓播放地址
 */
export const GAINVOICESRC = 'im/chat/msg/get'

/* *******************************************==d2p其它==******************************************* */

/**
 * 待付款
 */
export const CONTINUEPAY = 'continuepay'
/* *******************************************==drug==******************************************* */

/**
 * 药品列表
 */
export const DRUGSLIST = 'drug/list'
/**
 * 药品详情
 */
export const DRUGDETAIL = 'drug/info'
/**
 * 药品订单列表
 */
export const DRUGORDERLIST = 'drug/order/list'
/**
 * 药品订单详情
 */
export const DRUGORDERDETAIL = 'drug/order/detail'
/**
 * 药品订单操作
 */
export const DRUGORDEROPERATE = 'drug/order/operate'
/**
 * 购物车提交
 */
export const DRUGSUBMIT = 'drug/submit'
/**
 * 获取药品分类
 */
export const DRUGTYPELIST = 'drug/type/list'

