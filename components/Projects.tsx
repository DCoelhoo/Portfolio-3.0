"use client"

import { motion } from "framer-motion"
import Link from "next/link"

const projects = [
    {
        title: "Portfolio Pessoal",
        desc: "Desenvolvido com Next.js e Tailwind, com animações em Framer Motion e integração com APIs.",
        link: "https://github.com/DCoelhoo/Portfolio-3.0",
    },
    {
        title: "Aplicação de Tarefas",
        desc: "App em React + Node.js para gestão de tarefas, com autenticação JWT e base de dados MongoDB.",
        link: "#",
    },
    {
        title: "Dashboard Financeiro",
        desc: "Dashboard em Next.js com gráficos dinâmicos e integração com API financeira.",
        link: "#",
    },
    {
        title: "Landing Page Minimalista",
        desc: "Website otimizado para performance e acessibilidade, com design responsivo.",
        link: "#",
    },
]

export default function Projects() {
    return (
        <section id="projects" className="min-h-screen flex flex-col justify-center items-center px-6">
            <h2 className="text-3xl font-semibold mb-8 text-cyan-400">Projetos</h2>

            <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ staggerChildren: 0.15 }}
            >
                {projects.map((project, i) => (
                    <motion.div
                        key={i}
                        variants={{
                            hidden: { opacity: 0, y: 50, scale: 0.95 },
                            visible: { opacity: 1, y: 0, scale: 1 },
                        }}
                        whileHover={{
                            y: -8,
                            scale: 1.02,
                            borderColor: "rgba(34,211,238,0.9)",
                            boxShadow: "0 0 25px rgba(34,211,238,0.2)",
                        }}
                        transition={{ type: "spring", stiffness: 350, damping: 20, mass: 0.3 }}
                        className="p-6 rounded-xl border border-white/10 bg-white/5 cursor-pointer"
                    >
                        <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                        <p className="text-sm text-white/70 mb-3">{project.desc}</p>
                        <Link
                            href={project.link}
                            target="_blank"
                            className="text-cyan-400 hover:underline text-sm"
                        >
                            Ver mais →
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    )
}