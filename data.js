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
      models: ["zq2","zq3"]
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
  "gsc1":     {name:"谷神星一号",      vendor:"星河动力",                  type:"固体", fuel:"固体", leo:"LEO·0.5t", note:""},
  "gsc2":     {name:"谷神星二号",      vendor:"星河动力",                  type:"液体", fuel:"液氧甲烷", leo:"LEO·2.8t", note:"2026首飞"},
  "yyl1":     {name:"引力一号",        vendor:"东方空间",                  type:"固体", fuel:"固体", leo:"LEO·6.5t", note:"全球最大固体"},
  "zs1":      {name:"智神星一号",      vendor:"星河动力",                  type:"液体", fuel:"液氧煤油", leo:"LEO·7t(可复用)", note:"2026首飞"},
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
const DATA_ASOF = "2026-09-06";   // 数据整理基准日期
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
  {id:"m9-1", name:"千帆极轨16组（9月12日）", s:"2026-09-12", e:"2026-09-12", t:"预计", rk:"长征八号甲 · 遥十一", rkKey:"cz8a", pl:"千帆极轨16A-T组网卫星", satCount:0, site:"海南商业航天发射场", op:"垣信卫星 · 千帆星座", opKey:"yuanxin", cat:"yuanxin", ty:"国发", st:"plan", hl:1, src:"est", note:"9月千帆「双发」之一，与9月17日任务同为高频组网发射。"},
  {id:"m9-1b", name:"千帆极轨16组（9月17日）", s:"2026-09-17", e:"2026-09-17", t:"预计", rk:"长征十二号 · 遥十", rkKey:"cz12", pl:"千帆极轨16A-T组网卫星", satCount:0, site:"海南商业航天发射场", op:"垣信卫星 · 千帆星座", opKey:"yuanxin", cat:"yuanxin", ty:"国发", st:"plan", hl:0, src:"est", note:"千帆星座9月第二次组网发射，全年324颗目标冲刺。"},
  {id:"m9-1c", name:"风云四号M气象卫星", s:"2026-09-29", e:"2026-09-29", t:"预计", rk:"长征三号乙 · 遥一百二十", rkKey:"cz3b", pl:"风云四号M气象卫星", satCount:0, site:"西昌卫星发射中心", op:"国家气象卫星工程", opKey:"weather", cat:"other", ty:"国发", st:"plan", hl:0, src:"est", note:"新一代静止轨道气象卫星。"},
  {id:"m9-1d", name:"西昌任务（载荷未公布）", s:"2026-09-10", e:"2026-09-10", t:"预计", rk:"长征三号乙 · 遥一百一十七", rkKey:"cz3b", pl:"未公布", satCount:0, site:"西昌卫星发射中心", op:"国家任务", opKey:"", cat:"other", ty:"国发", st:"plan", hl:0, src:"est", note:"据发射计划预告，载荷信息未公布。"},
  {id:"m9-2", name:"中国移动03星（择机）", s:"", e:"", t:"待定", rk:"待定", rkKey:"", pl:"中国移动03星（搭载星载基站）", satCount:0, site:"待定", op:"中国移动", opKey:"cmcc", cat:"other", ty:"商发", st:"plan", tbd:1, month:9, hl:0, src:"tbd", note:"验证「星上再生」模式与卫星物联网业务，发射日期未定。"},

  /* ===== 10-12月（占位·计划预告区） ===== */
  {id:"m10-1", name:"千帆极轨17组（10月·待排期）", s:"", e:"", t:"待定", rk:"长征八号甲", rkKey:"cz8a", pl:"千帆极轨17组组网卫星", satCount:0, site:"海南商业航天发射场", op:"垣信卫星 · 千帆星座", opKey:"yuanxin", cat:"yuanxin", ty:"国发", st:"plan", tbd:1, month:10, hl:0, src:"tbd", note:"千帆星座10月组网任务（排期待定）。"},
  {id:"m10-2", name:"星网低轨25组（10月·待排期）", s:"", e:"", t:"待定", rk:"长征十二号", rkKey:"cz12", pl:"卫星互联网低轨25组", satCount:0, site:"海南商业航天发射场", op:"中国星网", opKey:"satnet", cat:"xingwang", ty:"国发", st:"plan", tbd:1, month:10, hl:0, src:"tbd", note:"星网10月组网任务（排期待定）。"},
  {id:"m11-1", name:"千帆极轨18组（11月·待排期）", s:"", e:"", t:"待定", rk:"长征八号甲", rkKey:"cz8a", pl:"千帆极轨18组组网卫星", satCount:0, site:"海南商业航天发射场", op:"垣信卫星 · 千帆星座", opKey:"yuanxin", cat:"yuanxin", ty:"国发", st:"plan", tbd:1, month:11, hl:0, src:"tbd", note:"千帆星座11月组网任务（排期待定）。"},
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
  {id:"sx-m9-1", name:"Starlink 12-31（9月·计划）", s:"2026-09-08", e:"2026-09-08", t:"预计", rk:"Falcon 9", rkKey:"falcon9", pl:"Starlink v2 mini ×22", satCount:0, site:"佛州卡角·40号工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"plan", hl:0, src:"est", note:"9月首批"},
  {id:"sx-m9-2", name:"Starlink 12-32（9月·计划）", s:"2026-09-22", e:"2026-09-22", t:"预计", rk:"Falcon 9", rkKey:"falcon9", pl:"Starlink v2 mini ×22", satCount:0, site:"佛州卡角·40号工位", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"plan", hl:0, src:"est", note:""},
  {id:"sx-m10-1", name:"Starlink 10月组网（计划×4）", s:"2026-10-06", e:"2026-10-27", t:"窗口", rk:"Falcon 9", rkKey:"falcon9", pl:"Starlink v2 mini ×约90颗", satCount:0, site:"佛州/加州交替", op:"SpaceX·星链", opKey:"starlink", cat:"spacex", ty:"国外", st:"plan", hl:0, src:"est", note:"10月预计4次·累计约90颗"},
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
  {id:"kp-m9-1", name:"Kuiper Sat 82-108（计划·一箭27星）", s:"2026-09-15", e:"2026-09-15", t:"预计", rk:"Vulcan Centaur", rkKey:"vulcan", pl:"Project Kuiper ×27", satCount:0, site:"佛州卡角·41号工位", op:"亚马逊·Kuiper", opKey:"kuiper", cat:"amazon", ty:"国外", st:"plan", hl:0, src:"est", note:"9月计划批次"},
  {id:"kp-m10-1", name:"Kuiper 10月批次（计划）", s:"2026-10-20", e:"2026-10-20", t:"预计", rk:"Atlas V", rkKey:"atlasV", pl:"Project Kuiper ×27", satCount:0, site:"佛州卡角·41号工位", op:"亚马逊·Kuiper", opKey:"kuiper", cat:"amazon", ty:"国外", st:"plan", hl:0, src:"est", note:"10月计划批次·累计~135颗"},
  {id:"kp-m11-1", name:"Kuiper 11月批次（计划）", s:"2026-11-18", e:"2026-11-18", t:"预计", rk:"Vulcan Centaur", rkKey:"vulcan", pl:"Project Kuiper ×27", satCount:0, site:"佛州卡角·41号工位", op:"亚马逊·Kuiper", opKey:"kuiper", cat:"amazon", ty:"国外", st:"plan", hl:0, src:"est", note:"11月计划批次"},
  {id:"kp-m12-1", name:"Kuiper 12月批次（计划）", s:"2026-12-10", e:"2026-12-10", t:"预计", rk:"Atlas V", rkKey:"atlasV", pl:"Project Kuiper ×27", satCount:0, site:"佛州卡角·41号工位", op:"亚马逊·Kuiper", opKey:"kuiper", cat:"amazon", ty:"国外", st:"plan", hl:0, src:"est", note:"12月计划批次·全年Kuiper累计约162颗"},

  /* --- OneWeb（已完成第一阶段·2026年补网+二代验证） --- */
  {id:"ow-m2-1", name:"OneWeb 补网批次（Soyuz·一箭36星）", s:"2026-02-28", e:"2026-02-28", t:"—", rk:"Soyuz-2.1b", rkKey:"soyuz", pl:"OneWeb Gen1.5 ×36", satCount:36, site:"哈萨克斯坦·拜科努尔", op:"OneWeb·Eutelsat", opKey:"oneweb", cat:"oneweb", ty:"国外", st:"done", hl:1, src:"est", note:"2026年首次补网·填补轨道间隙"},
  {id:"ow-m5-1", name:"OneWeb Gen2 首批验证（Soyuz·一箭36星）", s:"2026-05-18", e:"2026-05-18", t:"—", rk:"Soyuz-2.1b", rkKey:"soyuz", pl:"OneWeb Gen2 ×36", satCount:36, site:"哈萨克斯坦·拜科努尔", op:"OneWeb·Eutelsat", opKey:"oneweb", cat:"oneweb", ty:"国外", st:"done", hl:1, src:"est", note:"二代卫星首次验证·增强手机直连能力"},
  {id:"ow-m9-1", name:"OneWeb Gen2 第二批（计划·一箭36星）", s:"2026-09-20", e:"2026-09-20", t:"预计", rk:"Soyuz-2.1b", rkKey:"soyuz", pl:"OneWeb Gen2 ×36", satCount:0, site:"哈萨克斯坦·拜科努尔", op:"OneWeb·Eutelsat", opKey:"oneweb", cat:"oneweb", ty:"国外", st:"plan", hl:0, src:"est", note:"9月计划批次"},
  {id:"ow-m11-1", name:"OneWeb Gen2 第三批（计划·一箭36星）", s:"2026-11-12", e:"2026-11-12", t:"预计", rk:"Soyuz-2.1b", rkKey:"soyuz", pl:"OneWeb Gen2 ×36", satCount:0, site:"哈萨克斯坦·拜科努尔", op:"OneWeb·Eutelsat", opKey:"oneweb", cat:"oneweb", ty:"国外", st:"plan", hl:0, src:"est", note:"11月计划批次·全年OneWeb累计108颗"},

  /* --- 2026年9月补充（公开发射计划·est，窗口以官方通告为准） --- */
  {id:"m9-6", name:"吉利07A-L卫星", s:"2026-09-09", e:"2026-09-09", t:"17:00", rk:"长征二号丙", rkKey:"cz2c", pl:"吉利07A-L卫星", satCount:0, site:"酒泉卫星发射中心", op:"航天科技火箭院", opKey:"", cat:"other", ty:"国发", st:"plan", hl:0, src:"est", note:"吉利星座组网卫星，计划9月9日17:00发射（窗口待官方确认）。"},
  {id:"m9-3", name:"千帆星座（引力一号·遥三·一箭9星）", s:"2026-09-14", e:"2026-09-14", t:"05:30", rk:"引力一号 · 遥三", rkKey:"yyl1", pl:"千帆星座1箭9星", satCount:0, site:"山东海阳东方航天港", op:"垣信卫星 · 千帆星座", opKey:"yuanxin", cat:"yuanxin", ty:"国发", st:"plan", hl:0, src:"est", note:"引力一号首次千帆组网发射，计划9月14日05:30（窗口待官方确认）。"},
  {id:"m9-4", name:"谷神星二号 · 遥二", s:"2026-09-23", e:"2026-09-23", t:"预计", rk:"谷神星二号 · 遥二", rkKey:"gsc2", pl:"应用卫星（一箭多星，载荷待公布）", satCount:0, site:"酒泉卫星发射中心", op:"星河动力", opKey:"", cat:"verify", ty:"商发", st:"plan", hl:0, src:"est", note:"谷神星二号第二飞（年初遥一首飞失利后复飞），计划9月23日。"},
  {id:"m9-5", name:"快舟十一号（9月·计划）", s:"2026-09-28", e:"2026-09-28", t:"预计", rk:"快舟十一号", rkKey:"kz11", pl:"载荷待公布", satCount:0, site:"酒泉卫星发射中心", op:"航天科工", opKey:"", cat:"other", ty:"商发", st:"plan", hl:0, src:"est", note:"快舟十一号9月计划发射，具体日期待公布（暂列9月下旬）。"},
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
  {d:"2026-08-20", t:"时空道宇获第二张卫星物联网牌照", s:"继5月国电高科首张牌照后，工信部批复第二张卫星物联网商用试验许可（试验期两年），持牌企业增至2家。", k:"政策", c:"#0ea5e9"},
  {d:"2026-08-24", t:"嫦娥七号推迟至2027年", s:"19号台风「紫檀」致发射条件不满足，2026年窗口取消，预计2027年发射。", k:"探月", c:"#f97316"},
  /* === 国际大事记 === */
  {d:"2026-01-15", t:"Starship IFT-9 助推器回收验证", s:"SpaceX 2026年首次Starship试飞，再次验证助推器筷子塔回收技术。", k:"国际·火箭", c:"#0c4a8c"},
  {d:"2026-03-25", t:"Starship 首次完整入轨尝试", s:"Starship IFT-10 首次尝试飞船+助推器完整入轨并双回收，可复用重型火箭里程碑。", k:"国际·火箭", c:"#0c4a8c"},
  {d:"2026-04-08", t:"亚马逊 Kuiper 大规模部署启动", s:"Atlas V 一箭27星，Kuiper 从2023年2颗试验星进入规模化部署阶段。", k:"国际·星座", c:"#b45309"},
  {d:"2026-06-12", t:"Vulcan 首次执行 Kuiper 任务", s:"ULA Vulcan Centaur 首次执行商业载荷任务，一箭27星部署 Kuiper。", k:"国际·火箭", c:"#b45309"},
  {d:"2026-08-25", t:"星链在轨突破7700颗", s:"SpaceX Starlink 在轨卫星累计突破7700颗，继续保持全球最大低轨星座地位。", k:"国际·星座", c:"#0c4a8c"},
  {d:"2026-05-18", t:"OneWeb Gen2 首批验证发射", s:"Eutelsat-OneWeb 发射二代卫星首批36颗，验证手机直连能力，对标星链直连服务。", k:"国际·星座", c:"#475569"},
];
