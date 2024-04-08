<template>
    <div class='newsRemedy'>
        <!-- <h5>新建保健品</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="医药保健商品管理" content="新建保健品" hidden-breadcrumb />
        </div>
        <div class="news_body">
            <div class="body_top">
                <Row>
                    <Col span="3">
                    <strong style="margin-right: 15px;">查询方式:</strong>
                    <RadioGroup v-model="searchCode.type">
                        <Radio label="barcode">
                            <span>69码</span>
                        </Radio>
                        <Radio label="search">
                            <span>关键字</span>
                        </Radio>
                    </RadioGroup>
                    </Col>
                    <Col span="18" style="margin-bottom: 20px;">
                    <template v-if="searchCode.type == 'search'">
                        <TreeSelect v-model="searchCode.classifyId" placeholder="请选择次级分类" clearable :data="classList"
                            v-width="150" />
                        <Input v-model="searchCode.searchKey" placeholder="请输入保健品名称关键字" clearable
                            style="width: 40%;"></Input>
                        <Select v-model="searchCode.searchType" clearable v-width="100">
                            <Option value="1">保健品名称</Option>
                            <Option value="2">药企名称</Option>
                            <Option value="3">药准字号</Option>
                            <Option value="4">保健品id</Option>
                        </Select>
                    </template>
                    <Input v-else v-model="searchCode.codeId" placeholder="请输入完整条形编码" style="width: 40%;"></Input>
                    <Button type="primary" @click="getCodeList" style="margin: 0 20px;">查询</Button>
                    <Button type="primary">+自定义增加</Button>
                    </Col>
                </Row>
                <Row v-if="drugSearchList.length !== 0">
                    <Col span="2">
                    </Col>
                    <Col span="19">
                    <div style="border: 1px solid #d7d7d7;display: inline-block; ">
                        <RadioGroup v-model="phone" style="display: flex;margin: 10px;" @on-change="changeDrugRadio">
                            <template v-for="(item, index) in drugSearchList" :key="index">
                                <Radio :label="index" style="display: flex;align-items: center; margin: 0 10px;">
                                    <img src="" alt="" width="50">
                                    <div>
                                        <strong>{{ item.drugName }}</strong>
                                        <p>{{ item.manu }}</p>
                                        <p>{{ item.gg }}</p>
                                    </div>
                                </Radio>
                            </template>
                        </RadioGroup>
                    </div>
                    </Col>
                </Row>
            </div>
            <div class="body_main">
                <Row style="margin: 20px 0 10px;">
                    <Col span="2"><strong>条形编码</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.barcode" placeholder="请输入条形编码"></Input>
                    </Col>
                    <Col span="2">
                    <Icon type="md-medical" size="11" color="#ff0000" style="transform: scale(.5);" />
                    <strong>保健品名称</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.name" placeholder="请输入保健品名称"></Input>
                    </Col>
                </Row>
                <!-- <Row style="margin: 20px 0;">
                    <Col span="2" style="text-align: right;"><strong>通用名称</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input placeholder="请输入名称 --- "></Input>
                    </Col>
                    <Col span="2" style="text-align: right;"><strong>商品名称</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.name" disabled placeholder="请输入商品名称"></Input>
                    </Col>
                </Row> -->
                <!-- <Row style="margin: 20px 0;">
                    <Col span="2">
                    <strong>保健品id</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input placeholder="请输入保健品id --- "></Input>
                    </Col>
                    <Col span="2">
                    <strong>汉语拼音</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.namePy" placeholder="请输入汉语拼音"></Input>
                    </Col>
                </Row> -->
                <Row style="margin: 20px 0;">
                    <Col span="2">
                    <Icon type="md-medical" size="11" color="#ff0000" style="transform: scale(.5);" />
                    <strong>品牌</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Select v-model="list.brandId" filterable :remote-method="remoteMethodBrand" :loading="loadingBrand">
                        <Option :value="item.id" v-for="item in  brandDataList" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    </Col>
                    <Col span="2" style="text-align: right;"><strong>规格</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.spec" placeholder="请输入规格"></Input>
                    </Col>
                </Row>
                <Row style="margin: 20px 0;">
                    <Col span="2">
                    <Icon type="md-medical" size="11" color="#ff0000" style="transform: scale(.5);" />
                    <strong>分类</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <TreeSelect v-model="list.categoryId" :data="classifyList" />
                    </Col>
                    <Col span="2" style="text-align: right;"><strong>性状</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.character" placeholder="请输入"></Input>
                    </Col>
                </Row>
                <Row style="margin: 20px 0;">
                    <Col span="2">
                    <strong>批准文号</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.approval" placeholder="请输入批准文号"></Input>
                    </Col>
                    <Col span="2" style="text-align: right;"><strong>主治疾病</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.purpose" placeholder="请输入主治疾病"></Input>
                    </Col>
                </Row>
                <Row style="margin: 20px 0;">
                    <Col span="2" style="text-align: right;"><strong>有效期</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <DatePicker v-model="list.validity" type="date" placeholder="请选择有效期" v-width="'100%'" />
                    </Col>
                    <Col span="2" style="text-align: right;"><strong>贮藏</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.storage" placeholder="请输入"></Input>
                    </Col>
                </Row>
                <Row style="margin: 20px 0;">
                    <Col span="2">
                    <strong>禁忌</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.taboo" placeholder="请输入"></Input>
                    </Col>
                    <Col span="2">
                    <strong>用法用量</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.dosage" placeholder="请输入用法用量"></Input>
                    </Col>
                </Row>

                <!-- 保健品 -->
                <!-- <template v-if="true">
                    <Row style="margin: 20px 0;">
                        <Col span="2">
                        <strong>生产企业</strong></Col>
                        <Col span="9" style="display: flex;align-items: center;">
                        <Input v-model="list.manuCorp" placeholder="请输入生产企业"></Input>
                        </Col>
                        <Col span="2">
                        <strong>药理毒理</strong></Col>
                        <Col span="9" style="display: flex;align-items: center;">
                        <Input placeholder="请输入药理毒理 -- "></Input>
                        </Col>
                    </Row>
                    <Row style="margin: 20px 0;">
                        <Col span="2" style="text-align: right;"><strong>药物相互作用</strong></Col>
                        <Col span="9" style="display: flex;align-items: center;">
                        <Input v-model="list.interactions" placeholder="请输入"></Input>
                        </Col>
                        <Col span="2" style="text-align: right;"><strong>不良反应</strong></Col>
                        <Col span="9" style="display: flex;align-items: center;">
                        <Input v-model="list.adr" placeholder="请输入不良反应"></Input>
                        </Col>
                    </Row>
                    <Row style="margin: 20px 0;">
                        <Col span="2">
                        <strong>适应症状</strong></Col>
                        <Col span="9" style="display: flex;align-items: center;">
                        <Input v-model="list.adaptDisease" placeholder="请输入适应症状"></Input>
                        </Col>
                        <Col span="2" style="text-align: right;"><strong>药代动力学</strong></Col>
                        <Col span="9" style="display: flex;align-items: center;">
                        <Input v-model="list.dmpk" placeholder="请输入"></Input>
                        </Col>
                    </Row>
                </template> -->

                <!-- 通用 -->
                <!-- <Row style="margin: 20px 0;">
                    <Col span="2" style="text-align: right;"><strong>保质期</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input placeholder="请输入保质期 --- "></Input>
                    </Col>
                    <Col span="2">
                    <strong>适宜人群</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.commendedUser" placeholder="请输入适宜人群 --- "></Input>
                    </Col>
                </Row> -->
                <!-- <Row style="margin: 20px 0;">
                    <Col span="2">
                    <strong>剂型</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.form" placeholder="请输入 --- "></Input>
                    </Col>
                    <Col span="2">
                    <strong>执行标准</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.manuExeStandard" placeholder="请输入执行标准 --- "></Input>
                    </Col>
                </Row> -->
                <Row style="margin: 20px 0;">
                    <Col span="2" style="text-align: right;"><strong>注意事项</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.consideration" placeholder="请输入注意事项"></Input>
                    </Col>
                    <Col span="2">
                    <strong>主要成分</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.basis" placeholder="请输入主要成分"></Input>
                    </Col>
                </Row>

                <!-- 保健品 -->
                <!-- <Row style="margin: 20px 0;">
                    <Col span="2" style="text-align: right;"><strong>备案号</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.bah" placeholder="请输入备案号 --- "></Input>
                    </Col>
                    <Col span="2">
                    <strong>食品生产许可证</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.manuCertNum" placeholder="请输入生产许可 --- "></Input>
                    </Col>
                </Row> -->
                <!-- <Row style="margin: 20px 0;">
                    <Col span="2" style="text-align: right;"><strong>包装</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.packingInfo" placeholder="请输入包装信息 --- "></Input>
                    </Col>
                    <Col span="2">
                    <strong>产地</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.cd" placeholder="请输入产地 --- "></Input>
                    </Col>
                </Row> -->

                <!-- <Row style="margin: 20px 0;">
                    <Col span="2" style="text-align: right;"><strong>原料</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.yl" placeholder="请输入原料 --- "></Input>
                    </Col>
                    <Col span="2">
                    <strong>辅料</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.fl" placeholder="请输入辅料 --- "></Input>
                    </Col>
                </Row> -->

                <!-- 通用 -->
                <Row style="margin: 20px 0;">
                    <Col span="2" style="text-align: right;">
                    <Icon type="md-medical" size="11" color="#ff0000" style="transform: scale(.5);" /> <strong>供应商</strong>
                    </Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Select v-model="list.merchantId" filterable :remote-method="remoteMethodMerchant"
                        :loading="loadingMerchant">
                        <Option :value="item.id" v-for="item in merchantList" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    </Col>
                    <Col span="2" style="text-align: right;">
                    <Icon type="md-medical" size="11" color="#ff0000" style="transform: scale(.5);" />
                    <strong>市场价</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.marketPrice" placeholder="请输入价格"></Input>
                    </Col>
                </Row>
                <Row style="margin: 20px 0;">
                    <Col span="2" style="text-align: right;">
                    <Icon type="md-medical" size="11" color="#ff0000" style="transform: scale(.5);" />
                    <strong>初始销量</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.initSales" placeholder="请输入销量"></Input>
                    </Col>
                    <Col span="2" style="text-align: right;">
                    <Icon type="md-medical" size="11" color="#ff0000" style="transform: scale(.5);" />
                    <strong>成本价</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.costPrice" placeholder="请输入价格"></Input>
                    </Col>
                </Row>
                <Row style="margin: 20px 0;">
                    <!-- <Col span="2">
                    <strong>海外购</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.hwg" placeholder="请输入 --- "></Input>
                    </Col> -->
                    <Col span="2" style="text-align: right;"><strong>是否进口</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <RadioGroup v-model="list.imported">
                        <Radio label="true">
                            <span>是</span>
                        </Radio>
                        <Radio label="false">
                            <span>否</span>
                        </Radio>
                    </RadioGroup>
                    </Col>
                </Row>
                <!-- 分账规则 -->
                <div class="rule_box">
                    <Row style="margin: 20px 0;">
                        <Col span="2">
                        <strong>分账规则</strong></Col>
                    </Row>
                    <Row style="margin: 20px 0;">
                        <Col span="3">
                        <strong>分账时效：</strong></Col>
                        <Col span="20">
                        <strong class="rule_obj"> T + </strong>
                        <Input v-width="60" size="small" type="number"></Input>
                        <strong>个工作日</strong>
                        <i style="padding: 0 15px; transform: scale(.8);">（备注：选填，不填则默认全局规则）</i>
                        </Col>
                    </Row>
                    <Row style="margin: 20px 0;">
                        <Col span="3">
                        <strong>分账对象：</strong></Col>
                        <Col span="20">
                        <strong class="rule_obj"> 供应商 </strong>
                        <Input v-width="120" size="small" type="number"></Input>
                        <strong>%</strong>
                        <i style="padding: 0 15px; transform: scale(.8);">（备注：选填，不填则默认全局规则）</i>
                        </Col>
                    </Row>
                    <Row style="margin: 20px 0;">
                        <Col span="3">
                        </Col>
                        <Col span="20">
                        <strong class="rule_obj"> 基金会 </strong>
                        <Input v-width="120" size="small" type="number"></Input>
                        <strong>%</strong>
                        <i style="padding: 0 15px; transform: scale(.8);">（备注：选填，不填则默认全局规则）</i>
                        </Col>
                    </Row>
                    <Row style="margin: 20px 0;">
                        <Col span="3">
                        </Col>
                        <Col span="20">
                        <strong class="rule_obj"> 平台 </strong>
                        <Input v-width="120" size="small" type="number"></Input>
                        <strong>%</strong>
                        <i style="padding: 0 15px; transform: scale(.8);">（备注：选填，不填则默认全局规则）</i>
                        </Col>
                    </Row>
                </div>
                <!-- 规格 -->
                <Row style="margin: 30px 0; border: #d7d7d7 1px solid;">
                    <Col span="2">
                    <strong>规格</strong></Col>
                    <Col span="20">
                    <Row style=" padding: 10px 0; ">
                        <Col span="6">
                        <Select clearable v-model="specList.propertyId" placeholder="规格属性" @on-change="changeSel">
                            <Option v-for="(item, index) in propertyList" :key="index" :value="index">
                                {{ item.name }}
                            </Option>
                        </Select>
                        </Col>
                        <Col span="6">
                        <Button style="margin: 0 10px;" @click="newsSize">新增规格</Button>
                        <Button size="small" @click="attrFlag = true;">补充规格</Button>
                        <i style="color: #f00; font-size: 12px;">（请先选择分类）</i>
                        </Col>
                    </Row>
                    <!-- 尺寸块 -->
                    <Row>
                        <Col span="5" class="size_col5" v-for="(item, index) in haveSizeList" :key="index"
                            :value="item.property.id">
                        <Icon type="md-close" @click="delSizeOne(item, index)" color="#f00" />
                        <div class="col-top">
                            <Button style="width: 45%;">{{ item.property.name }}</Button>
                            <!-- <div class="top-up">上传图片
                                <Switch v-model="pic" @on-change="change" />
                            </div> -->
                        </div>
                        <div class="col-modul">
                            <div class="modul-color" v-for="itm in item.value" :key="itm.id">
                                <Icon type="md-close" @click="delSizeFn(itm)" color="#f00" />
                                <p style="padding: 10px 20px; border: 1px solid #c7c9cd;border-radius: 9px;">
                                    {{ itm.value }}
                                </p>
                                <!-- <div class="modul-img" title="上传图片">
                                    <Upload ref="upload" action="" :before-upload="handleBeforeLicenseUrlUploadStock">
                                        <Button icon="ios-cloud-upload-outline">上传图片</Button>
                                    </Upload>
                                    <div v-viewer>
                                        <img :src="stockList.img" alt="" :data-source="stockList.img" style="width:120px" />
                                    </div>
                                </div> -->
                            </div>
                        </div>
                        <div class="col-footer">
                            <Input placeholder="输入属性值名称" v-model="attrName[index]" style="width: 57%;" :key="index"></Input>
                            <Button icon="md-add" type="primary" @click="addNewSize(index)"
                                style="width: 38%;">新增属性值</Button>
                        </div>
                        </Col>
                    </Row>
                    </Col>
                </Row>
                <!-- 库存 -->
                <Row style="margin: 30px 0; border: #d7d7d7 1px solid;">
                    <Col span="2">
                    <strong>库存</strong></Col>
                    <Col span="20">
                    <div class="add-store" style="margin: 10px 0;">
                        <Select v-for="(item, index) in haveSizeList" :key="index" :placeholder="item.property.name"
                            style="width: 80px; margin-right: 15px;" v-model="stockList[index]">
                            <Option v-for="itm in item.value" :key="itm.id" :value="itm.id">{{ itm.value }}</Option>
                        </Select>
                        <!-- <Select placeholder="尺寸" style="width: 80px; margin-right: 15px;">
                            <Option value="10001">sx</Option>
                            <Option value="10002">m</Option>
                            <Option value="10003">l</Option>
                        </Select> -->
                        <Input v-model="stocks" placeholder="库存" style="width: 80px; margin-right: 15px;"></Input>
                        <Button type="primary" @click="addNewStocks">增加</Button>
                    </div>
                    <Table :loading="loading" :columns="columns" :data="skuList" border class="top20" size="small">
                        <template #stocks="{ index }">
                            <!-- <Input v-model="skuList[index].stocks" type="number" style="width: 100px" size="small" /> -->
                            <div>{{ skuList[index].stocks }}</div>
                        </template>
                        <!-- <template #rank="{ row, index }">
                            <div v-if="!row.rankType">
                                {{ row.rank }}
                                <Button size="small" style="margin-left:5px" type="info"
                                    @click="skuList[index].rankType = true">编辑</Button>
                            </div>
                            <div v-else>
                                <Input v-model="skuList[index].rank" type="number" style="width: 100px" size="small" />
                                <Button size="small" class="margin-left:5px" type="success"
                                    @click="contentRankClick(index)">保存</Button>
                            </div>
                        </template> -->
                        <template #action="{ row }">
                            <!-- <Button type="primary" size="small" style="margin-right: 5px" @click="confirm(row)">保存</Button> -->
                            <Poptip confirm transfer title="您确认删除吗?" @on-ok="delStockFn(row)">
                                <Button type="error" size="small">删除</Button>
                            </Poptip>
                        </template>
                    </Table>
                    </Col>
                </Row>
                <!-- 图片 -->
                <Row style="margin: 30px 0; border: #d7d7d7 1px solid;">
                    <Col span="2">
                    <strong>主图</strong></Col>
                    <Col span="20">
                    <div class="uploadImg" v-for="(item, index) in list.pic" :key="index">
                        <div v-viewer class="imgs">
                            <img :src="item.media" alt="" :data-source="item.img" style="width: 100%;" />
                        </div>
                        <Icon type="md-close" class="uploadImg_icon" size="25" @click="mediaDelFn(item, index)"
                            v-show="item" />
                    </div>
                    <div>
                        <Upload :multiple="true" action="abc" ref="upload" :before-upload="handleBeforeLicenseUrlUpload">
                            <Button icon="md-cloud-upload">上传文件</Button>
                            最少1张、最多10张
                        </Upload>
                    </div>
                    </Col>
                </Row>
                <!-- 视频 -->
                <Row style=" border: #d7d7d7 1px solid;">
                    <Col span="2">
                    <strong>视频</strong></Col>
                    <Col span="20" style="padding-top: 10px;">
                    <div class="uploadImg" v-for="(item, index) in list.video" :key="index">
                        <div v-viewer class="imgs">
                            <video :src="item.media" alt="" :data-source="item.media" style="width: 100%;"></video>
                        </div>
                        <Icon type="md-close" class="uploadImg_icon" size="25" @click="mediaDelFn(item, index, 'video')"
                            v-show="item" />
                    </div>
                    <Upload ref="upload" action="" :before-upload="videoHandleBeforeLicenseUrlUpload" style="width: 500px;">
                        <Button icon="ios-cloud-upload-outline">上传</Button>
                    </Upload>
                    </Col>
                </Row>
                <!-- 详情 -->
                <Row style="margin: 20px 0; border: #d7d7d7 1px solid;">
                    <Col span="2">
                    <strong>详情</strong></Col>
                    <Col span="20">
                    <div style="width: 100%; height: 382px; overflow: hidden;">
                        <!-- <richText :details="list.details"></richText> -->
                        <div style="border: 1px solid #ccc; height: 382px;">
                            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig"
                                mode="default" />
                            <Editor style="height: 300px; overflow-y: hidden" v-model="list.details"
                                :defaultConfig="editorConfig" mode="default" @onCreated="onCreated" />
                        </div>
                    </div>
                    </Col>
                </Row>
                <div style="margin: 20px 0; text-align: center;">
                    <Space>
                        <Button type="primary" @click="submitFn">确认</Button>
                        <Button @click="this.$router.back()">取消</Button>
                    </Space>
                </div>
            </div>
        </div>
        <!-- 增加的弹框 -->
        <Modal class-name="vertical-center-modal" v-model="attrFlag" title="补充属性" @on-ok="confirm">
            <Form ref="addAttr" :model="addAttr" :label-width="80">
                <FormItem label="属性名称">
                    <Input v-model="addAttr.attrName" placeholder="请输入" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="商品分类">
                    <TreeSelect v-model="addAttr.categoryId" multiple :data="classifyList" v-width="300" transfer />
                </FormItem>
                <FormItem label="排序">
                    <Input v-model="addAttr.rank" placeholder="请输入" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="图片">
                    <p>建议尺寸120*120</p>
                    <Upload ref="upload" action="" :before-upload="handleBeforeLicenseUrlUploadAttr">
                        <Button icon="ios-cloud-upload-outline">上传</Button>
                    </Upload>
                    <div>
                        <img :src="addAttr.pic" alt="" :data-source="addAttr.pic" style="width:120px" />
                    </div>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import {
    getGoodsCategoryTreeApi, // 商品分类
    getBrandPageApi,  // 品牌
    getMerchantBasePageApi,  // 供应商
    postGoodsInfoSaveApi,  // 保存
    getGoodsInfoDetailApi,  // 商品详情
    goodsInfoFileDel,   // 图片删除
    getOttDrugBarcodeApi,  // 条码获取
    getOttDrugClassifyApi,  // 保健品分类

    getGoodsPropertyValueListApi, // 规格列表
    postGoodsPropertyValueSaveApi,  // 规格值保存
    postGoodsPropertyValueRemoveApi,   // 规格删除
    postGoodsPropertySaveApi,  // 规格保存
    getGoodsPropertyPageApi, // 属性列表
    postGoodsSkuSaveApi,  //  规格保存--->  库存
    getGoodsSkuListApi, // 库存列表
    postGoodsSkuRemoveApi,  // 库存删除

    postGoodsMediaBatchSaveApi,   // 媒体保存
    getGoodsMediaListApi,   // 媒体列表
    postGoodsMediaRemoveApi,   // 媒体删除
} from '@/api/account'
import { jsonToArray, jsonToArray2 } from "@/libs/util.js";
export default {
    name: 'newsRemedy',
    components: { Editor, Toolbar },
    data() {
        return {
            phone: 'apple',
            toolbarConfig: {},
            editorConfig: {
                MENU_CONF: {
                    uploadImage: {
                        base64LimitSize: 5000000 * 1024, // 5kb
                    },
                },
            },  // 编辑器
            editor: null,
            list: {
                pic: [],
                video: [],  // 视频
                details: ''
            }, // 主图
            video: [],  // 视频
            pic: [], // 主图
            healthId: '',  // 跳转类型
            uploadImgKey: 0,  // 个数
            classifyList: [],  // 分类树
            brandDataList: [],  // 品牌列表
            merchantList: [],  // 供应商
            searchCode: {
                type: 'barcode'
            },  // 条码信息
            classList: [],  // 分类
            drugSearchList: [],  // 远程获取的商品

            /* 规格属性 */
            // goodsId: '',  // 商品id   替代  drugId 
            tabsId: '',
            specList: {},   // 新增规格
            propertyList: [], // 所有规格列表
            sizeIndex: '', // 添加的列表索引
            haveSizeList: [],  // 单个规格列表

            stockList: [], // 添加库存
            skuList: [], // 库存列表
            stocks: 0, // 库存量
            attrName: [], // 属性名
            // pic: [], // 新增属性值的图片
            img: null,
            columns: [
                {
                    title: '库存',
                    minWidth: 200,
                    slot: 'stocks',
                },
                {
                    title: '编码',
                    // width: 110,
                    key: 'code'
                },
                // {
                //     title: '排序值',
                //     width: 200,
                //     align: 'center',
                //     fixed: 'right',
                //     slot: 'rank'
                // },
                {
                    title: '操作',
                    width: 150,
                    fixed: 'right',
                    slot: 'action'
                },
            ],  // 库存标题
            columns1: [
                {
                    title: '库存',
                    minWidth: 200,
                    slot: 'stocks',
                },
                {
                    title: '编码',
                    width: 110,
                    key: 'code'
                },
                // {
                //     title: '排序值',
                //     width: 200,
                //     align: 'center',
                //     fixed: 'right',
                //     slot: 'rank'
                // },
                {
                    title: '操作',
                    width: 150,
                    fixed: 'right',
                    align: 'center',
                    slot: 'action'
                }
            ],
            listArrt: {
                id: ""
            }, // 属性提交的列表
            loading: false,
            timer: null,

            // 新增规格
            apic: null,
            addAttr: {
                attrName: '',
                categoryInfo: '',
                categoryId: '',
                rank: '',
                pic: ''
            },
            attrFlag: false, // 弹窗的状态
            brandTime: null,  // 品牌模糊查询
            loadingBrand: false,  // 品牌……
            merchantTime: null,  // 商家模糊查询
            loadingMerchant: false,  // 商家
        }
    },
    async created() {
        this.getClassify() // 商品分类
        this.getClassList()  // 系统分类
        this.healthId = this.$route.query.id
        if (this.healthId) {
            await getBrandPageApi({ biz: 'medical', pageSize: 6666 }).then(res => {
                this.brandDataList = []
                this.brandDataList.push(...res.data)
                // console.log(res.data);
            }).catch(err => {
                console.log(err);
            })
            await getMerchantBasePageApi({ biz: 'medical', type: 'supplier' }).then(res => {
                let data = res.data
                this.merchantList = data
            }).catch(err => {
                console.log(err);
            })
            await getGoodsInfoDetailApi(this.healthId).then(res => {
                let arr = res
                let url = [];
                if (arr.file) {
                    let key = Object.keys(arr.file);
                    let values = Object.values(arr.file);
                    for (let i = 0; i < key.length; i++) {
                        // console.log(key[i], values[i]);
                        url.push({ id: key[i], img: values[i] });
                    }
                }
                this.listArrt = {
                    id: res.id
                };

                this.list = {
                    id: this.healthId,
                    barcode: res.barcode ? res.barcode : '',  // 条编码
                    name: res.name ? res.name : '',  // 保健品名
                    namePy: res.namePy ? res.namePy : '',  // 拼音
                    spec: res.spec ? res.spec : '',  // 规格
                    brandId: res.brand ? res.brand.id : '',  // 品牌
                    categoryId: res.category ? res.category.id : '',  // 分类
                    manuExeStandard: res.manuExeStandard ? res.manuExeStandard : '',  // 执行标准 --- 
                    storage: res.storage ? res.storage : '',  // 贮藏
                    validity: res.validity ? res.validity : '',  // 有效期
                    approval: res.approval ? res.approval : '',  // 批准文号
                    form: res.form ? res.form : '',  // 剂型 --- 
                    character: res.character ? res.character : '',  // 性状
                    taboo: res.taboo ? res.taboo : '',  // 禁忌
                    purpose: res.purpose ? res.purpose : '',  // 主治疾病 --- 
                    commendedUser: res.commendedUser ? res.commendedUser : '',  // 适宜人群 --- 
                    dosage: res.dosage ? res.dosage : '',  // 用法用量
                    consideration: res.consideration ? res.consideration : '',  // 注意事项
                    basis: res.basis ? res.basis : '',  // 主要成分
                    manuCertNum: res.manuCertNum ? res.manuCertNum : '',  // 生产许可 --- 
                    packingInfo: res.packingInfo ? res.packingInfo : '',  // 包装信息 --- 
                    imported: res.imported ? res.imported.toString() : 'false',  // 是否进口商品
                    merchantId: res.merchant ? res.merchant.id : '',  // 供应商
                    marketPrice: res.marketPrice ? res.marketPrice : '',  // 市场价
                    initSales: res.initSales ? res.initSales : '',  // 初始销量
                    costPrice: res.costPrice ? res.costPrice : '',  // 成本价格
                    medicalType: res.medicalType ? res.medicalType.code : '',  // 医药类型
                    // pic: url,  // 图片
                    // video: res.videoSource ? res.videoSource : '',  // 视频
                    details: res.details ? res.details : '',  // 详情
                }

                this.getGoodsPropertyValueList();    // 获取规格列表
                this.getgoodsSkuList();   // 库存
                this.getCid(this.list.categoryId);  // 属性

                this.mediaListFn('mainpic');
                this.mediaListFn('mainvideo');
            })
        };
    },
    watch: {
        'searchCode.type'(newVal, oldVal) {
            this.searchCode = {
                type: newVal
            }
        },
    },
    methods: {
        // 商品分类
        getClassify() {
            getGoodsCategoryTreeApi({ biz: 'medical' }).then(res => {
                this.classifyList = jsonToArray(res, false)
            }).catch(err => {
                console.log(err);
            })
        },
        // 获取品牌列表 模糊查询
        remoteMethodBrand(query) {
            if (query !== '') {
                this.loadingBrand = true;
                if (this.brandTime) {
                    clearTimeout(this.brandTime);
                };
                this.brandTime = setTimeout(() => {
                    this.loadingBrand = false;
                    getBrandPageApi({
                        biz: 'medical',
                        keywords: query
                    }).then(res => {
                        this.brandDataList = []
                        this.brandDataList.push(...res.data)
                        // console.log(res.data);
                    }).catch(err => {
                        console.log(err);
                    })
                }, 300);
            } else {
                this.brandDataList = [];
            }
        },
        // 获取商家列表
        remoteMethodMerchant(query) {
            if (query !== '') {
                this.loadingMerchant = true;
                if (this.merchantTime) {
                    clearTimeout(this.merchantTime);
                };
                this.merchantTime = setTimeout(() => {
                    this.loadingMerchant = false;
                    getMerchantBasePageApi({
                        biz: 'medical', type: 'supplier',
                        keywords: query
                    }).then(res => {
                        this.merchantList = []
                        this.merchantList = res.data
                        // console.log(res.data);
                    }).catch(err => {
                        console.log(err);
                    })
                }, 300);
            } else {
                this.merchantList = [];
            }
        },
        // 获取系统保健品分类
        getClassList() {
            getOttDrugClassifyApi().then(res => {
                let obj = JSON.parse(JSON.stringify(res))
                let arr = []
                for (const key in obj) {
                    if (Object.hasOwnProperty.call(obj, key)) {
                        const item = obj[key];
                        arr.push({
                            value: new Date().getTime() + Math.random(),
                            title: key,
                            children: jsonToArray2(item, 'classify', 'classifyId')
                        })
                    }
                }
                this.classList = arr
            })
        },
        // 提交
        submitFn() {
            let formData = new FormData()
            this.list.biz = 'medical'
            this.list.medicalType = 'health'

            if (this.list.validity) {
                let endDate = new Date(this.list.validity)
                let yy = endDate.getFullYear();
                let mm = endDate.getMonth() + 1;
                mm = mm < 10 ? ('0' + mm) : mm;
                let dd = endDate.getDate();
                dd = dd < 10 ? ('0' + dd) : dd;
                this.list.validity = yy + '-' + mm + '-' + dd
            }

            for (const key in this.list) {
                if (Object.hasOwnProperty.call(this.list, key)) {
                    const element = this.list[key];
                    if (element instanceof Array) {
                        element.forEach(item => {
                            formData.append(key, item)
                        })
                    } else if (key !== 'pic' && key !== 'video') {
                        formData.append(key, element)
                    }
                }
            }
            // if (this.video !== null) {
            //     formData.append("video", this.video);
            // }
            // if (this.pic && this.pic.length > 0) {
            //     this.pic.forEach((v) => {
            //         formData.append("pic", v);
            //     });
            // }
            postGoodsInfoSaveApi(formData, false).then(res => {
                if (res.id) {
                    this.healthId = res.id
                    this.$Message.success('成功')
                    this.$router.back()
                }

                if (this.pic && this.pic.length > 0) {
                    this.mediaSaveFn('mainpic');
                };
                if (this.video && this.video.length > 0) {
                    this.mediaSaveFn('mainvideo');
                };
            }).catch(err => {
                console.log(err);
            })
        },
        // 条码获取  、 关键字获取
        getCodeList() {
            let data = {}
            if (!!this.searchCode.codeId) {
                data.code = this.searchCode.codeId
            }
            if (!!this.searchCode.searchKey) {
                data = { ...this.searchCode }
            }
            getOttDrugBarcodeApi(data, this.searchCode.type).then(res => {
                // this.assistInput = false;  // 状态是否禁用
                if (res.msg && res.ret_code != '0') {
                    this.$Message.error(res.msg)
                    this.drugSearchList = []
                    this.list = {}
                } else {
                    this.$Message.success('查询成功！')
                }
                if (this.searchCode.type == 'search') {
                    if (res.ret_code == 0) {
                        if (res.drugList.length <= 3) {
                            this.drugSearchList = res.drugList
                        } else {
                            this.drugSearchList = res.drugList.slice(0, 3)
                        }
                    }
                }
                if (this.searchCode.type == 'barcode') {
                    this.list = {
                        barcode: res.code ? res.code : '', // 条形编码  。。-- 
                        name: res.name, // 名字  。。 -- 
                        namePy: res.namePy ? res.namePy : '', // 拼音
                        columnId: res.column ? res.column.id : '',  // 馆
                        categoryId: res.category ? res.category.id : '',  // 分类
                        brandId: res.brand ? res.brand.id : '', // 品牌
                        merchantId: res.merchant ? res.merchant.id : '',  // 商家
                        dmpk: res.dmpk ? res.dmpk : '',  // 药代动力学
                        drugType: res.drugType ? res.drugType.code : '',  // 保健品类型
                        nrdl: res.nrdl ? res.nrdl.toString() : "false",  // 是否是国家医保目录
                        interactions: res.other ? res.other : '',  // 药物相互作用  。。-- 
                        adr: res.adr ? res.adr : '',  // 不良反应
                        adaptDisease: res.adaptDisease ? res.adaptDisease : '',  // 适应症状
                        // 药理毒理
                        packingInfo: res.packingInfo ? res.packingInfo : '',  // 包装信息
                        manuExeStandard: res.manuExeStandard ? res.manuExeStandard : '',  // 执行标准
                        storage: res.storage ? res.storage : '',  // 贮藏信息  -- 
                        approval: res.approval ? res.approval : '',  // 批准文号  。。 -- 
                        spec: res.spec ? res.spec : '',  // 规格信息  。。  -- 
                        manuCorp: res.manuName ? res.manuName : '',  // 生产企业 。。 -- 
                        manuAddress: res.manuAddress ? res.manuAddress : '',  // 产地  -- 
                        basis: res.basis ? res.basis : '',  // 主要成分
                        form: res.form ? res.form : '',  // 剂型
                        character: res.character ? res.character : '',  // 性状  -- 
                        taboo: res.taboo ? res.taboo : '',   // 禁忌  。。  -- 
                        purpose: res.purpose ? res.purpose : '',  // 主治疾病 。。  -- 
                        dosage: res.dosage ? res.dosage : '',   // 用法用量  。。  -- 
                        commendedUser: res.note ? res.note : '',  // 适宜人群  。。  -- 
                        costPrice: res.costPrice ? res.costPrice : '',   // 成本价
                        consideration: res.consideration ? res.consideration : '',  // 注意事项  -- 
                        marketPrice: res.marketPrice ? res.marketPrice : '',  // 市场价
                        details: res.details ? res.details : '',  // 详情
                        medicalType: res.medicalType ? res.medicalType.code : '',  // 大 类别
                        // memberPrice: res.memberPrice ? res.memberPrice : '',  // 销售价
                        validity: res.validity ? res.validity : '',  // 有效期  暂无用 -- 
                        manuDate: res.manuDate ? res.manuDate : '',  // 生产日期
                        validity: res.validity ? res.validity : '',  // 过期日期
                        // coinGain4Pur: res.coinGain4Pur ? res.coinGain4Pur : '',  // 采购员积分
                        // coinGain4Clerk: res.coinGain4Clerk ? res.coinGain4Clerk : '',  // 店员积分
                        // fz4Sales: res.fz4Sales ? res.fz4Sales : '',  // 业务员分润
                        // fz4Agency: res.fz4Agency ? res.fz4Agency : '',  // 区域分代商分润
                        // fz4Operator: res.fz4Operator ? res.fz4Operator : '',  // 鸿升医药分账
                        // fz4Platform: res.fz4Platform ? res.fz4Platform : '',  // 平台剩余分账
                        pic: [],
                        video: '',  // 视频
                        details: ''
                    }
                }
            })
        },
        // 选择商品
        changeDrugRadio(i) {
            let res = this.drugSearchList[i]
            // console.log("🚀 ~ file: index.vue:1034 ~ changeDrugRadio ~ res:", res)
            this.list = {
                barcode: res.code ? res.code : '', // 条形编码
                name: res.drugName, // 名字  。。.
                namePy: res.namePy ? res.namePy : '', // 拼音
                columnId: res.column ? res.column.id : '',  // 馆
                categoryId: res.category ? res.category.id : '',  // 分类
                brandId: res.brand ? res.brand.id : '', // 品牌
                merchantId: res.merchant ? res.merchant.id : '',  // 商家
                dmpk: res.dmpk ? res.dmpk : '',  // 药代动力学
                drugType: res.drugType ? res.drugType.name : '',  // 保健品类型
                nrdl: res.nrdl ? res.nrdl.toString() : "false",  // 是否是国家医保目录
                interactions: res.ywxhzy ? res.ywxhzy : '',  // 药物相互作用  。。.
                adr: res.blfy ? res.blfy : '',  // 不良反应  。。.
                adaptDisease: res.syz ? res.syz : '',  // 适应症状 。。.
                // 药理毒理
                packingInfo: res.packingInfo ? res.packingInfo : '',  // 包装信息
                manuExeStandard: res.zxbz ? res.zxbz : '',  // 执行标准  。。.
                storage: res.zc ? res.zc : '',  // 贮藏信息  。。.
                approval: res.pzwh ? res.pzwh : '',  // 批准文号  。。.
                spec: res.gg ? res.gg : '',  // 规格信息  。。.
                manuCorp: res.manu ? res.manu : '',  // 生产企业 。。.
                manuAddress: res.manuAddress ? res.manuAddress : '',  // 产地
                basis: res.zycf ? res.zycf : '',  // 主要成分  。。.
                form: res.jx ? res.jx : '',  // 剂型  。。.
                character: res.xz ? res.xz : '',  // 性状  。。.
                taboo: res.jj ? res.jj : '',   // 禁忌  。。.
                purpose: res.purpose ? res.purpose : '',  // 主治疾病 。。
                dosage: res.yfyl ? res.yfyl : '',   // 用法用量  。。.
                commendedUser: res.note ? res.note : '',  // 适宜人群  。。
                costPrice: res.costPrice ? res.costPrice : '',   // 成本价
                consideration: res.zysx ? res.zysx : '',  // 注意事项  。。.

                marketPrice: res.marketPrice ? res.marketPrice : '',  // 市场价
                details: res.details ? res.details : '',  // 详情
                medicalType: res.medicalType ? res.medicalType.code : '',  // 大 类别
                memberPrice: res.memberPrice ? res.memberPrice : '',  // 销售价
                validity: res.yxq ? res.yxq : '',  // 有效期  暂无用
                manuDate: res.manuDate ? res.manuDate : '',  // 生产日期
                validity: res.validity ? res.validity : '',  // 过期日期
                pic: [],
                video: '',  // 视频
                details: ''
            }
        },
        // 媒体保存
        mediaSaveFn(tag) {
            let formData = new FormData();
            formData.append('goodsId', this.healthId);
            formData.append('tag', tag);

            if (tag == 'mainpic') {

                formData.append('name', '商品主图');
                if (this.pic && this.pic.length > 0) {
                    this.pic.forEach((v) => {
                        formData.append("file", v);
                    });
                }
            } else if (tag == 'mainvideo') {
                formData.append('name', '商品视频');
                if (this.video && this.video.length > 0) {
                    this.video.forEach((v) => {
                        formData.append("file", v);
                    });
                }
            }

            postGoodsMediaBatchSaveApi(formData, false).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            })
        },
        // 媒体列表
        mediaListFn(tag) {
            getGoodsMediaListApi({
                goodsId: this.healthId,
                tag
            }).then(res => {
                let arr = JSON.parse(JSON.stringify(res))
                arr = arr.map(item => {
                    return {
                        ids: item.id,
                        media: item.filePath
                    }
                })

                if (tag == 'mainpic') {
                    this.list.pic = arr;
                }
                if (tag == 'mainvideo') {
                    this.list.video = arr;
                }

            }).catch(err => {
                console.log(err);
            })
        },
        // 媒体删除
        mediaDelFn(item, index, tag) {
            let id = item.ids;
            if (typeof id != 'string') {
                if (tag == 'img') {
                    this.list.pic.splice(index, 1);
                    this.pic.splice(index, 1);
                };
                if (tag == 'video') {
                    this.list.video.splice(index, 1);
                    this.video.splice(index, 1);
                };
            } else {
                postGoodsMediaRemoveApi({ id }).then(res => {
                    if (res) {
                        if (tag == 'img') {
                            this.list.pic.splice(index, 1);
                        }
                        if (tag == 'video') {
                            this.list.video.splice(index, 1);
                        }
                        this.$Message.success('删除成功');
                    };
                }).catch(err => {
                    console.log(err);
                })
            }
        },
        // 图片上传 多个图片
        handleBeforeLicenseUrlUpload(file) {
            file.ids = this.uploadImgKey;
            if (this.list.pic.length > 9) {
                this.$Message.error('请注意最多上传10张')
            } else {
                this.list.pic.push({
                    ids: this.uploadImgKey,
                    img: window.URL.createObjectURL(file),
                });
                this.pic.push(file);
                this.uploadImgKey++;
                return false;
            }
        },
        // 上传视频
        videoHandleBeforeLicenseUrlUpload(file) {
            file.ids = this.uploadVideoKey;
            if (this.list.video.length > 5) {
                this.$Message.error('请注意最多上传5张')
            } else {
                this.list.video.push({
                    ids: this.uploadVideoKey,
                    media: window.URL.createObjectURL(file),
                });
                this.video.push(file);
                this.uploadVideoKey++;
                return false;
            }
        },

        // 规格属性  设置

        // 新增规格
        newsSize() {
            let i = this.sizeIndex
            if (this.haveSizeList.length >= 3) {
                this.$Message.error('不好意思，最多只能加三个！！！')
            } else {
                if (i !== '') {
                    let newData = {
                        property: {
                            name: this.propertyList[i].name,
                            id: this.propertyList[i].id
                        },
                        value: []
                    };

                    let ifAdd = false;
                    this.haveSizeList.map(item => {
                        if (item.property.name === newData.property.name) {
                            this.$Message.warning('规格值不能重复，属性值可添加多个 ！');
                            ifAdd = true;
                        }
                    });
                    if (!ifAdd) {
                        this.haveSizeList.push(newData);
                    }
                } else {
                    this.$Message.info('请先选择')
                }
            }
        },
        // 根据分类来获取属性列表
        getCid(cid) {
            // 这是根据分类id来获取的属性列表，判断属性id的改变来改变
            getGoodsPropertyPageApi({ categoryId: cid, biz: 'medical' })
                .then((res) => {
                    let arr = res.data
                    arr.forEach((v) => {
                        v.rankType = false;
                        v.categoryId = v.categoryInfo ? v.categoryInfo.map(v => { return v.id }) : []
                        v.categoryName = v.categoryInfo ? v.categoryInfo.map(v => { return v.name }).join(",") : ''
                    });
                    this.propertyList = arr;
                    this.loading = false
                }).catch((err) => {
                });
        },
        // 选择的属性 ---> 索引
        changeSel(index) {
            this.sizeIndex = index
        },
        // 获取规格列表
        getGoodsPropertyValueList() {
            getGoodsPropertyValueListApi({ goodsId: this.healthId }).then(res => {
                let arr = res
                arr.forEach(v => {
                    v.value.forEach(a => {
                        a.rankType = false
                    });
                });
                if (arr.length > 0 && (!this.tabsId)) {
                    this.tabsId = arr[0].property.id
                }
                this.haveSizeList = arr
                this.loading = false;
            }).catch(err => {
                this.loading = false
                console.log(err);
            })
        },
        // 新增  属性值
        addNewSize(ix) {
            if (!this.healthId) {
                this.submitFn(false)
            }
            this.timer = setTimeout(() => {
                let property = this.haveSizeList[ix].property
                this.loading = true
                let formData = new FormData();
                formData.append('id', this.listArrt.id ? this.listArrt.id : '');
                formData.append('goodsId', this.healthId);
                formData.append('propertyId', property.id ? property.id : '');
                formData.append('value', this.attrName[ix] ? this.attrName[ix] : '');
                formData.append('biz', 'common');
                // formData.append('pic', this.list.pic ? this.list.pic : '');
                // if (this.img !== null) {
                //     formData.append('upload[pic]', this.img);
                // }
                postGoodsPropertyValueSaveApi(formData, false).then((res) => {
                    this.modal = false
                    this.$Message.success('添加成功');
                    // this.attrName = ''
                    this.getGoodsPropertyValueList()
                    this.loading = false
                }).catch((err) => {
                    this.loading = false
                });
            }, 500);
        },
        // 添加新的库存
        addNewStocks() {
            let formData = new FormData();
            formData.append('id', this.list.id ? this.list.id : '');
            formData.append('stocks', this.stocks ? this.stocks : 0);
            formData.append('goodsId', this.healthId);
            formData.append('pic', this.pic ? this.pic : '');
            if (this.img !== null) {
                formData.append('upload[pic]', this.img);
            }
            this.stockList.forEach(v => {
                formData.append('propertyValueId', v);
            });
            postGoodsSkuSaveApi(formData, false).then((res) => {
                this.modal = false
                this.$Message.success('添加成功');
                this.getgoodsSkuList()
                this.loading = false
            }).catch((err) => {
                this.loading = false
            });
        },
        // 获取库存列表
        getgoodsSkuList() {
            if (this.healthId) {
                getGoodsSkuListApi({ goodsId: this.healthId }).then(res => {
                    let arr = res
                    arr.forEach(v => {
                        v.rankType = false
                        v.propertyValueId = []
                        v.propertyValue.forEach(a => {
                            v[a.property.id] = a.value[0].value
                            v.propertyValueId.push(a.value[0].id)
                        });
                    });
                    // console.log(arr);
                    this.skuList = arr
                    this.loading = false;
                }).catch(err => {
                    this.loading = false
                    console.log(err);
                })
                // 
                getGoodsPropertyValueListApi({ goodsId: this.healthId }).then(res => {
                    let arr = res
                    let com = this.columns1
                    for (let i = arr.length - 1; i >= 0; i--) {
                        // console.log(arr[i]);
                        com.unshift({
                            title: arr[i].property.name,
                            minWidth: 200,
                            key: arr[i].property.id,
                        })
                    }
                    // console.log(com);
                    this.columns = com
                    this.propertyValueList = arr

                }).catch(err => {
                    this.loading = false
                    console.log(err);
                })
            }
        },
        // 规格图
        handleBeforeLicenseUrlUploadStock(file) {
            this.img = file;
            this.stockList.img = window.URL.createObjectURL(file);
            return false;
        },
        // 规格删除
        delSizeFn(row) {
            postGoodsPropertyValueRemoveApi({ id: row.id }).then(res => {
                if (res.success) {
                    this.$Message.success('操作成功');
                    this.getGoodsPropertyValueList();
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 删除库存
        delStockFn(row) {
            postGoodsSkuRemoveApi({ id: row.id }).then(res => {
                if (res.success) {
                    this.getgoodsSkuList();
                    this.$Message.success('操作成功');
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 删除尺寸块
        delSizeOne(item, index) {
            if (item.value.length == 0) {
                this.haveSizeList.splice(index, 1);
            } else {
                this.$Message.warning('内有属性，不能删除')
            }
        },

        // 补充规格按钮 确认弹框
        // 弹框的确认
        confirm() {
            let formData = new FormData();
            if (this.addAttr.attrName !== '') {
                formData.append('name', this.addAttr.attrName ? this.addAttr.attrName : '');
            }
            if (this.addAttr.categoryId && this.addAttr.categoryId.length > 0) {
                this.addAttr.categoryId.forEach(v => {
                    formData.append('categoryId', v);
                });
            }
            if (this.addAttr.rank !== '') {
                formData.append('rank', this.addAttr.rank ? this.addAttr.rank : '');
            }
            if (this.apic !== null) {
                formData.append('upload[pic]', this.apic);
            }
            for (var [a, b] of formData.entries()) {
                console.log(a, b);
            }
            if (this.addAttr.attrName && this.addAttr.categoryId.length > 0) {
                postGoodsPropertySaveApi(formData, false).then((res) => {
                    if (res) {
                        this.$Message.success('添加成功！');
                        this.getCid(this.list.categoryId)
                    };
                }).catch((err) => {
                    console.log(err);
                });
            } else {
                this.$Message.error('属性名称和所属分类未填写')
            }
        },
        // 属性图
        handleBeforeLicenseUrlUploadAttr(file) {
            this.apic = file;
            this.addAttr.pic = window.URL.createObjectURL(file);
            return false;
        },

        onCreated(editor) {
            this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
        },

    },
    beforeUnmount() {
        const editor = this.editor;
        if (editor == null) return;
        editor.destroy(); // 组件销毁时，及时销毁编辑器
        this.timer = null;
        this.brandTime = null;
    },
}
</script>
<style scoped lang='less'>
.news_body {
    margin-top: 24px;
    padding: 20px 30px;
    box-sizing: border-box;
    background: #fff;

    .body_top {
        margin-top: 10px;
    }

    .uploadImg {
        position: relative;
        display: inline-block;
        margin-right: 16px;
        width: 19%;

        .imgs {
            margin: 10px 10px 0 0;
        }

        .uploadImg_icon {
            position: absolute;
            right: -3px;
            top: -3px;
            cursor: pointer;
        }

    }

    .uploadVideo {
        position: relative;
        padding: 10px;
        display: inline-block;

        .btn_remove {
            position: absolute;
            right: -1%;
            top: -1%;
        }
    }

    .size_col5 {
        // height: 210px;
        margin-right: 20px;
        margin: 10px 0;
        padding: 5px;
        box-sizing: border-box;
        border: 1px solid #c7c9cd;
        position: relative;

        &>i {
            position: absolute;
            right: 1%;
        }

        .col-top {
            width: 100%;
            height: 33px;
            display: flex;
            justify-content: space-around;
            align-items: center;

            .top-up {
                display: flex;
                align-items: center;
                line-height: 32px;

                .ivu-switch {
                    margin-left: 5px;
                }
            }
        }

        .col-modul {
            width: 100%;
            margin: 15px 0;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;

            .modul-color {
                width: 33.33%;
                display: flex;
                position: relative;

                i {
                    position: absolute;
                    right: 65%;
                }

                .modul-img {
                    width: 100px;
                }
            }
        }
    }

    .rule_box {
        border: 1px solid #c7c9cd;

        .ivu-col-span-3 {
            text-align: right;
        }

        .rule_obj {
            display: inline-block;
            padding: 0 15px 0 0;
            width: 70px;
            text-align: right;
        }
    }

    :deep(.ivu-col-span-2) {
        text-align: right;
        // line-height: 32px;
        display: flex;
        align-items: center;
        justify-content: right;
        padding-right: 15px;
        box-sizing: border-box;
    }
}
</style>