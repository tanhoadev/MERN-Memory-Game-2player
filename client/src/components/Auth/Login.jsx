import React from 'react'
import { Alert, Button, Card, Flex, Form, Input, Spin, Typography } from 'antd'
import { Link } from 'react-router-dom'
import regsiterImage from '../../assets/img/manlogin.png'
import useLogin from '../hooks/useLogin'

function Login() {
    const { loading, error, loginUser } = useLogin()
    const handleLogin = async (values) => {
        await loginUser(values)
    }
    return (
        <div className='auth-page'>
            <Card className='form-container'>
                <Flex gap="large" align='center'>
                    {/* image */}
                    <Flex flex={1} className='img-login'>
                        <img src={regsiterImage} alt="" className='auth-img' />
                    </Flex>
                    {/* Form  */}
                    <Flex vertical flex={1}>
                        <Typography.Title level={3} strong className='title'>
                            Sign In
                        </Typography.Title>
                        <Typography.Text type='secondary' strong className='slogan'>
                            Unlock you work
                        </Typography.Text>
                        <Form layout='vertical' onFinish={handleLogin} autoComplete='off'>
                            <Form.Item label="Email" name="email" rules={[
                                {
                                    required: true,
                                    message: 'please input your email'
                                },
                                {
                                    type: 'email',
                                    message: "The input is not valid Email"
                                },
                                {
                                    max: 30,
                                    message: "email must be maximum 30 characters long"
                                }
                                ,
                                {
                                    validator: (_, value) => {
                                        if (!/^[a-zA-Z0-9@.-]+$/.test(value)) {
                                            return Promise.reject("The data should only contain Latin characters, dashes, and digits.");
                                        }
                                        return Promise.resolve()
                                    }
                                }
                            ]} hasFeedback>
                                <Input placeholder='Enter your email' size='large' />
                            </Form.Item>
                            <Form.Item label="Password" name="password" rules={[
                                {
                                    required: true,
                                    message: 'please input your password'
                                }, {
                                    max: 25,
                                    message: "Password must be maximum 25 characters long"
                                }, {
                                    validator: (_, value) => {
                                        if (!/^[a-zA-Z0-9_@-]+$/.test(value)) {
                                            return Promise.reject("The data should only contain Latin characters, dashes, and digits.");
                                        }
                                        return Promise.resolve()
                                    }
                                }
                            ]} hasFeedback>
                                <Input.Password placeholder='Enter your password' size='large' />
                            </Form.Item>
                            {
                                error && <Alert description={error} type='error' showIcon closable className='alert' />
                            }
                            <Form.Item>
                                <Button
                                    type={`${loading ? '' : 'primary'}`}
                                    htmlType='submit'
                                    size='large'
                                    className='btn-'
                                >
                                    {loading ? <Spin /> : 'Sign In'}
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Link to="/">
                                    <Button size='large' className='btn-'>
                                        Create an account
                                    </Button>
                                </Link>
                            </Form.Item>
                        </Form>
                    </Flex>
                </Flex>
            </Card>
        </div>
    )
}

export default Login