import { useState } from "react";
import { useNavigate } from "react-router";

const DiaryForm = () => {
    const [text, setText] = useState('')
    const [result, setResult] = useState(null);  // 添削結果を保存
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const wordsCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        // 1. いまの履歴を localStorage から取得
        const saved = localStorage.getItem("wordscount");
        const parsed: number[] | number = saved ? JSON.parse(saved) : [];
        const countArr: number[] = Array.isArray(parsed) ? parsed : [parsed];

        // 2. 今回の語数を追加
        countArr.push(wordsCount);

        // 3. 配列として保存し直す
        localStorage.setItem("wordscount", JSON.stringify(countArr));

        // 日記本文も配列で保存したいなら同じ方式
        const diarySaved = localStorage.getItem("diary");
        const diaryParsed: string[] | string = diarySaved ? diarySaved : [];
        const diaryArr: string[] = Array.isArray(diaryParsed) ? diaryParsed : [diaryParsed]
        diaryArr.push(text);
        //localStorage.setItem("diary", JSON.stringify(diaryArr));

        const res = await fetch(`${import.meta.env.VITE_API_URL}/diaries/correct-and-save`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
            content: text,
            }),
        })

        if (!res.ok) throw new Error('Failed to post to GPT')

        const data = await res.json()
        setResult(data)

        setLoading(false)


        navigate('/showresult', {state: {original: text, corrected: data.corrected_content, grammar_issues: data.grammar_issues}})
    }

    return ( 
        <div>
            <h2 className='p-6 text-center font-semifold'>
                日記入力フォーム
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="diary" className="block text-sm font-medium text-center">
                        日記
                    </label>
                    <textarea id='diary'
                        name='diary'
                        value={text}
                        className="w-full h-128 mt-1 px-4 py-2 border border-gray-700 rouded-lg bg-white"
                        onChange={(e) => setText(e.target.value)}
                    />
                    <p className="text-right">{wordsCount}</p>
                    <div className="flex justify-center">
                        <button 
                            disabled={loading}
                            className="w-2xs bg-orange-400 text-white rounded cursor-pointer py-2 hover:bg-orange-500"
                        >
                            保存
                        </button>
                    </div>
                </div>
            </form>
            {loading && (
                <div className="flex justify-center mt-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
            )}
        </div>
     );
}
 
export default DiaryForm;