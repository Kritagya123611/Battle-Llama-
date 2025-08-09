'use client'; 
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

export default function Signup() { 
    const router = useRouter(); 
    
    type GoogleUser = {
        name: string;
        email: string;
        picture: string;
    }
    const [user, setUser] = React.useState<GoogleUser | null>(null);

    return(
        <div>
            <div className='flex flex-col justify-center text-white items-center h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 space-y-6'>
                <video
                    src="https://llamaland.arweave.net/assets/video.webm"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
                <p className='text-4xl font-bold'>this is the signup page</p>
                <p className='text-xl'>Sign up with Google to continue</p>
                <GoogleLogin onSuccess={(credentialResponse) => {
                    if (credentialResponse.credential) {
                        const decoded = jwtDecode(credentialResponse.credential) as GoogleUser;
                        setUser(decoded);
                        console.log("User logged in:", decoded);
                        
                        // Pass user data as a URL query parameter
                        const userString = JSON.stringify(decoded);
                        router.push(`/dashboard?user=${encodeURIComponent(userString)}`);

                    } else {
                        console.log("No credential received");
                    }
                }} onError={()=>{console.log("Login Failed")}}/>
            </div>
        </div>
    );
}