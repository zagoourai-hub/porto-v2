'use client'
import React from 'react'
import Image from 'next/image'
import { useLang } from '@/app/i18n/useLang'
import { Reveal, RevealGroup, RevealItem } from '@/app/components/animation/Reveal'

const AboutMe = () => {
    const { t } = useLang()
    const a = t.about
    return (
        <section id="about" className='min-h-screen w-full '>
            <div className="container flex flex-col p-5 sm:p-10 mx-auto">

                <Reveal className="border-t border-b border-base-300 py-3 flex items-center justify-between text-[8px] md:text-sm tracking-[0.14em] uppercase font-mono-custom text-base-content/60 mb-16 lg:mb-20">
                    <div className="flex items-center gap-3">
                        <span className="inline-block w-1.5 h-1.5 bg-primary"></span>
                        <span className="font-semibold text-base-content">{a.eyebrow}</span>
                    </div>
                    <div className="flex items-center gap-2 text-base-content/40">
                        <span>{a.scroll}</span>
                        <span>↓</span>
                    </div>
                </Reveal>

                <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start'>

                    {/* colom 1 right */}
                    <Reveal from="left" className="lg:col-span-5 flex flex-col">
                        <div className="w-full aspect-square border-all p-2 bg-base-200 relative overflow-hidden group">
                            <div className="w-full h-full relative overflow-hidden bg-[#0d1117] border border-base-content/10">
                                <Image
                                    src="/assets/about.jpg"
                                    alt={a.photoAlt}
                                    fill
                                    sizes="(min-width: 1024px) 40vw, 100vw"
                                    className="object-cover object-center grayscale contrast-125 hover:grayscale-0 transition-all duration-500 ease-out"
                                />
                                <div className="absolute inset-0 bg-base-content/10 pointer-events-none"></div>
                                <div className="absolute top-2 left-2 text-[10px] font-mono-custom text-white/70 bg-black/50 px-1 py-0.5 tracking-wider">CAM // 01</div>
                                <div className="absolute bottom-2 right-2 w-2 h-2 border-r border-b border-primary"></div>
                            </div>
                        </div>

                        <div className="flex items-center  justify-between mt-3 px-0.5 font-mono-custom text-sm  md:text-[15px] tracking-[0.09em] uppercase text-base-content/60">
                            <div className="grid md:grid-cols-2 font-label  leading-5 md:py-5 md:leading-none items-center md:gap-5">
                                <div className='space-x-10  md:col-span-2 '>
                                    <span className="inline-block w-2 h-2   bg-primary"></span>
                                    <span className="text-base-content flex-1 font-medium">{a.name}</span>
                                    <span className="inline-block w-2 h-2  bg-primary"></span>
                                    <span className="text-base-content flex-1 font-medium">{a.age}</span>
                                </div>
                                <div className='space-x-10 md:col-span-2 '>
                                    <span className="inline-block w-2 h-2  bg-primary"></span>
                                    <span className="text-base-content font-medium">{a.country}</span>
                                </div>
                            <span className="text-base-content/40">ID // 0824</span>
                            </div>
                        </div>
                    </Reveal>
                    {/* colom 1 right */}

                    {/* colom2 left*/}
                    <RevealGroup className="lg:col-span-7 flex flex-col">
                        <RevealItem>
                        <h2 className=" md:text-5xl lg:text-[54px] leading-[1.2] font-bold tracking-[-0.04em] text-base-content mb-8">
                            {a.h2a}<br />
                            {a.h2b}<span className="text-primary">{a.h2c}</span>
                        </h2>
                        </RevealItem>

                        <RevealItem>
                        <article className="space-y-1 italic text-sm md:text-[17px] leading-[1.65] font-serif text-base-content mb-12 max-w-[620px]">
                            <p>
                                <span className="block md:inline">{a.p[0][0]}</span>
                                <span className="block md:inline">{a.p[0][1]}</span>
                            </p>
                            <p>
                                <span className="block md:inline">{a.p[1][0]}</span>
                                <span className="block md:inline">{a.p[1][1]}</span>
                            </p>
                        </article>
                        </RevealItem>

                        {/* <!-- 2x2 KEY FACTS GRID (separated by 0.5px borders, no shadow, no cards) --> */}
                        <RevealGroup className="w-full border-t border-l border-base-300 grid grid-cols-2">
                            <RevealItem className="p-6 md:p-7 border-r border-b bg-transparent">
                                <div className="text-3xl md:text-4xl font-bold tracking-[-0.03em] text-base-content mb-1 font-sans">
                                    3+
                                </div>
                                <div className="font-mono-custom text-[11px] tracking-[0.08em] uppercase text-base-content/60">
                                    {a.stats[0]}
                                </div>
                            </RevealItem>

                            <RevealItem className="p-6 md:p-7 border-r border-b bg-transparent">
                                <div className="text-3xl md:text-4xl font-bold tracking-[-0.03em] text-base-content mb-1 font-sans">
                                    20+
                                </div>
                                <div className="font-mono-custom text-[11px] tracking-[0.08em] uppercase text-base-content/60">
                                    {a.stats[1]}
                                </div>
                            </RevealItem>

                            <RevealItem className="p-6 md:p-7 border-r border-b bg-transparent">
                                <div className="text-3xl md:text-4xl font-bold tracking-[-0.03em] text-base-content mb-1 font-sans">
                                    12
                                </div>
                                <div className="font-mono-custom text-[11px] tracking-[0.08em] uppercase text-base-content/60">
                                    {a.stats[2]}
                                </div>
                            </RevealItem>

                            {/* <!-- Stat 4 --> */}
                            <RevealItem className="p-6 md:p-7 border-r border-b bg-transparent">
                                <div className="text-3xl md:text-4xl font-bold tracking-[-0.03em] text-primary mb-1 font-sans">
                                    100
                                </div>
                                <div className="font-mono-custom text-[11px] tracking-[0.08em] uppercase text-base-content/60">
                                    {a.stats[3]}
                                </div>
                            </RevealItem>
                        </RevealGroup>
                    </RevealGroup>
                    {/* colom 2 left end  */}


                </div>
            </div>
        </section>
    )
}

export default AboutMe
