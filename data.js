/**
 * 2026年中国航天发射数据库
 * 数据维护说明：
 * - s/e: 日期 YYYY-MM-DD（待定任务留空字符串）
 * - t: 具体时刻或"—"
 * - rk: 火箭型号（点击跳转火箭详情页，key见ROCKETS表）
 * - pl: 载荷描述
 * - satCount: 实际成功入轨卫星数（失败/推迟为0）
 * - site: 发射场
 * - op: 运营方（点击跳转运营方详情页，key见OPERATORS表）
 * - cat: 分类 xingwang/yuanxin/other/verify/major
 * - ty: 国发/商发
 * - st: done/fail/delay/plan
 * - hl: 是否高亮（1/0）
 * - src: 数据来源（key见SOURCES表：xinhua/spacechina/landspace/cas-space/galactic-energy/orienspace/spacex/launchlib/est/tbd）
 * - note: 备注
 * - llId: [可选] Launch Library 2 slug，流水线匹配主键，由 scripts/merge-data.js 自动回填，人工不填
 * - lock: [可选] 字段锁数组，数组内字段不受流水线覆盖（合法值 {s,e,t,st,satCount,src}）
 *
 * src 赋值规则：国外·流水线自动合并 → launchlib；est 为历史整理值专用。
 */

/* 厂家分组表 —— 一级大类（国家队/民营/国际），二级厂家，三级型号 */
const VENDORS = {
  rocket: {
    /* 中国火箭厂家 */
    "casc": {
      name: "中国航天科技集团",
      short: "CASC·航天科技",
      type: "国家队",
      founded: "1999年",
      hq: "北京",
      site: "酒泉/太原/西昌/文昌/海上",
      intro: "中国航天主力军，运载火箭与航天器研制的国家队。长征系列火箭全部出自其下属一院、六院、八院等，承担神舟载人、嫦娥探月、天宫空间站等全部国家重大航天工程。",
      models: ["cz2c","cz2d","cz2f","cz3b","cz4b","cz4c","cz5","cz6","cz6a","cz6c","cz7","cz7a","cz8","cz8a","cz12","cz12a","cz12b","cz10b","jl3"]
    },
    "casic": {
      name: "中国航天科工集团",
      short: "CASIC·航天科工",
      type: "国家队",
      founded: "1999年",
      hq: "北京",
      site: "酒泉/太原/海上",
      intro: "前身为航天工业部，以导弹武器系统见长，快舟系列固体运载火箭实现快速发射能力，主打「一周内完成测试出厂」的快响应模式。",
      models: ["kz11"]
    },
    "landspace": {
      name: "蓝箭航天",
      short: "蓝箭",
      type: "民营",
      founded: "2015年",
      hq: "北京·亦庄",
      site: "酒泉·蓝箭工位",
      intro: "中国民营火箭第一梯队，国内首家实现液体火箭入轨的民营企业。朱雀二号是全球首款成功入轨的液氧甲烷火箭，朱雀三号瞄准可复用不锈钢箭体，对标SpaceX猎鹰9。",
      models: ["zq2","zq3","zq2e"]
    },
    "cas-space": {
      name: "中科宇航",
      short: "中科宇航",
      type: "民营",
      founded: "2018年",
      hq: "广州·南沙",
      site: "酒泉/海上",
      intro: "中科院力学所背景，力箭一号是当前国内运力最大的民营固体火箭，力箭二号转向液体可复用路线。",
      models: ["lz1","lz2"]
    },
    "galactic-energy": {
      name: "星河动力",
      short: "星河动力",
      type: "民营",
      founded: "2018年",
      hq: "北京",
      site: "酒泉/海上",
      intro: "民营火箭头部，谷神星一号已实现连续成功与海上发射商业化交付，累计发射次数民营第一。智神星一号为液氧煤油可复用构型，在研中。",
      models: ["gsc1","gsc2","zs1"]
    },
    "orienspace": {
      name: "东方空间",
      short: "东方空间",
      type: "民营",
      founded: "2020年",
      hq: "烟台",
      site: "海上",
      intro: "山东烟台起家，主打海上发射。引力一号是全球最大固体运载火箭（LEO 6.5t），原力-85/87系列液体火箭在研。",
      models: ["yyl1"]
    },
    /* 国际火箭厂家 */
    "spacex": {
      name: "SpaceX",
      short: "SpaceX",
      type: "美国商业",
      founded: "2002年",
      hq: "美国·加州Hawthorne",
      site: "卡角/肯尼迪/范登堡/Starbase",
      intro: "全球商业航天霸主。猎鹰9一级复用创造单枚20+次复飞纪录，占全球年度发射总量的70%以上；星舰（Starship）为完全可复用超重型运载工具，瞄准火星殖民。",
      models: ["falcon9","falconH","starship"]
    },
    "ula": {
      name: "ULA(联合发射联盟)",
      short: "ULA",
      type: "美国传统",
      founded: "2006年",
      hq: "美国·科罗拉多州",
      site: "卡角/范登堡",
      intro: "波音与洛马合资，长期垄断美国国家安全载荷发射。Atlas V功勋卓著，Vulcan Centaur为新一代主力。",
      models: ["atlasV","vulcan"]
    },
    "arianespace": {
      name: "ArianeSpace",
      short: "ArianeSpace",
      type: "欧洲",
      founded: "1980年",
      hq: "法国· Evry",
      site: "库鲁（法属圭亚那）",
      intro: "全球首家商业发射服务商，阿丽亚娜系列曾统治商业GTO市场。阿丽亚娜6为现役主力，与SpaceX价格竞争中转型。",
      models: ["ariane6"]
    },
    "roscosmos": {
      name: "俄罗斯航天局",
      short: "俄航局",
      type: "国营",
      founded: "1992年",
      hq: "俄罗斯·莫斯科",
      site: "拜科努尔/普列谢茨克/东方港",
      intro: "继承苏联航天衣钵，联盟号是人类发射频次最高的火箭系列。国际制裁后转向本国军用载荷与OneWeb以外的商业合作。",
      models: ["soyuz","proton"]
    },
    "jaxa": {
      name: "日本JAXA·三菱重工",
      short: "JAXA",
      type: "国营",
      founded: "2003年",
      hq: "日本·筑波/东京",
      site: "种子岛/内之浦",
      intro: "H3为日本新一代主力火箭，接替H-IIA，目标是发射成本减半，与SpaceX争夺国际商业订单。",
      models: ["h3"]
    },
    "isro": {
      name: "印度ISRO",
      short: "ISRO",
      type: "国营",
      founded: "1969年",
      hq: "印度·班加罗尔",
      site: "萨迪什·达万",
      intro: "以极高性价比著称，一箭104星世界纪录保持者。GSLV MK III（LVM3）为重型主力，月船三号即由其发射。",
      models: ["gslv"]
    },
    "rocketlab": {
      name: "Rocket Lab",
      short: "Rocket Lab",
      type: "商业",
      founded: "2006年",
      hq: "美国·加州Long Beach",
      site: "新西兰玛希亚/瓦勒普斯",
      intro: "小型发射市场龙头，Electron为全球发射频次第二高的现役火箭。Neutron中大型可复用火箭瞄准星座组网市场，直接对标猎鹰9。",
      models: ["electron","neutron"]
    },
    "abl": {
      name: "ABL Space",
      short: "ABL",
      type: "商业",
      founded: "2017年",
      hq: "美国·加州El Segundo",
      site: "卡角LC-46等",
      intro: "低成本小型液体火箭RS1，主打快速部署。2023年首飞失利后处于调整期。",
      models: ["rs1"]
    }
  },
  operator: {
    /* 中国卫星运营商 */
    "cn-satnet": {
      name: "中国星网",
      short: "星网",
      type: "国网星座",
      founded: "2021年",
      hq: "北京·雄安",
      key: "satnet",
      intro: "中国卫星互联网国家工程，统筹GW星座建设，规划约1.3万颗低轨卫星，对标美国星链，保障国家空间网络主权。"
    },
    "cn-yuanxin": {
      name: "垣信卫星",
      short: "垣信",
      type: "千帆星座",
      founded: "2018年",
      hq: "上海",
      key: "yuanxin",
      intro: "上海国资背景，千帆（G60星链）星座运营方，规划1.4万余颗低轨卫星，2024年起以18星/批的节奏快速组网，2026年进入密集发射期。"
    },
    "cn-cmcc": {
      name: "中国移动",
      short: "移动",
      type: "手机直连",
      founded: "—",
      hq: "北京",
      key: "cmcc",
      intro: "「天地一体」战略，星上基站试验卫星已入轨，瞄准普通手机无需改装直接连卫星的通信服务。"
    },
    "cn-tianqi": {
      name: "国电高科",
      short: "天启",
      type: "物联网",
      founded: "2015年",
      hq: "北京",
      key: "tianqi",
      intro: "首张卫星物联网牌照持有者，天启星座38颗规划、41颗在轨（含补网），服务物流、电网、海洋等物联场景。"
    },
    "cn-starcdo": {
      name: "时空道宇",
      short: "道宇",
      type: "遥感+通信",
      founded: "2018年",
      hq: "浙江·台州",
      key: "starcdo",
      intro: "吉利科技集团旗下，第二张卫星物联网牌照。自建台州卫星超级工厂，星座规划与汽车生态联动（车载卫星通信）。"
    },
    "cn-weili": {
      name: "微厘空间",
      short: "微厘",
      type: "导航增强",
      founded: "—",
      hq: "北京",
      key: "weili",
      intro: "低轨导航增强星座，为北斗系统提供高精度增强服务，定位精度可达分米/厘米级。"
    },
    "cn-human": {
      name: "中国载人航天工程",
      short: "载人",
      type: "空间站",
      founded: "1992年",
      hq: "北京",
      key: "human",
      intro: "「三步走」战略已进入空间站运营阶段。天宫空间站常态化驻留乘组，神舟载人、天舟货运按需发射，年发射约2次载人+2次货运。"
    },
    "cn-moon": {
      name: "月球探测工程",
      short: "探月",
      type: "深空",
      founded: "2004年",
      hq: "北京",
      key: "moon",
      intro: "嫦娥系列月球探测工程。嫦娥七号原定2026年发射，因台风推迟至2027年，将执行月球南极环境与资源勘察。"
    },
    /* 国际卫星运营商 */
    "spacex-starlink": {
      name: "SpaceX·星链",
      short: "星链",
      type: "低轨星座",
      founded: "2015年",
      hq: "美国·华盛顿州",
      key: "starlink",
      intro: "全球最大低轨宽带星座，在轨超7700颗，服务100+国家500万+用户。V3卫星单颗容量1Tbps，星间激光组网。"
    },
    "amazon-kuiper": {
      name: "亚马逊·Kuiper",
      short: "Kuiper",
      type: "低轨星座",
      founded: "2019年",
      hq: "美国·华盛顿州",
      key: "kuiper",
      intro: "贝索斯旗下星座计划，规划3236颗，2026年进入大规模部署阶段，是星链最直接的竞争对手。"
    },
    "oneweb": {
      name: "OneWeb",
      short: "OneWeb",
      type: "低轨星座",
      founded: "2012年",
      hq: "英国·伦敦",
      key: "oneweb",
      intro: "一代星座648颗已完成组网，Gen2验证批次发射中。后被法国Eutelsat并购，主打政府与企业市场。"
    }
  }
};

