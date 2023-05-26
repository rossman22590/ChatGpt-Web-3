import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

function ResultPage() {
  const navigate = useNavigate()
  return (
    <Result
      status="success"
      title="payment successful!"
      subTitle=""
      extra={[
        <Button
          key="home"
          onClick={() => {
            navigate('/')
          }}
        >
          Back to homepage
        </Button>,
        <Button
          type="primary"
          key="shop"
          onClick={() => {
            navigate('/shop')
          }}
        >
          View record
        </Button>
      ]}
    />
  )
}
export default ResultPage
