import React from 'react'
import { Alert, Button, Card, Flex, Form, Input, Spin, Typography } from 'antd'
import { Link } from 'react-router-dom'
import regsiterImage from '../../assets/img/men.png'
import useSignup from '../hooks/useSignup'

function Register() {
    const { loading, error, registerUser } = useSignup()
    const handleRegister = async (values) => {
        await registerUser(values)
    }
    return (
        <div className='auth-page'>

            <Card className='form-container'>
                <Flex gap="large" align='center'>
                    {/* Form  */}
                    <Flex vertical flex={1}>
                        <Typography.Title level={3} strong className='title'>
                            Create an account
                        </Typography.Title>
                        <Typography.Text type='secondary' strong className='slogan'>
                            Join for exclusive access!
                        </Typography.Text>
                        <Form layout='vertical' onFinish={handleRegister} autoComplete='off'>
                            <Form.Item label="Full Name" name="name" rules={[
                                {
                                    required: true,
                                    message: 'please input your full name'
                                },
                                {
                                    max: 15,
                                    message: 'Username must be maximum 15 characters long.'
                                },
                                {
                                    validator: (_, value) => {
                                        if (!/^[a-zA-Z]/.test(value)) {
                                            return Promise.reject("The first character must be a letter.");
                                        }
                                        if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
                                            return Promise.reject("The data should only contain Latin characters, dashes, and digits.");
                                        }
                                        const specialWords = ["administrator", "support", "admin"];
                                        if (specialWords.includes(value.toLowerCase())) {
                                            return Promise.reject("Not allowed to match special names.");
                                        }
                                        return Promise.resolve();
                                    }
                                }
                            ]}
                                hasFeedback
                            >
                                <Input placeholder='Enter your full name' size='large' />
                            </Form.Item>
                            <Form.Item label="Email" name="email" rules={[
                                {
                                    required: true,
                                    message: 'please input your email'
                                },
                                {
                                    max: 30,
                                    message: 'email must be maximum 30 characters long.'
                                },
                                {
                                    type: 'email',
                                    message: "The input is not valid Email"
                                },
                                {
                                    validator: (_, value) => {
                                        if (!/^[a-zA-Z0-9_@.-]+$/.test(value)) {
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
                                },
                                {
                                    min: 12,
                                    message: 'The minimum password length is 12 characters'
                                },
                                {
                                    max: 25,
                                    message: 'The password must not exceed 25 characters.'
                                },
                                {
                                    validator: (_, value) => {
                                        if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
                                            return Promise.reject("The data should only contain Latin characters, dashes, and digits.");
                                        }
                                        const specialWords = ["administrator", "support", "admin"];
                                        if (specialWords.includes(value.toLowerCase())) {
                                            return Promise.reject("Not allowed to match special names.");
                                        }
                                        return Promise.resolve();
                                    }
                                },
                            ]} hasFeedback>
                                <Input.Password placeholder='Enter your password' size='large' />
                            </Form.Item>
                            <Form.Item label="Password Confirm" name="passwordConfirm" dependencies={["password"]} rules={[
                                {
                                    required: true,
                                    message: 'please input your Confirm password'
                                },
                                {
                                    max: 25,
                                    message: 'The Password Confirm must not exceed 25 characters.'
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            "The two passwords that you entered does not match."
                                        );
                                    },
                                }),
                            ]} hasFeedback>
                                <Input.Password placeholder='re-enter password' size='large' />
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
                                    {loading ? <Spin /> : 'Create Account'}
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Link to="/login">
                                    <Button size='large' className='btn-'>
                                        Sign In
                                    </Button>
                                </Link>
                            </Form.Item>

                        </Form>
                    </Flex>

                    {/* image */}
                    <Flex flex={1} className='img-regis'>
                        <img src={regsiterImage} alt="" className='auth-img' />
                    </Flex>
                </Flex>
            </Card>
        </div>
    )
}

export default Register