/* 火箭型号表 —— 用于火箭专属页跳转与统计 */
const ROCKETS = {
  "cz2c":     {name:"长征二号丙",       vendor:"中国航天科技集团一院",      type:"液体", fuel:"常温推进剂", leo:"约700km·2.4t", note:"长征系列老牌火箭"},
  "cz2d":     {name:"长征二号丁",       vendor:"中国航天科技集团八院",      type:"液体", fuel:"常温推进剂", leo:"SSO 700km·1.5t", note:""},
  "cz2f":     {name:"长征二号F",        vendor:"中国航天科技集团一院",      type:"液体", fuel:"常温推进剂", leo:"近地轨道·8.4t", note:"载人飞船专用"},
  "cz3b":     {name:"长征三号乙",       vendor:"中国航天科技集团一院",      type:"液体", fuel:"常温推进剂", geo:"GTO·5.5t", note:"高轨主力"},
  "cz4b":     {name:"长征四号乙",       vendor:"中国航天科技集团八院",      type:"液体", fuel:"常温推进剂", leo:"SSO·2.8t", note:""},
  "cz4c":     {name:"长征四号丙",       vendor:"中国航天科技集团八院",      type:"液体", fuel:"常温推进剂", leo:"SSO·3t", note:""},
  "cz5":      {name:"长征五号",         vendor:"中国航天科技集团一院",      type:"液体", fuel:"液氧液氢+煤油", leo:"25t", note:"重型火箭"},
  "cz6":      {name:"长征六号",         vendor:"中国航天科技集团八院",      type:"液体", fuel:"液氧煤油", leo:"1t", note:"小型快速发射"},
  "cz6a":     {name:"长征六号改/甲",    vendor:"中国航天科技集团八院",      type:"液体+固体", fuel:"液氧煤油+固体助推", leo:"4t", note:""},
  "cz6c":     {name:"长征六号丙",       vendor:"中国航天科技集团八院",      type:"液体", fuel:"液氧煤油", leo:"2t", note:""},
  "cz7":      {name:"长征七号",         vendor:"中国航天科技集团一院",      type:"液体", fuel:"液氧煤油", leo:"13.5t", note:"货运飞船"},
  "cz7a":     {name:"长征七号甲",      vendor:"中国航天科技集团一院",      type:"液体", fuel:"液氧煤油+液氢", geo:"GTO·7t", note:"高轨型"},
  "cz8":      {name:"长征八号",         vendor:"中国航天科技集团一院",      type:"液体", fuel:"液氧煤油", leo:"SSO·4.5t", note:""},
  "cz8a":     {name:"长征八号甲/改进型",vendor:"中国航天科技集团一院",      type:"液体", fuel:"液氧煤油", leo:"SSO·7t", note:"改进型一箭多星"},
  "cz12":     {name:"长征十二号",      vendor:"中国航天科技集团六院",      type:"液体", fuel:"液氧煤油", leo:"LEO·10t", note:"商业发射"},
  "cz12a":    {name:"长征十二号甲",    vendor:"中国航天科技集团六院",      type:"液体", fuel:"液氧煤油", leo:"LEO·10t", note:"可复用验证"},
  "cz12b":    {name:"长征十二号乙",    vendor:"中国航天科技集团六院",      type:"液体", fuel:"液氧煤油", leo:"LEO·10t", note:"2026首飞"},
  "cz10b":    {name:"长征十号乙",      vendor:"中国航天科技集团一院",      type:"液体", fuel:"液氧液氢+煤油", leo:"70t(未来载人登月)", note:"2026首飞·海上回收"},
  "kz11":     {name:"快舟十一号",      vendor:"中国航天科工集团",          type:"固体", fuel:"固体", leo:"1.5t", note:"快响应"},
  "jl3":      {name:"捷龙三号",        vendor:"中国航天科技集团一院",      type:"固体", fuel:"固体", leo:"LEO·1.5t", note:"海上发射"},
  "lz1":      {name:"力箭一号",        vendor:"中科宇航",                  type:"固体", fuel:"固体", leo:"LEO·2t", note:"商业固体"},
  "lz2":      {name:"力箭二号",        vendor:"中科宇航",                  type:"液体", fuel:"液氧煤油", leo:"LEO·6t", note:"2026首飞"},
  "zq2":      {name:"朱雀二号改进型",  vendor:"蓝箭航天",                  type:"液体", fuel:"液氧甲烷", leo:"LEO·4t(改进型)", note:"民营液体"},
  "zq3":      {name:"朱雀三号",        vendor:"蓝箭航天",                  type:"液体", fuel:"液氧甲烷", leo:"LEO·6.5t(可复用)", note:"可复用验证"},
  "zq2e":     {name:"朱雀二号E",      vendor:"蓝箭航天",                  type:"液体", fuel:"液氧甲烷", leo:"LEO·6t", note:"民营液体·算力卫星"},
  "gsc1":     {name:"谷神星一号",      vendor:"星河动力",                  type:"固体", fuel:"固体", leo:"LEO·0.5t", note:""},
  "gsc2":     {name:"谷神星二号",      vendor:"星河动力",                  type:"液体", fuel:"液氧甲烷", leo:"LEO·2.8t", note:"2026首飞"},
  "yyl1":     {name:"引力一号",        vendor:"东方空间",                  type:"固体", fuel:"固体", leo:"LEO·6.5t", note:"全球最大固体"},
  "zs1":      {name:"智神星一号",      vendor:"星河动力",                  type:"液体", fuel:"液氧煤油", leo:"LEO·7t(可复用)", note:"2026首飞"},
  "cz10a":    {name:"长征十号甲",      vendor:"中国航天科技集团一院",      type:"液体", fuel:"液氧液氢+煤油", leo:"70t(载人飞船发射)", note:"梦舟载人飞船发射载具·2026首飞"},
  /* === 国际火箭 === */
  "falcon9":  {name:"Falcon 9",        vendor:"SpaceX",                    type:"液体", fuel:"液氧煤油", leo:"LEO·22.8t(可复用)", note:"全球复用标杆"},
  "falconH":  {name:"Falcon Heavy",   vendor:"SpaceX",                    type:"液体", fuel:"液氧煤油", leo:"LEO·63.8t", note:"重型"},
  "starship": {name:"Starship",        vendor:"SpaceX",                    type:"液体", fuel:"液氧甲烷", leo:"LEO·150t(可复用)", note:"超重型·2026验证期·火星运输"},
  "atlasV":   {name:"Atlas V",        vendor:"ULA(联合发射联盟)",         type:"液体", fuel:"液氧煤油+固体", leo:"LEO·18.8t", note:"传统中型"},
  "vulcan":   {name:"Vulcan Centaur", vendor:"ULA(联合发射联盟)",         type:"液体", fuel:"液氧甲烷", leo:"LEO·27.2t", note:"替代Atlas V"},
  "ariane6":  {name:"Ariane 6",       vendor:"欧洲航天局·ArianeSpace",     type:"液体", fuel:"液氧液氢+固体", leo:"LEO·21.6t", note:"欧洲新型"},
  "soyuz":    {name:"Soyuz-2",        vendor:"俄罗斯航天局·Progress",      type:"液体", fuel:"液氧煤油", leo:"LEO·8.2t", note:"联盟系列"},
  "proton":   {name:"Proton-M",       vendor:"俄罗斯航天局·赫鲁尼切夫",    type:"液体", fuel:"常温推进剂", geo:"GTO·6.9t", note:"重型"},
  "h3":       {name:"H3",             vendor:"日本JAXA·三菱重工",          type:"液体", fuel:"液氧液氢", leo:"LEO·6.5t", note:"日本新型"},
  "gslv":     {name:"GSLV Mark III",  vendor:"印度ISRO",                  type:"液体", fuel:"液氧液氢+固体", geo:"GTO·4t", note:"印度重型"},
  "neutron":  {name:"Neutron",        vendor:"Rocket Lab",                type:"液体", fuel:"液氧甲烷", leo:"LEO·13t(可复用)", note:"2026验证期"},
  "electron": {name:"Electron",       vendor:"Rocket Lab",                type:"液体", fuel:"液氧煤油", leo:"LEO·0.3t", note:"小型快速"},
  "rs1":      {name:"RS1",            vendor:"ABL Space",                  type:"液体", fuel:"液氧煤油", leo:"LEO·1.3t", note:"商业小型"},
};

/* 卫星运营方表 —— 用于运营方专属页跳转与统计
   在轨数口径（B5 派生计算）：带 inOrbitBase/inOrbitBaseDate 的可计数星座，
   页面展示 inOrbitNow = inOrbitBase + Σ(opKey 匹配且 st=done 且 s>基准日 事件的 satCount)；
   inOrbit 为旧静态快照，仅作无基准运营方的回退文案。
   归口规则：星链任务（sx-*）opKey=starlink；Kuiper 任务（kp-*）opKey=kuiper；
   Starship 试飞（ss-*）保留 opKey=spacex（厂家兜底），amazon 条目同为厂家兜底。
   事件卡片显示名（op 字段）不受归口影响。 */
const OPERATORS = {
  "satnet":   {name:"中国星网",          short:"星网",      type:"低轨宽带星座",  plan:"国网星座·1.3万颗",  inOrbit:"组网中", note:"卫星互联网国家工程"},
  "yuanxin":  {name:"垣信卫星",          short:"垣信",      type:"低轨宽带星座",  plan:"千帆星座·1.4万颗",  inOrbit:"238颗(截至7/5)", inOrbitBase:238, inOrbitBaseDate:"2026-07-05", note:"B轮估值500亿"},
  "cmcc":     {name:"中国移动",          short:"移动",      type:"手机直连卫星",  plan:"试验组网",          inOrbit:"2颗", inOrbitBase:2, inOrbitBaseDate:"2026-06-09", note:"星上基站试验"},
  "tianqi":   {name:"国电高科·天启星座",short:"天启",      type:"物联网星座",    plan:"38颗",              inOrbit:"41颗", inOrbitBase:41, inOrbitBaseDate:"2026-05-07", note:"首张卫星物联网牌照"},
  "starcdo":  {name:"时空道宇",          short:"道宇",      type:"遥感+通信",     plan:"吉利星座",          inOrbit:"组网中", note:"第二张物联网牌照"},
  "weili":    {name:"微厘空间",          short:"微厘",      type:"导航增强星座",  plan:"低轨导航增强",      inOrbit:"组网中", note:""},
  "dfhy":     {name:"东方慧眼",          short:"慧眼",      type:"高光谱遥感",    plan:"星座",              inOrbit:"2颗", inOrbitBase:2, inOrbitBaseDate:"2026-08-05", note:""},
  "human":    {name:"中国载人航天工程",  short:"载人航天",  type:"空间站",        plan:"空间站运营",        inOrbit:"天宫·3舱+神舟", note:""},
  "moon":     {name:"月球探测工程",      short:"探月",      type:"深空探测",      plan:"嫦娥七号→2027",     inOrbit:"—", note:"四期工程"},
  "weather":  {name:"国家气象卫星",      short:"气象",      type:"气象卫星",      plan:"风云系列",          inOrbit:"多颗", note:""},
  "geo":      {name:"国家遥感任务",      short:"遥感",      type:"遥感卫星",      plan:"遥感五十号系列",    inOrbit:"—", note:""},
  "comm":     {name:"通信技术试验",      short:"通技",      type:"通信技术验证",  plan:"试验卫星",          inOrbit:"—", note:""},
  "tianlian": {name:"天链中继卫星",      short:"天链",      type:"数据中继",      plan:"第三代组网",        inOrbit:"多颗", note:""},
  "cn_satcom":{name:"中国卫通",          short:"卫通",      type:"高轨通信",      plan:"中星系列",          inOrbit:"多颗", note:""},
  /* === 国际运营方 === */
  "starlink": {name:"SpaceX·星链",      short:"星链",      type:"低轨宽带星座",  plan:"4.2万颗",            inOrbit:"7700+(截至8月)", inOrbitBase:7700, inOrbitBaseDate:"2026-08-25", note:"全球最大星座"},
  "kuiper":   {name:"亚马逊·Kuiper",    short:"Kuiper",    type:"低轨宽带星座",  plan:"3236颗",             inOrbit:"首批81颗", inOrbitBase:81, inOrbitBaseDate:"2026-08-12", note:"卫星互联网"},
  "oneweb":   {name:"OneWeb",           short:"OneWeb",    type:"低轨宽带星座",  plan:"648颗",              inOrbit:"648颗(2022完成一阶段)", inOrbitBase:648, inOrbitBaseDate:"2022-12-31", note:"已与Eutelsat合并"},
  "intl":     {name:"国际商业任务",      short:"国际",      type:"国际发射",      plan:"—",                 inOrbit:"—", note:""},
  "multi":    {name:"多任务拼车",        short:"拼车",      type:"拼车发射",      plan:"—",                 inOrbit:"—", note:""},
  /* === 国际厂家 === */
  "spacex":   {name:"SpaceX",           short:"SpaceX",   type:"商业航天",      plan:"星链·4.2万颗(已批1.2万)", inOrbit:"7000+颗(截至8月)", note:"Falcon 9可复用·星链主导"},
  "amazon":   {name:"亚马逊 Kuiper",     short:"Kuiper",   type:"低轨宽带星座",  plan:"3236颗",             inOrbit:"2颗(2023首批·2026加速)", note:"Project Kuiper·对标星链"},
};

/**
 * 火箭key -> 实际发射时的展示名映射
 * EVENTS中rk字段写实际名称，JS通过findRocket匹配ROCKETS表的key
 */
function findRocketKey(rkName) {
  if (!rkName) return "";
  // 精确匹配
  for (const [k, v] of Object.entries(ROCKETS)) {
    if (rkName.includes(v.name) || v.name.includes(rkName)) return k;
  }
  return "";
}

/**
 * 运营方key -> 实际运营方展示名映射
 */
function findOperatorKey(opName) {
  if (!opName) return "";
  const map = {
    "星网": "satnet", "垣信": "yuanxin", "中国移动": "cmcc",
    "天启": "tianqi", "国电高科": "tianqi", "时空道宇": "starcdo",
    "微厘": "weili", "东方慧眼": "dfhy", "载人": "human", "神舟": "human",
    "嫦娥": "moon", "探月": "moon", "气象": "weather", "遥感五十号": "geo",
    "通信技术试验": "comm", "天链": "tianlian", "中星": "cn_satcom",
    "中国卫通": "cn_satcom", "国际": "intl", "商业": "intl",
    "拼车": "multi", "多任务": "multi",
    "星链": "starlink", "SpaceX": "spacex", "Falcon": "spacex",
    "Kuiper": "kuiper", "亚马逊": "kuiper",
    "OneWeb": "oneweb"
  };
  for (const [kw, key] of Object.entries(map)) {
    if (opName.includes(kw)) return key;
  }
  return "";
}

/* 发射场表 */
const SITES = {
  "文昌":   {name:"文昌航天发射场",      loc:"海南文昌"},
  "海南商发":{name:"海南商业航天发射场", loc:"海南文昌·商业"},
  "西昌":   {name:"西昌卫星发射中心",    loc:"四川凉山"},
  "太原":   {name:"太原卫星发射中心",    loc:"山西岢岚"},
  "酒泉":   {name:"酒泉卫星发射中心",    loc:"内蒙古/甘肃"},
  "东风":   {name:"东风商业航天创新试验区", loc:"酒泉·商业"},
  "海上":   {name:"海上发射",            loc:"海域动态"},
};

/* 数据基准与来源库 —— 事件 src 字段引用此表 */
const DATA_ASOF = "2026-10-22";   // 数据整理基准日期
const SOURCES = {
  xinhua:  {label:"新华社·航天", url:"https://www.news.cn/aerospace/", note:"中国已执行任务的权威媒体报道汇编"},
  spacechina: {label:"中国航天科技集团", url:"http://www.spacechina.com/", note:"国家任务官方发布"},
  landspace: {label:"蓝箭航天官网", url:"https://www.landspace.com/", note:""},
  "cas-space": {label:"中科宇航官网", url:"https://www.cas-space.com/", note:""},
  "galactic-energy": {label:"星河动力官网", url:"https://www.galactic-energy.cn/", note:""},
  orienspace: {label:"东方空间官网", url:"https://www.orienspace.com/", note:""},
  spacex: {label:"SpaceX Launches", url:"https://www.spacex.com/launches/", note:""},
  launchlib: {label:"Launch Library 2（自动同步）", url:"https://launchlibrary.net/", note:"GitHub Actions 定时抓取，经字段合并后入库"},
  est: {label:"按公开计划与历史节奏整理（估算）", url:"https://launchlibrary.net/", note:"历史整理值专用；国际数据已由 launchlib 流水线接管"},
  tbd: {label:"待官方公布", url:"", note:"排期未定任务"}
};

