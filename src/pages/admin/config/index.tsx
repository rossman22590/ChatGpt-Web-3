import {
    ProFormDigit,
    QueryFilter,
} from '@ant-design/pro-components';
import { Form, Space, message } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.module.less'
import { getAdminConfig, putAdminConfig } from '@/request/adminApi';
import { ConfigInfo } from '@/types/admin'

function ConfigPage() {

    const [configs, setConfigs] = useState<Array<ConfigInfo>>([])
    const [rewardForm] = Form.useForm<{
        register_reward: number | string,
        signin_reward: number | string,
    }>();

    const [historyMessageForm] = Form.useForm<{
        history_message_count: number | string,
    }>();

    function getConfigValue(key: string, data: Array<ConfigInfo>) {
        const value = data.filter(c => c.name === key)[0]
        return value
    }

    function onRewardFormSet(data: Array<ConfigInfo>) {
        const registerRewardInfo = getConfigValue('register_reward', data)
        const signinRewardInfo = getConfigValue('signin_reward', data)
        const historyMessageCountInfo = getConfigValue('history_message_count', data)
        rewardForm.setFieldsValue({
            register_reward: registerRewardInfo.value,
            signin_reward: signinRewardInfo.value
        })
        historyMessageForm.setFieldsValue({
            history_message_count: Number(historyMessageCountInfo.value)
        })
    }


    function onGetConfig() {
        getAdminConfig().then((res) => {
            if (res.code) {
                message.error('Get configuration error')
                return
            }
            onRewardFormSet(res.data)
            setConfigs(res.data)
        })
    }

    useEffect(() => {
        onGetConfig()
    }, [])

    async function onSave(values: any){
        return putAdminConfig(values).then((res) => {
            if (res.code) {
                message.error('Preservation failure')
                return
            }
            message.success('Saved successfully')
            onGetConfig()
        })
    }

    return (
        <div className={styles.config}>
            <Space direction="vertical" style={{
                width: '100%'
            }}
            >
                <div className={styles.config_form}>
                    <h3>Reward incentive</h3>
                    <QueryFilter
                        form={rewardForm}
                        onFinish={async (values: any) => {
                            putAdminConfig(values).then((res) => {
                                if (res.code) {
                                    message.error('Preservation failure')
                                    return
                                }
                                message.success('Saved successfully')
                                onGetConfig()
                            })
                        }}
                        onReset={() => {
                            onRewardFormSet(configs)
                        }}
                        size="large"
                        collapsed={false}
                        defaultCollapsed={false}
                        requiredMark={false}
                        defaultColsNumber={79}
                        searchText="keep"
                        resetText="recover"
                    >
                        <ProFormDigit
                            name="register_reward"
                            label="Register"
                            tooltip="New user registration gift number quantity"
                            min={0}
                            max={100000}
                        />
                        <ProFormDigit
                            name="signin_reward"
                            label="Sign in"
                            tooltip="Daily sign -in gifts"
                            min={0}
                            max={100000}
                        />
                    </QueryFilter>
                </div>
                <div className={styles.config_form}>
                    <h3>history record</h3>
                    <QueryFilter
                        form={historyMessageForm}
                        onFinish={onSave}
                        onReset={() => {
                            onRewardFormSet(configs)
                        }}
                        size="large"
                        collapsed={false}
                        defaultCollapsed={false}
                        requiredMark={false}
                        defaultColsNumber={79}
                        searchText="keep"
                        resetText="recover"
                    >
                        <ProFormDigit
                            name="history_message_count"
                            label="Number"
                            tooltip="New user registration gift number quantity"
                            min={1}
                            max={100000}
                        />
                    </QueryFilter>
                </div>
            </Space>
        </div>
    )
}
export default ConfigPage;
