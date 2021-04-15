export const newsEventConfig = {
  cols: ['breaktime', 'category', 'level', 'event_summary', 'url'],
  colNameMap: {
    breaktime: '时间',
    category: '分类',
    level: '级别',
    event_summary: '说明',
    url: 'url',
  },
  defaultFormatter: 'identity',
  colFormatterMap: {
    // profit_min: 'numberEn',
    // profit_max: 'numberEn',
    // profit_last: 'numberEn',
    // profit_ratio_min: 'numberEn',
    // profit_ratio_max: 'numberEn',
  },
};

export const priceEventConfig = {
  cols: ['time', 'type', 'extent', 'reason', 'url'],
  colNameMap: {
    time: '时间',
    type: '类型',
    extent: '幅度',
    reason: '原因',
    url: 'url',
  },
  defaultFormatter: 'identity',
  colFormatterMap: {
    // profit_min: 'numberEn',
    // profit_max: 'numberEn',
    // profit_last: 'numberEn',
    // profit_ratio_min: 'numberEn',
    // profit_ratio_max: 'numberEn',
  },
};

export const valuationConfig = {
  cols: [
    'day',
    'pe_ratio',
    'turnover_ratio',
    'pb_ratio',
    'pcf_ratio',
    'capitalization',
    'market_cap',
    'circulating_cap',
    'circulating_market_cap',
    'pe_ratio_lyr',
  ],
  colNameMap: {
    day: '时间',
    pe_ratio: '市盈率(%)',
    turnover_ratio: '换手率(%)',
    pb_ratio: '市净率(PB)',
    pcf_ratio: '市现率(PCF, TTM)',
    capitalization: '总股本(万股)',
    market_cap: '总市值(亿元)',
    circulating_cap: '流通股本(万股)',
    circulating_market_cap: '流通市值(亿元)',
    pe_ratio_lyr: '市盈率(PE,LYR)',
  },
  defaultFormatter: 'numberEn',
  colFormatterMap: {
    day: 'identity',
    pe_ratio: 'percentage',
    turnover_ratio: 'percentage',
  },
};

export const wechatRecommendationConfig = {
  cols: [
    'authorUpdateTime',
    'title',
    'related_stocks',
    // 'display_name',
    'score',
    'statements',
  ],
  colNameMap: {
    authorUpdateTime: '文章来源',
    updatetime: '更新时间',
    related_stocks: '股票名称',
    // display_name: '股票名称',
    code: '股票代码',
    score: '深度评分',
    title: '文章标题',
    statements: '推荐详情',
  },
  // Placeholder to be displayed in search fields
  searchNameMap: {
    authorUpdateTime: '文章来源',
    updatetime: null,
    related_stocks: '股票名称',
    // display_name: '股票名称',
    code: null,
    score: '评分不低于',
    title: '文章标题',
    statements: '推荐详情',
  },
  // Key of search fields, wrt search fields in corresponding FilterStore
  searchValueMap: {
    authorUpdateTime: 'author',
    updatetime: null,
    related_stocks: 'displayName',
    // display_name: 'displayName',
    code: null,
    score: 'score',
    title: 'title',
    statements: 'statements',
  },
  defaultFormatter: 'identity',
  colFormatterMap: {
    stock_statement: 'stringList',
  },
  cellTypeMap: {
    authorUpdateTime: 'fixed-rem-long',
    title: 'link',
    related_stocks: 'link-list-long',
    score: 'fixed-rem-short',
    // display_name: 'link',
    statements: 'bullet-list',
  },
  manageSearch: true,
};

export const articleSearchConfig = {
  cols: ['authorUpdateTime', 'title', 'relatedBlocks', 'relatedStocks', 'stockScore', 'statements'],
  colNameMap: {
    authorUpdateTime: '文章来源',
    title: '文章标题',
    relatedBlocks: '相关板块',
    relatedStocks: '相关个股',
    stockScore: '推荐评分',
    statements: '推荐详情',
  },
  searchNameMap: {
    authorUpdateTime: '文章来源',
    title: '文章标题',
    relatedBlocks: '相关板块',
    relatedStocks: '相关个股',
    stockScore: '评分不低于',
    statements: '推荐详情',
  },
  searchValueMap: {
    authorUpdateTime: 'author',
    title: 'title',
    relatedBlocks: 'blockName',
    relatedStocks: 'displayName',
    stockScore: 'score',
    statements: 'statements',
  },
  defaultFormatter: 'identity',
  colFormatterMap: {},
  cellTypeMap: {
    authorUpdateTime: 'fixed-rem-short',
    title: 'link',
    relatedBlocks: 'link-list-long',
    relatedStocks: 'link-list-long',
    stockScore: 'list',
    statements: 'bullet-list',
  },
  manageSearch: true,
};