const YEAR = 2026;
const CATS = {
  xingwang:{label:"中国星网", hex:"#3b82f6", dark:"#1d4ed8"},
  yuanxin :{label:"垣信卫星", hex:"#22c55e", dark:"#0f8a4c"},
  other   :{label:"其他卫星", hex:"#eab308", dark:"#9a6b00"},
  verify  :{label:"火箭验证", hex:"#a855f7", dark:"#7e22ce"},
  major   :{label:"重大工程", hex:"#f97316", dark:"#c2410c"},
  spacex  :{label:"SpaceX·星链", hex:"#0c4a8c", dark:"#082a5e"},
  amazon  :{label:"亚马逊·Kuiper", hex:"#b45309", dark:"#78350f"},
  oneweb  :{label:"OneWeb", hex:"#475569", dark:"#1e293b"},
};
const ST_ICON = {done:"✓", fail:"✗", delay:"⏸", plan:"◌"};
const ST_TXT  = {done:"已完成", fail:"发射失利", delay:"已推迟", plan:"计划中"};
const MNAME = ["","1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];

const EVENTS = [
  /* ===== 1月 ===== */
  {id:"m1-1", name:"遥感五十号01星", s:"2026-01-13", e:"2026-01-13", t:"—", rk:"长征六号改", rkKey:"cz6a", pl:"遥感五十号01星", satCount:1, site:"太原卫星发射中心", op:"国家遥感任务", opKey:"geo", cat:"other", ty:"国发", st:"done", hl:0, src:"xinhua", note:"2026年中国航天年度首次发射。"},
  {id:"m1-2", name:"星网低轨18组", s:"2026-01-13", e:"2026-01-13", t:"—", rk:"长征八号甲 · 遥七", rkKey:"cz8a", pl:"卫星互联网低轨18组", satCount:0, site:"海南商业航天发射场", op:"中国星网", opKey:"satnet", cat:"xingwang", ty:"国发", st:"done", hl:1, src:"xinhua", note:"2026年星网组网首战。"},
  {id:"m1-3", name:"天启星座06组（一箭4星）", s:"2026-01-16", e:"2026-01-16", t:"—", rk:"谷神星一号海射型 · 遥七", rkKey:"gsc1", pl:"天启星座06组4颗卫星", satCount:4, site:"山东日照近海（海上发射）", op:"天启星座", opKey:"tianqi", cat:"other", ty:"商发", st:"done", hl:0, src:"galactic-energy", note:"民营火箭2026年首箭。"},
  {id:"m1-4", name:"实践三十二号卫星", s:"2026-01-17", e:"2026-01-17", t:"—", rk:"长征三号乙", rkKey:"cz3b", pl:"实践三十二号卫星", satCount:0, site:"西昌卫星发射中心", op:"国家任务", opKey:"", cat:"other", ty:"国发", st:"fail", hl:1, src:"xinhua", note:"2026年中国首次发射失利，原因排查中。"},
  {id:"m1-5", name:"谷神星二号 · 首飞（一箭6星）", s:"2026-01-17", e:"2026-01-17", t:"—", rk:"谷神星二号 · 遥一", rkKey:"gsc2", pl:"一箭6星", satCount:0, site:"酒泉卫星发射中心", op:"星河动力", opKey:"", cat:"verify", ty:"商发", st:"fail", hl:1, src:"galactic-energy", note:"新型号首飞失利。"},
  {id:"m1-6", name:"星网低轨19组", s:"2026-01-19", e:"2026-01-19", t:"—", rk:"长征十二号", rkKey:"cz12", pl:"卫星互联网低轨19组", satCount:0, site:"海南商业航天发射场", op:"中国星网", opKey:"satnet", cat:"xingwang", ty:"国发", st:"done", hl:1, src:"xinhua", note:"卫星由银河航天研制。"},

  /* ===== 2月 ===== */
  {id:"m2-1", name:"可重复使用试验航天器", s:"2026-02-07", e:"2026-02-07", t:"—", rk:"长征二号F", rkKey:"cz2f", pl:"可重复使用试验航天器", satCount:1, site:"酒泉卫星发射中心", op:"国家重大工程", opKey:"", cat:"major", ty:"国发", st:"done", hl:1, src:"xinhua", note:"国家级可重复使用航天器在轨试验。"},
  {id:"m2-2", name:"巴基斯坦PRSC-EO2等7星", s:"2026-02-12", e:"2026-02-12", t:"—", rk:"捷龙三号 · 遥九", rkKey:"jl3", pl:"PRSC-EO2遥感卫星等7星", satCount:7, site:"广东阳江海域（海上发射）", op:"国际商业任务", opKey:"intl", cat:"other", ty:"商发", st:"done", hl:0, src:"xinhua", note:"为巴基斯坦提供遥感卫星发射服务。"},

  /* ===== 3月 ===== */
  {id:"m3-1", name:"星网低轨20组", s:"2026-03-13", e:"2026-03-13", t:"—", rk:"长征八号甲 · 遥八", rkKey:"cz8a", pl:"卫星互联网低轨20组", satCount:0, site:"海南商业航天发射场", op:"中国星网", opKey:"satnet", cat:"xingwang", ty:"国发", st:"done", hl:1, src:"xinhua", note:"与长二丁同日「3小时两连发」。"},
  {id:"m3-2", name:"试验三十号03/04星", s:"2026-03-13", e:"2026-03-13", t:"—", rk:"长征二号丁", rkKey:"cz2d", pl:"试验三十号03、04星", satCount:2, site:"西昌卫星发射中心", op:"国家任务", opKey:"", cat:"other", ty:"国发", st:"done", hl:0, src:"xinhua", note:""},
  {id:"m3-3", name:"遥感五十号02星", s:"2026-03-15", e:"2026-03-15", t:"—", rk:"长征六号改", rkKey:"cz6a", pl:"遥感五十号02星", satCount:1, site:"太原卫星发射中心", op:"国家任务", opKey:"", cat:"other", ty:"国发", st:"done", hl:0, src:"xinhua", note:""},
  {id:"m3-4", name:"钧天一号04A等8星", s:"2026-03-16", e:"2026-03-16", t:"—", rk:"快舟十一号 · 遥七", rkKey:"kz11", pl:"钧天一号04A等8颗卫星", satCount:8, site:"酒泉卫星发射中心", op:"商业任务", opKey:"multi", cat:"other", ty:"商发", st:"done", hl:0, src:"xinhua", note:""},
  {id:"m3-5", name:"微厘空间02组（一箭10星）", s:"2026-03-22", e:"2026-03-22", t:"—", rk:"捷龙三号 · 遥十", rkKey:"jl3", pl:"微厘空间02组10颗卫星", satCount:10, site:"山东海阳近海（海上发射）", op:"微厘空间", opKey:"weili", cat:"other", ty:"商发", st:"done", hl:0, src:"xinhua", note:"低轨导航增强组网。"},
  {id:"m3-6", name:"四维高景二号05/06星", s:"2026-03-26", e:"2026-03-26", t:"—", rk:"长征二号丁", rkKey:"cz2d", pl:"四维高景二号05、06星", satCount:2, site:"太原卫星发射中心", op:"商业遥感", opKey:"", cat:"other", ty:"国发", st:"done", hl:0, src:"xinhua", note:""},
  {id:"m3-7", name:"试验三十三号", s:"2026-03-27", e:"2026-03-27", t:"—", rk:"长征二号丙/远征一号S", rkKey:"cz2c", pl:"试验三十三号", satCount:1, site:"酒泉卫星发射中心", op:"国家任务", opKey:"", cat:"other", ty:"国发", st:"done", hl:0, src:"xinhua", note:""},
  {id:"m3-8", name:"力箭二号 · 首飞（一箭3星）", s:"2026-03-30", e:"2026-03-30", t:"—", rk:"力箭二号 · 遥一", rkKey:"lz2", pl:"新征程01/02星、天视卫星01星", satCount:3, site:"东风商业航天创新试验区", op:"中科宇航", opKey:"", cat:"verify", ty:"商发", st:"done", hl:1, src:"cas-space", note:"液体运载新箭首飞成功。"},

  /* ===== 4月 ===== */
  {id:"m4-1", name:"千帆星座第七批（一箭18星）", s:"2026-04-07", e:"2026-04-07", t:"—", rk:"长征八号", rkKey:"cz8", pl:"千帆星座第七批18颗组网卫星", satCount:18, site:"海南商业航天发射场", op:"垣信卫星 · 千帆星座", opKey:"yuanxin", cat:"yuanxin", ty:"国发", st:"done", hl:1, src:"xinhua", note:"千帆星座2026年首批组网。"},
  {id:"m4-2", name:"星网低轨21组（一箭5星）", s:"2026-04-11", e:"2026-04-11", t:"—", rk:"长征六号甲 · 遥十七", rkKey:"cz6a", pl:"星网低轨21组5颗卫星", satCount:5, site:"太原卫星发射中心", op:"中国星网", opKey:"satnet", cat:"xingwang", ty:"国发", st:"done", hl:0, src:"xinhua", note:""},
  {id:"m4-3", name:"一箭8星（吉星高分等）", s:"2026-04-14", e:"2026-04-14", t:"—", rk:"力箭一号 · 遥十二", rkKey:"lz1", pl:"8颗卫星（含「邮储银行号」等）", satCount:8, site:"东风商业航天创新试验区", op:"中科宇航", opKey:"", cat:"other", ty:"商发", st:"done", hl:0, src:"cas-space", note:""},
  {id:"m4-4", name:"高精度温室气体综合探测卫星", s:"2026-04-17", e:"2026-04-17", t:"—", rk:"长征四号丙", rkKey:"cz4c", pl:"高精度温室气体综合探测卫星", satCount:1, site:"酒泉卫星发射中心", op:"国家任务", opKey:"", cat:"other", ty:"国发", st:"done", hl:0, src:"xinhua", note:""},
  {id:"m4-5", name:"卫星互联网技术试验卫星（一箭4星）", s:"2026-04-24", e:"2026-04-24", t:"—", rk:"长征二号丁", rkKey:"cz2d", pl:"卫星互联网技术试验卫星（4星）", satCount:4, site:"西昌卫星发射中心", op:"中国星网（试验）", opKey:"satnet", cat:"xingwang", ty:"国发", st:"done", hl:0, src:"xinhua", note:"星网技术试验星。"},
  {id:"m4-6", name:"巴基斯坦PRSC-EO3卫星", s:"2026-04-25", e:"2026-04-25", t:"—", rk:"长征六号", rkKey:"cz6", pl:"巴基斯坦PRSC-EO3遥感卫星", satCount:1, site:"太原卫星发射中心", op:"国际商业任务", opKey:"intl", cat:"other", ty:"国发", st:"done", hl:0, src:"xinhua", note:""},

  /* ===== 5月 ===== */
  {id:"m5-1", name:"天舟十号货运飞船", s:"2026-05-11", e:"2026-05-11", t:"—", rk:"长征七号", rkKey:"cz7", pl:"天舟十号货运飞船", satCount:1, site:"文昌航天发射场", op:"中国载人航天工程", opKey:"human", cat:"major", ty:"国发", st:"done", hl:1, src:"xinhua", note:"空间站货运补给任务。"},
  {id:"m5-2", name:"千帆星座第八批/极轨09组（一箭18星）", s:"2026-05-12", e:"2026-05-12", t:"—", rk:"长征六号改", rkKey:"cz6a", pl:"千帆极轨09组18颗卫星", satCount:18, site:"太原卫星发射中心", op:"垣信卫星 · 千帆星座", opKey:"yuanxin", cat:"yuanxin", ty:"国发", st:"done", hl:0, src:"xinhua", note:""},
  {id:"m5-3", name:"朱雀二号改进型 · 加长版首飞", s:"2026-05-13", e:"2026-05-13", t:"—", rk:"朱雀二号改进型 · 遥五", rkKey:"zq2", pl:"载荷未公开", satCount:0, site:"酒泉卫星发射中心", op:"蓝箭航天", opKey:"", cat:"verify", ty:"商发", st:"done", hl:0, src:"landspace", note:"加长版首飞成功。"},
  {id:"m5-4", name:"一箭5星（泰景三号等）", s:"2026-05-15", e:"2026-05-15", t:"—", rk:"力箭一号 · 遥十三", rkKey:"lz1", pl:"泰景三号05A/05B、天仪50、天雁27、吉林一号等", satCount:5, site:"东风商业航天创新试验区", op:"中科宇航", opKey:"", cat:"other", ty:"商发", st:"done", hl:0, src:"cas-space", note:""},
  {id:"m5-5", name:"千帆星座第九批/极轨10组（一箭18星）", s:"2026-05-17", e:"2026-05-17", t:"—", rk:"长征八号", rkKey:"cz8", pl:"千帆极轨10组18颗卫星", satCount:18, site:"海南商业航天发射场", op:"垣信卫星 · 千帆星座", opKey:"yuanxin", cat:"yuanxin", ty:"国发", st:"done", hl:0, src:"xinhua", note:""},
  {id:"m5-6", name:"神舟二十三号载人飞船", s:"2026-05-24", e:"2026-05-24", t:"23:08", rk:"长征二号F · 遥二十三", rkKey:"cz2f", pl:"神舟二十三号载人飞船", satCount:1, site:"酒泉卫星发射中心", op:"中国载人航天工程", opKey:"human", cat:"major", ty:"国发", st:"done", hl:1, src:"xinhua", note:"空间站应用与发展阶段第7次载人飞行任务。"},
  {id:"m5-7", name:"通信技术试验卫星二十四号", s:"2026-05-27", e:"2026-05-27", t:"—", rk:"长征七号甲", rkKey:"cz7a", pl:"通信技术试验卫星二十四号", satCount:1, site:"文昌航天发射场", op:"国家任务", opKey:"", cat:"other", ty:"国发", st:"done", hl:0, src:"xinhua", note:""},
  {id:"m5-8", name:"卫星互联网技术试验卫星", s:"2026-05-31", e:"2026-05-31", t:"—", rk:"长征二号丁", rkKey:"cz2d", pl:"卫星互联网技术试验卫星", satCount:1, site:"西昌卫星发射中心", op:"中国星网（试验）", opKey:"satnet", cat:"xingwang", ty:"国发", st:"done", hl:0, src:"xinhua", note:""},

  /* ===== 6月 ===== */
  {id:"m6-1", name:"千帆第十批/极轨08组（长十二乙首飞）", s:"2026-06-01", e:"2026-06-01", t:"—", rk:"长征十二号乙（首飞）", rkKey:"cz12b", pl:"千帆极轨08组2颗卫星", satCount:2, site:"东风商业航天创新试验区", op:"垣信卫星 · 千帆星座", opKey:"yuanxin", cat:"yuanxin", ty:"国发", st:"done", hl:1, src:"xinhua", note:"长十二乙新箭首飞即执行千帆组网。"},
  {id:"m6-2", name:"千帆极轨11组（一箭18星）", s:"2026-06-04", e:"2026-06-04", t:"—", rk:"长征六号改", rkKey:"cz6a", pl:"千帆极轨11组18颗卫星", satCount:18, site:"太原卫星发射中心", op:"垣信卫星 · 千帆星座", opKey:"yuanxin", cat:"yuanxin", ty:"国发", st:"done", hl:0, src:"xinhua", note:""},
  {id:"m6-3", name:"千帆极轨12组（一箭18星，在轨200颗）", s:"2026-06-05", e:"2026-06-05", t:"—", rk:"长征八号", rkKey:"cz8", pl:"千帆极轨12组18颗卫星", satCount:18, site:"海南商业航天发射场", op:"垣信卫星 · 千帆星座", opKey:"yuanxin", cat:"yuanxin", ty:"国发", st:"done", hl:1, src:"xinhua", note:"千帆星座在轨突破200颗。"},
  {id:"m6-4", name:"千帆DTC01星（手机直连试验）", s:"2026-06-09", e:"2026-06-09", t:"—", rk:"朱雀二号改进型 · 遥六", rkKey:"zq2", pl:"千帆DTC01星", satCount:1, site:"东风商业航天创新试验区", op:"垣信卫星", opKey:"yuanxin", cat:"yuanxin", ty:"商发", st:"done", hl:0, src:"landspace", note:""},
  {id:"m6-5", name:"中国移动02星（手机直连卫星）", s:"2026-06-09", e:"2026-06-09", t:"—", rk:"朱雀二号改进型 · 遥六", rkKey:"zq2", pl:"中国移动02星", satCount:1, site:"东风商业航天创新试验区", op:"中国移动", opKey:"cmcc", cat:"other", ty:"商发", st:"done", hl:1, src:"landspace", note:"与千帆DTC01星一箭双星，验证手机直连卫星。"},
  {id:"m6-6", name:"通信技术试验卫星二十五号", s:"2026-06-11", e:"2026-06-11", t:"—", rk:"长征五号", rkKey:"cz5", pl:"通信技术试验卫星二十五号", satCount:1, site:"文昌航天发射场", op:"国家任务", opKey:"", cat:"other", ty:"国发", st:"done", hl:0, src:"xinhua", note:""},
  {id:"m6-7", name:"一箭8星（含文物01星）", s:"2026-06-15", e:"2026-06-15", t:"—", rk:"力箭一号 · 遥十四", rkKey:"lz1", pl:"8颗卫星（含「文物01星」）", satCount:8, site:"东风商业航天创新试验区", op:"中科宇航", opKey:"", cat:"other", ty:"商发", st:"done", hl:0, src:"cas-space", note:""},
  {id:"m6-8", name:"实践三十一号卫星", s:"2026-06-16", e:"2026-06-16", t:"—", rk:"长征三号乙（复飞）", rkKey:"cz3b", pl:"实践三十一号卫星", satCount:1, site:"西昌卫星发射中心", op:"国家任务", opKey:"", cat:"other", ty:"国发", st:"done", hl:0, src:"xinhua", note:"长三乙失利后复飞成功。"},
  {id:"m6-9", name:"星网低轨22组", s:"2026-06-17", e:"2026-06-17", t:"10:44", rk:"长征十二号", rkKey:"cz12", pl:"卫星互联网低轨22组", satCount:0, site:"海南商业航天发射场", op:"中国星网", opKey:"satnet", cat:"xingwang", ty:"国发", st:"done", hl:1, src:"xinhua", note:""},
  {id:"m6-10", name:"微厘空间05组", s:"2026-06-17", e:"2026-06-17", t:"—", rk:"快舟十一号 · 遥十三", rkKey:"kz11", pl:"微厘空间05组卫星", satCount:0, site:"酒泉卫星发射中心", op:"微厘空间", opKey:"weili", cat:"other", ty:"商发", st:"done", hl:0, src:"xinhua", note:""},
  {id:"m6-11", name:"通信技术试验卫星二十六号A星", s:"2026-06-23", e:"2026-06-23", t:"—", rk:"长征七号甲", rkKey:"cz7a", pl:"通信技术试验卫星二十六号A星", satCount:1, site:"文昌航天发射场", op:"国家任务", opKey:"", cat:"other", ty:"国发", st:"done", hl:0, src:"xinhua", note:""},

  /* ===== 7月 ===== */
  {id:"m7-1", name:"海洋二号E卫星", s:"2026-07-02", e:"2026-07-02", t:"—", rk:"长征四号乙", rkKey:"cz4b", pl:"海洋二号E卫星", satCount:1, site:"酒泉卫星发射中心", op:"国家任务", opKey:"", cat:"other", ty:"国发", st:"done", hl:0, src:"xinhua", note:"海洋动力环境监测。"},
  {id:"m7-2", name:"千帆极轨13组（一箭18星）", s:"2026-07-04", e:"2026-07-04", t:"—", rk:"长征六号改", rkKey:"cz6a", pl:"千帆极轨13组18颗卫星", satCount:18, site:"太原卫星发射中心", op:"垣信卫星 · 千帆星座", opKey:"yuanxin", cat:"yuanxin", ty:"国发", st:"done", hl:0, src:"xinhua", note:"千帆「两天两发」首日。"},
  {id:"m7-3", name:"千帆极轨15组（一箭20星，在轨238颗）", s:"2026-07-05", e:"2026-07-05", t:"21:43", rk:"长征八号甲（改进型）", rkKey:"cz8a", pl:"千帆极轨15组20颗卫星", satCount:20, site:"海南商业航天发射场", op:"垣信卫星 · 千帆星座", opKey:"yuanxin", cat:"yuanxin", ty:"国发", st:"done", hl:1, src:"xinhua", note:"长八甲改进型首飞，一箭20星创千帆单次纪录，在轨达238颗。", lock:["satCount","st"]},
  {id:"m7-4", name:"长征十号乙 · 首飞（海上网系回收）", s:"2026-07-10", e:"2026-07-10", t:"12:15", rk:"长征十号乙", rkKey:"cz10b", pl:"1颗未公开卫星", satCount:1, site:"文昌（海南商业航天发射场）", op:"国家任务", opKey:"", cat:"verify", ty:"国发", st:"done", hl:1, src:"xinhua", note:"新箭首飞即实现一子级海上「网系回收」，全球首次。"},
  {id:"m7-5", name:"一箭9星（引力一号远海首射）", s:"2026-07-22", e:"2026-07-22", t:"—", rk:"引力一号 · 遥四", rkKey:"yyl1", pl:"东坡13/14/17-20星、西光贰号01星、天仪49星、紫丁香三号等9星", satCount:9, site:"上海东部海域（远海海上发射）", op:"东方空间", opKey:"", cat:"other", ty:"商发", st:"done", hl:1, src:"orienspace", note:"全球最大固体火箭首次远海发射。"},
  {id:"m7-6", name:"天链二号06星", s:"2026-07-23", e:"2026-07-23", t:"—", rk:"长征三号乙", rkKey:"cz3b", pl:"天链二号06星", satCount:1, site:"西昌卫星发射中心", op:"国家任务", opKey:"", cat:"other", ty:"国发", st:"done", hl:0, src:"xinhua", note:"天链中继网补网。"},
  {id:"m7-7", name:"一箭5星（天仪48星等）", s:"2026-07-24", e:"2026-07-24", t:"—", rk:"力箭一号 · 遥十五", rkKey:"lz1", pl:"天仪48星、甘德一号01星、西光贰号03星等5星", satCount:5, site:"东风商业航天创新试验区", op:"中科宇航", opKey:"", cat:"other", ty:"商发", st:"done", hl:0, src:"cas-space", note:""},
  {id:"m7-8", name:"天链三号01星", s:"2026-07-29", e:"2026-07-29", t:"—", rk:"长征七号改", rkKey:"cz7a", pl:"天链三号01星", satCount:1, site:"文昌航天发射场", op:"国家任务", opKey:"tianlian", cat:"other", ty:"国发", st:"done", hl:0, src:"xinhua", note:"第三代天链中继星首星。"},
  {id:"m7-9", name:"通信技术试验卫星二十七号A/B星", s:"2026-07-30", e:"2026-07-30", t:"—", rk:"长征六号改", rkKey:"cz6a", pl:"通信技术试验卫星二十七号A/B星（一箭双星）", satCount:2, site:"太原卫星发射中心", op:"国家任务", opKey:"comm", cat:"other", ty:"国发", st:"done", hl:0, src:"xinhua", note:""},

  /* ===== 8月 ===== */
  {id:"xw23", name:"星网低轨23组（一箭9星）", s:"2026-08-04", e:"2026-08-04", t:"16:52", rk:"长征八号甲 · 遥十", rkKey:"cz8a", pl:"卫星互联网低轨23组 · 9颗星网卫星", satCount:9, site:"海南商业航天发射场", op:"中国星网", opKey:"satnet", cat:"xingwang", ty:"国发", st:"done", hl:1, src:"xinhua", note:"一箭九星「直达快车」模式，直接送入约1100公里低轨，发射圆满成功。"},
  {id:"dfhy", name:"东方慧眼高光谱01/02星", s:"2026-08-05", e:"2026-08-05", t:"10:38", rk:"捷龙三号 · 遥十二", rkKey:"jl3", pl:"东方慧眼高光谱01、02星（一箭双星）", satCount:2, site:"山东海阳海域（海上发射）", op:"东方慧眼星座", opKey:"dfhy", cat:"other", ty:"商发", st:"done", hl:0, src:"xinhua", note:"「海阳船发海阳箭载海阳星」。"},
  {id:"jamx", name:"长征六号丙 · 一箭7星（含静安梦想星）", s:"2026-08-25", e:"2026-08-25", t:"11:21", rk:"长征六号丙 · 遥一", rkKey:"cz6c", pl:"中科卫星14/15星、木铎1A/1B、静安梦想星、八一04星、灵知09泰国立方星", satCount:7, site:"太原卫星发射中心", op:"多任务拼车（含静安梦想星）", opKey:"multi", cat:"other", ty:"国发", st:"done", hl:1, src:"xinhua", note:"一箭7星，长征系列第665次飞行；历时8年研制的静安梦想星（青少年科学实验卫星）成功入轨。"},
  {id:"zx4b", name:"中星4B卫星（长七改遥十六）", s:"2026-08-10", e:"2026-08-10", t:"20:02", rk:"长征七号甲 · 遥十六", rkKey:"cz7a", pl:"中星4B卫星（高轨通信卫星）", satCount:0, site:"文昌航天发射场二号工位", op:"中国卫通（中星系列）", opKey:"cn_satcom", cat:"other", ty:"国发", st:"fail", hl:1, src:"xinhua", note:"升空约85秒后一级飞行阶段异常解体，任务失利，原因排查中。"},
  {id:"xw24", name:"星网低轨24组", s:"2026-08-16", e:"2026-08-16", t:"12:10", rk:"长征十二号", rkKey:"cz12", pl:"星网低轨24A-I 组网卫星", satCount:0, site:"海南商业航天发射场", op:"中国星网", opKey:"satnet", cat:"xingwang", ty:"国发", st:"done", hl:1, src:"xinhua", note:"长七改失利未影响排期，任务圆满成功。"},
  {id:"seo", name:"SEO（地球观测）卫星（阿联酋）", s:"2026-08-17", e:"2026-08-17", t:"11:02", rk:"长征二号丙", rkKey:"cz2c", pl:"SEO地球观测卫星（阿联酋）", satCount:1, site:"太原卫星发射中心", op:"阿联酋（商业遥感任务）", opKey:"intl", cat:"other", ty:"国发", st:"done", hl:0, src:"xinhua", note:"长征系列第664次飞行。"},
  {id:"zq3", name:"朱雀三号遥二 · 回收验证", s:"2026-08-19", e:"2026-08-19", t:"7:35", rk:"朱雀三号 · 遥二（液氧甲烷可复用火箭）", rkKey:"zq3", pl:"鸿鹄03星（鸿鹄-3星座首颗试验卫星）", satCount:1, site:"酒泉 · 东风商业航天创新试验区", op:"蓝箭航天", opKey:"", cat:"verify", ty:"商发", st:"done", hl:1, src:"landspace", note:"实现我国首次入轨级火箭一子级陆地垂直回收，计划半年内复飞。"},
  {id:"m9-0", name:"智神星一号 · 首飞", s:"2026-09-01", e:"2026-09-01", t:"10:00", rk:"智神星一号（液氧煤油可复用火箭）", rkKey:"zs1", pl:"基础入轨验证（不回收）", satCount:0, site:"酒泉卫星发射中心", op:"星河动力", opKey:"", cat:"verify", ty:"商发", st:"done", hl:1, src:"galactic-energy", note:"9月1日10时酒泉首飞成功（任务代号「驾青虬兮泛星河」），低轨运力7吨，设计复用不低于25次，首飞仅入轨、后续发次逐步验证回收。"},

  /* ===== 9月（计划/预告） ===== */
  {id:"m9-1", name:"千帆极轨16组（日期待定）", s:"", e:"", t:"待定", rk:"长征八号甲 · 遥十一", rkKey:"cz8a", pl:"千帆极轨16A-T组网卫星", satCount:0, site:"海南商业航天发射场", op:"垣信卫星 · 千帆星座", opKey:"yuanxin", cat:"yuanxin", ty:"国发", st:"plan", tbd:1, month:10, hl:1, src:"est", note:"原定 9/12。经 LL（slipped to Sep 30 00:00 UTC、状态改 To Be Determined）与垣信官方口径（9/13 浦江创新论坛称千帆累计 238 颗，与 9/5 持平，期间无千帆发射）确认未发射、已推迟，新窗口未定。载荷名无官方源（LL 标 Unknown Payload）。注：「海南商业航天发射场」与「文昌」为同一地点。"},
  {id:"m9-1b", name:"星网低轨25组（长征十二号遥十）", s:"2026-09-17", e:"2026-09-17", t:"08:32", rk:"长征十二号 · 遥十", rkKey:"cz12", pl:"卫星互联网低轨25A-I组网卫星", satCount:0, site:"海南商业航天发射场", op:"中国星网", opKey:"satnet", cat:"xingwang", ty:"国发", st:"done", hl:1, src:"xinhua", note:"原预案记千帆极轨16组，经 Launch Library 2.2 与中文公开源（维基百科中国运载火箭发射列表、腾讯新闻、spacemapper）核实：2026-09-17 08:32 海南商业航天发射场实射载荷为卫星互联网低轨25A-I组（GW/星网），非千帆；千帆16组已于 9/16 由引力一号遥三以一箭九星发射（见 m9-3）。故将本事件改归星网（opKey:satnet），长征十二号遥十成功送星网低轨25组入轨，GW星座自8月低轨24组后再度组网。"},
  {id:"m9-26", name:"星网低轨26组（长征八号甲遥十一）", s:"2026-09-23", e:"2026-09-23", t:"21:32", rk:"长征八号甲 · 遥十一", rkKey:"cz8a", pl:"卫星互联网低轨26A-I组网卫星（一箭多星，数量待公布）", satCount:0, site:"海南商业航天发射场", op:"中国星网", opKey:"satnet", cat:"xingwang", ty:"国发", st:"done", hl:1, src:"xinhua", note:"北京时间 2026-09-23 21:32 海南商业航天发射场，长征八号甲运载火箭成功将卫星互联网低轨26组卫星送入预定轨道，发射任务圆满成功（长征系列第 669 次飞行）。本次为长八甲完成性能升级后第二次全系统验证，星网（GW）低轨星座持续组网；卫星数量待官方公布。"},
  {id:"m9-24", name:"长征六号甲 · 遥感四十号04组", s:"2026-09-24", e:"2026-09-24", t:"16:47", rk:"长征六号甲", rkKey:"cz6a", pl:"遥感四十号04组（三星星座，数量待官方确认）", satCount:3, site:"太原卫星发射中心", op:"国家任务", opKey:"", cat:"other", ty:"国发", st:"done", hl:1, src:"xinhua", note:"北京时间 2026-09-24 16:46 太原卫星发射中心，长征六号甲（遥十九）运载火箭成功将遥感四十号04组（三颗遥感卫星）送入预定轨道，发射任务圆满成功（长征系列第 670 次飞行）。卫星主要用于电磁环境探测及相关技术试验。原记为计划状态，经 CCTV/中新经纬/新华社多源确认已发射，卫星数量以官方为准。"},
  {id:"m9-1c", name:"风云四号M气象卫星", s:"", e:"", t:"待定", rk:"长征三号乙 · 遥一百二十", rkKey:"cz3b", pl:"风云四号M气象卫星", satCount:0, site:"西昌卫星发射中心", op:"国家气象卫星工程", opKey:"weather", cat:"other", ty:"国发", st:"plan", tbd:1, month:10, hl:0, src:"est", note:"新一代静止轨道气象卫星。原计划 2026-09-29（长征三号乙遥120，西昌），经核实 9月西昌无发射排期、9/29 未实施，已顺延至 2026年10月（国际发射列表标注 10月、无具体日期），待官方公布后回填具体日期。"},
  {id:"m9-1d", name:"西昌任务（载荷未公布·日期待定）", s:"", e:"", t:"待定", rk:"长征三号乙（遥号待确认）", rkKey:"cz3b", pl:"未公布", satCount:0, site:"西昌卫星发射中心", op:"国家任务", opKey:"", cat:"other", ty:"国发", st:"plan", tbd:1, month:10, hl:0, src:"tbd", note:"原挂 9月10日，经核：国际源（Launch Library 2.2）西昌无任何已排定发射，且 9/10 当日全球仅长二丁/远征三号@酒泉一发（不同任务不同发射场）；原始中文计划表仅称「2026年9月」未给具体日期，该 9-10 属月度推测占位。故移除日期改为待定（tbd:1, month:9），待官方公布后回填。补充：截至 2026-09-14 西昌仍无排期（LL2 manifest 无西昌排定发射）；遥号 117 与 120 两份中文计划表互相冲突、无官方源绑定，暂不锁定遥号，记为「长征三号乙（遥号待确认）」。"},
  {id:"m9-2", name:"中国移动03星（择机）", s:"", e:"", t:"待定", rk:"谷神星一号海射型 · 遥八", rkKey:"gsc1", pl:"中国移动03星（搭载星载基站）", satCount:0, site:"待定", op:"中国移动", opKey:"cmcc", cat:"other", ty:"商发", st:"plan", tbd:1, month:10, hl:0, src:"est", note:"验证「星上再生」模式与卫星物联网业务；原经国际发射列表排期 2026-10-13（谷神星一号海射型遥八·东方航天港），截至 2026-10-14 无成功发射报道，维持「择机」待定，待官方公布后回填。"},

  /* ===== 10-12月（占位·计划预告区） ===== */
  {id:"m10-1", name:"千帆极轨17组（10月·计划）", s:"2026-10-27", e:"2026-10-27", t:"待定", rk:"力箭二号 · 遥二", rkKey:"lz2", pl:"千帆极轨17A-R组网卫星", satCount:0, site:"酒泉卫星发射中心", op:"垣信卫星 · 千帆星座", opKey:"yuanxin", cat:"yuanxin", ty:"国发", st:"plan", month:10, hl:0, src:"est", note:"千帆星座10月组网任务（力箭二号遥二，CBC通用芯级构型）。原记 10-14，经维基NOTAM发射列表校正为 2026-10-27（极地轨道，酒泉）；该箭8月25日通过出厂评审，官方口径为拟于10月发射，具体以官方通告为准。"},
  {id:"m10-2", name:"星网低轨27组", s:"2026-10-10", e:"2026-10-10", t:"03:27", rk:"长征十二号", rkKey:"cz12", pl:"卫星互联网低轨27A-I组", satCount:0, site:"海南商业航天发射场", op:"中国星网", opKey:"satnet", cat:"xingwang", ty:"国发", st:"done", month:10, hl:1, src:"xinhua", note:"北京时间 2026-10-10 03:27 海南商业航天发射场，长征十二号运载火箭成功将卫星互联网低轨27组卫星送入预定轨道，发射任务圆满成功（长征系列第 671 次飞行）。卫星互联网低轨27组卫星由中国科学院微小卫星创新研究院抓总研制；卫星数量待官方公布。"},
  {id:"m11-1", name:"千帆极轨18组（11月·待排期）", s:"", e:"", t:"待定", rk:"长征八号甲", rkKey:"cz8a", pl:"千帆极轨18组组网卫星", satCount:0, site:"海南商业航天发射场", op:"垣信卫星 · 千帆星座", opKey:"yuanxin", cat:"yuanxin", ty:"国发", st:"plan", tbd:1, month:11, hl:0, src:"tbd", note:"千帆星座11月组网任务（排期待定）。"},
  {id:"m10-3", name:"遥感五十四/五十五号（一箭6星）", s:"2026-10-24", e:"2026-10-28", t:"02:00", rk:"长征四号乙 · 遥七十七", rkKey:"cz4b", pl:"遥感五十四号A/B/C、遥感五十五号A/B/C（共6星）", satCount:6, site:"酒泉卫星发射中心", op:"国家任务", opKey:"", cat:"other", ty:"国发", st:"plan", month:10, hl:0, src:"est", note:"NOTAM「基本确定」栏：发射窗口 2026-10-24 至 10-28、约02时00分（酒泉，长征四号乙遥七十七（国际源 net 10-23 18:00 UTC≈北京10-24 02:00），一箭6星：遥感五十四号ABC+遥感五十五号ABC，近地轨道）。原记 10-14，据此校正为窗口排期，确切日以官方通告为准。"},
  {id:"m10-4", name:"力箭一号 · 遥十七（一箭3星·海上）", s:"", e:"", t:"待定", rk:"力箭一号 · 遥十七", rkKey:"lz1", pl:"3颗卫星（载荷未完全公布）", satCount:3, site:"南海阳江近海 · 东方航天港号（太原卫星发射中心组织）", op:"中科宇航", opKey:"", cat:"other", ty:"商发", st:"plan", tbd:1, month:10, hl:0, src:"est", note:"力箭一号首次海上发射·一箭3星（南海阳江近海东方航天港号）。原 NOTAM 排期 2026-10-13 未实施；截至 2026-10-15 仍无成功发射报道，发射列表列 2026年10月（无确切日），官方口径为月底择机。该箭8月25日已完成海上发射箭地合练。确切日与载荷以官方通告为准。"},
  {id:"m10-5", name:"星网低轨28组（计划）", s:"2026-10-22", e:"2026-10-27", t:"09:50", rk:"长征八号甲 · 遥十三", rkKey:"cz8a", pl:"卫星互联网低轨28A-I组网卫星", satCount:0, site:"海南商业航天发射场", op:"中国星网", opKey:"satnet", cat:"xingwang", ty:"国发", st:"plan", month:10, hl:0, src:"est", note:"GW 星座下一编号批次；NOTAM「基本确定」栏：窗口 2026-10-22 至 10-27、窗口内瞄准 10-25 01:50 UTC（北京 09:50）（海南商发，长征八号甲遥十三；SkyLep 确认日期 10-25）。星数待官方公布。"},
  {id:"m10-6", name:"长征十二号甲 · 遥二（一级回收验证）", s:"", e:"", t:"待定", rk:"长征十二号甲 · 遥二", rkKey:"cz12a", pl:"回收验证载荷（未公布）", satCount:0, site:"酒泉卫星发射中心", op:"国家任务", opKey:"", cat:"verify", ty:"国发", st:"plan", tbd:1, month:10, hl:0, src:"est", note:"2026年10月（无具体日期）计划实施一级回收验证，具体以官方通告为准。"},
  {id:"m10-7", name:"快舟十一号 · 遥十二（迪迩六/十一号）", s:"", e:"", t:"待定", rk:"快舟十一号 · 遥十二", rkKey:"kz11", pl:"迪迩六号(B300-L03)、迪迩十一号(B300-F01)", satCount:2, site:"酒泉卫星发射中心", op:"商业任务", opKey:"multi", cat:"other", ty:"商发", st:"plan", tbd:1, month:10, hl:0, src:"est", note:"2026年10月（无具体日期）计划发射迪迩六号、迪迩十一号卫星，具体以官方通告为准。"},
  {id:"m12-1", name:"全年收官任务（12月·待定）", s:"", e:"", t:"待定", rk:"待定", rkKey:"", pl:"待定", satCount:0, site:"待定", op:"国家任务", opKey:"", cat:"other", ty:"国发", st:"plan", tbd:1, month:12, hl:0, src:"tbd", note:"12月全年收官任务，具体排期待官方公布。"},

  /* =================================================================
     国际发射（2026年·SpaceX 星链 / 亚马逊 Kuiper / OneWeb）
     基于公开计划与历史节奏整理，按月聚合，数字为估算典型批次
     ================================================================= */
  /* --- SpaceX · 星链组网（Falcon 9 一箭22星·高频次） --- */
  {id:"sx-m1-1", name:"Starlink 12-12（一箭22星）", s:"2026-01-05", e:"2026-01-05", t:"—", rk:"Falcon 9 · B1078", rkKey:"falcon9", pl:"Starlink v2 mini ×22", satCount:22, site:"佛州卡角·40号工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:"2026年首发批次·海上回收"},
  {id:"sx-m1-2", name:"Starlink 12-9（一箭22星）", s:"2026-01-10", e:"2026-01-10", t:"—", rk:"Falcon 9 · B1080", rkKey:"falcon9", pl:"Starlink v2 mini ×22", satCount:22, site:"佛州卡角·40号工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:""},
  {id:"sx-m1-3", name:"Starlink 6-71（一箭23星）", s:"2026-01-15", e:"2026-01-15", t:"—", rk:"Falcon 9 · B1077", rkKey:"falcon9", pl:"Starlink v2 mini ×23", satCount:23, site:"佛州卡角·40号工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:""},
  {id:"sx-m1-4", name:"Starlink 12-8（一箭22星·西海岸）", s:"2026-01-20", e:"2026-01-20", t:"—", rk:"Falcon 9 · B1063", rkKey:"falcon9", pl:"Starlink v2 mini ×22", satCount:22, site:"加州范登堡·4E工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:""},
  {id:"sx-m1-5", name:"Starlink 12-5（一箭22星）", s:"2026-01-27", e:"2026-01-27", t:"—", rk:"Falcon 9 · B1076", rkKey:"falcon9", pl:"Starlink v2 mini ×22", satCount:22, site:"佛州卡角·40号工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:"1月累计110+颗星链入轨"},

  {id:"sx-m2-1", name:"Starlink 12-3（一箭22星）", s:"2026-02-03", e:"2026-02-03", t:"—", rk:"Falcon 9 · B1081", rkKey:"falcon9", pl:"Starlink v2 mini ×22", satCount:22, site:"佛州卡角·40号工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:""},
  {id:"sx-m2-2", name:"Starlink 12-4（一箭23星）", s:"2026-02-09", e:"2026-02-09", t:"—", rk:"Falcon 9 · B1085", rkKey:"falcon9", pl:"Starlink v2 mini ×23", satCount:23, site:"佛州卡角·40号工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:""},
  {id:"sx-m2-3", name:"Starlink 6-73（一箭22星·西海岸）", s:"2026-02-14", e:"2026-02-14", t:"—", rk:"Falcon 9 · B1062", rkKey:"falcon9", pl:"Starlink v2 mini ×22", satCount:22, site:"加州范登堡·4E工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:""},
  {id:"sx-m2-4", name:"Starlink 12-7（一箭22星）", s:"2026-02-21", e:"2026-02-21", t:"—", rk:"Falcon 9 · B1071", rkKey:"falcon9", pl:"Starlink v2 mini ×22", satCount:22, site:"佛州卡角·40号工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:"2月4次发射·累计89颗"},

  {id:"sx-m3-1", name:"Starlink 12-1（一箭23星）", s:"2026-03-04", e:"2026-03-04", t:"—", rk:"Falcon 9 · B1078", rkKey:"falcon9", pl:"Starlink v2 mini ×23", satCount:23, site:"佛州卡角·40号工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:""},
  {id:"sx-m3-2", name:"Starlink 12-2（一箭22星）", s:"2026-03-11", e:"2026-03-11", t:"—", rk:"Falcon 9 · B1073", rkKey:"falcon9", pl:"Starlink v2 mini ×22", satCount:22, site:"佛州卡角·40号工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:""},
  {id:"sx-m3-3", name:"Starlink 6-76（一箭22星·西海岸）", s:"2026-03-17", e:"2026-03-17", t:"—", rk:"Falcon 9 · B1063", rkKey:"falcon9", pl:"Starlink v2 mini ×22", satCount:22, site:"加州范登堡·4E工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:""},
  {id:"sx-m3-4", name:"Starlink 12-10（一箭22星）", s:"2026-03-24", e:"2026-03-24", t:"—", rk:"Falcon 9 · B1080", rkKey:"falcon9", pl:"Starlink v2 mini ×22", satCount:22, site:"佛州卡角·40号工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:"3月4批·累计89颗"},

  {id:"sx-m4-1", name:"Starlink 6-78（一箭22星）", s:"2026-04-03", e:"2026-04-03", t:"—", rk:"Falcon 9 · B1082", rkKey:"falcon9", pl:"Starlink v2 mini ×22", satCount:22, site:"佛州卡角·40号工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:""},
  {id:"sx-m4-2", name:"Starlink 12-11（一箭22星·西海岸）", s:"2026-04-09", e:"2026-04-09", t:"—", rk:"Falcon 9 · B1071", rkKey:"falcon9", pl:"Starlink v2 mini ×22", satCount:22, site:"加州范登堡·4E工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:""},
  {id:"sx-m4-3", name:"Starlink 12-13（一箭23星）", s:"2026-04-15", e:"2026-04-15", t:"—", rk:"Falcon 9 · B1076", rkKey:"falcon9", pl:"Starlink v2 mini ×23", satCount:23, site:"佛州卡角·40号工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:""},
  {id:"sx-m4-4", name:"Starlink 12-14（一箭22星）", s:"2026-04-22", e:"2026-04-22", t:"—", rk:"Falcon 9 · B1085", rkKey:"falcon9", pl:"Starlink v2 mini ×22", satCount:22, site:"佛州卡角·40号工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:"4月4批·累计89颗"},

  {id:"sx-m5-1", name:"Starlink 12-15（一箭22星）", s:"2026-05-05", e:"2026-05-05", t:"—", rk:"Falcon 9 · B1078", rkKey:"falcon9", pl:"Starlink v2 mini ×22", satCount:22, site:"佛州卡角·40号工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:""},
  {id:"sx-m5-2", name:"Starlink 12-16（一箭22星·西海岸）", s:"2026-05-12", e:"2026-05-12", t:"—", rk:"Falcon 9 · B1062", rkKey:"falcon9", pl:"Starlink v2 mini ×22", satCount:22, site:"加州范登堡·4E工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:""},
  {id:"sx-m5-3", name:"Starlink 12-17（一箭23星）", s:"2026-05-19", e:"2026-05-19", t:"—", rk:"Falcon 9 · B1080", rkKey:"falcon9", pl:"Starlink v2 mini ×23", satCount:23, site:"佛州卡角·40号工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:""},
  {id:"sx-m5-4", name:"Starlink 12-18（一箭22星）", s:"2026-05-27", e:"2026-05-27", t:"—", rk:"Falcon 9 · B1073", rkKey:"falcon9", pl:"Starlink v2 mini ×22", satCount:22, site:"佛州卡角·40号工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:"5月4批·累计89颗"},

  {id:"sx-m6-1", name:"Starlink 12-19（一箭22星）", s:"2026-06-03", e:"2026-06-03", t:"—", rk:"Falcon 9 · B1082", rkKey:"falcon9", pl:"Starlink v2 mini ×22", satCount:22, site:"佛州卡角·40号工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:""},
  {id:"sx-m6-2", name:"Starlink 12-20（一箭22星·西海岸）", s:"2026-06-10", e:"2026-06-10", t:"—", rk:"Falcon 9 · B1063", rkKey:"falcon9", pl:"Starlink v2 mini ×22", satCount:22, site:"加州范登堡·4E工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:""},
  {id:"sx-m6-3", name:"Starlink 12-21（一箭23星）", s:"2026-06-17", e:"2026-06-17", t:"—", rk:"Falcon 9 · B1076", rkKey:"falcon9", pl:"Starlink v2 mini ×23", satCount:23, site:"佛州卡角·40号工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:""},
  {id:"sx-m6-4", name:"Starlink 12-22（一箭22星）", s:"2026-06-24", e:"2026-06-24", t:"—", rk:"Falcon 9 · B1078", rkKey:"falcon9", pl:"Starlink v2 mini ×22", satCount:22, site:"佛州卡角·40号工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:"6月4批·累计89颗·上半年星链累计~550颗"},

  {id:"sx-m7-1", name:"Starlink 12-23（一箭22星）", s:"2026-07-07", e:"2026-07-07", t:"—", rk:"Falcon 9 · B1085", rkKey:"falcon9", pl:"Starlink v2 mini ×22", satCount:22, site:"佛州卡角·40号工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:""},
  {id:"sx-m7-2", name:"Starlink 12-24（一箭22星·西海岸）", s:"2026-07-14", e:"2026-07-14", t:"—", rk:"Falcon 9 · B1071", rkKey:"falcon9", pl:"Starlink v2 mini ×22", satCount:22, site:"加州范登堡·4E工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:""},
  {id:"sx-m7-3", name:"Starlink 12-25（一箭23星）", s:"2026-07-21", e:"2026-07-21", t:"—", rk:"Falcon 9 · B1080", rkKey:"falcon9", pl:"Starlink v2 mini ×23", satCount:23, site:"佛州卡角·40号工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:""},
  {id:"sx-m7-4", name:"Starlink 12-26（一箭22星）", s:"2026-07-28", e:"2026-07-28", t:"—", rk:"Falcon 9 · B1073", rkKey:"falcon9", pl:"Starlink v2 mini ×22", satCount:22, site:"佛州卡角·40号工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:"7月4批·累计89颗"},

  {id:"sx-m8-1", name:"Starlink 12-27（一箭22星）", s:"2026-08-04", e:"2026-08-04", t:"—", rk:"Falcon 9 · B1078", rkKey:"falcon9", pl:"Starlink v2 mini ×22", satCount:22, site:"佛州卡角·40号工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:""},
  {id:"sx-m8-2", name:"Starlink 12-28（一箭22星·西海岸）", s:"2026-08-11", e:"2026-08-11", t:"—", rk:"Falcon 9 · B1062", rkKey:"falcon9", pl:"Starlink v2 mini ×22", satCount:22, site:"加州范登堡·4E工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:""},
  {id:"sx-m8-3", name:"Starlink 12-29（一箭23星）", s:"2026-08-18", e:"2026-08-18", t:"—", rk:"Falcon 9 · B1082", rkKey:"falcon9", pl:"Starlink v2 mini ×23", satCount:23, site:"佛州卡角·40号工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:""},
  {id:"sx-m8-4", name:"Starlink 12-30（一箭22星）", s:"2026-08-25", e:"2026-08-25", t:"—", rk:"Falcon 9 · B1076", rkKey:"falcon9", pl:"Starlink v2 mini ×22", satCount:22, site:"佛州卡角·40号工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"est", note:"8月4批·累计89颗·星链在轨突破7700颗"},

  /* SpaceX 9-12月计划 */
  {id:"sx-m9-1", name:"Starlink Group 15-23（一箭27星）", s:"2026-09-02", e:"2026-09-02", t:"16:42", rk:"Falcon 9", rkKey:"falcon9", pl:"Starlink v2 mini ×27", satCount:27, site:"加州范登堡·4E工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"launchlib", note:"原记为「Starlink 12-31」（该批次号在任何公开源中均不存在），经 Launch Library 2.2 核实 9 月首批实为 Group 15-23：net=2026-09-02T08:42:12Z（北京 16:42），范登堡 SLC-4E，一箭 27 星入 LEO，成功。注意：库内沿用「12-xx」编号体系，与国际源「Group 15-xx」不一致，批次号以国际源为准。团队外部查证另记一级编号 B1063。"},
  {id:"sx-m9-1b", name:"Starlink Group 15-24（一箭27星）", s:"2026-09-06", e:"2026-09-06", t:"22:26", rk:"Falcon 9", rkKey:"falcon9", pl:"Starlink v2 mini ×27", satCount:27, site:"加州范登堡·4E工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"launchlib", note:"2026-09-06T14:26:54Z（北京 22:26）范登堡 SLC-4E 发射，一箭 27 星入 LEO，成功。数据源 Launch Library 2.2（mission description: A batch of 27 satellites）。库内原无对应条目，本次补录。"},
  {id:"sx-m9-2", name:"Starlink Group 15-27（一箭27星）", s:"2026-09-20", e:"2026-09-20", t:"09:47", rk:"Falcon 9", rkKey:"falcon9", pl:"Starlink v2 mini ×27", satCount:27, site:"加州范登堡·4E工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"launchlib", note:"原记 12-32 / 9-22；经 LL 核实 9 月下旬星链批次为 Group 15-27，net=2026-09-20T01:47Z（北京 09:47），范登堡 SLC-4E，一箭 27 星（Starlink v2 mini）。北京时间 2026-09-20 09:47 发射（LL 状态 Launch in Flight，发射已实施），入 LEO，成功。沿用国际源 Group 编号体系。"},
  {id:"sx-m10-1", name:"Starlink Group 15-25（一箭27星）", s:"2026-10-13", e:"2026-10-13", t:"08:28", rk:"Falcon 9", rkKey:"falcon9", pl:"Starlink v2 mini ×27", satCount:27, site:"加州范登堡·4E工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"launchlib", note:"net=2026-10-13T00:28Z（北京08:28），范登堡 SLC-4E，一箭27星（v2 mini）。星链三周停飞后首发（上一批为9-20 Group 15-27）。替换原「10月组网计划×4」占位。"},
  {id:"sx-m10-2", name:"Starlink Group 15-15（一箭27星）", s:"2026-10-22", e:"2026-10-22", t:"07:02", rk:"Falcon 9", rkKey:"falcon9", pl:"Starlink v2 mini ×27", satCount:27, site:"加州范登堡·4E工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"done", hl:0, src:"launchlib", note:"net=2026-10-21T23:02Z（北京10-22 07:02），范登堡 SLC-4E，一箭27星（v2 mini）。10-20 技术 scrub 后一日补发；助推器 B1082 第12次飞行，回收船 OCISLY。本次为 SpaceX 首次24小时内从三个不同发射台连发三枚 Falcon 9。"},
  {id:"sx-m10-3", name:"Starlink Group 15-16（计划·一箭约27星）", s:"2026-10-24", e:"2026-10-24", t:"13:29", rk:"Falcon 9", rkKey:"falcon9", pl:"Starlink v2 mini ×约27", satCount:0, site:"加州范登堡·4E工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"plan", hl:0, src:"est", note:"国际排期源：net=2026-10-24T05:29Z（北京10-24 13:29），范登堡 SLC-4E。"},
  {id:"sx-m11-1", name:"Starlink 11月组网（计划×4）", s:"2026-11-03", e:"2026-11-24", t:"窗口", rk:"Falcon 9", rkKey:"falcon9", pl:"Starlink v2 mini ×约90颗", satCount:0, site:"佛州/加州交替", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"plan", hl:0, src:"est", note:"11月预计4次"},
  {id:"sx-m12-1", name:"Starlink 12月组网（计划×4）", s:"2026-12-01", e:"2026-12-29", t:"窗口", rk:"Falcon 9", rkKey:"falcon9", pl:"Starlink v2 mini ×约90颗", satCount:0, site:"佛州/加州交替", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"plan", hl:0, src:"est", note:"12月预计4次·全年星链~70次·~1500颗入轨"},

  /* --- Starship 验证（2026年继续高频测试） --- */
  {id:"ss-m1", name:"Starship IFT-9（亚轨道）", s:"2026-01-15", e:"2026-01-15", t:"—", rk:"Starship · Ship+Booster", rkKey:"starship", pl:"无载荷·亚轨道试飞", satCount:0, site:"德州博卡奇卡·Starbase", op:"SpaceX", opKey:"spacex", cat:"verify", ty:"商发", st:"done", hl:1, src:"xinhua", note:"2026年首飞·助推器回收验证"},
  {id:"ss-m3", name:"Starship IFT-10（首次完整入轨尝试）", s:"2026-03-25", e:"2026-03-25", t:"—", rk:"Starship · Ship+Booster", rkKey:"starship", pl:"无载荷·入轨级试飞", satCount:0, site:"德州博卡奇卡·Starbase", op:"SpaceX", opKey:"spacex", cat:"verify", ty:"商发", st:"done", hl:1, src:"xinhua", note:"首次尝试完整入轨·助推器+飞船筷子塔回收"},
  {id:"ss-m5", name:"Starship IFT-11（载荷舱验证）", s:"2026-05-20", e:"2026-05-20", t:"—", rk:"Starship · Ship+Booster", rkKey:"starship", pl:"Starlink 试验舱段", satCount:0, site:"德州博卡奇卡·Starbase", op:"SpaceX", opKey:"spacex", cat:"verify", ty:"商发", st:"done", hl:0, src:"xinhua", note:"载荷部署机构验证"},
  {id:"ss-m7", name:"Starship IFT-12（在轨重新点火）", s:"2026-07-18", e:"2026-07-18", t:"—", rk:"Starship · Ship+Booster", rkKey:"starship", pl:"无载荷·在轨点火验证", satCount:0, site:"德州博卡奇卡·Starbase", op:"SpaceX", opKey:"spacex", cat:"verify", ty:"商发", st:"done", hl:0, src:"xinhua", note:"飞船在轨重新点火验证"},

  /* --- 亚马逊 Kuiper（2026年加速部署·Atlas V/Vulcan） --- */
  {id:"kp-m4-1", name:"Kuiper Sat 1-27（Atlas V·一箭27星）", s:"2026-04-08", e:"2026-04-08", t:"—", rk:"Atlas V · 401", rkKey:"atlasV", pl:"Project Kuiper ×27", satCount:27, site:"佛州卡角·41号工位", op:"亚马逊·Kuiper", opKey:"kuiper", cat:"amazon", ty:"国外", st:"done", hl:1, src:"est", note:"Kuiper 2026年首批·大规模部署启动"},
  {id:"kp-m6-1", name:"Kuiper Sat 28-54（Vulcan·一箭27星）", s:"2026-06-12", e:"2026-06-12", t:"—", rk:"Vulcan Centaur · VC2L", rkKey:"vulcan", pl:"Project Kuiper ×27", satCount:27, site:"佛州卡角·41号工位", op:"亚马逊·Kuiper", opKey:"kuiper", cat:"amazon", ty:"国外", st:"done", hl:1, src:"est", note:"Vulcan 首次执行Kuiper任务"},
  {id:"kp-m8-1", name:"Kuiper Sat 55-81（Atlas V·一箭27星）", s:"2026-08-12", e:"2026-08-12", t:"—", rk:"Atlas V · 401", rkKey:"atlasV", pl:"Project Kuiper ×27", satCount:27, site:"佛州卡角·41号工位", op:"亚马逊·Kuiper", opKey:"kuiper", cat:"amazon", ty:"国外", st:"done", hl:0, src:"est", note:"8月批次·累计81颗入轨"},
  {id:"kp-m9-1", name:"Kuiper LV-01（Vulcan·首担Leo批次）", s:"2026-10-29", e:"2026-10-29", t:"待定", rk:"Vulcan Centaur · VC6L", rkKey:"vulcan", pl:"Amazon Leo（原Project Kuiper）×约27-45", satCount:0, site:"佛州卡角·41号工位", op:"亚马逊·Kuiper", opKey:"kuiper", cat:"amazon", ty:"国外", st:"plan", month:10, hl:0, src:"est", note:"原记 9/15→9/30（月度TBD）→ 现国际排期源给出 net=2026-10-29（卡角 SLC-41，Vulcan VC6L，任务代号 LV-01，Amazon Leo 更名后首个 Vulcan 批次）。星数口径存疑（27 vs 45），待官方。合并吸收原 kp-m10-1（10-20 Atlas V 占位，无源佐证）。"},
  {id:"kp-m11-1", name:"Kuiper 11月批次（计划）", s:"2026-11-18", e:"2026-11-18", t:"预计", rk:"Vulcan Centaur", rkKey:"vulcan", pl:"Project Kuiper ×27", satCount:0, site:"佛州卡角·41号工位", op:"亚马逊·Kuiper", opKey:"kuiper", cat:"amazon", ty:"国外", st:"plan", hl:0, src:"est", note:"11月计划批次"},
  {id:"kp-m12-1", name:"Kuiper 12月批次（计划）", s:"2026-12-10", e:"2026-12-10", t:"预计", rk:"Atlas V", rkKey:"atlasV", pl:"Project Kuiper ×27", satCount:0, site:"佛州卡角·41号工位", op:"亚马逊·Kuiper", opKey:"kuiper", cat:"amazon", ty:"国外", st:"plan", hl:0, src:"est", note:"12月计划批次·全年Kuiper累计约162颗"},

  /* --- OneWeb（已完成第一阶段·2026年补网+二代验证） --- */
  {id:"ow-m2-1", name:"OneWeb 补网批次（Soyuz·一箭36星）", s:"2026-02-28", e:"2026-02-28", t:"—", rk:"Soyuz-2.1b", rkKey:"soyuz", pl:"OneWeb Gen1.5 ×36", satCount:36, site:"哈萨克斯坦·拜科努尔", op:"OneWeb·Eutelsat", opKey:"oneweb", cat:"oneweb", ty:"国外", st:"done", hl:1, src:"est", note:"2026年首次补网·填补轨道间隙"},
  {id:"ow-m5-1", name:"OneWeb Gen2 首批验证（Soyuz·一箭36星）", s:"2026-05-18", e:"2026-05-18", t:"—", rk:"Soyuz-2.1b", rkKey:"soyuz", pl:"OneWeb Gen2 ×36", satCount:36, site:"哈萨克斯坦·拜科努尔", op:"OneWeb·Eutelsat", opKey:"oneweb", cat:"oneweb", ty:"国外", st:"done", hl:1, src:"est", note:"二代卫星首次验证·增强手机直连能力"},
  {id:"ow-m9-1", name:"OneWeb Gen2 第二批（待排期·一箭36星）", s:"", e:"", t:"待定", rk:"Soyuz-2.1b", rkKey:"soyuz", pl:"OneWeb Gen2 ×36", satCount:0, site:"哈萨克斯坦·拜科努尔", op:"OneWeb·Eutelsat", opKey:"oneweb", cat:"oneweb", ty:"国外", st:"plan", hl:0, src:"tbd", tbd:1, month:10, note:"原记 9/20；经 Launch Library 2.2 核实 9/20 无 Soyuz/OneWeb 发射（previous 窗口 9/20~9/24 仅 Kinetica 1 与 Starlink 15-27 两发），该 9/20 批次未实施，改为待排期（tbd:1, month:9），具体日期待官方公布后回填。"},
  {id:"ow-m11-1", name:"OneWeb Gen2 第三批（计划·一箭36星）", s:"2026-11-12", e:"2026-11-12", t:"预计", rk:"Soyuz-2.1b", rkKey:"soyuz", pl:"OneWeb Gen2 ×36", satCount:0, site:"哈萨克斯坦·拜科努尔", op:"OneWeb·Eutelsat", opKey:"oneweb", cat:"oneweb", ty:"国外", st:"plan", hl:0, src:"est", note:"11月计划批次·全年OneWeb累计108颗"},

  /* --- 2026年9月补充（公开发射计划·est，窗口以官方通告为准） --- */
  {id:"m9-6", name:"遥感五十三号01-03星 · 遥感五十六号01-03星", s:"2026-09-10", e:"2026-09-10", t:"17:00", rk:"长征四号乙", rkKey:"cz4b", pl:"遥感五十三号01~03星 + 遥感五十六号01~03星（一箭六星）", satCount:6, site:"酒泉卫星发射中心", op:"航天科技集团八院（上海航天）", opKey:"", cat:"other", ty:"国发", st:"done", hl:0, src:"xinhua", note:"原记长征二号丁·远征三号 / 载荷未公布 / 吉利07A-L，经中国日报、央视新闻、中国航天报与 Launch Library 状态变更四源核实，实为长征四号乙发射遥感五十三号01-03星、遥感五十六号01-03星，一箭六星，2026-09-10 17:00 酒泉发射成功，长征系列第 666 次发射。原载荷名「吉利07A-L」仅见于中文民间计划表、无官方来源，不予采信。"},
  {id:"m9-7", name:"朱雀二号改进型遥七 · 千帆极轨19组（一箭十星）", s:"2026-09-15", e:"2026-09-15", t:"14:26", rk:"朱雀二号改进型 · 遥七", rkKey:"zq2", pl:"千帆极轨19组共10颗卫星", satCount:10, site:"东风商业航天创新试验区（LA-96A）", op:"垣信卫星 · 千帆星座", opKey:"yuanxin", cat:"yuanxin", ty:"商发", st:"done", hl:1, src:"xinhua", note:"2026-09-15 14:26 酒泉东风商业航天创新试验区发射成功，将千帆极轨19组共10颗卫星送入预定轨道，朱雀二号系列第9次飞行；我国民营火箭首次执行规模化卫星互联网星座组网任务（蓝箭航天承运）。据新华社、央视新闻。"},
  {id:"m9-3", name:"引力一号遥三 · 千帆极轨组网（一箭九星）", s:"2026-09-16", e:"2026-09-16", t:"06:00", rk:"引力一号 · 遥三", rkKey:"yyl1", pl:"千帆极轨组网卫星（一箭九星）", satCount:9, site:"山东海阳附近海域（东方航天港·海上发射）", op:"垣信卫星 · 千帆星座", opKey:"yuanxin", cat:"yuanxin", ty:"国发", st:"done", hl:1, src:"launchlib", note:"2026-09-16 约06:00（北京时间）山东海阳附近海域（东方航天港）海上发射成功，一箭九星将千帆极轨组网卫星送入轨道（东方空间·引力一号遥三承运）。经 Launch Library 2.2 核实发射成功，载荷官方确认为千帆星座。注：海域名称两源冲突（民间记「东海」、LL 记「Yellow Sea/黄海」），本站采用中性表述「山东海阳附近海域」，以官方通告为准。"},
  {id:"m9-4", name:"谷神星二号 · 遥二", s:"", e:"", t:"待定", rk:"谷神星二号 · 遥二", rkKey:"gsc2", pl:"应用卫星（一箭多星，载荷待公布）", satCount:0, site:"酒泉卫星发射中心", op:"星河动力", opKey:"", cat:"verify", ty:"商发", st:"plan", s:"2026-10-25", e:"2026-10-25", t:"待定", hl:0, src:"est", month:10, note:"谷神星二号第二飞（年初遥一首飞失利后复飞）。原定 9/23，经核实 9/23 未见发射成功报道（公开源仍列为计划/未实施），推迟待排期，具体日期待官方公布后回填。"},
  {id:"m9-5", name:"快舟十一号遥三（一箭双星）", s:"2026-09-17", e:"2026-09-17", t:"10:40", rk:"快舟十一号 · 遥三", rkKey:"kz11", pl:"天仪51星（彩云SAR01）· 天仪52星（一箭双星）", satCount:2, site:"酒泉卫星发射中心", op:"快舟航天空间科技", opKey:"", cat:"other", ty:"商发", st:"done", hl:0, src:"xinhua", note:"航天科工火箭更名「快舟航天空间科技有限公司」后首次发射（快舟十一号第7飞）。北京时间 2026-09-17 10:40 酒泉 LA-95A 一箭双星，成功将天仪51星（彩云SAR01，C波段雷达遥感，云南彩云星座）与天仪52星（新技术试验星）送入预定轨道，发射任务圆满成功。经新华社、央视新闻、中国新闻网多源确认。"},
  {id:"m9-8", name:"长征二号丁 · 一箭四星（株洲太空星际 PIESAT-2 13~16星）", s:"2026-09-19", e:"2026-09-19", t:"18:50", rk:"长征二号丁", rkKey:"cz2d", pl:"株洲太空星际 PIESAT-2 13~16星（银河航天研制·4颗X波段SAR）", satCount:4, site:"太原卫星发射中心", op:"国家任务", opKey:"", cat:"other", ty:"国发", st:"done", hl:0, src:"spacechina", note:"北京时间 2026-09-19 18:50 太原卫星发射中心 LC-9，长征二号丁一箭四星成功将株洲太空星际 PIESAT-2 13~16星送入预定轨道，发射任务圆满成功（长征系列第 668 次飞行）。4 颗卫星均由银河航天自主研制，为高分辨率合成孔径雷达（SAR）卫星，搭载星上智能处理与任务规划载荷。经中国航天科技集团官网、人民网、央视新闻确认。"},
  {id:"m9-9", name:"力箭一号遥十八（酒泉·一箭九星）", s:"2026-09-20", e:"2026-09-20", t:"12:03", rk:"力箭一号", rkKey:"lz1", pl:"超智算一号等9颗卫星（含鹏城南科一号、秦岭卫星01/02星等）", satCount:9, site:"酒泉卫星发射中心", op:"中科宇航", opKey:"", cat:"other", ty:"商发", st:"done", hl:1, src:"launchlib", note:"经 Launch Library 2.2 核实并据新华社/央视/网易/腾讯等多源确认：2026-09-20T04:03Z（北京 12:03）酒泉发射区 130 力箭一号遥十八（Kinetica 1）成功实施一箭九星发射，将「超智算一号」（国内首个首箭首星一体化太空算力卫星）、鹏城南科一号、秦岭卫星01/02星等共9颗卫星送入太阳同步轨道，任务取得圆满成功（中科宇航承运，力箭一号第16次飞行、累计送星超110颗）。"},
  /* 2026年10-12月补充（NOTAM 已确认排期，源自中国运载火箭发射列表） */
  {id:"m10-8", name:"西光四号01星（五羊星座先导A星）", s:"2026-10-21", e:"2026-10-21", t:"11:39", rk:"谷神星一号海射型 · 遥八", rkKey:"gsc1", pl:"西光四号01星（广大一号/五羊星座先导A星，高光谱遥感）", satCount:1, site:"日照近海 · 东方航天港号（太原卫星发射中心组织）", op:"中科西光航天 · 五羊星座", opKey:"", cat:"other", ty:"商发", st:"done", hl:1, month:10, src:"xinhua", note:"2026-10-21 11:39 日照近海发射成功，西光肆号01星入轨（全球首个低倾角遥感星座「五羊星座」先导星）。谷神星一号第24次飞行、海射型第7次海射保持100%成功率；首次「陆地指挥·海上发射」新模式（日照指控中心启用）。西安中科西光航天承研，39°低倾角轨道（500-550km）、0.5m高分相机+多光谱+宽幅红外，补低纬高频观测短板；谷神星一号海射型遥八（星河动力），日照近海第8次海上发射保障任务。星河动力累计23次入轨发射、服务28家客户、90颗商业卫星入轨。 五羊星座由广州市政府/国家信息中心/广州大学推动、广东省天垣科技商业化运营，规划3颗先导星+25颗业务星（愿景1008星），服务南北纬35°低纬区域高频遥感。"},
  {id:"m10-11", name:"长征六号改 · 太原10-23（载荷待定）", s:"2026-10-23", e:"2026-10-23", t:"18:15", rk:"长征六号改", rkKey:"cz6a", pl:"待官方披露", satCount:0, site:"太原卫星发射中心 · 9A工位", op:"国家任务", opKey:"", cat:"other", ty:"国发", st:"plan", month:10, hl:0, src:"est", note:"国际排期源（SkyLep/Spaceflight Tracker）：net=2026-10-23T10:15Z（北京18:15），太原 LC-9A，载荷未披露。是否组网批次待官方通告确认。"},
  {id:"m10-9", name:"长征十二号海 · 遥一（首飞）", s:"", e:"", t:"待定", rk:"长征十二号海 · 遥一", rkKey:"cz12", pl:"首飞载荷（未公布）", satCount:0, site:"黄海海阳近海 · 东方航天港号", op:"国家任务", opKey:"", cat:"verify", ty:"国发", st:"plan", tbd:1, month:10, hl:0, src:"est", note:"长征十二号海上发射型首飞（CZ-12 海射构型），NOTAM 列入 2026年10月窗口，具体日期待官方公布。"},
  {id:"m11-2", name:"神舟二十四号载人飞船", s:"2026-11-24", e:"2026-11-24", t:"待定", rk:"长征二号F · 遥二十四", rkKey:"cz2f", pl:"神舟二十四号载人飞船（3人乘组，含巴基斯坦航天员短期驻留）", satCount:1, site:"酒泉卫星发射中心 · 921工位", op:"中国载人航天工程", opKey:"human", cat:"major", ty:"国发", st:"plan", month:11, hl:1, src:"est", note:"空间站应用与发展阶段第8次载人飞行；乘组含港澳航天员，巴基斯坦航天员随乘短期驻留后随神舟二十三号乘组返回；NOTAM 排期 2026-11-24，具体以官方通告为准。"},
  {id:"m11-3", name:"梦舟一号载人飞船（无人首飞）", s:"", e:"", t:"待定", rk:"长征十号甲 · 遥一", rkKey:"cz10a", pl:"梦舟一号近地版载人飞船（无人）", satCount:1, site:"文昌航天发射场 · 3号工位", op:"中国载人航天工程", opKey:"human", cat:"major", ty:"国发", st:"plan", tbd:1, month:11, hl:1, src:"est", note:"新一代可重复使用载人飞船梦舟一号首次无人飞行试验，对接中国空间站核心舱；由长征十号甲遥一发射，NOTAM 列入 2026年11月，具体日期待官方公布。"},
  {id:"m8-cz6c", name:"长征六号丙遥一 · 一箭七星", s:"2026-08-25", e:"2026-08-25", t:"11:21", rk:"长征六号丙 · 遥一", rkKey:"cz6c", pl:"中科卫星14星/15星、木铎1A/B、静安梦想星、八一04星、银河航天灵知09泰国立方星（共7星）", satCount:7, site:"太原卫星发射中心", op:"国家任务", opKey:"", cat:"other", ty:"国发", st:"done", hl:0, src:"spacechina", note:"北京时间 2026-08-25 11:21 太原卫星发射中心，长征六号丙遥一运载火箭成功将中科卫星14星、中科卫星15星、木铎1A/B、静安梦想星、八一04星、银河航天灵知09泰国立方星等7颗卫星送入预定轨道，飞行试验任务圆满成功（长征系列第 665 次飞行）。银河航天灵知09为泰国立方星，系中国商业航天首次面向东南亚整星研制、发射及在轨交付（一带一路合作）。"},
  {id:"m10-10", name:"朱雀二号E · 一箭十星（星算02组+光传03/04）", s:"2026-10-14", e:"2026-10-14", t:"19:40", rk:"朱雀二号改进型 · 遥四", rkKey:"zq2e", pl:"国星宇航星算计划02组8星（星时代-39、44~50）+ 蓝塔智能光传-03、04星（共10星）", satCount:10, site:"酒泉 · 东风商业航天创新试验区", op:"蓝箭航天", opKey:"", cat:"verify", ty:"商发", st:"done", month:10, hl:1, src:"xinhua", note:"北京时间 2026-10-14 19:40，朱雀二号改进型遥四在东风商业航天创新试验区点火升空，采用多客户「拼车」方式将国星宇航星算计划02组首批8颗晨昏轨道算力卫星（星时代-39、44~50）及蓝塔智能光传-03、04星共10颗卫星送入预定轨道，发射任务圆满成功。此为朱雀二号系列第10次飞行，距9月15日遥七任务仅29天，箭体印大熊猫萌兰。星算02组将验证万瓦级液冷流路、超大辐冷翼、全域激光通信网与在轨大模型训练。"},
];

/* 大事记 */
const MILESTONES = [
  {d:"2026-01-19", t:"星网低轨19组发射成功", s:"1月连续完成低轨18、19两组组网，国网星座2026年部署开局。", k:"星座", c:"#3b82f6"},
  {d:"2026-03-30", t:"力箭二号液体新箭首飞成功", s:"中科宇航力箭二号一箭3星首飞，商业液体运载能力补强。", k:"火箭", c:"#a855f7"},
  {d:"2026-05-07", t:"国电高科获国内首张卫星物联网牌照", s:"工信部批复卫星物联网业务商用试验许可，依托在轨41颗的天启星座，成为国内首家具备卫星物联网规模化商业运营资质的企业。", k:"政策", c:"#0ea5e9"},
  {d:"2026-05-24", t:"神舟二十三号载人飞船发射成功", s:"空间站应用与发展阶段第7次载人飞行任务，航天员再赴中国空间站。", k:"载人", c:"#f97316"},
  {d:"2026-06-05", t:"千帆星座在轨突破200颗", s:"长八一箭18星；7月5日进一步增至238颗，「两天两发」38星入轨。", k:"星座", c:"#22c55e"},
  {d:"2026-06-09", t:"中国移动02星入轨", s:"与千帆DTC01星一箭双星，手机直连卫星试验星发射，直连商用提速。", k:"产业", c:"#eab308"},
  {d:"2026-07-10", t:"长征十号乙首飞 + 海上网系回收", s:"新箭首飞即实现全球首次运载火箭一子级海上「网系回收」。", k:"火箭", c:"#a855f7"},
  {d:"2026-08-10", t:"长征七号改发射失利", s:"中星4B卫星发射任务失利（2026年第4次轨道级发射失败），原因排查中。", k:"发射", c:"#dc2626"},
  {d:"2026-08-17", t:"垣信卫星完成近70亿元增资", s:"B轮18家投资方入局、估值约500亿元，千帆星座建设资金充裕。", k:"资本", c:"#eab308"},
  {d:"2026-08-19", t:"朱雀三号实现我国首次火箭陆地回收", s:"入轨级火箭一子级陆地垂直回收成功，可复用火箭技术重大突破。", k:"火箭", c:"#a855f7"},
  {d:"2026-10-14", t:"朱雀二号E一箭十星·星算02组入轨", s:"19:40 东风商发，多客户「拼车」送国星宇航8星与蓝塔光传2星；朱雀二号系列第10飞，29天内两发。", k:"星座", c:"#22c55e"},
  {d:"2026-10-21", t:"谷神星一号海遥八发射西光肆号01星", s:"11:39 日照近海，五羊星座先导星入轨；首次「陆地指挥·海上发射」新模式，谷神星一号第24飞、海射型7战7捷。", k:"卫星", c:"#22c55e"},
  {d:"2026-08-20", t:"时空道宇获第二张卫星物联网牌照", s:"继5月国电高科首张牌照后，工信部批复第二张卫星物联网商用试验许可（试验期两年），持牌企业增至2家。", k:"政策", c:"#0ea5e9"},
  {d:"2026-08-24", t:"嫦娥七号推迟至2027年", s:"19号台风「紫檀」致发射条件不满足，2026年窗口取消，预计2027年发射。", k:"探月", c:"#f97316"},
  {d:"2026-08-25", t:"长征六号丙遥一一箭七星", s:"太原卫星发射中心成功发射中科卫星14/15星、木铎1A/B、静安梦想星、八一04星、银河航天灵知09泰国立方星等7星（长征系列第665次），银河航天灵知09泰国立方星系商业航天首次面向东南亚整星交付。", k:"卫星", c:"#22c55e"},
  /* === 国际大事记 === */
  {d:"2026-01-15", t:"Starship IFT-9 助推器回收验证", s:"SpaceX 2026年首次Starship试飞，再次验证助推器筷子塔回收技术。", k:"国际·火箭", c:"#0c4a8c"},
  {d:"2026-03-25", t:"Starship 首次完整入轨尝试", s:"Starship IFT-10 首次尝试飞船+助推器完整入轨并双回收，可复用重型火箭里程碑。", k:"国际·火箭", c:"#0c4a8c"},
  {d:"2026-04-08", t:"亚马逊 Kuiper 大规模部署启动", s:"Atlas V 一箭27星，Kuiper 从2023年2颗试验星进入规模化部署阶段。", k:"国际·星座", c:"#b45309"},
  {d:"2026-06-12", t:"Vulcan 首次执行 Kuiper 任务", s:"ULA Vulcan Centaur 首次执行商业载荷任务，一箭27星部署 Kuiper。", k:"国际·火箭", c:"#b45309"},
  {d:"2026-08-25", t:"星链在轨突破7700颗", s:"SpaceX Starlink 在轨卫星累计突破7700颗，继续保持全球最大低轨星座地位。", k:"国际·星座", c:"#0c4a8c"},
  {d:"2026-05-18", t:"OneWeb Gen2 首批验证发射", s:"Eutelsat-OneWeb 发射二代卫星首批36颗，验证手机直连能力，对标星链直连服务。", k:"国际·星座", c:"#475569"},
  {d:"2026-09-15", t:"民营火箭首次规模化星座组网", s:"朱雀二号改进型遥七一箭十星将千帆极轨19组送入轨道，蓝箭航天承运，我国民营商业火箭首次执行巨型星座批量组网发射。", k:"产业", c:"#eab308"},
  {d:"2026-09-16", t:"引力一号遥三海上一箭九星", s:"东方空间引力一号遥三在山东海阳附近海域（东方航天港）成功实施海上发射，将千帆极轨组网卫星一箭九星送入轨道。", k:"星座", c:"#22c55e"},
  {d:"2026-09-17", t:"长征十二号遥十发射星网低轨25组", s:"航天科技集团长征十二号遥十在海南商业航天发射场成功将卫星互联网低轨25A-I组送入近地轨道，GW（星网）星座组网自8月低轨24组后再度加注。", k:"星座", c:"#3b82f6"},
  {d:"2026-09-17", t:"快舟十一号遥三一箭双星", s:"快舟航天空间科技快舟十一号遥三在酒泉一箭双星，将天仪51星（彩云SAR01，C波段雷达遥感）与天仪52星送入预定轨道，快舟十一号第7次飞行，商业航天高频发射延续。", k:"商发", c:"#eab308"},
  {d:"2026-09-19", t:"长征二号丁一箭四星 PIESAT-2 13~16", s:"太原卫星发射中心长征二号丁一箭四星成功发射株洲太空星际 PIESAT-2 13~16星（银河航天研制·4颗X波段SAR），长征系列第668次飞行。", k:"国发", c:"#3b82f6"},
  {d:"2026-09-20", t:"Starlink Group 15-27 一箭27星", s:"SpaceX 范登堡 SLC-4E 发射星链 Group 15-27 一批 27 颗 v2 mini 卫星入近地轨道，星链组网持续高频部署。", k:"国际·星座", c:"#0c4a8c"},
  {d:"2026-09-20", t:"力箭一号遥十八一箭九星·太空算力首星入轨", s:"中科宇航力箭一号遥十八在酒泉东风商业航天创新试验区一箭九星发射成功，将「超智算一号」（国内首个首箭首星一体化太空算力卫星）、鹏城南科一号、秦岭卫星01/02星等送入太阳同步轨道，开启「算力上天、天数天算」工程化落地关键一步。", k:"商发", c:"#eab308"},
  {d:"2026-09-23", t:"长征八号甲一箭多星·星网低轨26组入轨", s:"海南商业航天发射场长征八号甲运载火箭于 21:32 成功将卫星互联网低轨26组卫星送入预定轨道，发射任务圆满成功（长征系列第 669 次飞行），星网（GW）低轨星座持续组网。", k:"国发", c:"#3b82f6"},
  {d:"2026-09-24", t:"长征六号甲发射遥感四十号04组·长征系列第670飞", s:"太原卫星发射中心长征六号甲（遥十九）成功将遥感四十号04组（三颗）送入轨道，长征系列运载火箭累计发射达 670 次。", k:"国发", c:"#3b82f6"}
];
