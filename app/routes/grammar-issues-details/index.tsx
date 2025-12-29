import { useOutletContext } from "react-router";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from "react";
import LoadComponent from "~/components/Loading";
import { useAuthStore } from "~/stores/auth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Issue = {
  label: string;
  count: number;
};

type IssuesExample = {
    before: string;
    after: string;
}


const GrammarIssuesDetails = () => {
    const { token } = useAuthStore()
    const [issues, setIssues] = useState<Issue[]>([])
    const [examples, setExamples] = useState<Record<string, { before: string, after: string }>>({})
    const [isLoading, setIsLoading] = useState(false)

    const getIssuesExample = async () => {
        setIsLoading(true)
        const res = await fetch(`${import.meta.env.VITE_API_URL}/diaries/recent-grammar-issues-details`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        const data = await res.json()
        console.log(data)
        setIssues(data.trends)
        setExamples(data.examples)
        setIsLoading(false)
    }

    useEffect(() => {
        getIssuesExample()
    }, [])

    if(isLoading) {
        return <LoadComponent />
    }
    

    const options = {
        indexAxis: 'y' as const,
        elements: {
            bar: {
            borderWidth: 2,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'right' as const,
            },
            title: {
                display: true,
                text: '過去10回の文法ミスTop5',
            },
        },
    };
    
    let labels: string[] = []
    let counts: number[] = []
    for(let i=0; i<issues.length; i++){
        const label = issues[i].label
        labels.push(label)
        const count = issues[i].count
        counts.push(count)
    }

    const data = {
        labels,
        datasets: [
            {
            label: '',
            data: counts,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ]
    }
    
    return ( 
        <div>
            <div>
                <Bar options={options} data={data} />;
            </div>
            <div className="m-8">
                <h2 className="text-center text-xl font-semibold mb-4">間違えた部分の例</h2>
                { Object.entries(examples).map(([label, example]) => (
                    <div key={label} className="border border-gray-400 items-center">
                        <h3 className="text-center border-b border-gray-200">{label}</h3>
                        <p className="text-center text-red-500">Before: {example.before}</p>
                        <p className="text-center text-green-500">After: {example.after}</p>
                    </div>
                ))}
            </div>
        </div>
     );
}
 
export default GrammarIssuesDetails;