'use server';

import { db,auth } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

export async function signUp(params:SignUpParams) {
    const { uid, name, email, password } = params;

    try{
        const userRecord = await db.collection('users').doc(uid).get();

        if(userRecord.exists){
            return {
                success:true,
                message: "User already exists. Please login instead."
            }
        }
        await db.collection('users').doc(uid).set({
            name,email  
        })
        return {
            success:true,
            message: "Account created successfully. Please login."
        }

    }catch(err: any){
        console.log("Error creating a user", err);

        if(err.code === 'auth/email-already-exists'){
            return {
                success:false,
                message: "This email is already in use. Please login instead."
            }
        }
        return {
            success:false,
            message: "Could not create a user. Please try again later."
        }
    }
}


export async function signIn(params:SignInParams) {
    const {email,idToken} = params;

    try{
        const userRecord = await auth.getUserByEmail(email);
        if(!userRecord){
            return {
                succes:false,
                message:" No user found with this email. Please sign up first."
            }
        }
        await setSessionCookie(idToken);
    }catch(err:any){
        console.log("Error signing in a user", err);

        return {
            succes:false,
            message:" Could not sign in. Please try again later."
        }
    }
}


export async function setSessionCookie(idToken: string){
    const cookieStore = await cookies();
    const sessionCookie =  await auth.createSessionCookie(idToken,{
        expiresIn: ONE_WEEK_IN_MS // 7 days
    })

    cookieStore.set('session',sessionCookie,{
        maxAge: ONE_WEEK_IN_MS,
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production',
        path:'/',
        sameSite:'lax',
    })
}   


export async function getCurrentUser():Promise<User | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if(!sessionCookie)return null;

    try{
        const decodedClaims = await auth.verifySessionCookie(sessionCookie,true);
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();

        if(!userRecord.exists)return null;

        return {
            ...userRecord.data(),
            id:userRecord.id,

        } as User;
    }catch(err){
        console.log("Error fetching current user", err);
        return null;
    }
}


export async function isAuthenticated() {
    const user =await getCurrentUser();

    return !!user;
}