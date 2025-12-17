import Navbar from "~/components/Navbar";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { VscAdd } from "react-icons/vsc";
import { diffWords, wordDiff } from "diff";
import type { ChangeObject } from "diff";

type GrammarIssue = {
    label: string,
    count: number
}

const Home = () => {
    const [totalCount, setTotalCount] = useState(0)
    const [original, setOriginal] = useState("")
    const [corrected, setCorrected] = useState("")
    const [level, setLevel] = useState("")
    const [grammarIssues, setGrammarIssues] = useState([""])
    const [feedback, setFeedback] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [diffsDiary, setDiffsDiary] = useState<ChangeObject<string>[]>([])
    const getTotalWords = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/diaries/monthly-word-count`)
        if(!res.ok) throw new Error('Failed to fetch data')
        const data = await res.json()
        console.log(data)
        setTotalCount(data.total)
    }

    const getPrevDiaryData = async () => {
        setIsLoading(true)
        const res = await fetch(`${import.meta.env.VITE_API_URL}/diaries?sort[0]=createdAt:desc&pagination[limit]=1`)
        const data = await res.json()
        const latest = data.data[0]
        setOriginal(latest.content)
        setCorrected(latest.corrected_content)
        setFeedback(latest.feedback)
        const diffs = diffWords(latest.content, latest.corrected_content)
        setDiffsDiary(diffs)
        setIsLoading(false)
    }

    const getMonthlyLevel = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/diaries/monthly-level`)
        const data = await res.json()
        setLevel(data.level)
    }

    const recentGrammarIssues = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/diaries/recent-grammar-issues`)
        const data = await res.json()
        const label = data.trends.map((d: GrammarIssue) => d.label)
        setGrammarIssues(label)
    }

    useEffect(() => {
        getTotalWords()
        getPrevDiaryData()
        getMonthlyLevel()
        recentGrammarIssues()
    }, [])



    return ( 
        <div>
            {isLoading && (
                <div className="flex justify-center mt-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
            )}
            <h2 className='font-bold text-lg text-center my-6'>英語日記アプリ</h2>
            <div className="grid gap-6 sm:grid-cols-2 items-start">
                <div className="bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow-sm transition hover:shadow-md">
                    <h3 className='p-6 text-center font-semifold'>連続記録</h3>
                </div>
                <div className="bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow-sm transition hover:shadow-md"> 
                    <h3 className='p-6 text-center font-semifold'>今月の平均レベル</h3>
                    <p className="mb-4 text-center">{level}</p>
                </div>
                <div className="bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow-sm transition hover:shadow-md"> 
                    <h3 className='p-6 text-center font-semifold'>あなたの苦手 Top5</h3>
                    {grammarIssues.map((issue) => (
                        <p key={issue} className="mb-4 text-center">{issue}</p>
                    ))}
                </div>
                <div className="bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow-sm transition hover:shadow-md">
                    <h3 className='p-6 text-center font-semifold'>今月の文字数</h3>
                    <p className="mb-4 text-center">{totalCount}</p>
                </div>
                <div className="sm:col-span-2 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow-sm transition hover:shadow-md">
                    <h3 className='p-6 text-center font-semifold'>前回のフィードバック</h3>
                    <p className="mb-4 text-center">{feedback}</p>
                </div>
                <div className="sm:col-span-2 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-8 transition hover:shadow-md">
                    <h3 className='p-6 text-center font-semifold'>前回の添削</h3>
                    <div className="px-4 mb-2">
                        {diffsDiary.map((part, index) => (
                            <span 
                            key={index} 
                            style={{
                                color: part.added ? 'green' : part.removed ? 'red' : 'black',
                                textDecoration: part.removed ? 'line-through' : 'none',
                            }}
                            >
                                { part.value }
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className='fixed bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow'>
                <Link to="/diaryform">
                    <VscAdd size={28} />
                </Link>
            </div>
        </div>
     );
}
 
export default Home;