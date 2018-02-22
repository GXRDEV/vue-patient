/**
 * 图片上传控件，用在快速问诊等表单界面
 */
import File from './File'
/**
 * 图片展示列表，用在家庭成员就诊记录里显示图片列表
 */
import ImgList from './ImgList'
/**
 * 弹出select选择，可以过滤和自定义输入项，用在家庭成员增加就诊记录里面
 */
import FilterSelect from './FilterSelect'
/**
 * 选择科室。全屏显示，快速问诊
 */
import FullDepart from './FullDepart'
/**
 * 倒计时，快速问诊医生抢单
 */
import CountDown from './CountDown'
/**
 * 医生，专家团队库过滤条件之所在省市
 */
import ChooseArea from './ChooseArea'
/**
 * 医生，专家团队库过滤条件之所在科室
 */
import ChooseDepart from './ChooseDepart'
/**
 * 医生，专家团队库过滤条件之所在医院
 */
import ChooseHos from './ChooseHos'
/**
 * 医生，专家团队库过滤条件之开通的服务
 */
import ChooseService from './ChooseService'
/**
 * 医生，专家团队库过滤条件
 */
import Choose from './Choose'
import ChooseItems from './ChooseItems'
/**
 * 热门科室（首页、电话图文问诊医生库）
 */
import HotDepart from './HotDepart'
/**
 * 全国知名专家（首页，医生主页）
 */
import WellKnowExp from './WellKnowExp'
/**
 * 优质医生（首页，优质医生推荐）
 */
import WellKnowDoc from './WellKnowDoc'
/**
 * 医生主页，专家主页出诊时间显示
 */
import DocTimeShow from './DocTimeShow'
/**
 * 医生主页，医生评价，和更多里面的评价
 */
import Appraises from './Appraises'
/**
 * 个人信息的头部信息
 */
import Heads from './Heads'
/**
 * 医生专家列表项
 */
import DocItem from './DocItem'
/**
 * 左右两栏带头像布局
 */
import ItemFlexImg from './ItemFlexImg'
/**
 * 语音播放和图片查看
 */
import Media from './Media'
/**
 * 聊天界面语音说话
 */
import WxSpeaking from './WxSpeaking'
/**
 * 聊天界面文字输入
 */
import Texting from './Texting'
/**
 * 聊天界面的融云服务
 */
import RongImLib from './RongImLib'
/**
 * 聊天界面文字图片等显示与发送
 */
import RongImItem from './RongImItem'
/**
 * 调用微信jssdk选择图片，返回base64
 */
import WxChooseImg from './WxChooseImg'
/**
 * 选择表情
 */
import WxChooseEmj from './WxChooseEmj'
/**
 * 无订单时显示页面
 */
import NoOrder from './NoOrder'
/**
 * 医生列表，团队主页开通的服务
 */
import OpenServices from './OpenServices'
/**
 * 星星显示
 */
import Star from './Star'
/**
 * 无我的医生、最近咨询时显示页面
 */
import NoDoctor from './NoDoctor'
/**
 * 优秀医生团队
 */
import WellKnowTeam from './WellKnowTeam'
/**
 * 星星评分
 */
import Score from './Score'
/**
 * 搜索跳转
 */
import SearchBar from './SearchBar'
/**
 * 家庭成员选项
 */
import FamilyItems from './FamilyItems'
/**
 * 家庭成员选项
 */
import MsgCount from './MsgCount'
/**
 * 医生团队列表
 */
import TeamItem from './TeamItem'

/**
 * 注册头部
 */
import Heading from './Heading'
/**
 * 性别，初复诊选择
 */
import Choice from './Choice'
/**
 * 病例附件
 */
import ShowEnclosure from './ShowEnclosure'
import ShowEnclosures from './ShowEnclosures'
/**
 * 优惠券
 */
import Coupons from './Coupons'
/**
 * 评价
 */
import EvaluateList from './EvaluateList'
/**
 * VIP服务
 */
import Server from './Server'
/**
 * 说明组件
 */
import Rule from './Rule'
/**
 * 邀请好友页面
 */
import Invitation from './Invitation'
/**
 * 快速购药
 */
import FastBuyDrug from './FastBuyDrug'
export {
    File, FilterSelect,
    ImgList, FullDepart,
    CountDown, ChooseArea,
    ChooseDepart, ChooseHos,
    ChooseService, Choose, ChooseItems,
    HotDepart, WellKnowExp, DocTimeShow,
    Appraises, DocItem, ItemFlexImg, Media,
    WxSpeaking, Texting, RongImLib, RongImItem,
    Heads, WxChooseImg, NoOrder, OpenServices,
    Star, NoDoctor, WellKnowTeam, Score, SearchBar,
    FamilyItems, MsgCount, WxChooseEmj, TeamItem,
    Heading, Choice, WellKnowDoc, ShowEnclosure,
    ShowEnclosures, Coupons, EvaluateList,
    Server, Rule, Invitation, FastBuyDrug
}
