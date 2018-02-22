<template>
    <article class="bgfff">
        <p class="title relative bgfff big16" @click="goback"><i></i>服务须知</p>
        <div class="content">
            <div class="atten-item big14 graycolor">
                <span class="big15 grayer content-title block"><span class="maincolor">1.</span> 面诊须知</span>
                <p><i>1.</i>面诊之前，需提供病情，病史，近期服药情况，既往检查结果等，便于面诊医生做对比参考。</p>
                <p><i>2.</i>提供您的有效身份证件（身份证原件，医保卡原件社保卡原件等）。</p>
                <p><i>3.</i>面诊时间，收到您的有效身份证件一周左右通知您</p>
                <p><i>4.</i>面诊当天需要带以往病史，病例，检查报告等。有些之前做的检查可以做参考，还有的检查不要重复做，免去二次检查。</p>
                <p><i>5.</i>请患者及家属按照约定的时间准时到医院，避免过号。</p>
                <p><i>6.</i>如遇特殊情况（专家停诊，出差等）协商解决。</p>
            </div>
            <div class="atten-item big14 graycolor" style="padding-top: 1.2rem;">
                <span class="big15 grayer content-title block"><span class="maincolor">2.</span> 检查须知</span>
                <p>医生开具的检查单：常规检查、影像检查等需要按医院流程预约等候安排，如需加急可另行协商。</p>
            </div>
            <div class="atten-item big14 graycolor" style="padding-top: 1.2rem;">
                <span class="big15 grayer content-title block"><span class="maincolor">3.</span> 住院须知</span>
                <p><i>1.</i>拿到住院条后，一般住院时间是两周左右，紧急科室除外，如需加急安排，则需要根据实际情况再行协商。</p>
                <p><i>2.</i>是否接受指定医生院外手术，请提前思考选择。</p>
                <p><i>3.</i>为了您顺利就诊，服务期间请配合工作人员安排和</p>
                <p><i>4.</i>我们只收取绿通服务费，院内产生的所有院方收取的费用，全部自行承担，患者如需服务，请提前交付全部服务费，如因自身原因中止服务已经产生的费用不退，剩余未发生的费用，我们可以全额退还</p>
            </div>
        </div>
    </article>
</template>
<script>
export default {
    created (){
        this.$nextTick(() => {
            document.documentElement.scrollTop = window.pageYOffset = document.body.scrollTop = 0
        })
    },
    methods: {
        goback (){
            this.$router.go(-1);
        }
    }
}
</script>
<style lang="less" scoped>
    @import "../../../assets/css/var";
    .graycolor { color: rgba(102, 102, 102, 1); }
    .grayer { color: rgba(51, 51, 51, 1); }
    .title {
        height: 3.6rem;
        line-height: 3.6rem;
        text-align: center;
        color:rgba(1,1,1,1);
        border-bottom: 1px solid #eee;
        i{
            display: inline-block;
            width: .7rem;
            height: .7rem;
            border-left: 2px solid #ccc;
            border-bottom: 2px solid #ccc;
            transform: rotate(45deg);
            position: absolute;
            left: 1rem;
            top: 50%;
            margin-top: -.35rem;
        }
    }
    .content {
        padding: 2rem 1.7rem 2rem 2rem;
      p { margin-bottom: 1.5rem; line-height: 2rem; margin-left: 1.5rem; position: relative; }
    }
    .content-title { margin-bottom: 1.325rem; }
    .atten-item {
        span {
            position:relative;
            &:after {
                content: ""; display: block; position:absolute;width: .25rem; height: .9rem; background: @main-color; left:-8px; top: 4px;
             }
        }
        i { font-style: normal; position: absolute; left:-1rem; top: 0;}
    }
</style>
