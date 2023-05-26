import { getAdminMessages } from '@/request/adminApi';
import { MessageInfo } from '@/types/admin';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Tag } from 'antd';
import { useRef} from 'react';

function MessagePage() {

    const tableActionRef = useRef<ActionType>();
    const columns: ProColumns<MessageInfo>[] = [
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
            title: 'content',
            dataIndex: 'content',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            render: (_, data)=><Tag>{data.role}</Tag>
        },
        {
            title: 'Model',
            dataIndex: 'model',
            render: (_, data)=><Tag>{data.model}</Tag>
        },
        {
            title: 'Session ID',
            dataIndex: 'parent_message_id',
            render: (_, data)=><Tag>{data.role}</Tag>
        },
        {
            title: 'State value',
            dataIndex: 'status',
            render: (_, data) => <Tag color={data.status ? 'green' : 'red'}>{data.status ? '正常' : '异常'}</Tag>
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
                    const res = await getAdminMessages({
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

export default MessagePage;
