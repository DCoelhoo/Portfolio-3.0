"use client"

import { useEffect, useState } from "react"
import { Github, Newspaper, Linkedin } from "lucide-react"

interface Update {
    title: string
    url: string
    description?: string
    image?: string | null
    source: string
    date: string
}

function timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    const intervals: [number, string][] = [
        [60, "segundo"],
        [60, "minuto"],
        [24, "hora"],
        [7, "dia"],
        [4.34524, "semana"],
        [12, "mês"],
        [Number.POSITIVE_INFINITY, "ano"],
    ];

    let count = seconds;
    let unit = "segundo";

    for (const [interval, name] of intervals) {
        if (count < interval) break;
        count /= interval;
        unit = name;
    }

    count = Math.floor(count);
    const plural = count !== 1 ? "s" : "";
    return `há ${count} ${unit}${plural}`;
}

export default function UpdateFeed() {
    const [updates, setUpdates] = useState<Update[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/updates")
            .then((r) => r.json())
            .then((data) => setUpdates(data))
            .finally(() => setLoading(false))
    }, [])

    if (loading)
        return <p className="text-center text-gray-400 mt-10">A carregar atualizações...</p>

    // 🔹 Separar por tipo de origem
    const github = updates
        .filter((u) => u.source === "GitHub")
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)

    const blog = updates
        .filter((u) => u.source === "Hashnode")
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3)

    const linkedin = updates
        .filter((u) => u.source === "LinkedIn")
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3)

    const Column = ({
        title,
        icon: Icon,
        color,
        data,
    }: {
        title: string
        icon: any
        color: string
        data: Update[]
    }) => (
        <div className="flex-1 min-w-[340px] bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800 shadow-md">
            <div className="flex items-center justify-center gap-2 mb-5">
                <Icon className={`w-5 h-5 text-${color}-400`} />
                <h3 className={`text-xl font-semibold text-${color}-400`}>{title}</h3>
            </div>
            {data.length === 0 ? (
                <p className="text-sm text-gray-500 text-center">Nada encontrado</p>
            ) : (
                <ul className="space-y-3">
                    {data.map((u, i) => (
                        <li key={i}>
                            <a
                                href={u.url}
                                target="_blank"
                                className="flex items-start gap-3 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 p-4 transition"
                            >
                                {/* Avatar */}
                                {u.image && (
                                    <img
                                        src={u.image}
                                        alt="Avatar"
                                        className="w-8 h-8 rounded-full border border-zinc-700 mt-1"
                                    />
                                )}

                                {/* Conteúdo */}
                                <div className="flex-1">
                                    <p className="font-medium text-gray-200 truncate">{u.title}</p>
                                    {u.description && (
                                        <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                                            {u.description}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-2">{timeAgo(u.date)}</p>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )

    return (
        <section className="py-12">
            <h2 className="text-3xl font-bold text-center text-cyan-400 mb-10">
                Updates
            </h2>

            <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
                <Column title="GitHub" icon={Github} color="cyan" data={github} />
                <Column
                    title="Blog"
                    icon={Newspaper}
                    color="purple"
                    data={blog.map((p) => ({
                        ...p,
                        image: "https://cdn.hashnode.com/res/hashnode/image/upload/v1753393025418/ad9ce15a-0fd0-4cbe-8fe4-698b2e7f7462.jpeg?w=200&h=200&fit=crop&crop=faces&w=500&h=500&fit=crop&crop=entropy&auto=compress,format&format=webp&auto=compress,format&format=webp",
                    }))}
                />
                <Column title="LinkedIn" icon={Linkedin} color="blue" data={linkedin} />
            </div>
        </section>
    )
}