export const stockRecommendationConfig = {
  ...articleSearchConfig,
  searchNameMap: {
    authorUpdateTime: '文章来源',
    title: '文章标题',
    relatedStocks: '相关个股',
    stockScore: '评分不低于',
    statements: '推荐详情',
  },
  searchValueMap: {
    authorUpdateTime: 'author',
    title: 'title',
    relatedStocks: null,
    stockScore: 'score',
    statements: 'statements',
  },
  statementHighlight: ['statements'],
};

export const statementSearchConfig = {
  cols: ['text', 'title'],
  colNameMap: {
    text: '段落内容',
    title: '标题',
  },
  defaultFormatter: 'identity',
  colFormatterMap: {
    updatetime: 'isoDateTime',
    stock_statement: 'stringList',
  },
};

export const blockRecommendationConfig = {
  cols: [
    'author_updatetime',
    'article_title',
    'related_entity_list',
    'related_topic_list',
    'statements',
  ],
  colNameMap: {
    author_updatetime: '文章来源',
    related_entity_list: '相关个股/板块',
    related_topic_list: '相关主题',
    article_title: '文章标题',
    statements: '段落详情',
  },
  searchNameMap: {
    author_updatetime: null,
    related_entity_list: null,
    related_topic_list: null,
    article_title: null,
    statements: null,
  },
  searchValueMap: {
    author_updatetime: null,
    related_entity_list: null,
    related_topic_list: null,
    article_title: null,
    statements: null,
  },
  defaultFormatter: 'identity',
  colFormatterMap: {},
  cellTypeMap: {
    author_updatetime: 'fixed-rem-long',
    article_title: 'link',
    statements: 'bullet-list',
    related_entity_list: 'link-list-long',
    related_topic_list: 'fixed-rem-long',
  },
  manageSearch: false,
};

export const businessDataConfig = {
  categories: ['hy', 'cp', 'qy'],
  categoryNameMap: {
    hy: '按行业分类',
    cp: '按产品分类',
    qy: '按地区分类',
  },
  cols: ['zygc', 'zysr', 'srbl', 'zycb', 'cbbl', 'zylr', 'lrbl', 'mll'],
  colNameMap: {
    zygc: '主营构成',
    zysr: '主营收入(元)',
    srbl: '收入比例',
    zycb: '主营成本(元)',
    cbbl: '成本比例',
    zylr: '主营利润(元)',
    lrbl: '利润比例',
    mll: '毛利率(%)',
  },
  defaultBDFormatter: 'identity',
  colFormatterMap: {},
};

export const stockCompareConfig = {
  cols: [
    'rank',
    'code',
    'display_name',
    'total_operating_revenue',
    'total_operating_revenue_year_on_year',
    'np_parent_company_owners',
    'gross_profit_margin',
    'roe',
    'circulating_market_cap',
    'pe_ratio',
    'income_report_date',
  ],
  colNameMap: {
    rank: '排名',
    code: '股票代码',
    display_name: '股票名称',
    total_operating_revenue: '营业总收入(元)',
    total_operating_revenue_year_on_year: '营业总收入同比增长(%)',
    np_parent_company_owners: '归属净利润(元)',
    gross_profit_margin: '毛利率(%)',
    roe: '加权净资产收益率(%)',
    circulating_market_cap: '流通市值(亿元)',
    pe_ratio: '市盈率(PE, TTM)',
    income_report_date: '报告期',
  },
  defaultFormatter: 'numberEn',
  colFormatterMap: {
    rank: 'identity',
    code: 'identity',
    display_name: 'identity',
    total_operating_revenue_year_on_year: 'percentage',
    gross_profit_margin: 'percentage',
    roe: 'percentage',
    income_report_date: 'dateQuarter',
  },
};

