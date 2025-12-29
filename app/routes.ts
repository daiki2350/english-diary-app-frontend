import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout('./routes/layouts/public.tsx', [
        route('login', './routes/login/index.tsx'),
        route('register', './routes/register/index.tsx')
    ]),
    layout("./routes/layouts/app.tsx", [
        index("./routes/home/home.tsx"),
        route("diaryform", "./routes/diaryform/index.tsx"),
        route("prevdiaries", "./routes/prev-diary/index.tsx"),
        route("showresult", "./routes/corrected-diary/index.tsx"),
        route("cefrdetails", "./routes/cefr-details/index.tsx"),
        route("issuesdetails", "./routes/grammar-issues-details/index.tsx"),
    ]),
] satisfies RouteConfig;
