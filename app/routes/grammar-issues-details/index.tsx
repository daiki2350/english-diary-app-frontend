import { useLocation } from "react-router";
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


const GrammarIssuesDetails = () => {
    const location = useLocation()
    const [issues, setIssues] = useState<Issue[]>([])

    useEffect(() => {
        setIssues(location.state)
    }, [])
    

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
            <Bar options={options} data={data} />;
        </div>
     );
}
 
export default GrammarIssuesDetails;