export const stockInfoConfig = {
  by_report_or_year: {
    keyRow: 'report_date',
    rows: [
      'report_date',
      'total_operating_revenue',
      'np_parent_company_owners',
      'total_operating_revenue_year_on_year',
      'np_parent_company_owners_year_on_year',
      'roe',
      'gross_profit_margin',
      'net_profit_margin',
      'inventories_turnover_day',
      'debt_ratio',
    ],
    rowNameMap: {
      report_date: '每股指标',
      total_operating_revenue: '营业总收入(元)',
      np_parent_company_owners: '归属净利润(元)',
      total_operating_revenue_year_on_year: '营业总收入同比增长(%)',
      np_parent_company_owners_year_on_year: '归属净利润同比增长(%)',
      roe: '加权净资产收益率(%)',
      gross_profit_margin: '毛利率(%)',
      net_profit_margin: '净利率(%)',
      inventories_turnover_day: '存货周转天数(天)',
      debt_ratio: '资产负债率(%)',
    },
    defaultFormatter: 'numberEn',
    rowFormatterMap: {
      report_date: 'identity',
      total_operating_revenue_year_on_year: 'percentage',
      np_parent_company_owners_year_on_year: 'percentage',
      roe: 'percentage',
      gross_profit_margin: 'percentage',
      net_profit_margin: 'percentage',
      // inventory_turnover_day: 'identity',
      debt_ratio: 'percentage',
    },
  },
  by_quarter: {
    keyRow: 'statdate',
    rows: [
      'statdate',
      'total_operating_revenue',
      'np_parent_company_owners',
      'inc_total_revenue_year_on_year',
      'inc_net_profit_to_shareholders',
      'roe',
      'gross_profit_margin',
      'net_profit_margin',
    ],
    rowNameMap: {
      statdate: '每股指标',
      total_operating_revenue: '营业总收入(元)',
      np_parent_company_owners: '归属净利润(元)',
      inc_total_revenue_year_on_year: '营业总收入同比增长(%)',
      inc_net_profit_to_shareholders: '归属净利润同比增长(%)',
      roe: '加权净资产收益率(%)',
      gross_profit_margin: '毛利率(%)',
      net_profit_margin: '净利率(%)',
    },
    defaultFormatter: 'numberEn',
    rowFormatterMap: {
      statdate: 'identity',
      inc_total_revenue_year_on_year: 'percentage',
      inc_net_profit_to_shareholders: 'percentage',
      roe: 'percentage',
      gross_profit_margin: 'percentage',
      net_profit_margin: 'percentage',
    },
  },
};

export const financeRatioConfig = {
  rows: [
    'report_date',
    'current_ratio',
    'quick_ratio',
    'cash_ratio',
    'current_liability_ratio',
    'inventories_turnover_ratio',
    'inventories_turnover_day',
    'receivables_turnover_day',
    'receivables_turnover_ratio',
    'capital_turnover_ratio',
    'asset_turnover_ratio',
    'net_working_capital_ratio',
    'earnings_margin',
    'return_on_investment',
    'roe',
    'gross_profit_margin',
    'net_profit_margin',
    'tax_ratio',
    'advance_peceipts_to_operating_revenue',
    'sale_cash_to_operating_revenue',
    'net_operate_cash_flow_to_operating_revenue',
    'total_operating_revenue_year_on_year',
    'np_parent_company_owners_year_on_year',
    'ebit_to_sale',
    'net_profit_to_ebit',
    'net_profit_to_sale',
    'debt_equities_ratio',
    'interest_coverage_ratio',
    'debt_service_coverage_ratio',
  ],
  keyRow: 'report_date',
  rowNameMap: {
    // code: '股票代码',
    // company_name: '公司名称',
    report_date: '每股指标',
    current_ratio: '流动比率',
    quick_ratio: '速动比率',
    current_liability_ratio: '流动负债率',
    debt_ratio: '资产负债率',
    inventory_turnover_ratio: '存货周转率',
    inventory_turnover_day: '存货周转天数(天)',
    receivables_turnover_day: '应收账款周转天数(天)',
    receivables_turnover_ratio: '应收账款周转率',
    capital_turnover_ratio: null,
    asset_turnover_ratio: null,
    net_working_capital_ratio: null,
    earnings_margin: null,
    return_on_investment: null,
    return_on_equity: null,
    gross_profit_margin: '毛利率',
    net_profit_margin: '净利率',
    tax_ratio: '实际税率(%)',
    sale_cash_to_operating_revenue: '销售现金流/营业收入',
    net_operate_cash_flow_to_operating_revenue: '经营现金流/营业收入',
    net_operate_cash_flow_to_np_parent_company_owners: '净现比',
    total_operating_revenue_year_on_year: '营收同比',
    ebit_to_sale: null,
    net_profit_to_ebit: null,
    net_profit_to_sale: null,
    debt_equities_ratio: null,
    interest_coverage_ratio: null,
    debt_service_coverage_ratio: null,
    good_will_to_total_owner_equities: '商誉占净资产',
  },
};

