"use client";
import React, { useState } from 'react'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
const Auth = () => {
    const [state, setState] = useState<"login" | "register">("login");
    return (
        state === "login" ? <LoginForm setState={setState}/> : <RegisterForm setState={setState}/>
    )
}

export default Auth