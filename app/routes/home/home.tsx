import Navbar from "~/components/Navbar";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { VscAdd } from "react-icons/vsc";

const Home = () => {
    const [totalCount, setTotalCount] = useState(0)
    const getTotalWords = () => {
        const saved: string | null = localStorage.getItem('wordscount')
        const parsed: number[] | number = saved ? JSON.parse(saved) : []
        console.log(parsed)
        const countArr: number[] = Array.isArray(parsed) ? parsed : [parsed];
        const wordsCount = countArr.reduce((acc: number, value: number) => acc + value, 0)
        setTotalCount(wordsCount)
    }

    useEffect(() => {
        getTotalWords()
    }, [])



    return ( 
        <div>
            <h2 className='text-center my-6'>英語日記アプリ</h2>
            <div className="grid gap-6 sm:grid-cols-2">
                <div className="bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow-sm transition hover:shadow-md">
                    <h3 className='p-6 text-center font-semifold'>これまでの記録</h3>
                </div>
                <div className="bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow-sm transition hover:shadow-md"> 
                    <h3 className='p-6 text-center font-semifold'>今月の平均レベル</h3>
                </div>
                <div className="bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow-sm transition hover:shadow-md"> 
                    <h3 className='p-6 text-center font-semifold'>改善ポイント</h3>
                </div>
                <div className="bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow-sm transition hover:shadow-md">
                    <h3 className='p-6 text-center font-semifold'>前回のサマリー</h3>
                </div>
                <div className="bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow-sm transition hover:shadow-md">
                    <h3 className='p-6 text-center font-semifold'>前回の添削</h3>
                </div>
                <div className="bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow-sm transition hover:shadow-md">
                    <h3 className='p-6 text-center font-semifold'>今月の文字数</h3>
                    <p className="mb-4 text-center">{totalCount}</p>
                </div>
            </div>
            <div className='fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow'>
                <Link to="/diaryform">
                    <VscAdd size={28} />
                </Link>
            </div>
        </div>
     );
}
 
export default Home;