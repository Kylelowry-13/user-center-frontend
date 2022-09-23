import { useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { searchUsers } from "@/services/ant-design-pro/api";
import {Image} from "antd";


const columns: ProColumns<API.CurrentUser>[] = [
  {
    dataIndex: 'id',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '用户名',
    dataIndex: 'userName',
    copyable: true,
    align: "center",
  },
  {
    title: '账号',
    align: "center",
    dataIndex: 'loginId',
    copyable: true,
  },
  {
    title: '头像',
    align: "center",
    dataIndex: 'avatarUrl',
    render: (_ ,record) => (
      <div>
        <Image src={record.avatarUrl} width={100} height={100} fallback={'https://img2.woyaogexing.com/2018/04/05/2a88108dc1b705b6!400x400_big.jpg'} />
      </div>
    ),
  },
  {
    title: '性别',
    align: "center",
    dataIndex: 'gender',
    valueType: 'select',
    valueEnum: {
      0: {text: '保密'},
      1: {
        text: '男',
      },
      2: {
        text: '女',
      },
    },
  },
  {
    title: '邮箱',
    align: "center",
    dataIndex: 'email',
    copyable: true,
    ellipsis: true,
  },
  {
    title: '电话',
    align: "center",
    dataIndex: 'phoneNumber',
    copyable: true,
    ellipsis: true,
  },
  {
    title: '状态',
    align: "center",
    dataIndex: 'userStatus',
  },
  {
    title: '注册时间',
    align: "center",
    dataIndex: 'createTime',
    valueType: 'dateRange',
  },
  {
    title: '角色',
    align: "center",
    dataIndex: 'isManager',
    valueType: 'select',
      valueEnum: {
        0: { text: '普通用户', status: 'default' },
        1: {
          text: '管理员',
          status: 'Error',
        },
        // closed: {
        //   text: '已解决',
        //   status: 'Success',
        //   disabled: true,
        // },
        // processing: {
        //   text: '解决中',
        //   status: 'Processing',
        // },
      },
  },
  // {
  //   disable: true,
  //   title: '状态',
  //   dataIndex: 'userStatus',
  //   filters: true,
  //   onFilter: true,
  //   ellipsis: true,
  //   valueType: 'select',
  //   valueEnum: {
  //     all: { text: '超长'.repeat(50) },
  //     open: {
  //       text: '未解决',
  //       status: 'Error',
  //     },
  //     closed: {
  //       text: '已解决',
  //       status: 'Success',
  //       disabled: true,
  //     },
  //     processing: {
  //       text: '解决中',
  //       status: 'Processing',
  //     },
  //   },
  // },
  // {
  //   disable: true,
  //   title: '标签',
  //   dataIndex: 'labels',
  //   search: false,
  //   renderFormItem: (_, { defaultRender }) => {
  //     return defaultRender(_);
  //   },
  //   render: (_, record) => (
  //     <Space>
  //       {record.labels.map(({ name, color }) => (
  //         <Tag color={color} key={name}>
  //           {name}
  //         </Tag>
  //       ))}
  //     </Space>
  //   ),
  // },
  // {
  //   title: '创建时间',
  //   key: 'showTime',
  //   dataIndex: 'created_at',
  //   valueType: 'date',
  //   sorter: true,
  //   hideInSearch: true,
  // },
  // {
  //   title: '创建时间',
  //   dataIndex: 'created_at',
  //   valueType: 'dateRange',
  //   hideInTable: true,
  //   search: {
  //     transform: (value) => {
  //       return {
  //         startTime: value[0],
  //         endTime: value[1],
  //       };
  //     },
  //   },
  // },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a  target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
        ]}
      />,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<API.CurrentUser>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        console.log(sort, filter);
        const userList = await searchUsers();
        return {
          data: userList
        }
      }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        // onChange(value) {
        //   console.log('value: ', value);
        // },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="高级表格"
    />
  );
};
