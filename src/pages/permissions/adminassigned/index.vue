<template>
    <div class="adminassigned">
        <!-- <h3>管理员分配</h3> -->
        <div class="i-layout-page-header">
            <PageHeader title="权限管理" content="管理员分配" hidden-breadcrumb />
        </div>
        <div class="admin-main">
            <Card>
                <template #title>
                    管理员
                </template>
                <template #extra>
                    <Button size="small" @click="modal = true; difEdit = true;">添加</Button>
                </template>
                <div class="assigned-list">
                    <Table border :columns="columns" :data="data">
                        <template #name="{ row }">
                            <strong>{{ row.name }}</strong>
                        </template>
                        <template #action="{ row }">
                            <Button type="info" size="small" style="margin-right: 5px" @click="accreditFn(row)">授权</Button>
                            <Button type="primary" size="small" style="margin-right: 5px"
                                @click="eidtAdminFn(row)">编辑</Button>
                            <Poptip confirm transfer title="您确认删除吗?" @on-ok="delAmdinFn(row.id)">
                                <Button type="error" size="small">删除</Button>
                            </Poptip>
                        </template>
                    </Table>
                </div>
                <div style="margin: 20px 0 0;">
                    <Page :total="total" size="small" show-elevator show-sizer show-total
                        @on-page-size-change="pageSizeChange" @on-change="changePage" />
                </div>
            </Card>
        </div>
        <!-- 添加管理员 -->
        <Modal v-model="modal" title="添加管理员" width="500" @on-visible-change="visibleChange">
            <Form ref="formValidate" :model="list" :rules="rules" label-position="right" :label-width="120">
                <FormItem label="管理员账号：" prop="username" v-if="difEdit">
                    <Input v-model="list.username" placeholder="请输入管理员账号（用户名）" />
                </FormItem>
                <FormItem label="真实姓名：" prop="name">
                    <Input v-model="list.name" placeholder="请输入真实名字" />
                </FormItem>
                <FormItem label="昵称：" prop="nickName">
                    <Input v-model="list.nickName" placeholder="请输入昵称" />
                </FormItem>
                <FormItem label="性别：" prop="gender">
                    <RadioGroup v-model="list.gender">
                        <Radio label="male">男</Radio>
                        <Radio label="female">女</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="联系方式：" prop="mobile" v-if="difEdit">
                    <Input v-model="list.mobile" placeholder="请输入联系方式" type="number" maxlength="11" show-word-limit />
                </FormItem>
                <FormItem label="邮箱：" prop="email" v-if="difEdit">
                    <Input v-model="list.email" placeholder="请输入邮箱" />
                </FormItem>
                <FormItem label="密码：" prop="password" v-if="difEdit">
                    <Input v-model="list.password" placeholder="请输入密码" />
                </FormItem>
                <FormItem label="确认密码：" prop="passwords" v-if="difEdit">
                    <Input v-model="list.passwords" placeholder="请再次输入密码" />
                </FormItem>
                <FormItem label="备注：">
                    <Input v-model="list.remark" type="textarea" :rows="4" placeholder="请输入备注" />
                </FormItem>
                <!-- <FormItem label="是否离职：" prop="name">
                    <RadioGroup v-model="list.video">
                        <Radio :label="1">是</Radio>
                        <Radio :label="0">否</Radio>
                    </RadioGroup>
                </FormItem> -->
            </Form>
            <template #footer>
                <Button type="primary" @click="saveAdminFn('formValidate')">确认</Button>
                <Button @click="modal = false;">取消</Button>
            </template>
        </Modal>
        <!-- 绑定角色 -->
        <Modal v-model="roleModal" title="用户授权" width="500">
            <Form ref="formValidate" :model="accrEdit" :rules="rules" label-position="right" :label-width="120">
                <FormItem label="授权人：" prop="name">
                    <Input v-model="accrEdit.username" placeholder="请输入管理员账号（用户名）" disabled />
                </FormItem>
                <FormItem label="角色：" prop="name">
                    <Select v-model="accrEdit.roleId" multiple placeholder="请选择角色">
                        <Option :value="item.id" v-for="item in roleList" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
            </Form>
            <template #footer>
                <Button type="primary" @click="saveAccreditFn()">确认</Button>
                <Button @click="roleModal = false;">取消</Button>
            </template>
        </Modal>
    </div>
