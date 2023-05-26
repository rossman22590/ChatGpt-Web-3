import {
  CommentOutlined,
  CrownFilled,
  ExperimentFilled,
  FileTextFilled,
  GithubFilled,
  GithubOutlined,
  GoldenFilled,
  IdcardFilled,
  InsuranceFilled,
  LockFilled,
  MessageFilled,
  MoneyCollectFilled,
  PictureOutlined,
  ReconciliationFilled,
  ScheduleFilled,
  SettingFilled,
  ShopFilled,
  ShopOutlined,
  SmileFilled,
  WalletFilled
} from '@ant-design/icons'

const web = [
  {
    path: '/',
    name: 'dialogue',
    icon: <CommentOutlined />,
    message: 'Dialogue with Smart AI'
  },
  {
    path: '/draw',
    name: 'painting',
    icon: <PictureOutlined />,
    message: 'Use intelligent AI to draw pictures'
  },
  {
    path: '/shop',
    name: 'Mall',
    icon: <ShopOutlined />,
    message: 'Account balance and recharge package record'
  },
  {
    path: 'https://github.com/79E/ChatGpt-Web',
    name: 'project address',
    icon: <GithubOutlined />,
    message: 'Free open source commercialization AIWEB project'
  }
]

const admin = {
  path: '/',
  routes: [
    {
      path: '/admin',
      name: 'Welcome',
      icon: <SmileFilled />
    },
    {
      path: '/admin_base',
      name: 'Basic management',
      icon: <ExperimentFilled />,
      access: 'canAdmin',
      component: './Admin',
      routes: [
        {
          path: '/admin/carmi',
          name: 'Dense management',
          icon: <LockFilled />
        },
        {
          path: '/admin/token',
          name: 'Token management',
          icon: <InsuranceFilled />
        }
      ]
    },
    {
      path: '/admin_user',
      name: 'User Management',
      icon: <CrownFilled />,
      access: 'canAdmin',
      component: './Admin',
      routes: [
        {
          path: '/admin/user',
          name: 'user list',
          icon: <IdcardFilled />
        },
        {
          path: '/admin/turnover',
          name: 'Expenses record',
          icon: <ReconciliationFilled />
        },
        {
          path: '/admin/signin',
          name: 'Sign in',
          icon: <ScheduleFilled />
        }
      ]
    },
    {
      name: 'Session management',
      icon: <MessageFilled />,
      path: '/admin_message',
      routes: [
        {
          path: '/admin/messages',
          name: 'Message list',
          icon: <FileTextFilled />
        }
      ]
    },
    {
      path: '/admin_orders',
      name: 'Commodity and order',
      icon: <GoldenFilled />,
      routes: [
        {
          path: '/admin/product',
          name: 'Product list',
          icon: <ShopFilled />
        },
        {
          path: '/admin/payment',
          name: 'Payment configuration',
          icon: <MoneyCollectFilled />
        },
        {
          path: '/admin/order',
          name: 'Payment order',
          icon: <WalletFilled />
        }
      ]
    },
    {
      path: '/admin/config',
      name: 'System Configuration',
      icon: <SettingFilled />
    },
    {
      path: 'https://github.com/79E/ChatGpt-Web',
      name: 'Github',
      icon: <GithubFilled />
    }
  ]
}

export default {
  web,
  admin
}
