import { getAdminSignin } from '@/request/adminApi';
import { SigninInfo } from '@/types/admin';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Tag } from 'antd';
import { useRef} from 'react';

function SigninPage() {

    const tableActionRef = useRef<ActionType>();
    const columns: ProColumns<SigninInfo>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 180,
        },
        {
            title: 'userID',
            width: 180,
            dataIndex: 'user_id',
        },
        {
            title: 'IP',
            dataIndex: 'ip',
            render: (_, data)=><Tag>{data.ip}</Tag>
        },
        {
            title: 'State value',
            dataIndex: 'status',
            render: (_, data) => <Tag color={data.status ? 'green' : 'red'}>{data.status ? '签到成功' : '签到失败'}</Tag>
        },
        {
            title: 'Creation time',
            dataIndex: 'create_time',
        },
        {
            title: 'Update time',
            dataIndex: 'update_time',
        },
    ];

    return (
        <div>
            <ProTable
                actionRef={tableActionRef}
                columns={columns}
                scroll={{
                    x: 1200
                }}
                request={async (params, sorter, filter) => {
                    // Form search items will be passed in from Params and passed to the rear port interface.
                    const res = await getAdminSignin({
                        page: params.current || 1,
                        page_size: params.pageSize || 10,
                    });
                    return Promise.resolve({
                        data: res.data.rows,
                        total: res.data.count,
                        success: true,
                    });
                }}
                toolbar={{
                    actions: [],
                }}
                rowKey="id"
                search={false}
                bordered
            />
        </div>
    )
}

export default SigninPage;
