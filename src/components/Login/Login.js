'use client'
import React from 'react';
import styles from './LoginStyle.module.css';
import { authAPI } from '@/src/lib/authAPI';
import { useRouter } from 'next/navigation';

const Login = () => {
    const formRef = React.useRef(null);
    const router = useRouter();


    const onSubmit = async (e) => {
        e.preventDefault();

        e.target.setAttribute('disabled', true);

        let formData = new FormData(formRef.current);
        let email = formData.get('email');
        let password = formData.get('password');
        if (email !== '' && password !== '') {
            console.log('signIn');

            let user = await authAPI.signIn(email, password);
            // let user = await authAPI.signIn('1@1.com', password);
            e.target.setAttribute('disabled', true);

            if (user && user.uid || user.uid !== '') {
                router.push(`/chat`);
            }
        }
    }

    return (
        <main className={styles.loginMain}>
            <div className={styles.signInContainer}>
                <form ref={formRef} onSubmit={onSubmit}>
                    <div className={styles.signInFormItem}>
                        <label htmlFor='email'>Email:</label>
                        <input placeholder={'1@1.com'} type={'email'} id={'email'} name={'email'} className={styles.input} defaultValue={'1@1.com'} />
                    </div>
                    <div className={styles.signInFormItem}>
                        <label htmlFor='password'>Password:</label>
                        <input placeholder={'123123'} type={'text'} id={'password'} name={'password'} className={styles.input} />
                    </div>
                    <div className={styles.signInFormItem}>
                        <button type='submit' onClick={(e) => onSubmit(e)}>Sign In</button>
                    </div>
                </form>
            </div>
        </main>
    )
};

export default Login;