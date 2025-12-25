import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form";
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";

const registerSchema = z.object({
  username: z.string().min(1, "ユーザー名は必須です"),
  email: z.string().email("メール形式が正しくありません"),
  password: z.string().min(8, "8文字以上必要です"),
});

type FormInput = z.infer<typeof registerSchema>;


const UserRegister = () => {
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormInput>({resolver: zodResolver(registerSchema),})
  
    const onSubmit: SubmitHandler<FormInput> = async (data) => {
        console.log(data);
        await fetch(`${import.meta.env.VITE_API_URL}/auth/local/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        navigate('/login')
    };
    return ( 
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
                <h2 className="text-center text-xl font-bold mb-6">
                    ユーザー登録
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                    {/* username */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                            ユーザーネーム
                        </label>
                        <input
                            type="text"
                            {...register('username')}
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="username"
                        />
                    </div>

                    {/* email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                            メールアドレス
                        </label>
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                strokeWidth="2.5"
                                fill="none"
                                stroke="currentColor"
                                >
                                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                </g>
                            </svg>
                            <input
                                id="email"
                                type="email"
                                {...register('email')}
                                className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                placeholder="diary@example.com"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-2">
                            パスワード
                        </label>
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g
                                stroke-linejoin="round"
                                stroke-linecap="round"
                                stroke-width="2.5"
                                fill="none"
                                stroke="currentColor"
                                >
                                <path
                                    d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                                ></path>
                                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                </g>
                            </svg>
                            <input
                                type="password"
                                {...register('password')}
                                className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                placeholder="diary1234"
                            />
                        </div>
                        {errors.password && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-orange-400 text-white rounded-lg py-2 hover:bg-orange-500 transition"
                    >
                        登録
                    </button>
                </form>
            </div>
        </div>

     );
}
 
export default UserRegister;