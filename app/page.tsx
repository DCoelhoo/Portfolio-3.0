import { ArrowRight, Github, Linkedin } from 'lucide-react'
import socials from '@/data/socials.json'

export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold">Diogo Gonçalves</h1>
        <p className="text-lg text-muted">Coding the future, one line at a time</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <a className="btn" href="/projects">Ver Projetos <ArrowRight size={18}/></a>
        <a className="btn" href={socials.github} target="_blank" rel="noreferrer">
          <Github size={18}/> GitHub
        </a>
        <a className="btn" href={socials.linkedin} target="_blank" rel="noreferrer">
          <Linkedin size={18}/> LinkedIn
        </a>
        <a className="btn" href={socials.blog} target="_blank" rel="noreferrer">Blog</a>
      </div>
    </section>
  )
}