const rows = [
  {
    data: 'date',
    name: '每股指标',
  },
  {
    data: 'jbmgsy',
    name: '基本每股收益',
  },
  {
    data: 'kfmgsy',
    name: '扣非每股收益',
  },
  {
    data: 'xsmgsy',
    name: '稀释每股收益',
  },
  {
    data: 'mgjzc',
    name: '每股净资产',
  },
  {
    data: 'mggjj',
    name: '每股公积金',
  },
  {
    data: 'mgwfply',
    name: '每股未分配利润',
  },
  {
    data: 'mgjyxjl',
    name: '每股经营现金流',
  },
  {
    data: 'yyzsr',
    name: '营业总收入(元)',
  },
  {
    data: 'mlr',
    name: '毛利润(元)',
  },
  {
    data: 'gsjlr',
    name: '归属净利润(元)',
  },
  {
    data: 'kfjlr',
    name: '扣非净利润(元)',
  },
  {
    data: 'yyzsrtbzz',
    name: '营业总收入同比增长(%)',
  },
  {
    data: 'gsjlrtbzz',
    name: '归属净利润同比增长(%)',
  },
  {
    data: 'kfjlrtbzz',
    name: '扣非净利润同比增长(%)',
  },
  {
    data: 'yyzsrgdhbzz',
    name: '营业总收入滚动环比增长(%)',
  },
  {
    data: 'gsjlrgdhbzz',
    name: '归属净利润滚动环比增长(%)',
  },
  {
    data: 'kfjlrgdhbzz',
    name: '扣非净利润滚动环比增长(%)',
  },
  // { data: '', name: '盈利能力指标' },
  {
    data: 'jqjzcsyl',
    name: '加权净资产收益率(%)',
  },
  {
    data: 'tbjzcsyl',
    name: '摊薄净资产收益率(%)',
  },
  {
    data: 'tbzzcsyl',
    name: '摊薄总资产收益率(%)',
  },
  {
    data: 'mll',
    name: '毛利率(%)',
  },
  {
    data: 'jll',
    name: '净利率(%)',
  },
  {
    data: 'sjsl',
    name: '实际税率(%)',
  },
  // { data: '', name: '盈利质量指标' },
  {
    data: 'yskyysr',
    name: '预收款/营业收入',
  },
  {
    data: 'xsxjlyysr',
    name: '销售现金流/营业收入',
  },
  {
    data: 'jyxjlyysr',
    name: '经营现金流/营业收入',
  },
  // { data: '', name: '运营能力指标' },
  {
    data: 'zzczzy',
    name: '总资产周转率(次)',
  },
  {
    data: 'yszkzzts',
    name: '应收账款周转天数(天)',
  },
  {
    data: 'chzzts',
    name: '存货周转天数(天)',
  },
  // { data: '', name: '财务风险指标' },
  {
    data: 'zcfzl',
    name: '资产负债率(%)',
  },
  {
    data: 'ldzczfz',
    name: '流动资产/总负债(%)',
  },
  {
    data: 'ldbl',
    name: '流动比率',
  },
  {
    data: 'sdbl',
    name: '速动比率',
  },
];

export { rows };