</template>
<script>
import {
    getUserInfoPageApi,   // 管理员列表
    postUserInfoSaveApi,  // 管理员保存
    getAuthorityRolePageApi,  // 分页
    postRoleMemberBind4accountApi,   // 用户绑定角色
    getUserRoleListApi,   // 用户角色
    postUserInfoRemoveApi,  // 用户删除
    getUserInfoDetailApi,   // 用户详情

    getSelfAuthorityPermissionTreeApi,  // 当前角色的资源树
} from "@/api/account";
export default {
    name: 'adminassigned',
    data() {
        // 验证密码是否相同
        const validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.list.passwords !== '') {
                    // 对第二个密码框单独验证
                    this.$refs.formValidate.validateField('passwords');
                }
                callback();
            }
        };
        const validatePassCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.list.password) {
                callback(new Error('两次密码输入不一致'));
            } else {
                callback();
            }
        };
        return {
            columns: [
                {
                    title: '编号',
                    // slot: 'name',
                    key: 'id',
                    align: 'center'
                },
                {
                    title: '用户名',
                    key: 'username',
                    align: 'center'
                },
                {
                    title: '姓名',
                    key: 'name',
                    align: 'center'
                },
                {
                    title: '联系方式',
                    key: 'mobile',
                    align: 'center'
                },
                {
                    title: '所属角色',
                    key: 'role',
                    align: 'center'
                },
                {
                    title: '备注',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', '---')
                    }
                },
                {
                    title: '创建时间',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', this.$Date(params.row.registerTime).format('YYYY-MM-DD HH:mm:ss'))
                    }
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 200,
                    align: 'center'
                }
            ],
            data: [],
            total: 0, // 总条数
            pageSize: 10,
            pageNumber: 1,
            modal: false,
            roleModal: false,  // 授权弹框
            accrEdit: {},   // 授权信息
            roleList: [],  // 角色列表
            difEdit: true,   // 区分编辑false和新增true
            // 弹出层数据 
            list: {
                password: '',
                passwords: '',
            },
            // 规则
            rules: {
                username: [
                    { required: true, message: '请输入管理员账号', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                nickName: [
                    { required: true, message: '请输入昵称', trigger: 'blur' }
                ],
                gender: [
                    { required: true, message: '请选择性别', trigger: 'change' }
                ],
                mobile: [
                    { required: true, message: '请输入联系方式', trigger: 'blur' },
                    { type: 'string', max: 11, message: '请输入正确的联系方式', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' }
                ],
                password: [
                    { required: true, validator: validatePass, trigger: 'blur' }
                ],
                passwords: [
                    { required: true, validator: validatePassCheck, trigger: 'blur' }
                ],
            },
        }
    },
    created() {
        this.getAdminPage();
        this.getRoleList();
    },
    methods: {
        // 获取管理员
        getAdminPage() {
            let data = {
                type: 'admin',
                pageNumber: this.pageNumber,
                pageSize: this.pageSize
            }
            getUserInfoPageApi(data).then(res => {
                // console.log(res);
                if (res.totalElements > 0) {
                    this.total = res.totalElements - 1;
                }
                this.data = [];
                res.data.forEach(item => {
                    if (item.mobile != '15300646077') {
                        this.data.push(item);
                    }
                })
            })
        },
        // 编辑按钮
        eidtAdminFn(row) {
            this.difEdit = false;   // 编辑
            getUserInfoDetailApi(row.id).then(res => {
                this.list = {
                    id: res.id,
                    name: res.name,
                    nickName: res.name,
                    gender: res.gender ? res.gender.code : '',
                    remark: res.remark ? res.remark : '',
                };
                this.modal = true;
            })
        },
        // 删除
        delAmdinFn(id) {
            postUserInfoRemoveApi({ id }).then(res => {
                res;
                this.$Message.success('操作成功！');
                this.getAdminPage();
            });
        },
        // 弹出层确认
        saveAdminFn(name) {
            // this.$Message.info('Clicked ok');
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let data = {
                        type: 'admin',
                    };
                    for (const key in this.list) {
                        if (Object.hasOwnProperty.call(this.list, key)) {
                            const element = this.list[key];
                            if (key && key != 'passwords') {
                                data[key] = element;
                            };
                        };
                    };
                    postUserInfoSaveApi(data).then(res => {
                        // console.log(res);
                        if (res.id) {
                            this.modal = false;
                            this.$Message.success('成功！');
                            this.list = {};
                            this.getAdminPage();
                        };
                    });
                } else {
                    this.$Message.error('请补充必填项 !');
                };
            });
        },
        // 角色列表
        getRoleList() {
            getAuthorityRolePageApi().then(res => {
                let data = JSON.parse(JSON.stringify(res.data));
                this.roleList = data;
            }).catch(err => {
                this.$router.push({ path: '/403' })
            })
        },
        // 角色授权
        accreditFn(row) {
            this.roleModal = true;
            this.accrEdit.accountId = row.accountId;
            this.accrEdit.username = row.name + `（${row.mobile}）`
            getUserRoleListApi({ accountId: row.accountId }).then(res => {
                // console.log(res);
                this.accrEdit.roleId = [];
                if (res.length > 0) {
                    res.forEach(item => {
                        this.accrEdit.roleId.push(item.id);
                    })
                }
            })
        },
        // 确认授权角色
        saveAccreditFn() {
            let data = {
                accountId: this.accrEdit.accountId,
                roleId: this.accrEdit.roleId,
            };
            postRoleMemberBind4accountApi(data, true).then(res => {
                if (res.length > 0) {
                    this.$Message.success('授权成功！')
                    this.accrEdit = {};
                    this.roleModal = false;
                }
            })
        },
        // 弹框
        visibleChange(flag) {
            if (!flag) {
                this.list = {};
            }
        },
        // 分页
        changePage(page) {
            this.pageNumber = page;
            this.getAdminPage();
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getAdminPage();
        },

    }
}
</script>
<style scoped lang="less">
.admin-main {
    margin-top: 24px;
}
</style>